import EmblemRecipeDisplay from "./emblem-recipe-display";
import "./crafting.css";
import { useEffect, useState } from "react";
import { EmblemRecipe } from "../../shared/model/emblem-recipe";
import { RecipeService } from "../../shared/service/recipe-service";
import StandardButton from "../../shared/components/standard-button/standard-button";

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
        {items.map((recipe, i) => (
          <EmblemRecipeDisplay key={i} recipe={recipe} />
        ))}
      </div>
      <br />
      <br />
      <StandardButton text="Cooler Button" onClick={() => console.log("Test")} />
    </div>
  );
}
