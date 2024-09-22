import EmblemRecipeDisplay from "./emblem-recipe-display";
import "./crafting.css";
import { useEffect, useState } from "react";
import { EmblemRecipe, ItemRecipe } from "../../shared/model/recipe.model";
import { RecipeService } from "../../shared/service/recipe-service";
import RecipeDisplay from "./recipe-display";
import { forkJoin, map } from "rxjs";
import { ItemSource, ItemType } from "../../shared/model/item";

export default function CraftingPage() {
  const recipeService = new RecipeService();

  const [emblemRecipes, setEmblemRecipes] = useState<EmblemRecipe[]>([]);
  const [potionRecipes, setPotionRecipes] = useState<ItemRecipe[]>([]);
  const [itemRecipes, setItemRecipes] = useState<Map<ItemType, ItemRecipe[]>>(new Map());

  useEffect(() => {
    forkJoin([
      recipeService.getEmblemCraftingRecipes(),
      recipeService.getItemCraftingRecipesOfType(ItemType.POTIONS),
      recipeService.getItemCraftingRecipesOfTypesFilteredBySource(
        [ItemType.WEAPONS, ItemType.ARMOR, ItemType.HELMETS, ItemType.SHIELDS, ItemType.DROIDS],
        ItemSource.EMBLEM,
      ),
    ]).subscribe({
      next: ([emblemRecipes, potionRecipes, itemRecipes]) => {
        setEmblemRecipes(emblemRecipes);
        setPotionRecipes(potionRecipes);
        setItemRecipes(itemRecipes);
      },
      error: (error) => console.error("Error loading items:", error),
    });
  }, []);

  return (
    <div className="crafting-page-container">
      <div className="emblem-crafting-grid">
        {emblemRecipes.map((recipe, i) => (
          <EmblemRecipeDisplay key={i} recipe={recipe} />
        ))}
      </div>
      <div className="potion-crafting-grid">
        {potionRecipes.map((recipe, i) => (
          <RecipeDisplay key={i} recipe={recipe} />
        ))}
      </div>
      {Object.entries(Object.fromEntries(itemRecipes)).map(([itemType, recipes], i) => (
        <div>
          <h1>{itemType}</h1>
          <div className="item-crafting-grid">
            {recipes.map((r, j) => (
              <RecipeDisplay key={`${i}+${j}`} recipe={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
