import { HttpClient } from "./http-client";
import { map, Observable } from "rxjs";
import { Item } from "../model/item";
import { ItemType } from "../model/item-type";

export class ItemService {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient();
  }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>("/items.json");
  }

  getAllItemsOfType(type: ItemType): Observable<Item[]> {
    return this.getAllItems().pipe(
      map((allItems) => allItems.filter((item) => item.path.includes(type))),
    );
  }
}
