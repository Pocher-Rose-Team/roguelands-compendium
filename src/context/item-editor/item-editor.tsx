import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Box, Button, Typography, Autocomplete, FormControlLabel, Switch } from '@mui/material';
import { ItemType } from '../../shared/model/item-type';
import { Item } from '../../shared/model/item';

const ItemEditor: React.FC = () => {
  const { itemname } = useParams<{ itemname: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [craftedWith, setCraftedWith] = useState<{item: string, amount: number}[]>([]);
  const [foundIn, setFoundIn] = useState<string[]>([]);
  const [showEmblemsOnly, setShowEmblemsOnly] = useState<boolean>(true);

  // Load the JSON data on component mount
  useEffect(() => {
    fetch('/items.json')
      .then((response) => response.json())
      .then((data: Item[]) => {
        setItems(data);
        
        const item = data.find((i) => i.name === itemname);
        if (item) {
          setSelectedItem(item);
          setCraftedWith(item.craftedWith || []);
          setFoundIn(item.foundIn || []);
        }
      })
      .catch((error) => console.error('Error loading items:', error));
  }, [itemname]);

  // Handle saving the modified item back to the list
  const handleSaveItem = () => {
    if (!selectedItem) return;

    const updatedItems = items.map((item) =>
      item.name === selectedItem.name ? { ...selectedItem, craftedWith, foundIn } : item
    );

    setItems(updatedItems);

    // Trigger download of updated JSON file
    const jsonBlob = new Blob([JSON.stringify(updatedItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated_items.json';
    link.click();
    URL.revokeObjectURL(url);
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
      {selectedItem ? (
        <Box>
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

          {/* Toggle to show only emblems */}
<Box sx={{ marginBottom: 2 }}>
  <FormControlLabel
    control={
      <Switch
        checked={showEmblemsOnly}
        onChange={() => setShowEmblemsOnly(!showEmblemsOnly)}
        color="primary"
      />
    }
    label="Show only Emblems"
  />
</Box>

{/* CraftedWith */}
<Autocomplete
  multiple
  options={items
    .filter((item) => !showEmblemsOnly || item.type === ItemType.EMBLEMS) // Filter based on toggle
    .map((item) => item.name)
  }
  value={craftedWith.map(item => item.item)}
  onChange={(event, newValue) => setCraftedWith(newValue.map(value => {return {item: value, amount: 1}}))}
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
            value={selectedItem.description}
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
            Save & Download JSON
          </Button>
        </Box>
      ) : (
        <Typography variant="h6">Item not found</Typography>
      )}
    </Box>
  );
};

export default ItemEditor;
