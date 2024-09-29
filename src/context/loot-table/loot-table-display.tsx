import { LootTable } from "../../shared/model/loot-table.model";
import ItemSlot, { ItemSlotType } from "../../shared/components/item-slot/item-slot";
import "./loot-table-page.css";

interface LootTableDisplayAttributes {
  lootTable: LootTable;
}

export default function LootTableDisplay({ lootTable }: LootTableDisplayAttributes) {
  return (
    <div>
      <h2>{lootTable.name}</h2>
      <img src={lootTable.path} alt={lootTable.name} style={{ transform: "scale(2.0)" }} />
      <p>
        Credits: {lootTable.credits.min}-{lootTable.credits.max} Scrap Metal:{" "}
        {lootTable.credits.min}-{lootTable.credits.max}
      </p>
      <p>Rolled 3 times</p>
      <div className="loot-table-grid">
        {lootTable.loot.map((loot, i) => (
          <ItemSlot key={"itm" + i} type={ItemSlotType.INVENTORY} item={loot.item} />
        ))}
      </div>
      <p>Special loot</p>
      <div className="loot-table-grid">
        {lootTable.extraLoot?.map((loot, i) => (
          <ItemSlot key={"itm" + i} type={ItemSlotType.INVENTORY} item={loot.item} />
        ))}
      </div>
    </div>
  );
}
