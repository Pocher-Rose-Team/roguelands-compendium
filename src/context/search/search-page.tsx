import React, { useState, useEffect } from "react";
import { TextField, Box, List, ListItem, ListItemText } from "@mui/material";
import { Item } from "../../shared/model/item";
import { ItemService } from "../../shared/service/item-service";
import { get} from 'fast-levenshtein';



const ItemSearch: React.FC = () => {
  const itemService = new ItemService();
  const [items, setItems] = useState<Item[]>([]); // Array of Item objects
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Filtered list of items

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
      const sanitizedSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, '');
      const results = items
        .filter((item) => {
          const sanitizedItemName = item.name.toLowerCase().replace(/\s+/g, '');
          const distance = get(sanitizedItemName, sanitizedSearchTerm);
          return distance <= 2 || sanitizedItemName.includes(sanitizedSearchTerm);
        })
        .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
        .slice(0, 5); // Limit the number of results to 5
      setFilteredItems(results);
    } else {
      setFilteredItems([]); // Show no items if the search term is empty
    }
  }, [searchTerm, items]);

  // Handle the search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto", mt: 5 }}>
      <h2>Search Items</h2>
      <TextField
        fullWidth
        label="Search by item name"
        variant="outlined"
        value={searchTerm}
        onChange={handleInputChange}
        margin="normal"
      />

      {/* Only show the list when there is something in the input field */}
      {searchTerm && filteredItems.length > 0 && (
        <List>
          {filteredItems.map((item) => (
            <ListItem key={item.name}>
              <ListItemText primary={item.representation} secondary={item.path} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ItemSearch;
