import "./checkout-page.css";
import { useEffect, useState } from "react";
import { Item } from "../../shared/model/item";
import CheckoutEntry from "./checkout-entry";
import StandardButton from "../../shared/components/standard-button/standard-button";
import { FarmingStrategyService } from "../../shared/service/farming-strategy-service";
import RogueContainer from "../../shared/components/rogue-container/rogue-container";
import RogueIcon from "../../shared/components/rogue-icon/rogue-icon";

export default function CheckoutPage() {
  const farmingStrategyService = new FarmingStrategyService();
  const [cart, setCart] = useState<Map<string, { item: Item; amount: number }>>(new Map());
  const [neededItems, setNeededItems] = useState<{ item: Item; amount: number }[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
    setCart(storedCart);
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

  const calculateFarmingStrategy = () => {
    farmingStrategyService
      .calculateNeededResources(Array.from(cart).map(([key, entry]) => entry))
      .subscribe((v) => setNeededItems(v));
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

      <StandardButton text="Calculate farming strategy" onClick={calculateFarmingStrategy} />

      <div style={{ height: 150 }}></div>

      <h1>List of needed items</h1>
      {neededItems.map((item) => (
        <RogueContainer className="checkout-entry">
          <RogueIcon itemId={item?.item?.id ?? 0} />
          <h2>
            {item?.amount}x {item?.item?.name}
          </h2>
        </RogueContainer>
      ))}
    </div>
  );
}
