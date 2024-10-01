import React, { useEffect, useState } from "react";
import { BiomeService } from "../../shared/service/biome-service";
import { Biome } from "../../shared/model/biome.model";
import BiomeProbabilityChart from "./biome-probability-chart";
import { useParams } from "react-router-dom";

export default function BiomeDetailPage() {
  const { biomekey } = useParams<{ biomekey: string }>();
  const biomeService = new BiomeService();
  const [biome, setBiome] = useState<Biome>();

  useEffect(() => {
    biomeService.getAllBiomesAsMap().subscribe({
      next: (biomes) => {
        const biome = biomes.get(biomekey ?? "");
        if (biome) {
          setBiome(biome);
        }
      },
      error: console.error,
    });
  }, []);

  return (
    <div>
      <h1>Probability Distributions ({biome?.name})</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {biome &&
          Array.from(biome.frequencyMap.entries()).map(
            ([objectName, countFrequencyMap]: [string, Map<number, number>]) => (
              <div key={objectName}>
                <h2>{objectName}</h2>
                <BiomeProbabilityChart
                  countFrequencyMap={countFrequencyMap}
                  biomeKey={objectName}
                />
              </div>
            ),
          )}
      </div>
    </div>
  );
}
