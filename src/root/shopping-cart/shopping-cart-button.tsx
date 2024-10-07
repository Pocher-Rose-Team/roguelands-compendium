import React, { useState, useEffect } from "react";
import { Badge, IconButton } from "@mui/material";
import { Item } from "../../shared/model/item";
import ShoppingCartIcon from "./shopping-cart-icon";
import { useNavigate } from "react-router-dom"; // Adjust this import based on your project structure

const ShoppingCartButton: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Item[]>([]);

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

  return (
    <div>
      <IconButton onClick={() => navigate("/roguelands-compendium/checkout")} color="primary">
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </div>
  );
};

export default ShoppingCartButton;
