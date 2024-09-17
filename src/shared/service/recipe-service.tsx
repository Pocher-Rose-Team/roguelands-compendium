import { forkJoin, map, Observable } from "rxjs";
import { ItemType } from "../model/item-type";
import { EmblemRecipe } from "../model/emblem-recipe";
import { ItemService } from "./item-service";
import { Item } from "../model/item";

export class RecipeService {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  getEmblemCraftingRecipes(): Observable<EmblemRecipe[]> {
    return forkJoin([
      this.itemService.getAllItems().pipe(
        map((allItems) =>
          allItems.reduce((map, obj) => {
            map.set(obj.name, obj);
            return map;
          }, new Map<string, Item>()),
        ),
      ),
      this.itemService.getAllItemsOfType(ItemType.EMBLEMS),
    ]).pipe(
      map(([itemMap, emblems]) =>
        emblems.map((em) => {
          return {
            material: itemMap.get(em.craftedWith.length > 0 ? em.craftedWith[0].item : ""),
            amount: em.craftedWith.length > 0 ? em.craftedWith[0].amount : "",
            result: em,
          } as EmblemRecipe;
        }),
      ),
    );
  }
}
