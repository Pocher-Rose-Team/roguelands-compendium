import EmblemRecipeDisplay from "./emblem-recipe-display";
import "./crafting.css";
import { useEffect, useState } from "react";
import { EmblemRecipe, ItemRecipe } from "../../shared/model/recipe.model";
import { RecipeService } from "../../shared/service/recipe-service";
import { ItemType } from "../../shared/model/item-type";
import RecipeDisplay from "./recipe-display";

export default function CraftingPage() {
  const recipeService = new RecipeService();

  const [emblemRecipes, setEmblemRecipes] = useState<EmblemRecipe[]>([]);
  const [itemRecipes, setItemRecipes] = useState<ItemRecipe[]>([]);

  useEffect(() => {
    recipeService.getEmblemCraftingRecipes().subscribe({
      next: (recipes) => setEmblemRecipes(recipes),
      error: (error) => console.error("Error loading items:", error),
    });
    recipeService.getItemCraftingRecipesOfType(ItemType.SHIELDS).subscribe({
      next: (recipes) => setItemRecipes(recipes),
      error: (error) => console.error("Error loading items:", error),
    });
  }, []);

  return (
    <div>
      <div className="emblem-crafting-grid">
        {emblemRecipes.map((recipe, i) => (
          <EmblemRecipeDisplay key={i} recipe={recipe} />
        ))}
      </div>
      <br />
      <br />
      <div className="item-crafting-grid">
        {itemRecipes.map((recipe, i) => (
          <RecipeDisplay recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
