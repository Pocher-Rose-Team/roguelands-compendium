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
  Tabs,
  Tab,
} from "@mui/material";
import { Item, ItemType, StatType } from "../../shared/model/item";
import { ItemService } from "../../shared/service/item-service"; // Assume this handles data fetching
import ItemCard from "./item-card";
import RogueButton from "../../shared/components/rogue-button/rogue-button";
import StandardAutocomplete from "../../shared/components/standard-autocomplete/standard-autocomplete";
import StandardTabContainer from "../../shared/components/standard-tab-container/standard-tab-container";

const Store: React.FC = () => {
  const itemService = new ItemService();
  const [items, setItems] = useState<Item[]>([]);
  const [mostUsedItems, setMostUsedItems] = useState<Item[]>([]);
  const [personalMostUsedItems, setPersonalMostUsedItems] = useState<Item[]>([]);
  const [leastUsedItems, setLeastUsedItems] = useState<Item[]>([]);
  const [personalLeastUsedItems, setPersonalLeastUsedItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [selectedStats, setSelectedStats] = useState<StatType[]>([]);
  const [cartItems, setCartItems] = useState<Item[]>([]); // To store added items in cart
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0); // For navigating with arrow keys
  const [selectedType, setSelectedType] = useState<ItemType | undefined>(undefined); // To store the selected item type
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    // Fetch data from the service
    itemService.getMostUsedItems().subscribe((data: Item[]) => setMostUsedItems(data));
    itemService.getLeastUsedItems().subscribe((data: Item[]) => setLeastUsedItems(data));

    const personalItems = JSON.parse(localStorage.getItem("personalItems") || "[]");
    setPersonalMostUsedItems(personalItems.mostUsed || []);
    setPersonalLeastUsedItems(personalItems.leastUsed || []);

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    itemService.getAllItems().subscribe((data: Item[]) => setItems(data));
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) => {
      if (selectedType === undefined) return true; // Show all items if "All" is selected
      return item.type === selectedType;
    });

    setFilteredItems(filtered);
    itemService.getMostUsedItems(selectedType).subscribe((data: Item[]) => setMostUsedItems(data));
    itemService
      .getLeastUsedItems(selectedType)
      .subscribe((data: Item[]) => setLeastUsedItems(data));
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
    itemService.getRecommendedItems(stat1, stat2).subscribe((suggestedItems) => {
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

  // Arrow key navigation for autocomplete
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveItemIndex((prevIndex) =>
        prevIndex < filteredItems.length - 1 ? prevIndex + 1 : prevIndex,
      );
    } else if (e.key === "ArrowUp") {
      setActiveItemIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === "Enter" && filteredItems[activeItemIndex]) {
      addToCart(filteredItems[activeItemIndex]);
    }
  };
  const handleAutocompletePick = (newValue: any) => {
    console.log(newValue);
  };

  return (
    <Box>
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
      <StandardAutocomplete
        options={items.map((item) => item.name)}
        onChange={(e, newValue) => handleAutocompletePick(newValue)}
        label="Search Item to add to cart"
        sx={{ marginTop: 1 }}
        multiple={false}
      />

      {/* Most Used Items Overall */}
      <Typography variant="h6">Most Used Items</Typography>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {mostUsedItems.map((item) => (
          <ItemCard key={item.name} item={item} onAddToCart={() => handleAddToCart(item)} />
        ))}
      </Box>

      {/* Most Used Items for User */}
      <Typography variant="h6">Your Most Used Items</Typography>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {personalMostUsedItems.map((item) => (
          <ItemCard key={item.name} item={item} onAddToCart={() => handleAddToCart(item)} />
        ))}
      </Box>

      {/* Least Used Items Overall */}
      <Typography variant="h6">Least Used Items</Typography>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {leastUsedItems.map((item) => (
          <ItemCard key={item.name} item={item} onAddToCart={() => handleAddToCart(item)} />
        ))}
      </Box>

      {/* Least Used Items for User */}
      <Typography variant="h6">Your Least Used Items</Typography>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {personalLeastUsedItems.map((item) => (
          <ItemCard key={item.name} item={item} onAddToCart={() => handleAddToCart(item)} />
        ))}
      </Box>

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
    </Box>
  );
};

export default Store;
