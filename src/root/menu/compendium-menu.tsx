import RogueButton from "../../shared/components/rogue-button/rogue-button";
import "./compendium-menu.css";
import { Link, useLocation } from "react-router-dom";
import ShoppingCartButton from "../shopping-cart/shopping-cart-button";
import StandardImage from "../../shared/components/standard-image/standard-image";

export default function CompendiumMenu() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/roguelands-compendium" && (
        <div className="compendium-menu">
          <Link to="/roguelands-compendium">
            <StandardImage className="logo" src="/logo192.png" alt="logo" />
          </Link>

          <div className="menu-wrapper">
            <RogueButton text="Store" route={"/roguelands-compendium/store"} />
            <RogueButton text="Crafting" route={"/roguelands-compendium/crafting"} />
            <RogueButton text="Loot tables" route={"/roguelands-compendium/loot-tables"} />
            <RogueButton text="Biomes" route={"/roguelands-compendium/biomes"} />
            {/*<RogueButton text="Search" route={"/roguelands-compendium/search"} />*/}
            {/*<RogueButton text="Editor" route={"/roguelands-compendium/editor"} />*/}
          </div>

          <ShoppingCartButton />
        </div>
      )}
    </>
  );
}
