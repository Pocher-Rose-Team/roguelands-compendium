import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Typography, Autocomplete, List, ListItem } from '@mui/material';

// Define the Item interface based on the structure of the JSON data
export interface Item {
  name: string;
  representation: string;
  path: string;
  stats: {
    str: number;
    dex: number;
    vit: number;
    tec: number;
    fth: number;
    mag: number;
  };
  craftedWith?: string[];
  description: string[];
  foundIn?: string[];
  type: string;
}

const ItemEditor: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [craftedWith, setCraftedWith] = useState<string[]>([]);
  const [foundIn, setFoundIn] = useState<string[]>([]);

  // Load the JSON data on component mount
  useEffect(() => {
    fetch('/items.json')
      .then((response) => response.json())
      .then((data: Item[]) => setItems(data))
      .catch((error) => console.error('Error loading items:', error));
  }, []);

  // Handle selecting an item for editing
  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setCraftedWith(item.craftedWith || []);
    setFoundIn(item.foundIn || []);
  };

  // Handle saving the modified item back to the list
  const handleSaveItem = () => {
    if (!selectedItem) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === selectedItem.name ? { ...selectedItem, craftedWith, foundIn } : item
      )
    );

    setSelectedItem(null);
    setCraftedWith([]);
    setFoundIn([]);
  };

  // Handle input changes for selected item's fields
  const handleInputChange = (field: string, value: any) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        [field]: value,
      });
    }
  };

  // Handle stats input changes
  const handleStatsChange = (stat: string, value: number) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        stats: {
          ...selectedItem.stats,
          [stat]: value,
        },
      });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Item Editor</Typography>

      {/* List of items to edit */}
      <List>
        {items.map((item) => (
          <ListItem key={item.name} onClick={() => handleItemClick(item)}>
            {item.name}
          </ListItem>
        ))}
      </List>

      {/* Item Edit Form */}
      {selectedItem && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">Editing: {selectedItem.name}</Typography>

          {/* Stats Block */}
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            {Object.keys(selectedItem.stats).map((stat) => (
              <TextField
                key={stat}
                label={stat.toUpperCase()}
                value={(selectedItem.stats as any)[stat]}
                onChange={(e) => handleStatsChange(stat, Number(e.target.value))}
                type="number"
                inputProps={{ tabIndex: 0 }} // Allows tabbing through inputs
              />
            ))}
          </Box>

          {/* CraftedWith */}
          <Autocomplete
            multiple
            options={items.map((item) => item.name)}
            value={craftedWith}
            onChange={(event, newValue) => setCraftedWith(newValue)}
            renderInput={(params) => <TextField {...params} label="Crafted With" />}
          />

          {/* FoundIn */}
          <Autocomplete
            multiple
            options={items.map((item) => item.name)}
            value={foundIn}
            onChange={(event, newValue) => setFoundIn(newValue)}
            renderInput={(params) => <TextField {...params} label="Found In" />}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            value={selectedItem.description.join(', ')}
            onChange={(e) => handleInputChange('description', e.target.value.split(', '))}
            margin="normal"
          />

          {/* Type */}
          <TextField
            fullWidth
            label="Type"
            value={selectedItem.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            margin="normal"
          />

          {/* Save Button */}
          <Button variant="contained" color="primary" onClick={handleSaveItem} sx={{ marginTop: 2 }}>
            Save Item
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ItemEditor;
