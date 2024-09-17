import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Box, Button, Typography, Autocomplete, IconButton, Switch, FormControlLabel } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Item, ItemType } from '../../shared/model/item';
import ItemSlot from '../../shared/components/item-slot';

// ItemEditor Component
const ItemEditor: React.FC = () => {
  const { itemname } = useParams<{ itemname: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [craftedWith, setCraftedWith] = useState<{ amount: number, item: string }[]>([]);
  const [foundIn, setFoundIn] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<string[]>([]); // Names of all items for autocomplete
  const [showEmblemsOnly, setShowEmblemsOnly] = useState<boolean>(true); // Toggle for showing only emblems

  // Load the JSON data on component mount
  useEffect(() => {
    // Fetch the item data here
    // Assuming you have a service to get items
    fetch('/items.json')
      .then((response) => response.json())
      .then((data: Item[]) => {
        setItems(data);
        const item = data.find((i) => i.name === itemname);
        if (item) {
          setSelectedItem(item);
          setCraftedWith(item.craftedWith);
          setFoundIn(item.foundIn);
          setAllItems(data.map(i => i.name)); // Extracting all item names for the autocomplete
        }
      })
      .catch((error) => console.error('Error loading items:', error));
  }, [itemname]);

  // Handle input change for item fields
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

  // Handle craftedWith amount change
  const handleCraftedWithAmountChange = (index: number, amount: number) => {
    const updatedCraftedWith = [...craftedWith];
    updatedCraftedWith[index].amount = amount;
    setCraftedWith(updatedCraftedWith);
  };

  // Handle craftedWith item change
  const handleCraftedWithItemChange = (index: number, item: string) => {
    const updatedCraftedWith = [...craftedWith];
    updatedCraftedWith[index].item = item;
    setCraftedWith(updatedCraftedWith);
  };

  // Add new craftedWith entry
  const addCraftedWith = () => {
    setCraftedWith([...craftedWith, { amount: 1, item: '' }]);
  };

  // Remove craftedWith entry
  const removeCraftedWith = (index: number) => {
    const updatedCraftedWith = craftedWith.filter((_, i) => i !== index);
    setCraftedWith(updatedCraftedWith);
  };

  // Handle foundIn change
  const handleFoundInChange = (event: any, newValue: string[]) => {
    setFoundIn(newValue);
  };

  // Handle Save (Assume you have a save logic here)
  const handleSave = () => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem,
craftedWith, 
foundIn 
};
// Save updatedItem to your data store
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
        />
      ))}
    </Box>

    {/* Toggle to filter craftedWith options */}
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
<Box sx={{ marginBottom: 2 }}>
  <Typography variant="h6">Crafted With</Typography>
  {craftedWith.map((entry, index) => {
    const craftedItem = items.find((item) => item.name === entry.item);
    return (
      <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* ItemSlot component to show the item with its image */}
        <ItemSlot item={craftedItem} amount={entry.amount} />

        <TextField
          label="Amount"
          type="number"
          value={entry.amount}
          onChange={(e) => handleCraftedWithAmountChange(index, Number(e.target.value))}
          sx={{ width: '100px' }}
        />

        <Autocomplete
          options={items
            .filter((item) => !showEmblemsOnly || item.type === ItemType.EMBLEMS)
            .map((item) => item.name)
          }
          value={entry.item}
          onChange={(e, newValue) => handleCraftedWithItemChange(index, newValue || '')}
          renderInput={(params) => <TextField {...params} label="Item" />}
          sx={{ flexGrow: 1 }}
        />

        <IconButton onClick={() => removeCraftedWith(index)}>
          <Remove />
        </IconButton>
      </Box>
    );
  })}
  <Button onClick={addCraftedWith} variant="contained" startIcon={<Add />}>
    Add Item
  </Button>
</Box>

    {/* FoundIn */}
    <Autocomplete
      multiple
      options={allItems}
      value={foundIn}
      onChange={handleFoundInChange}
      renderInput={(params) => <TextField {...params} label="Found In" />}
    />

    {/* Description */}
    <TextField
      fullWidth
      label="Description"
      value={selectedItem.description}
      onChange={(e) => handleInputChange('description', e.target.value)}
      margin="normal"
    />

    {/* Type */}
    <TextField
      fullWidth
      label="Type"
      value={selectedItem.type}
      onChange={(e) => handleInputChange('type', e.target.value as ItemType)}
      margin="normal"
    />

    {/* Save Button */}
    <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: 2 }}>
      Save Item
    </Button>
  </Box>
) : (
  <Typography variant="h6">Item not found</Typography>
)}
</Box>
);
};

export default ItemEditor;
