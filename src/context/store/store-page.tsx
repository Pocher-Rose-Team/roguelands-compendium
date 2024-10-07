import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
} from "@mui/material";
import { Item, ItemType, StatType } from "../../shared/model/item";
import ItemCard from "./item-card";
import StandardAutocomplete from "../../shared/components/standard-autocomplete/standard-autocomplete";
import StandardTabContainer from "../../shared/components/standard-tab-container/standard-tab-container";
import { StoreService } from "../../shared/service/store-service";
import StandardTextField from "../../shared/components/standard-textfield/standard-textfield";

const Store: React.FC = () => {
  const storeService = new StoreService();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [selectedStats, setSelectedStats] = useState<StatType[]>([]);
  const [cartItems, setCartItems] = useState<Item[]>([]); // To store added items in cart
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0); // For navigating with arrow keys
  const [selectedType, setSelectedType] = useState<ItemType | undefined>(undefined); // To store the selected item type

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
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
  }, [selectedType, items]);

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  const handleAddToCart = (item: Item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };
  const handleTypeChange = (type: ItemType | undefined) => {
    setSelectedType(type);
  };
  const handleOpenHelpDialog = () => {
    setOpenHelpDialog(true);
  };

  const handleCloseHelpDialog = () => {
    setOpenHelpDialog(false);
  };

  const handleStatChange = (index: number, value: StatType) => {
    const updatedStats = [...selectedStats];
    updatedStats[index] = value;
    setSelectedStats(updatedStats);
  };

  const handleHelpSelection = () => {
    // Logic for suggesting items based on selected stats
    // Assuming the itemService has a method to fetch based on stats
    const [stat1, stat2] = selectedStats;
    storeService.getRecommendedItems(stat1, stat2).subscribe((suggestedItems) => {
      // Do something with the suggested items
    });
    setOpenHelpDialog(false);
  };
  // Function to handle adding an item to the cart
  const addToCart = (item: Item) => {
    const updatedCart = [...cartItems, item];
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleItemSearchChange = (newValue: any) => {
    console.log(newValue);
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
        <StandardTextField
          onChange={(e) => handleItemSearchChange(e)}
          label="Search Item"
          sx={{ flexGrow: 1 }}
        />
      </div>

      <div className="store-grid">
        {items.map((item) => (
          <ItemCard key={item.name} item={item} onAddToCart={() => handleAddToCart(item)} />
        ))}
      </div>

      {/* Help Dialog */}
      <Dialog open={openHelpDialog} onClose={handleCloseHelpDialog}>
        <DialogTitle>Help Me Choose</DialogTitle>
        <DialogContent>
          <Typography>Select two stats:</Typography>
          <TextField
            label="First Stat"
            value={selectedStats[0] || ""}
            onChange={(e) => handleStatChange(0, e.target.value as StatType)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Second Stat"
            value={selectedStats[1] || ""}
            onChange={(e) => handleStatChange(1, e.target.value as StatType)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHelpDialog}>Cancel</Button>
          <Button onClick={handleHelpSelection}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Store;
