import "./item-slot.css";
import { Item } from "../model/item";

interface ItemSlotAttributes {
  item?: Item;
}

export default function ItemSlot({ item }: ItemSlotAttributes) {
  return <div className="item-slot">{item && <img src={item.path} alt={item.name} />}</div>;
}
