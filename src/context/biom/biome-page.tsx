import React, { useEffect, useState } from "react";
import { BiomeService } from "../../shared/service/biome-service";
import { Biome } from "../../shared/model/biome.model";
import BiomeProbabilityChart from "./biome-probability-chart";

export default function BiomePage() {
  const biomeService = new BiomeService();
  const [biomeData, setBiomeData] = useState<Biome[]>([]);

  useEffect(() => {
    biomeService.getAllBiomes().subscribe({
      next: (biomes) => {
        setBiomeData(biomes);
        console.log();
      },
      error: console.error,
    });
  }, []);

  return (
    <div>
      <h1>Probability Distributions</h1>
      {biomeData.length > 0 &&
        biomeData[0].frequencyMap &&
        Array.from(biomeData[0].frequencyMap.entries()).map(
          ([objectName, countFrequencyMap]: [string, Map<number, number>]) => (
            <div key={objectName}>
              <h2>{objectName}</h2>
              <BiomeProbabilityChart countFrequencyMap={countFrequencyMap} biomeKey={objectName} />
            </div>
          ),
        )}
    </div>
  );
}
