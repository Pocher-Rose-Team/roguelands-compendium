import React from "react";
import { Biome } from "../../shared/model/biome.model";
import { useNavigate } from "react-router-dom";
import StandardImage from "../../shared/components/standard-image/standard-image";

interface BiomeDisplayAttributes {
  biome: Biome;
}

export default function BiomeDisplay({ biome }: BiomeDisplayAttributes) {
  const navigate = useNavigate();

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column", cursor: "pointer" }}
      onClick={() => navigate(`/roguelands-compendium/biomes/${biome.name}`)}
    >
      <StandardImage
        src={`/img/worldIcons/${biome.name}Icon.png`}
        alt={biome.name}
        style={{ width: 125 }}
      />
      <h2>{biome.name}</h2>
    </div>
  );
}
