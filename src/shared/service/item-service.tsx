import { HttpClient } from "./http-client";
import { map, Observable } from "rxjs";
import { Item } from "../model/item";
import { ItemType } from "../model/item-type";

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
      vit: 0
    },
    type: ItemType.MISC
  }

  constructor() {
    this.http = new HttpClient();
  }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>("/items.json");
  }

  getItemByName(name: string): Observable<Item> {
    return this.getAllItems().pipe(
      map((allItems) =>
        allItems.reduce((map, obj) => {
          map.set(obj.name, obj);
          return map;
        }, new Map<string, Item>()),
      ), map(map => map.get(name) ?? this.defaultItem))
  }

  getAllItemsOfType(type: ItemType): Observable<Item[]> {
    return this.getAllItems().pipe(
      map((allItems) => allItems.filter((item) => item.path.includes(type))),
    );
  }
}
