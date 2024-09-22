import EmblemRecipeDisplay from "./emblem-recipe-display";
import "./crafting.css";
import { useEffect, useState } from "react";
import { EmblemRecipe, ItemRecipe } from "../../shared/model/recipe.model";
import { RecipeService } from "../../shared/service/recipe-service";
import { ItemType } from "../../shared/model/item-type";
import RecipeDisplay from "./recipe-display";
import { map } from "rxjs";

export default function CraftingPage() {
  const recipeService = new RecipeService();

  const [emblemRecipes, setEmblemRecipes] = useState<EmblemRecipe[]>([]);
  const [potionRecipes, setPotionRecipes] = useState<ItemRecipe[]>([]);
  const [itemRecipes, setItemRecipes] = useState<ItemRecipe[][]>([]);

  useEffect(() => {
    recipeService.getEmblemCraftingRecipes().subscribe({
      next: (recipes) => setEmblemRecipes(recipes),
      error: (error) => console.error("Error loading items:", error),
    });
    recipeService.getItemCraftingRecipesOfType(ItemType.POTIONS).subscribe({
      next: (recipes) => setPotionRecipes(recipes),
      error: (error) => console.error("Error loading items:", error),
    });
    recipeService
      .getItemCraftingRecipesOfTypes([
        ItemType.WEAPONS,
        ItemType.ARMOR,
        ItemType.HELMETS,
        ItemType.SHIELDS,
        ItemType.DROIDS,
      ])
      .pipe(
        map((recipes) =>
          recipes.map((r) => r.filter((v) => v?.materials && v.materials.length > 0)),
        ),
      )
      .subscribe({
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
      <div className="potion-crafting-grid">
        {potionRecipes.map((recipe, i) => (
          <RecipeDisplay key={i} recipe={recipe} />
        ))}
      </div>
      <br />
      <br />
      {itemRecipes.map((recipes, i) => (
        <div>
          <div className="item-crafting-grid">
            {recipes.map((r, j) => (
              <RecipeDisplay key={`${i}+${j}`} recipe={r} />
            ))}
          </div>
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
