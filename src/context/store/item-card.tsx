import React from "react";
import { IconButton } from "@mui/material";
import { Item } from "../../shared/model/item";
import ShoppingCartIcon from "../../root/shopping-cart/shopping-cart-icon";
import RogueContainer from "../../shared/components/rogue-container/rogue-container";
import RogueIcon from "../../shared/components/rogue-icon/rogue-icon";
import "./store-page.css";
import StatGroup from "../../shared/components/item-tooltip/stat-group";

interface ItemCardProps {
  item: Item;
  onAddToCart: () => void;
}

export default function ItemCard({ item, onAddToCart }: ItemCardProps) {
  return (
    <RogueContainer className="item-card">
      <div>
        <div className="item-img-container">
          <RogueIcon itemId={item.id ?? 0} size={60} />
        </div>
        <h2>{item.representation}</h2>
        {Object.values(item.stats).reduce((a, b) => a + b) > 0 && (
          <div className="stat-container">
            <span>Stats:</span>
            <StatGroup stats={item.stats} />
          </div>
        )}
        <div className="crafted-with">
          <span>Crafting:</span>
          <div style={{ display: "flex" }}>
            {item.craftedWith.map((c) => (
              <RogueIcon itemId={c.id ?? 0} />
            ))}
            {item.craftedWith.length === 0 && <span>None</span>}
          </div>
        </div>
      </div>

      <IconButton onClick={onAddToCart}>
        <ShoppingCartIcon />
      </IconButton>
    </RogueContainer>
  );
}
