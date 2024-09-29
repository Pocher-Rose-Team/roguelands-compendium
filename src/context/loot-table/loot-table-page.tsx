import { LootTableService } from "../../shared/service/loot-table-service";
import { useEffect, useState } from "react";
import { LootTable } from "../../shared/model/loot-table.model";
import LootTableDisplay from "./loot-table-display";

export default function LootTablePage() {
  const lootTableService = new LootTableService();

  const [lootTables, setLootTables] = useState<LootTable[]>([]);

  useEffect(() => {
    lootTableService.getAllLootTables().subscribe({
      next: (lootTables) => {
        setLootTables(lootTables);
      },
      error: console.error,
    });
  }, []);

  return (
    <div>
      <h1>Loot tables</h1>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {lootTables.map((table, i) => (
          <LootTableDisplay key={"ltd" + i} lootTable={table} />
        ))}
      </div>
    </div>
  );
}
