import { Item } from "../../model/item";
import useMousePosition from "../../hooks/use-mouse-position";
import useWindowSize from "../../hooks/use-window-size";
import "./item-tooltip.css";
import StandardImage from "../standard-image/standard-image";
import StatGroup from "./stat-group";

interface ItemTooltipAttributes {
  item?: Item;
}

export default function ItemTooltip({ item }: ItemTooltipAttributes) {
  const mousePos = useMousePosition();
  const windowSize = useWindowSize();
  const flippedX = mousePos.x > windowSize.width * 0.9 ? "flipped-x" : "";
  const flippedY = mousePos.y > windowSize.height * 0.9 ? "flipped-y" : "";

  return mousePos.x && mousePos.x !== 0 && mousePos.y && mousePos.y !== 0 ? (
    <div className={`item-tooltip ${flippedX} ${flippedY}`}>
      {item?.representation ? (
        <span>{item?.representation}</span>
      ) : (
        <span className="item-empty">{"<<empty>>"}</span>
      )}
      {item?.description && <span className="description">{item?.description}</span>}
      {item?.foundIn && item?.foundIn.length > 0 && (
        <div className="foundin-list">
          {item?.foundIn.map((foundInEntry) => (
            <StandardImage src={`/img/worldIcons/${foundInEntry}Icon.png`} alt={foundInEntry} />
          ))}
        </div>
      )}
      {item?.stats &&
        Object.keys(item.stats).length > 0 &&
        Object.values(item.stats).reduce((a, b) => a + b) > 0 && <StatGroup stats={item.stats} />}
    </div>
  ) : (
    <div></div>
  );
}
