import React, { useState, useEffect } from "react";
import {
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Item } from "../../shared/model/item";
import ShoppingCartIcon from "./shopping-cart-icon"; // Adjust this import based on your project structure

const ShoppingCartButton: React.FC = () => {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  // Function to fetch cart items from localStorage
  const fetchCartItems = () => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setCartItems(JSON.parse(storedItems));
    } else {
      setCartItems([]);
    }
  };

  // Effect to fetch cart items on mount
  useEffect(() => {
    fetchCartItems();

    // Event listener for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      fetchCartItems(); // Update state when localStorage changes
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Toggle dialog open/close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} color="primary">
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </div>
  );
};

export default ShoppingCartButton;
