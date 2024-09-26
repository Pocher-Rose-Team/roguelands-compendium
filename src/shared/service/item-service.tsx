import { HttpClient } from "./http-client";
import { map, Observable, of, tap } from "rxjs";
import { Item, ItemType } from "../model/item";

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
}
