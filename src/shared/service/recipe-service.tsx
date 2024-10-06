import { forkJoin, map, Observable } from "rxjs";
import { EmblemRecipe, ItemRecipe } from "../model/recipe.model";
import { ItemService } from "./item-service";
import { ItemSource, ItemType } from "../model/item";

export class RecipeService {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  getEmblemCraftingRecipes(): Observable<EmblemRecipe[]> {
    return forkJoin([
      this.itemService.getAllItemsAsMapByName(),
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
      this.itemService.getAllItemsAsMapByName(),
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

  getItemCraftingRecipesOfTypes(types: ItemType[]): Observable<Map<ItemType, ItemRecipe[]>> {
    return this.groupListOfRecipeListByTypes(
      forkJoin(types.map((type) => this.getItemCraftingRecipesOfType(type))),
    );
  }

  getItemCraftingRecipesOfTypeFilteredBySource(
    type: ItemType,
    source: ItemSource,
  ): Observable<ItemRecipe[]> {
    return this.getItemCraftingRecipesOfType(type).pipe(
      map((itemRecipes) =>
        itemRecipes.filter(
          (recipe) =>
            recipe.materials &&
            recipe.materials.filter((mat) => mat.name.toLowerCase().includes(source.toString()))
              .length > 0,
        ),
      ),
    );
  }

  getItemCraftingRecipesOfTypesFilteredBySource(
    types: ItemType[],
    source: ItemSource,
  ): Observable<Map<ItemType, ItemRecipe[]>> {
    return this.groupListOfRecipeListByTypes(
      forkJoin(
        types.map((type) => this.getItemCraftingRecipesOfTypeFilteredBySource(type, source)),
      ),
    );
  }

  private groupListOfRecipeListByTypes(
    list: Observable<ItemRecipe[][]>,
  ): Observable<Map<ItemType, ItemRecipe[]>> {
    return list.pipe(
      map((listOfRecipeList) =>
        listOfRecipeList.reduce((map, recipeList) => {
          const itemType = recipeList.length > 0 ? recipeList[0].result.type : null;
          if (itemType) {
            map.set(itemType, recipeList);
          }
          return map;
        }, new Map<ItemType, ItemRecipe[]>()),
      ),
    );
  }
}
