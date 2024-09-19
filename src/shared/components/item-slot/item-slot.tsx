import "./item-slot.css";
import { Item } from "../../model/item";
import { useState } from "react";
import ItemTooltip from "../item-tooltip/item-tooltip";

interface ItemSlotAttributes {
  item?: Item;
  amount?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function ItemSlot({ item, amount, onClick, isSelected }: ItemSlotAttributes) {
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(!!isSelected);

  const handleClick = () => {
    setSelected(!selected); // Toggle selected state
    if (onClick) onClick();
  };

  return (
    <div className={`item-slot ${selected ? "selected" : ""}`} style={{cursor: "pointer"}}>
      {item && <img src={item.path} alt={item.name} />}
      <span className="item-amount disable-select">{amount && amount > 1 ? amount : ""}</span>
      <div onClick={handleClick} 
        className="event-trigger"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      ></div>
      {tooltipVisible && <ItemTooltip item={item} />}
    </div>
  );
}
