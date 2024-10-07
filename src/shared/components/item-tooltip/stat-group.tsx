import { ReactNode } from "react";
import { Stats } from "../../model/item";
import "./item-tooltip.css";

enum StatColor {
  VIT = "#694444",
  STR = "#6F5943",
  DEX = "#3B723A",
  TEC = "#6D6B33",
  MAG = "#2E5069",
  FTH = "#582969",
}

export default function StatGroup({ stats }: { stats: Stats }) {
  const statOrNone = (stat: number) => (stat > 0 ? stat : "");

  return (
    <div className="stat-list">
      <StatDisplay color={StatColor.VIT}>{statOrNone(stats.vit)}</StatDisplay>
      <StatDisplay color={StatColor.DEX}>{statOrNone(stats.dex)}</StatDisplay>
      <StatDisplay color={StatColor.MAG}>{statOrNone(stats.mag)}</StatDisplay>
      <StatDisplay color={StatColor.STR}>{statOrNone(stats.str)}</StatDisplay>
      <StatDisplay color={StatColor.TEC}>{statOrNone(stats.tec)}</StatDisplay>
      <StatDisplay color={StatColor.FTH}>{statOrNone(stats.fth)}</StatDisplay>
    </div>
  );
}

function StatDisplay({ color, children }: { color: StatColor; children: ReactNode }) {
  return (
    <div className="stat-display" style={{ backgroundColor: color }}>
      {children && <span>{children}</span>}
    </div>
  );
}
