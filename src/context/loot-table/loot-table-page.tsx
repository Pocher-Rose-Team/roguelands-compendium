import { LootTableService } from "../../shared/service/loot-table-service";
import { useEffect, useState } from "react";
import { LootTable } from "../../shared/model/loot-table.model";
import LootTableDisplay from "./loot-table-display";
import MasonryGrid from "../../shared/components/masonry-grid/masonry-grid";

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

      <MasonryGrid breakpoints={[750, 1100, 1450, 1800]}>
        {lootTables.map((table, i) => (
          <LootTableDisplay key={"ltd" + i} lootTable={table} />
        ))}
      </MasonryGrid>
    </div>
  );
}
