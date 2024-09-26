import { LootTableService } from "../../shared/service/loot-table-service";
import { useEffect, useState } from "react";
import { LootTable } from "../../shared/model/loot-table.model";
import LootTableDisplay from "./loot-table-display";
import { ItemService } from "../../shared/service/item-service";
import { Item } from "../../shared/model/item";

export default function LootTablePage() {
  const lootTableService = new LootTableService();
  const itemService = new ItemService();

  const [lootTables, setLootTables] = useState<LootTable[]>([]);
  const [ids, setIds] = useState<Map<number, string>>(new Map());
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    lootTableService.getAllLootTables().subscribe({
      next: (lootTables) => {
        setLootTables(lootTables);
      },
      error: console.error,
    });
    itemService.getIdsMap().subscribe({
      next: (idMap) => {
        setIds(idMap);
        itemService.getAllItems().subscribe({
          next: (items) => {
            items.forEach((item) => {
              const x = idMap.get(item.id ?? 0);
              if (x) {
                item.representation = x;
              }
            });
            setItems(items.map((item) => ({ id: item.id, ...item })));
          },
        });
      },
    });
  }, []);

  return (
    <div>
      <h1>Loot tables</h1>
      <pre>{JSON.stringify(items)}</pre>

      {lootTables.map((table) => (
        <LootTableDisplay lootTable={table} />
      ))}
    </div>
  );
}
