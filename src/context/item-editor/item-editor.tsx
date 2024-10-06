import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Item, ItemType } from "../../shared/model/item";
import ItemSlot, { ItemSlotType } from "../../shared/components/item-slot/item-slot";
import StandardTextField from "../../shared/components/standard-textfield/standard-textfield";
import StandardAutocomplete from "../../shared/components/standard-autocomplete/standard-autocomplete";
import StandardButton from "../../shared/components/standard-button/standard-button";
import { Add, Remove } from "@mui/icons-material";
import { ItemService } from "../../shared/service/item-service";

// ItemEditor Component
const ItemEditor: React.FC = () => {
  const itemService = new ItemService();
  const statBlock = ["vit", "dex", "mag", "str", "tec", "fth"]; // Needed for order

  const navigate = useNavigate();
  const { itemname } = useParams<{ itemname: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [craftedWith, setCraftedWith] = useState<{ amount: number; item: string }[]>([]);
  const [foundIn, setFoundIn] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<string[]>([]); // Names of all items for autocomplete
  const worlds = [
    // TODO: @Jan Enum?
    "AncientRuins",
    "Byfrost",
    "Cathedral",
    "DeepJungle",
    "DemonsRift",
    "DesolateCanyon",
    "ForbiddenArena",
    "HollowCaverns",
    "MechCity",
    "MoltenCrag",
    "OldEarth",
    "Plaguelands",
    "Shroomtown",
    "Whisperwood",
  ];

  const [craftMode, setCraftMode] = useState<"emblem" | "free" | "prism">("prism"); // New mode state
  const [prismSlots, setPrismSlots] = useState<string[]>([]); // For prism selection
  const [additionalItem, setAdditionalItem] = useState<string>(""); // Exactly one additional item for Prism mode

  const currentQueue: string =
    "elitehelm,elitearmor,voyagerhelm,voyagerarmor,siegehelm,siegearmor,krabshellhelm,krabshellarmor,duneclothhelm,duneclotharmor,drifterhelmet,drifterarmor,leviathanhelm,leviathaarmor,krakenhelm,krakenarmor,chaoshelmet,chaosarmor,ultimahelm,ultimaarmor,destructionhelm,destructivearmor,ithacashelm,ithacasarmor,championhelm,championarmor,heroichelm,heroicarmor,deathgodhelm,deathgodarmor,shatterspellhelm,shatterspellarmor,towermagehelm,towermagearmor,deushelm,deusarmor,plasmahelm,plasmaarmor,rapturehelm,rupturearmor,firegodhelm,firegodarmor,bruiserhelm,bruiserarmor,infernohelm,infernoarmor,ironforgehelm,ironforgearmor,yojimbohelm,yojimboarmor,onihelm,oniarmor,akuhelm,akuarmor,reconhelm,reconarmor,forcehelm,forcearmor,helloworldhelm,helloworldarmor,darknighthelm,darknightarmor,onslaughthelm,onslaughtarmor,whitewhorlhelm,whitewhorlarmor,maelstormhelm,maelstormarmor,ruinhelm,ruinarmor,pyroclasmhelm,pyroclasmarmor";

  // Load the JSON data on component mount
  useEffect(() => {
    itemService.getAllItems().subscribe((data: Item[]) => setData(data));
  }, [itemname]);

  const setData = (data: Item[]) => {
    setItems(data);
    const item = data.find((i) => i.name === itemname);
    if (item) {
      setSelectedItem(item);
      setCraftedWith(item.craftedWith);
      setFoundIn(item.foundIn);
      setAllItems(data.map((i) => i.name)); // Extracting all item names for the autocomplete
    }
    const currentAdditionalItem = localStorage.getItem("currentAdditionalItem");
    if (currentAdditionalItem) {
      setAdditionalItem(currentAdditionalItem);
    }
  };

  // Handle input change for item fields
  const handleInputChange = (field: string, value: any) => {
    if (selectedItem) {
      setSelectedItem({ ...selectedItem, [field]: value });
    }
  };

  // Handle stats input changes
  const handleStatsChange = (stat: string, value: number) => {
    if (selectedItem) {
      const stats = selectedItem.stats;
      (stats as any)[stat] = value;
      setSelectedItem({ ...selectedItem, stats });
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
    setCraftedWith([...craftedWith, { amount: 1, item: "," }]);
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

  // Handle Save
  const handleSave = () => {
    if (selectedItem) {
      const updatedItem = selectedItem;
      updatedItem.craftedWith = craftedWith;
      if (craftMode === "prism") {
        updatedItem.craftedWith.push({ amount: 1, item: additionalItem });
        localStorage.setItem("currentAdditionalItem", additionalItem);
      }
      updatedItem.foundIn = foundIn;
      // TODO: @Jan das hier finde ich nicht so geil. Hier setzen wir global die Items, die von dem Service gecalled werden.
      localStorage.setItem("items", JSON.stringify(items));
      let foundItem: string = "";
      currentQueue.split(",").forEach((queueItem) => {
        items
          .filter((item) => item.name === queueItem)
          .forEach((x) => {
            if (foundItem === "" && x.craftedWith.length === 0) {
              foundItem = x.name;
            }
          });
      });
      if (foundItem !== "") {
        navigate("/roguelands-compendium/editor/" + foundItem);
      } else {
        navigate("/roguelands-compendium/search");
      }
    }
  };

  const handleClick = (itemName: string) => {
    // TODO This might still be buggy. If i log craftedWith at the end of this function it still displays the old value. Saving works without a hitch though
    // Check if the emblem is already in the craftedWith array
    const existingEntry = craftedWith.find((entry) => entry.item === itemName);

    if (existingEntry) {
      // If the emblem already exists, remove it
      const newCraftedWith = craftedWith.filter((x) => x.item !== itemName);
      setCraftedWith(newCraftedWith);
    } else {
      // If the emblem doesn't exist, add it with an amount of 1
      const newCraftedWith = craftedWith;
      newCraftedWith.push({ amount: 1, item: itemName });
      setCraftedWith(newCraftedWith);
    }
  };
  const handleAdditionalItemChange = (newItem: string) => {
    setAdditionalItem(newItem); // Only one additional item allowed
  };

  function handleStatKeyUp(stat: string, e: React.KeyboardEvent<HTMLInputElement>): void {
    const nextStat = statBlock.at(statBlock.indexOf(stat) + 1);
    if (nextStat) {
      const input = document.querySelector<HTMLInputElement>("#stat-input-" + nextStat);
      if (input) {
        input.focus();
        input.select();
      }
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      {selectedItem ? (
        <Box>
          <Typography variant="h6">Editing: {selectedItem.representation}</Typography>

          {/* Stats Block */}
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            {statBlock.map((stat) => (
              <StandardTextField
                key={stat}
                label={stat.toUpperCase()}
                value={(selectedItem.stats as any)[stat]}
                onChange={(e) => handleStatsChange(stat, Number(e.target.value))}
                onKeyUp={(e) => handleStatKeyUp(stat, e)}
                type="number"
              />
            ))}
          </Box>

          {/* Crafting Mode Selection */}
          <Box sx={{ marginBottom: 2, display: "flex", gap: 2 }}>
            <Button
              variant={craftMode === "emblem" ? "contained" : "outlined"}
              onClick={() => setCraftMode("emblem")}
            >
              Emblem
            </Button>
            <Button
              variant={craftMode === "free" ? "contained" : "outlined"}
              onClick={() => setCraftMode("free")}
            >
              Free Crafting
            </Button>
            <Button
              variant={craftMode === "prism" ? "contained" : "outlined"}
              onClick={() => setCraftMode("prism")}
            >
              Prisms
            </Button>
          </Box>

          {/* Crafted With */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Crafted With</Typography>

            {craftMode === "emblem" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 2,
                  marginTop: 1,
                }}
              >
                {[
                  // TODO: @Jan kann man mit dem Service machen und sich sparen
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
                      type={ItemSlotType.CRAFTING}
                      item={emblemItem || undefined}
                      amount={craftedWith.find((entry) => entry.item === emblemName)?.amount}
                      onClick={() => handleClick(emblemName)}
                      isSelected={
                        craftedWith.find((entry) => entry.item === emblemName) !== undefined
                      }
                    />
                  );
                })}
              </Box>
            )}

            {craftMode === "prism" && (
              <Box>
                {/* Prism Selection */}
                <Typography variant="subtitle1">Select Prism (One):</Typography>
                <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
                  {["aetheliteprism", "darkenedprism", "omegaprism"].map((prismName) => (
                    <ItemSlot
                      key={prismName}
                      type={ItemSlotType.CRAFTING}
                      item={items.find((item) => item.name === prismName)}
                      isSelected={prismSlots.includes(prismName)}
                      onClick={() => handleClick(prismName)}
                    />
                  ))}
                </Box>

                {/* Additional Item */}
                <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                  Select an Additional Item (One):
                </Typography>
                <StandardAutocomplete
                  options={items.map((item) => item.name)}
                  value={additionalItem}
                  onChange={(e, newValue) => handleAdditionalItemChange(newValue)}
                  label="Additional Item"
                  sx={{ marginTop: 1 }}
                />
              </Box>
            )}

            {craftMode === "free" &&
              craftedWith.map((entry, index) => {
                const craftedItem = items.find((item) => item.name === entry.item);
                return (
                  <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <ItemSlot
                      type={ItemSlotType.CRAFTING}
                      item={craftedItem}
                      amount={entry.amount}
                    />

                    <StandardTextField
                      label="Amount"
                      type="number"
                      value={entry.amount}
                      onChange={(e) => handleCraftedWithAmountChange(index, Number(e.target.value))}
                      sx={{ width: "100px" }}
                    />

                    <StandardAutocomplete
                      options={items.map((item) => item.name)}
                      value={entry.item}
                      onChange={(e, newValue) =>
                        handleCraftedWithItemChange(index, newValue?.toString() || ",")
                      }
                      label="Item"
                      sx={{ flexGrow: 1 }}
                    />

                    <Button onClick={() => removeCraftedWith(index)}>
                      <Remove />
                    </Button>
                  </Box>
                );
              })}

            {craftMode === "free" && (
              <StandardButton onClick={addCraftedWith} text="Add Item" startIcon={<Add />} />
            )}
          </Box>

          {/* FoundIn */}
          <StandardAutocomplete
            multiple
            options={worlds}
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
