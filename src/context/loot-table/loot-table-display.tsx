import { LootTable } from "../../shared/model/loot-table.model";
import ItemSlot, { ItemSlotType } from "../../shared/components/item-slot/item-slot";
import "./loot-table-page.css";
import RogueContainer from "../../shared/components/rogue-container/rogue-container";
import RogueIcon, { ItemId } from "../../shared/components/rogue-icon/rogue-icon";
import StandardImage from "../../shared/components/standard-image/standard-image";

interface LootTableDisplayAttributes {
  lootTable: LootTable;
}

export default function LootTableDisplay({ lootTable }: LootTableDisplayAttributes) {
  const rowWidth = 7;

  const fillWithEmptySlots = (array: any[]) => {
    const len = Array.isArray(array) ? array.length : 0;
    return Array(Math.ceil(len / rowWidth) * rowWidth)
      .fill({})
      .map((v, i) => (Array.isArray(array) && !!array[i] ? array[i] : v));
  };

  return (
    <div className="loot-table-container">
      <div className="flex-gap-4">
        <div className="loot-table-container" style={{ flexGrow: 1 }}>
          <RogueContainer>
            <h2>{lootTable.name}</h2>
          </RogueContainer>
          <RogueContainer className="flex-gap-4">
            {lootTable.credits
              ? `${lootTable.credits.min}${lootTable.credits.max ? " - " + lootTable.credits.max : ""}`
              : "0"}
            <RogueIcon itemId={ItemId.CREDIT} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            {lootTable.scrapmetal
              ? `${lootTable.scrapmetal.min}${lootTable.scrapmetal.max ? " - " + lootTable.scrapmetal.max : ""}`
              : "0"}
            <RogueIcon itemId={ItemId.SCRAP_METAL} />
          </RogueContainer>
        </div>
        <RogueContainer className="image-container">
          <StandardImage src={lootTable.path} alt={lootTable.name} />
        </RogueContainer>
      </div>
      <RogueContainer>{lootTable.description}</RogueContainer>
      <div className="loot-table-grid">
        {fillWithEmptySlots(lootTable.loot).map((loot, i) => (
          <ItemSlot
            key={"itm" + i}
            type={ItemSlotType.INVENTORY}
            item={loot.item}
            amount={loot.count}
          />
        ))}
      </div>
      {lootTable.extraLoot && lootTable.extraLoot.length > 0 && (
        <RogueContainer>Special loot:</RogueContainer>
      )}
      <div className="loot-table-grid">
        {fillWithEmptySlots(lootTable.extraLoot).map((loot, i) => (
          <ItemSlot key={"itm" + i} type={ItemSlotType.INVENTORY} item={loot.item} />
        ))}
      </div>
    </div>
  );
}
