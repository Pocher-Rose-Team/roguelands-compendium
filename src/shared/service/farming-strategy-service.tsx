import { HttpClient } from "./http-client";
import { ItemService } from "./item-service";
import { LootTableService } from "./loot-table-service";
import { Item } from "../model/item";
import { forkJoin, map, mergeMap, Observable } from "rxjs";
import { Biome } from "../model/biome.model";
import { LootItem, LootTable } from "../model/loot-table.model";
import { BiomeService } from "./biome-service";

export interface NeededItem {
  item: Item;
  amount: number;
  strategy?: ItemStrategy[];
}

interface ItemStrategy {
  obtainedFrom: LootTable;
  foundIn: Biome;
  avgItemCount: number;
}

export interface BiomePathSetp {
  biome: Biome;
  nextBiome: Biome | undefined;
  gatheredItems: NeededItem[];
  neededItems: NeededItem[];
}

export class FarmingStrategyService {
  private http: HttpClient;
  private itemService: ItemService;
  private lootTableService: LootTableService;
  private biomeService: BiomeService;

  constructor() {
    this.http = new HttpClient();
    this.itemService = new ItemService();
    this.lootTableService = new LootTableService();
    this.biomeService = new BiomeService();
  }

  calculateNeededResources(source: NeededItem[]): Observable<NeededItem[]> {
    return this.itemService.getAllItemsAsMapByName().pipe(
      map((itemMap) => this.getNeededResourcesFromItem(source, itemMap)),
      map((itemAmounts) =>
        itemAmounts.reduce((map, value) => {
          const existingEntry = map.get(value.item);
          if (existingEntry !== undefined) {
            map.set(value.item, existingEntry + value.amount);
          } else {
            map.set(value.item, value.amount);
          }
          return map;
        }, new Map<Item, number>()),
      ),
      map((itemAmountsMap) =>
        Array.from(itemAmountsMap).map(
          ([item, amount]) => ({ item: item, amount: amount }) as NeededItem,
        ),
      ),
      mergeMap((neededItems) =>
        forkJoin([this.biomeService.getAllBiomes(), this.lootTableService.getAllLootTables()]).pipe(
          map(([biomes, lootTables]) => {
            neededItems.forEach((neededItem) => {
              neededItem.strategy = this.getItemStrategiesForItem(
                neededItem.item,
                biomes,
                lootTables,
              );
              // console.log(neededItem.item.name, neededItem.strategy);
            });
            return neededItems;
          }),
        ),
      ),
    );
  }

  calculateBiomePath(source: NeededItem[]): Observable<BiomePathSetp[]> {
    return forkJoin([
      this.calculateNeededResources(source),
      this.biomeService.getAllBiomesAsMap(),
    ]).pipe(
      map(([neededItems, biomeMap]) => {
        return this.getBiomePathForNeededItems(neededItems, biomeMap);
      }),
    );
  }

  private getNeededResourcesFromItem(
    source: NeededItem[],
    itemMap: Map<string, Item>,
  ): NeededItem[] {
    return source.flatMap(({ item, amount }) => {
      if (item?.craftedWith && item.craftedWith.length > 0) {
        return this.getNeededResourcesFromItem(
          item.craftedWith.map(
            (v) => ({ item: itemMap.get(v.item) as Item, amount: v.amount * amount }) as NeededItem,
          ),
          itemMap,
        );
      }
      return { item: item, amount: amount };
    });
  }

  private getItemStrategiesForItem(
    item: Item,
    biomes: Biome[],
    lootTables: LootTable[],
  ): ItemStrategy[] {
    const itemId = item.id ?? 0;
    return lootTables
      .filter(
        (l) =>
          l.loot?.map((v) => v.id).includes(itemId) ||
          l.extraLoot?.map((v) => v.id).includes(itemId),
      )
      .flatMap((l) => {
        // TODO: Only best result ist taken. Not exactly accurate e.g. with glitterbug etc
        const loot = [...(l.loot ?? []), ...(l.extraLoot ?? [])];
        const lootItem = loot.filter((v) => v.id === itemId).pop() ?? ({} as LootItem);
        const foundInList = biomes.filter((b) => Array.from(b.objects.keys()).includes(l.name));
        return foundInList.map((foundIn) => {
          const objectsInBiome = foundIn.objects.get(l.name) ?? [];
          const biomeAvg = objectsInBiome.reduce((a, b) => a + b, 0) / objectsInBiome.length;
          return {
            obtainedFrom: l,
            foundIn: foundIn,
            avgItemCount: biomeAvg * (lootItem.count * (lootItem.probability / 100)),
          } as ItemStrategy;
        });
      })
      .sort((a, b) => b.avgItemCount - a.avgItemCount);
  }

  private getBiomePathForNeededItems(
    neededItems: NeededItem[],
    biomeMap: Map<string, Biome>,
  ): BiomePathSetp[] {
    const startBiomeKey = "DesolateCanyon";
    const startBiome = biomeMap.get(startBiomeKey) as Biome;
    const gatheredItems = this.deepCopy(neededItems).map((v) => {
      v.amount = 0;
      return v;
    });

    let currentStep = this.getNextStepInBiomePath(neededItems, gatheredItems, startBiome, biomeMap);
    const steps = [];
    steps.push(currentStep);

    while (currentStep.nextBiome !== undefined) {
      currentStep = this.getNextStepInBiomePath(
        currentStep.neededItems,
        currentStep.gatheredItems,
        currentStep.nextBiome,
        biomeMap,
      );
      steps.push(currentStep);

      if (steps.length > 100) {
        // Safety break
        break;
      }
    }
    return steps;
  }

  private getNextStepInBiomePath(
    neededItems: NeededItem[],
    gatheredItems: NeededItem[],
    currentBiome: Biome,
    biomeMap: Map<string, Biome>,
  ): BiomePathSetp {
    const newNeededItems = this.deepCopy(neededItems);
    const newGatheredItems = this.deepCopy(gatheredItems);
    newGatheredItems.forEach((v) => (v.amount = 0));

    newNeededItems.forEach((neededItem) => {
      newGatheredItems.forEach((gatheredItem) => {
        Array.from(neededItem.strategy ?? [])
          .filter((v) => v.foundIn.name === currentBiome.name)
          .forEach((strategy) => {
            if (gatheredItem.item.id === neededItem.item.id && neededItem.amount > 0) {
              gatheredItem.amount += strategy.avgItemCount;
              neededItem.amount -= strategy.avgItemCount;
            }
          });
      });
    });

    const biomesWithScores = Object.entries(currentBiome.portalTo)
      .filter(([_, probability]) => probability >= 0.25)
      .map(([biomeKey, _]) => biomeMap.get(biomeKey) as Biome)
      .map((biome) => ({
        biome: biome,
        score: this.getBiomeScoreForNeededItems(newNeededItems, biome),
      }));

    let nextBiome;

    if (biomesWithScores.filter((v) => v.score > 0).length > 0) {
      nextBiome = biomesWithScores.sort((a, b) => a.score - b.score).pop();
    } else {
      const allBiomesScored = Array.from(biomeMap.values()).map((biome) => ({
        biome: biome,
        score: this.getBiomeScoreForNeededItems(newNeededItems, biome),
      }));
      if (allBiomesScored.filter((v) => v.score > 0).length > 0) {
        nextBiome = allBiomesScored.sort((a, b) => a.score - b.score).pop();
      } else {
        nextBiome = undefined;
      }
    }

    return {
      biome: currentBiome,
      nextBiome: nextBiome?.biome,
      gatheredItems: newGatheredItems,
      neededItems: newNeededItems,
    };
  }

  private getBiomeScoreForNeededItems(neededItems: NeededItem[], biome: Biome): number {
    let score = 0;
    neededItems.forEach((neededItem) => {
      this.deepCopy(neededItem.strategy ?? [])
        .filter((v) => v.foundIn.name === biome?.name)
        .forEach((strategy) => {
          if (strategy.avgItemCount > neededItem.amount) {
            score += neededItem.amount > 0 ? neededItem.amount : 0;
          } else {
            score += strategy.avgItemCount;
          }
        });
    });
    return score;
  }

  private deepCopy<T>(arr: T[]): T[] {
    return Array.from(JSON.parse(JSON.stringify(arr)) as T[]);
  }
}
