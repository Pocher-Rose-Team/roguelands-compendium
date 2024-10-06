import "./item-slot.css";
import { Item } from "../../model/item";
import { useState } from "react";
import ItemTooltip from "../item-tooltip/item-tooltip";
import StandardImage from "../standard-image/standard-image";

interface ItemSlotAttributes {
  item?: Item;
  type: ItemSlotType;
  amount?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export enum ItemSlotType {
  CRAFTING = "crafting",
  INVENTORY = "inventory",
}

export default function ItemSlot({ item, type, amount, onClick, isSelected }: ItemSlotAttributes) {
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(!!isSelected);

  const handleClick = () => {
    if (onClick) {
      // Only if onClick is set, then the slot is clickable
      setSelected(!selected); // Toggle selected state
      onClick();
    }
  };

  return (
    <div className={`item-slot ${selected ? "selected" : ""} ${type}`}>
      {item && (
        <StandardImage
          className="disable-select"
          style={{ pointerEvents: "none" }}
          src={item.path}
          alt={item.name}
        />
      )}
      <span className="item-amount disable-select">{amount && amount > 1 ? amount : ""}</span>
      <div
        onClick={handleClick}
        className="event-trigger"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      ></div>
      {tooltipVisible && <ItemTooltip item={item} />}
    </div>
  );
}
