import { Item } from "./item";

export interface EmblemRecipe {
  material?: Item;
  amount: number;
  result: Item;
}

export interface ItemRecipe {
  materials?: Item[];
  result: Item;
}
