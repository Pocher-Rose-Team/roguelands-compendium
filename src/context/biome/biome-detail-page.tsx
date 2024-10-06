import React, { useEffect, useState } from "react";
import { BiomeService } from "../../shared/service/biome-service";
import { Biome } from "../../shared/model/biome.model";
import BiomeProbabilityChart from "./biome-probability-chart";
import { useParams } from "react-router-dom";
import "./biome.css";
import RogueContainer from "../../shared/components/rogue-container/rogue-container";
import StandardImage from "../../shared/components/standard-image/standard-image";

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

          // Merge 2 enries:
          // const arr1 = (Array.from(Object.entries(biome.objects))
          //   .filter(([k, v]) => k === "glibglob")
          //   .pop() ?? [])[1];
          // const arr2 = (Array.from(Object.entries(biome.objects))
          //   .filter(([k, v]) => k === "glibglob2")
          //   .pop() ?? [])[1];
          //
          // const res = arr1.map((v: number, i: number) => v + arr2[i]);
          // console.log(JSON.stringify(res), res.length);
        }
      },
      error: console.error,
    });
  }, []);

  const getObjectImageSrc = (biomeName: string, objectName: string): string => {
    const generalObjects = ["chest", "relic", "pirate", "glitterbug"];
    if (generalObjects.includes(objectName)) {
      return `/img/environment/${objectName}.png`;
    } else {
      return `/img/environment/${biomeName.toLowerCase()}/${objectName}.png`;
    }
  };

  return (
    <div className="biome-detail-page">
      <div className="biome-banner">
        <StandardImage src={`/img/environment/${biome?.name.toLowerCase()}/banner.jpg`} alt="" />
        <h1>Probability Distributions - {biome?.name}</h1>
      </div>
      <div className="biome-chart-grid">
        {biome &&
          Array.from(biome.frequencyMap.entries()).map(
            ([objectName, countFrequencyMap]: [string, Map<number, number>]) => (
              <RogueContainer>
                <div key={objectName} style={{ position: "relative", margin: "10px 12px 5px" }}>
                  <h2 style={{ marginTop: 0 }}>
                    {objectName}
                    &nbsp;&nbsp;-&nbsp;&nbsp;
                    <strong style={{ fontSize: "0.8em" }}>&#8960;</strong>&nbsp;
                    {Math.round(
                      Array.from(countFrequencyMap.entries())
                        .map(([count, freq]) => count * freq)
                        .reduce((a, b) => a + b) / biome.runs,
                    )}
                  </h2>
                  <StandardImage
                    src={getObjectImageSrc(biome.name, objectName)}
                    alt={objectName}
                    style={{ position: "absolute", right: 0, top: 0, width: 50 }}
                  />
                  <BiomeProbabilityChart
                    countFrequencyMap={countFrequencyMap}
                    biomeKey={objectName}
                  />
                </div>
              </RogueContainer>
            ),
          )}
      </div>
    </div>
  );
}
