import { Item } from "./item";

export interface LootItem {
  id: number;
  name: string;
  probability: number;
  item?: Item;
}

export interface LootTable {
  name: string;
  path: string;
  credits: { min: number; max: number };
  loot: LootItem[];
  extraLoot: LootItem[];
}
