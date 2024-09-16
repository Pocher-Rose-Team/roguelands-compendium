import EmblemRecipeDisplay from "./emblem-recipe-display";
import "./crafting.css";
import { ItemService } from "../../shared/service/item-service";
import { useEffect, useState } from "react";
import { Item } from "../../shared/model/item";
import { ItemType } from "../../shared/model/item-type";
import { EmblemRecipe } from "../../shared/model/emblem-recipe";
import { RecipeService } from "../../shared/service/recipe-service";

export default function CraftingPage() {
  const recipeService = new RecipeService();

  const [items, setItems] = useState<EmblemRecipe[]>([]);

  useEffect(() => {
    recipeService.getEmblemCraftingRecipes().subscribe({
      next: (recipes) => setItems(recipes),
      error: (error) => console.error("Error loading items:", error),
    });
  }, []);

  return (
    <div>
      <div className="crafting-grid">
        {items.map((recipe) => (
          <EmblemRecipeDisplay recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
