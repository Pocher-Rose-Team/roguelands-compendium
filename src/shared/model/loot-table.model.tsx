import { Item } from "./item";

export interface LootTable {
  name: string;
  path: string;
  credits: { min: number; max: number };
  loot: { id: number; name: string; probability: number; item?: Item }[];
  extraLoot: { id: number; item?: Item }[];
}
