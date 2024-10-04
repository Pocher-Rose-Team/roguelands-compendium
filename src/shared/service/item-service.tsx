import { HttpClient } from "./http-client";
import { filter, map, Observable, of, skip, take, tap, toArray } from "rxjs";
import { Item, ItemType, StatType } from "../model/item";

export class ItemService {
  private http: HttpClient;

  private readonly defaultItem: Item = {
    craftedWith: [],
    description: "No Item found",
    foundIn: [],
    name: "defaultitem",
    path: "",
    representation: "Default Item",
    stats: {
      dex: 0,
      fth: 0,
      mag: 0,
      str: 0,
      tec: 0,
      vit: 0,
    },
    type: ItemType.MISC,
  };

  constructor() {
    this.http = new HttpClient();
  }

  getAllItems(): Observable<Item[]> {
    // const localStorageItems = localStorage.getItem("items");
    // if (localStorageItems) {
    //   return of(JSON.parse(localStorageItems));
    // }
    return this.http
      .get<Item[]>("/json/items.json")
      .pipe(map((items) => items.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))))
      .pipe(tap((items) => localStorage.setItem("items", JSON.stringify(items))));
  }

  getIdsMap(): Observable<Map<number, string>> {
    return this.http.get<{ id: number; representation: string }[]>("/json/ids.json").pipe(
      map((allItems) =>
        allItems.reduce((map, obj) => {
          map.set(obj.id, obj.representation);
          return map;
        }, new Map<number, string>()),
      ),
    );
  }

  getAllItemsAsMapByName(): Observable<Map<string, Item>> {
    return this.getAllItemsAsMapByKey("name");
  }

  getAllItemsAsMapById(): Observable<Map<number, Item>> {
    return this.getAllItemsAsMapByKey("id");
  }

  private getAllItemsAsMapByKey(key: string): Observable<Map<any, Item>> {
    return this.getAllItems().pipe(
      map((allItems) =>
        allItems.reduce((map, obj) => {
          map.set((obj as any)[key], obj);
          return map;
        }, new Map<string, Item>()),
      ),
    );
  }

  getItemByName(name: string): Observable<Item> {
    return this.getAllItems().pipe(
      map((allItems) =>
        allItems.reduce((map, obj) => {
          map.set(obj.name, obj);
          return map;
        }, new Map<string, Item>()),
      ),
      map((map) => map.get(name) ?? this.defaultItem),
    );
  }

  getDefaultItem(): Item {
    return this.defaultItem;
  }

  getAllItemsOfType(type: ItemType): Observable<Item[]> {
    return this.getAllItems().pipe(
      map((allItems) => allItems.filter((item) => item.type === type)),
    );
  }
  getLeastUsedItems(type?: ItemType): Observable<Item[]> {
    return this.getAllItems().pipe(
      map((items) => items.filter((item) => !type || item.type === type).slice(0, 7)), // Ensures only first 10 items
    );
  }

  getMostUsedItems(type?: ItemType): Observable<Item[]> {
    return this.getAllItems().pipe(
      map((items) => items.filter((item) => !type || item.type === type).slice(10, 17)), // Skips 10 and takes the next 10 items
    );
  }
  getRecommendedItems(stat1: StatType, stat2: StatType): Observable<Item[]> {
    return this.getAllItems().pipe(
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
