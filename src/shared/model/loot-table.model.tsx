import { Item } from "./item";

export interface LootItem {
  id: number;
  name: string;
  probability: number;
  count: number;
  item?: Item;
}

export interface LootTable {
  name: string;
  path: string;
  credits: { min: number; max: number };
  scrapmetal: { min: number; max: number };
  description: string;
  loot: LootItem[];
  extraLoot: LootItem[];
}
