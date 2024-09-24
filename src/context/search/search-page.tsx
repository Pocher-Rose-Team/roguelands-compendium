import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Item } from "../../shared/model/item";
import { ItemService } from "../../shared/service/item-service";
import { get } from "fast-levenshtein";
import StandardTextField from "../../shared/components/standard-textfield/standard-textfield";
import "./search-page.css";
import { Box, FormControlLabel, Switch } from "@mui/material";
import StandardButton from "../../shared/components/standard-button/standard-button";

const ItemSearch: React.FC = () => {
  const MAX_RESULT_COUNT = 9;

  const itemService = new ItemService();
  const [items, setItems] = useState<Item[]>([]); // Array of Item objects
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Filtered list of items
  const [onlyItemsWithoutStats, setOnlyItemsWithoutStats] = useState<boolean>(true); // Filtered list of items
  const [onlyItemsWithoutCrafting, setOnlyItemsWithoutCrafting] = useState<boolean>(true); // Filtered list of items
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch the JSON data from the public folder on component mount
  useEffect(() => {
    itemService.getAllItems().subscribe({
      next: (items) => setItems(items),
      error: (error) => console.error("Error loading items:", error),
    });
  }, []);

  // Filter the items based on the search term and limit the results to 5 items
  useEffect(() => {
    if (searchTerm) {
      const sanitizedSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, "");
      const results = items
        .filter((item) => {
          if (onlyItemsWithoutCrafting) {
            if (item.craftedWith.length > 0 || item.foundIn.length > 0) {
              return false;
            }
          }
          if (onlyItemsWithoutStats) {
            if (
              item.stats.dex > 0 ||
              item.stats.fth > 0 ||
              item.stats.mag > 0 ||
              item.stats.str > 0 ||
              item.stats.tec > 0 ||
              item.stats.vit > 0
            ) {
              return false;
            }
          }
          const sanitizedItemName = item.name.toLowerCase().replace(/\s+/g, "");
          const distance = get(sanitizedItemName, sanitizedSearchTerm);
          return distance <= 2 || sanitizedItemName.includes(sanitizedSearchTerm);
        })
        .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
        .slice(0, MAX_RESULT_COUNT); // Limit the number of results to 5
      setFilteredItems(results);
    } else {
      setFilteredItems([]); // Show no items if the search term is empty
    }
  }, [searchTerm, items, onlyItemsWithoutCrafting, onlyItemsWithoutStats]);

  // Handle the search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle clicking on an item
  const handleItemClick = (itemName: string) => {
    navigate(`/editor/${itemName}`);
  };

  const downloadJson = () => {
    const itemsJson = localStorage.getItem("items"); // Get items from localStorage

    if (!itemsJson) {
      console.error("No items found in localStorage.");
      return;
    }

    const blob = new Blob([itemsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "json/items.json"; // The downloaded file will be named "items.json"
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a); // Clean up after the click
    URL.revokeObjectURL(url); // Release the blob URL after download
  };

  return (
    <div className="search-container">
      <h2>Search Items</h2>
      {/* Toggle to filter craftedWith options */}
      <Box sx={{ marginBottom: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={onlyItemsWithoutCrafting}
              onChange={() => setOnlyItemsWithoutCrafting(!onlyItemsWithoutCrafting)}
              color="primary"
            />
          }
          label="Show only unfinished items"
        />
      </Box>
      {/* Toggle to filter craftedWith options */}
      <Box sx={{ marginBottom: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={onlyItemsWithoutStats}
              onChange={() => setOnlyItemsWithoutStats(!onlyItemsWithoutStats)}
              color="primary"
            />
          }
          label="Show only items without stats"
        />
      </Box>
      <StandardTextField
        fullWidth
        label="Search by item name"
        value={searchTerm}
        onChange={handleInputChange}
      />

      {/* Only show the list when there is something in the input field */}
      {searchTerm && filteredItems.length > 0 && (
        <div className="search-result-list">
          {filteredItems.map((item) => (
            <div
              className="search-result-item"
              key={item.name}
              onClick={() => handleItemClick(item.name)} // Navigate to the editor when an item is clicked
            >
              <img src={item.path} alt={item.name} />
              <div>
                <p className="item-title">{item.representation}</p>
                <p className="item-path">{item.path}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <StandardButton onClick={downloadJson} sx={{ marginTop: 2 }} text="Download json" />
      <StandardButton
        onClick={() => localStorage.removeItem("items")}
        sx={{ marginTop: 2 }}
        text="Delete localStorage"
      />
    </div>
  );
};

export default ItemSearch;
