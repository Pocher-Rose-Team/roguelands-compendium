// Define the Item interface based on the structure of the JSON data
export interface Stats {
  vit: number;
  dex: number;
  mag: number;
  str: number;
  tec: number;
  fth: number;
}

export interface Item {
  id?: number;
  name: string;
  representation: string;
  path: string;
  stats: Stats;
  craftedWith: { amount: number; item: string; id?: number }[];
  description: string;
  foundIn: string[];
  type: ItemType;
}

export enum StatType {
  VIT = "vit",
  DEX = "dex",
  MAG = "mag",
  STR = "str",
  TEC = "tec",
  FTH = "fth",
}

export enum ItemType {
  ARMOR = "armor",
  DROIDS = "droids",
  DROPS = "drops",
  EMBLEMS = "emblems",
  GEARMODS = "gearmods",
  HELMETS = "helmets",
  MISC = "misc",
  POTIONS = "potions",
  PRISMS = "prisms",
  RINGS = "rings",
  SHIELDS = "shields",
  WEAPONS = "weapons",
}

export enum ItemSource {
  EMBLEM = "emblem",
  PRISM = "prism",
}
