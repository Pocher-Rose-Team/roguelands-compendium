import { LootTable } from "../../shared/model/loot-table.model";

interface LootTableDisplayAttributes {
  lootTable: LootTable;
}

export default function LootTableDisplay({ lootTable }: LootTableDisplayAttributes) {
  return (
    <div>
      <h2>{lootTable.name}</h2>
      <div className="loot-table-grid">
        {lootTable.loot.map((loot) => (
          <div>{loot.name}</div>
        ))}
      </div>
    </div>
  );
}
