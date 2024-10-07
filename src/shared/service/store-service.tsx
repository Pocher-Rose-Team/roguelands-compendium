import { HttpClient } from "./http-client";
import { forkJoin, map, Observable } from "rxjs";
import { Item, ItemType, StatType } from "../model/item";
import { ItemService } from "./item-service";
import { LootTableService } from "./loot-table-service";

export class StoreService {
  private http: HttpClient;
  private itemService: ItemService;
  private lootTableService: LootTableService;

  constructor() {
    this.http = new HttpClient();
    this.itemService = new ItemService();
    this.lootTableService = new LootTableService();
  }

  getAllCraftableOrLootableItems(): Observable<Item[]> {
    return forkJoin([
      this.itemService.getAllItems(),
      this.lootTableService.getAllLootTables(),
    ]).pipe(
      map(([items, lootTables]) =>
        items.filter(
          (item) =>
            item.craftedWith.length > 0 ||
            lootTables.flatMap((l) => l.loot.map((item) => item.id)).includes(item.id ?? 0),
        ),
      ),
    );
  }

  getAllCraftableOrLootableItemsByType(type: ItemType): Observable<Item[]> {
    return this.getAllCraftableOrLootableItems().pipe(
      map((allItems) => allItems.filter((item) => item.type === type)),
    );
  }

  getLeastUsedItems(type?: ItemType): Observable<Item[]> {
    return this.getAllCraftableOrLootableItems().pipe(
      map((items) => items.filter((item) => !type || item.type === type).slice(0, 7)), // Ensures only first 10 items
    );
  }

  getMostUsedItems(type?: ItemType): Observable<Item[]> {
    return this.getAllCraftableOrLootableItems().pipe(
      map((items) => items.filter((item) => !type || item.type === type).slice(10, 17)), // Skips 10 and takes the next 10 items
    );
  }

  getRecommendedItems(stat1: StatType, stat2: StatType): Observable<Item[]> {
    return this.getAllCraftableOrLootableItems().pipe(
      map(
        (items: Item[]) =>
          items
            .sort((a: Item, b: Item) => {
              // Calculate the total stat score for both stat1 and stat2
              const scoreA = (a.stats[stat1] || 0) + (a.stats[stat2] || 0);
              const scoreB = (b.stats[stat1] || 0) + (b.stats[stat2] || 0);

              // Sort by the combined value of stat1 and stat2 in descending order
              return scoreB - scoreA;
            })
            .slice(0, 10), // Return the top 10 items
      ),
    );
  }
}
