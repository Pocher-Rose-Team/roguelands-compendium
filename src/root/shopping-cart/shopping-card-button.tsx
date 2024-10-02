import React, { useState, useEffect } from "react";
import { Button, Badge, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Item } from "../../shared/model/item"; // Adjust this import based on your project structure

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
            <Button onClick={handleClickOpen} variant="contained" color="primary">
                <Badge badgeContent={cartItems.length} color="secondary">
                    <ShoppingCartIcon />
                </Badge>
                Shopping Cart
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Shopping Cart</DialogTitle>
                <DialogContent>
                    <List>
                        {cartItems.length === 0 ? (
                            <ListItem>
                                <ListItemText primary="Your cart is empty." />
                            </ListItem>
                        ) : (
                            cartItems.map((item) => (
                                <ListItem key={item.name}>
                                    <ListItemText primary={item.representation} secondary={`Path: ${item.path}`} />
                                </ListItem>
                            ))
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ShoppingCartButton;
