import { Item } from "../../model/item";
import useMousePosition from "../../hooks/use-mouse-position";
import "./item-tooltip.css";
import useWindowSize from "../../hooks/use-window-size";

interface ItemTooltipAttributes {
  item?: Item;
}

export default function ItemTooltip({ item }: ItemTooltipAttributes) {
  const mousePos = useMousePosition();
  const windowSize = useWindowSize();
  const flipped = mousePos.x > windowSize.width * 0.9 ? "flipped" : "";

  return mousePos.x && mousePos.x !== 0 ? (
    <div className={`item-tooltip ${flipped}`}>
      <span>{item?.representation}</span>
    </div>
  ) : (
    <div></div>
  );
}
