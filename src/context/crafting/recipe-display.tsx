import ItemSlot from "../../shared/components/item-slot/item-slot";
import CraftingArrow from "./crafting-arrow";
import { ItemRecipe } from "../../shared/model/recipe.model";

interface RecipeAttributes {
  recipe: ItemRecipe;
}

export default function RecipeDisplay({ recipe }: RecipeAttributes) {
  return (
    <div className="item-recipe">
      <div className="slot-group">
        <ItemSlot item={recipe.materials ? recipe.materials[0] : undefined} />
        <ItemSlot item={recipe.materials ? recipe.materials[1] : undefined} />
        <ItemSlot item={recipe.materials ? recipe.materials[2] : undefined} />
      </div>
      <CraftingArrow />
      <ItemSlot item={recipe.result} />
    </div>
  );
}
