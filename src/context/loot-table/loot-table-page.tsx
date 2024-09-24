import { LootTableService } from "../../shared/service/loot-table-service";
import { useEffect, useState } from "react";
import { LootTable } from "../../shared/model/loot-table.model";

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
      <h2>
        {lootTables.length > 0 &&
          lootTables[0].loot.map((v) => v.probability).reduce((a, b) => a + b)}
      </h2>
    </div>
  );
}
