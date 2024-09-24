import { HttpClient } from "./http-client";
import { map, Observable, of, tap } from "rxjs";
import { LootTable } from "../model/loot-table.model";

export class LootTableService {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient();
  }

  getAllLootTables(): Observable<LootTable[]> {
    const localStorageItems = localStorage.getItem("loot-tables");
    if (localStorageItems) {
      return of(JSON.parse(localStorageItems));
    }
    return this.http.get<LootTable[]>("/json/loot-tables.json").pipe(
      map((lootTables) => {
        lootTables.forEach((table) => {
          table.loot = table.loot.filter((v) => typeof v === "object");
        });
        return lootTables;
      }),
      tap((lootTables) => localStorage.setItem("loot-tables", JSON.stringify(lootTables))),
    );
  }
}
