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
        {recipe.materials?.map((material) => {
          return <ItemSlot item={material} />
        })
        }
        {!recipe.materials || recipe.materials.length < 1 && <ItemSlot /> }
      </div>
      <CraftingArrow />
      <ItemSlot item={recipe.result} />
    </div>
  );
}
