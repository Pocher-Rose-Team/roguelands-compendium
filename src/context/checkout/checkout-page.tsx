import "./checkout-page.css";
import { StoreService } from "../../shared/service/store-service";
import { useEffect, useState } from "react";
import { Item } from "../../shared/model/item";
import CheckoutEntry from "./checkout-entry";
import StandardButton from "../../shared/components/standard-button/standard-button";

export default function CheckoutPage() {
  const storeService = new StoreService();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Map<string, { item: Item; amount: number }>>(new Map());

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
    setCart(storedCart);

    storeService.getAllCraftableOrLootableItems().subscribe((data: Item[]) => setItems(data));
  }, []);

  const handleCheckoutEntryValueChange = (amount: number, item: string) => {
    // TODO: Refactor local storage stuff into service
    const updatedCart = Array.from(cart).reduce((map, [itemName, entry]) => {
      map.set(itemName, entry);
      return map;
    }, new Map());
    const existingItem = updatedCart.get(item);
    if (existingItem && amount !== 0) {
      existingItem.amount = amount;
      updatedCart.set(item, existingItem);
    } else {
      updatedCart.delete(item);
    }
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(Array.from(updatedCart)));
  };

  return (
    <div className="checkout-page-container">
      <h1>Checkout</h1>
      <div className="checkout-entry-list">
        {Array.from(cart).map(([key, entry]) => (
          <CheckoutEntry
            key={key}
            item={entry.item}
            amount={entry.amount}
            valueChange={handleCheckoutEntryValueChange}
          />
        ))}
        {Array.from(cart).length === 0 && "No entries in cart"}
      </div>

      <StandardButton text="Calculate farming strategy" />
    </div>
  );
}
