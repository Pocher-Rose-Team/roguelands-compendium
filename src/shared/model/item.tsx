// Define the Item interface based on the structure of the JSON data
export interface Item {
  name: string;
  representation: string;
  path: string;
  stats: {
    vit: number;
    dex: number;
    mag: number;
    str: number;
    tec: number;
    fth: number;
  };
  craftedWith: { amount: number; item: string }[];
  description: string;
  foundIn: string[];
  type: ItemType;
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
