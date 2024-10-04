import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Item } from "../../shared/model/item";
import ShoppingCartIcon from "../../root/shopping-cart/shopping-cart-icon";

interface ItemCardProps {
  item: Item;
  onAddToCart: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart }) => (
  <Box border={1} padding={2} margin={1} width="200px">
    <img src={item.path} alt={item.representation} width="100%" />
    <Typography variant="h6">{item.representation}</Typography>
    <Typography>
      Stats: STR {item.stats.str}, DEX {item.stats.dex}, etc.
    </Typography>
    <Typography>
      Crafted With: {item.craftedWith.map((c) => `${c.amount}x ${c.item}`).join(", ")}
    </Typography>
    <IconButton onClick={onAddToCart}>
      <ShoppingCartIcon />
    </IconButton>
  </Box>
);

export default ItemCard;
