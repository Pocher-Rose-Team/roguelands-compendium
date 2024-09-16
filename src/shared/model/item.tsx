// Define the Item interface based on the structure of the JSON data
export interface Item {
  name: string;
  representation: string;
  path: string;
  stats: {
    str: number;
    dex: number;
    vit: number;
    tec: number;
    fth: number;
    mag: number;
  };
  craftedWith: string[];
}
