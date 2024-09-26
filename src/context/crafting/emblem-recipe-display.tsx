import ItemSlot, { ItemSlotType } from "../../shared/components/item-slot/item-slot";
import CraftingArrow from "./crafting-arrow";
import { EmblemRecipe } from "../../shared/model/recipe.model";

interface EmblemRecipeAttributes {
  recipe: EmblemRecipe;
}

export default function EmblemRecipeDisplay({ recipe }: EmblemRecipeAttributes) {
  return (
    <div className="emblem-recipe">
      <ItemSlot type={ItemSlotType.CRAFTING} item={recipe.material} amount={recipe.amount} />
      <CraftingArrow />
      <ItemSlot type={ItemSlotType.CRAFTING} item={recipe.result} />
    </div>
  );
}
