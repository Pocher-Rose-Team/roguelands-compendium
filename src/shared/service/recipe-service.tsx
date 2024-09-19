import { forkJoin, map, Observable } from "rxjs";
import { ItemType } from "../model/item-type";
import { EmblemRecipe, ItemRecipe } from "../model/recipe.model";
import { ItemService } from "./item-service";

export class RecipeService {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  getEmblemCraftingRecipes(): Observable<EmblemRecipe[]> {
    return forkJoin([
      this.itemService.getAllItemsAsMap(),
      this.itemService.getAllItemsOfType(ItemType.EMBLEMS),
    ]).pipe(
      map(([itemMap, emblemList]) =>
        emblemList.map((emblem) => {
          const emblemCraftedWith =
            emblem.craftedWith.length > 0 ? emblem.craftedWith[0] : { item: "", amount: 0 };
          return {
            material: itemMap.get(emblemCraftedWith.item),
            amount: emblemCraftedWith.amount,
            result: emblem,
          } as EmblemRecipe;
        }),
      ),
    );
  }

  getItemCraftingRecipesOfType(type: ItemType): Observable<ItemRecipe[]> {
    if (type === ItemType.EMBLEMS) {
      throw new Error("For emblem recipes use getEmblemCraftingRecipes() method");
    }
    return forkJoin([
      this.itemService.getAllItemsAsMap(),
      this.itemService.getAllItemsOfType(type),
    ]).pipe(
      map(([itemMap, toCraftList]) =>
        toCraftList.map((itemToCraft) => {
          return {
            materials: itemToCraft.craftedWith.map((material) => itemMap.get(material.item)),
            result: itemToCraft,
          } as ItemRecipe;
        }),
      ),
    );
  }
}
