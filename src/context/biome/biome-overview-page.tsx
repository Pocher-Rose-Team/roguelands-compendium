import React, { useEffect, useState } from "react";
import { BiomeService } from "../../shared/service/biome-service";
import { Biome } from "../../shared/model/biome.model";
import BiomeDisplay from "./biome-display";

export default function BiomeOverviewPage() {
  const biomeService = new BiomeService();
  const [biomeData, setBiomeData] = useState<Biome[]>([]);

  useEffect(() => {
    biomeService.getAllBiomes().subscribe({
      next: (biomes) => {
        setBiomeData(biomes);
      },
      error: console.error,
    });
  }, []);

  return (
    <div style={{ margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Biomes</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {biomeData.length > 0 &&
          biomeData.map((biome) => <BiomeDisplay key={biome.name} biome={biome} />)}
      </div>
    </div>
  );
}
