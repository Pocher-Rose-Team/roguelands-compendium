import { BiomePathSetp } from "../../shared/service/farming-strategy-service";
import StandardImage from "../../shared/components/standard-image/standard-image";
import RogueContainer from "../../shared/components/rogue-container/rogue-container";

interface FarmingStrategyStepAttributes {
  step: BiomePathSetp;
}

export default function FarmingStrategyStep({ step }: FarmingStrategyStepAttributes) {
  return (
    <RogueContainer>
      <StandardImage src={`/img/worldIcons/${step.biome.name}Icon.png`} />
    </RogueContainer>
  );
}
