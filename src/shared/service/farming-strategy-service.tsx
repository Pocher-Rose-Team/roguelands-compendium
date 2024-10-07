import { HttpClient } from "./http-client";
import { ItemService } from "./item-service";
import { LootTableService } from "./loot-table-service";
import { Item } from "../model/item";
import { map, Observable } from "rxjs";

interface ItemAmount {
  item: Item;
  amount: number;
}

export class FarmingStrategyService {
  private http: HttpClient;
  private itemService: ItemService;
  private lootTableService: LootTableService;

  constructor() {
    this.http = new HttpClient();
    this.itemService = new ItemService();
    this.lootTableService = new LootTableService();
  }

  calculateNeededResources(source: ItemAmount[]): Observable<ItemAmount[]> {
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
        Array.from(itemAmountsMap).map(([item, amount]) => ({ item: item, amount: amount })),
      ),
    );
  }

  getNeededResourcesFromItem(source: ItemAmount[], itemMap: Map<string, Item>): ItemAmount[] {
    return source.flatMap(({ item, amount }) => {
      if (item?.craftedWith && item.craftedWith.length > 0) {
        return this.getNeededResourcesFromItem(
          item.craftedWith.map(
            (v) => ({ item: itemMap.get(v.item) as Item, amount: v.amount * amount }) as ItemAmount,
          ),
          itemMap,
        );
      }
      return { item: item, amount: amount };
    });
  }
}
