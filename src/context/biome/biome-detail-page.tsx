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
    <div>
      <div
        style={{
          backgroundImage: `url("/img/environment/${biome?.name.toLowerCase()}/banner.png")`,
        }}
      ></div>
      <h1>Probability Distributions ({biome?.name})</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 60 }}>
        {biome &&
          Array.from(biome.frequencyMap.entries()).map(
            ([objectName, countFrequencyMap]: [string, Map<number, number>]) => (
              <div key={objectName} style={{ position: "relative" }}>
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
                <img
                  src={getObjectImageSrc(biome.name, objectName)}
                  alt={objectName}
                  style={{ position: "absolute", right: 0, top: 0, width: 50 }}
                />
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
