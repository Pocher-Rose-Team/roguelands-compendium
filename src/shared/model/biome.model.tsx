export interface Biome {
  name: string;
  runs: number;
  // Map of key: objectName (one loot table), value: array of occurences of object in iterations
  objects: Map<string, number[]>;
  // Map of key: objectName (one loot table), value: Map of key: occurences of object in iterations, value: count of exact occurances in all iterations
  frequencyMap: Map<string, Map<number, number>>;
  // Map of key: biomeName, value: probability to get biome spawned
  portalTo: Map<string, number>;
}
