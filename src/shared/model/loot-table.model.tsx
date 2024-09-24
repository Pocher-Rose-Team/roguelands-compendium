export interface LootTable {
  name: string;
  loot: { id: number; name: string; probability: number }[];
}
