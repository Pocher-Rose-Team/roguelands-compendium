import "./item-slot.css";
import { Item } from "../model/item";
import { useState } from "react";
import ItemTooltip from "./item-tooltip";

interface ItemSlotAttributes {
  item?: Item;
  amount?: number;
}

export default function ItemSlot({ item, amount }: ItemSlotAttributes) {
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  return (
    <div className="item-slot">
      {item && <img src={item.path} alt={item.name} />}
      <span className="item-amount disable-select">{amount && amount > 1 ? amount : ""}</span>
      <div
        className="event-trigger"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      ></div>
      {tooltipVisible && <ItemTooltip item={item} />}
    </div>
  );
}
