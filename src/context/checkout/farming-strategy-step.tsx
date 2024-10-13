import { BiomePathSetp } from "../../shared/service/farming-strategy-service";
import StandardImage from "../../shared/components/standard-image/standard-image";
import RogueContainer from "../../shared/components/rogue-container/rogue-container";
import RogueIcon from "../../shared/components/rogue-icon/rogue-icon";

interface FarmingStrategyStepAttributes {
  step: BiomePathSetp;
}

export default function FarmingStrategyStep({ step }: FarmingStrategyStepAttributes) {
  return (
    <RogueContainer>
      <div style={{ display: "flex", gap: 10 }}>
        <StandardImage src={`/img/worldIcons/${step.biome.name}Icon.png`} />
        <h2 style={{ margin: 0 }}>{step.biome.name}</h2>
      </div>
      <hr />
      <h3 style={{ margin: "0 0 8px" }}>Gathered in biome</h3>
      <div>
        {step.gatheredItems
          .filter((v) => v.amount > 0)
          .map((v, i) => (
            <div
              key={`i-${i}${v.item.id}`}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <RogueIcon itemId={v.item.id ?? 0} />{" "}
              {v.amount > 1 ? Math.round(v.amount) : v.amount.toFixed(5)}x {v.item.name}
            </div>
          ))}
      </div>
      {/*<hr />*/}
      {/*<h3 style={{ margin: "0 0 8px" }}>Needed</h3>*/}
      {/*<div>*/}
      {/*  {step.neededItems*/}
      {/*    .filter((v) => v.amount > 0)*/}
      {/*    .map((v, i) => (*/}
      {/*      <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>*/}
      {/*        <RogueIcon itemId={v.item.id ?? 0} /> {Math.round(v.amount)}x {v.item.name}*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*</div>*/}
    </RogueContainer>
  );
}
