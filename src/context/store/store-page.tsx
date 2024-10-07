import React, { useState, useEffect } from "react";
import { Tab } from "@mui/material";
import { Item, ItemType } from "../../shared/model/item";
import ItemCard from "./item-card";
import StandardTabContainer from "../../shared/components/standard-tab-container/standard-tab-container";
import { StoreService } from "../../shared/service/store-service";
import StandardTextField from "../../shared/components/standard-textfield/standard-textfield";

const Store: React.FC = () => {
  const storeService = new StoreService();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Map<string, { item: Item; amount: number }>>(new Map());
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0); // For navigating with arrow keys
  const [selectedType, setSelectedType] = useState<ItemType | undefined>(undefined); // To store the selected item type

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
    setCart(storedCart);

    storeService.getAllCraftableOrLootableItems().subscribe((data: Item[]) => setItems(data));
  }, []);

  useEffect(() => {
    if (selectedType !== undefined) {
      storeService
        .getAllCraftableOrLootableItemsByType(selectedType)
        .subscribe((data) => setItems(data));
    } else {
      storeService.getAllCraftableOrLootableItems().subscribe((data) => setItems(data));
    }
  }, [selectedType]);

  const handleAddToCart = (item: Item) => {
    // TODO: Refactor local storage stuff into service
    const updatedCart = Array.from(cart).reduce((map, [itemName, entry]) => {
      map.set(itemName, entry);
      return map;
    }, new Map());
    const existingItem = updatedCart.get(item.name);
    if (existingItem) {
      existingItem.amount += 1;
      updatedCart.set(item.name, existingItem);
    } else {
      updatedCart.set(item.name, { item: item, amount: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(Array.from(updatedCart)));

    // TODO: @Jan das geht gar nicht
    window.dispatchEvent(new Event("storage"));
  };
  const handleTypeChange = (type: ItemType | undefined) => {
    setSelectedType(type);
  };

  return (
    <div className="store-page-container">
      <div className="store-nav-bar">
        <StandardTabContainer
          value={activeItemIndex}
          onChange={(_, index) => setActiveItemIndex(index)}
        >
          <Tab label="All" onClick={() => handleTypeChange(undefined)} />
          <Tab label="Armor" onClick={() => handleTypeChange(ItemType.ARMOR)} />
          <Tab label="Droids" onClick={() => handleTypeChange(ItemType.DROIDS)} />
          <Tab label="Helmets" onClick={() => handleTypeChange(ItemType.HELMETS)} />
          <Tab label="Shields" onClick={() => handleTypeChange(ItemType.SHIELDS)} />
          <Tab label="Weapons" onClick={() => handleTypeChange(ItemType.WEAPONS)} />
        </StandardTabContainer>

        {/* Search Bar */}
        <StandardTextField onChange={() => {}} label="Search Item" sx={{ flexGrow: 1 }} />
      </div>

      <div className="store-grid">
        {items.map((item, i) => (
          <ItemCard
            key={`${item.name}-${item.id}${i}`}
            item={item}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default Store;
