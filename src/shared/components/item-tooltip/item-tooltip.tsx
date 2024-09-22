import { Item } from "../../model/item";
import useMousePosition from "../../hooks/use-mouse-position";
import useWindowSize from "../../hooks/use-window-size";
import "./item-tooltip.css";
import { ReactNode } from "react";

enum StatColor {
  VIT = "#694444",
  STR = "#6F5943",
  DEX = "#3B723A",
  TEC = "#6D6B33",
  MAG = "#2E5069",
  FTH = "#582969"
}

interface ItemTooltipAttributes {
  item?: Item;
}

export default function ItemTooltip({ item }: ItemTooltipAttributes) {
  const mousePos = useMousePosition();
  const windowSize = useWindowSize();
  const flipped = mousePos.x > windowSize.width * 0.9 ? "flipped" : "";
  const statOrNone = (stat: number) => stat > 0 ? stat : "";

  return mousePos.x && mousePos.x !== 0 ? (
    <div className={`item-tooltip ${flipped}`}>
      {item?.representation ? (
        <span>{item?.representation}</span>
      ) : (
        <span className="item-empty">{"<<empty>>"}</span>
      )}
      {item?.stats && Object.keys(item.stats).length > 0 && Object.values(item.stats).reduce((a,b) => a+b) > 0 && (
        <div className="stat-list">
          <StatDisplay color={StatColor.VIT}>
            {statOrNone(item?.stats.vit)}
          </StatDisplay>
          <StatDisplay color={StatColor.DEX}>
            {statOrNone(item?.stats.dex)}
          </StatDisplay>
          <StatDisplay color={StatColor.MAG}>
            {statOrNone(item?.stats.mag)}
          </StatDisplay>
          <StatDisplay color={StatColor.STR}>
            {statOrNone(item?.stats.str)}
          </StatDisplay>
          <StatDisplay color={StatColor.TEC}>
            {statOrNone(item?.stats.tec)}
          </StatDisplay>
          <StatDisplay color={StatColor.FTH}>
            {statOrNone(item?.stats.fth)}
          </StatDisplay>
        </div>
      )}
    </div>
  ) : (
    <div></div>
  );
}

function StatDisplay({color, children}: {color: StatColor, children: ReactNode}) {
  return <div className="stat-display" style={{backgroundColor: color}}>
    {children && <span>{children}</span>}
  </div>
}
