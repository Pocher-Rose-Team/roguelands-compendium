import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, IconButton, Switch, FormControlLabel } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { Item } from "../../shared/model/item";
import { ItemType } from "../../shared/model/item-type";
import ItemSlot from "../../shared/components/item-slot/item-slot";
import StandardTextField from "../../shared/components/standard-textfield/standard-textfield";
import StandardAutocomplete from "../../shared/components/standard-autocomplete/standard-autocomplete";
import StandardButton from "../../shared/components/standard-button/standard-button";

// ItemEditor Component
const ItemEditor: React.FC = () => {
  const { itemname } = useParams<{ itemname: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [craftedWith, setCraftedWith] = useState<{ amount: number; item: string }[]>([]);
  const [foundIn, setFoundIn] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<string[]>([]); // Names of all items for autocomplete
  const [showEmblemsOnly, setShowEmblemsOnly] = useState<boolean>(true); // Toggle for showing only emblems

  // Load the JSON data on component mount
  useEffect(() => {
    // Fetch the item data here
    // Assuming you have a service to get items
    fetch("/items.json")
      .then((response) => response.json())
      .then((data: Item[]) => {
        setItems(data);
        const item = data.find((i) => i.name === itemname);
        if (item) {
          setSelectedItem(item);
          setCraftedWith(item.craftedWith);
          setFoundIn(item.foundIn);
          setAllItems(data.map((i) => i.name)); // Extracting all item names for the autocomplete
        }
      })
      .catch((error) => console.error("Error loading items:", error));
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
    setCraftedWith([...craftedWith, { amount: 1, item: "" }]);
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
      const updatedItem = { ...selectedItem, craftedWith, foundIn };
      // Save updatedItem to your data store
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {selectedItem ? (
        <Box>
          <Typography variant="h6">Editing: {selectedItem.name}</Typography>

          {/* Stats Block */}
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            {Object.keys(selectedItem.stats).map((stat) => (
              <StandardTextField
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

            {showEmblemsOnly ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 2,
                  marginTop: 1,
                }}
              >
                {[
                  "planetemblem",
                  "herbemblem",
                  "eyeballemblem",
                  "flutterflyemblem",
                  "orichalcumemblem",
                  "shroomemblem",
                  "clawemblem",
                  "beetleemblem",
                  "galacticiteemblem",
                  "seedemblem",
                  "fragmentemblem",
                  "ghastemblem",
                  "zephyremblem",
                  "staremblem",
                  "beastemblem",
                  "thunderwormemblem",
                  "flameemblem",
                  "aetheremblem",
                  "shinyemblem",
                  "glowflyemblem",
                  "existenceemblem",
                  "chaosemblem",
                  "ectoplasmemblem",
                  "plasmaemblem",
                ].map((emblemName) => {
                  const emblemItem = items.find((item) => item.name === emblemName);
                  return (
                    <ItemSlot
                      key={emblemName}
                      item={emblemItem || undefined}
                      amount={craftedWith.find((entry) => entry.item === emblemName)?.amount}
                    />
                  );
                })}
              </Box>
            ) : (
              craftedWith.map((entry, index) => {
                const craftedItem = items.find((item) => item.name === entry.item);
                return (
                  <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <ItemSlot item={craftedItem} amount={entry.amount} />

                    <StandardTextField
                      label="Amount"
                      type="number"
                      value={entry.amount}
                      onChange={(e) => handleCraftedWithAmountChange(index, Number(e.target.value))}
                      sx={{ width: "100px" }}
                    />

                    <StandardAutocomplete
                      options={items
                        .filter((item) => !showEmblemsOnly || item.type === ItemType.EMBLEMS)
                        .map((item) => item.name)}
                      value={entry.item}
                      onChange={(e, newValue) =>
                        handleCraftedWithItemChange(index, newValue?.toString() || "")
                      }
                      label="Item"
                      sx={{ flexGrow: 1 }}
                    />

                    <IconButton onClick={() => removeCraftedWith(index)}>
                      <Remove />
                    </IconButton>
                  </Box>
                );
              })
            )}

            {!showEmblemsOnly && (
              <StandardButton onClick={addCraftedWith} text="Add Item" startIcon={<Add />} />
            )}
          </Box>

          {/* FoundIn */}
          <StandardAutocomplete
            multiple
            options={allItems}
            value={foundIn}
            onChange={handleFoundInChange}
            label="Found In"
          />

          {/* Description */}
          <StandardTextField
            fullWidth
            label="Description"
            value={selectedItem.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            margin="normal"
          />

          {/* Type */}
          <StandardTextField
            fullWidth
            label="Type"
            value={selectedItem.type}
            onChange={(e) => handleInputChange("type", e.target.value as ItemType)}
            margin="normal"
          />

          {/* Save Button */}
          <StandardButton onClick={handleSave} sx={{ marginTop: 2 }} text="Save Item" />
        </Box>
      ) : (
        <Typography variant="h6">Item not found</Typography>
      )}
    </Box>
  );
};

export default ItemEditor;
