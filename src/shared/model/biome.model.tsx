export interface Biome {
  name: string;
  runs: number;
  objects: Map<string, number[]>;
  frequencyMap: Map<string, Map<number, number>>;
}
