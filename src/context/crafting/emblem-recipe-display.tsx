import ItemSlot from "../../shared/components/item-slot";
import CraftingArrow from "./crafting-arrow";
import { Item } from "../../shared/model/item";
import { EmblemRecipe } from "../../shared/model/emblem-recipe";

interface EmblemRecipeAttributes {
  recipe: EmblemRecipe;
}

export default function EmblemRecipeDisplay({ recipe }: EmblemRecipeAttributes) {
  return (
    <div className="emblem-recipe">
      <ItemSlot item={recipe.material} />
      <CraftingArrow />
      <ItemSlot item={recipe.result} />
    </div>
  );
}
