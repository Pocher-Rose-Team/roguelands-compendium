import { HttpClient } from "./http-client";
import { forkJoin, map, Observable, of, tap } from "rxjs";
import { LootItem, LootTable } from "../model/loot-table.model";
import { ItemService } from "./item-service";
import { Item } from "../model/item";

export class LootTableService {
  private http: HttpClient;
  private itemService: ItemService;

  constructor() {
    this.http = new HttpClient();
    this.itemService = new ItemService();
  }

  getAllLootTables(): Observable<LootTable[]> {
    // const localStorageItems = localStorage.getItem("loot-tables");
    // if (localStorageItems) {
    //   return of(JSON.parse(localStorageItems));
    // }
    return forkJoin([
      this.http.get<LootTable[]>("/json/loot-tables.json"),
      this.itemService.getAllItemsAsMapById(),
    ]).pipe(
      map(([lootTables, itemMap]) => {
        lootTables.forEach((table) => {
          table.loot = table.loot.filter((v) => typeof v === "object");
          this.setFieldInfosForItems(table.loot, itemMap);
          this.setFieldInfosForItems(table.extraLoot, itemMap);
          table.loot.sort((a, b) => (b.probability > a.probability ? 1 : -1));

          table.extraLoot?.forEach((loot) => (loot.item = itemMap.get(loot.id)));
        });
        return lootTables;
      }),
      tap((lootTables) => localStorage.setItem("loot-tables", JSON.stringify(lootTables))),
    );
  }

  private setFieldInfosForItems(loot: LootItem[], itemMap: Map<number, Item>) {
    loot?.forEach((loot) => {
      let item = itemMap.get(loot.id);
      if (loot.id === 0) {
        item = { ...this.itemService.getDefaultItem(), name: "", representation: "Nothing" };
      }
      if (item) {
        item.description = `${loot.probability}%`;
        item.foundIn = [];
        loot.item = { ...item };
      }
    });
  }
}
