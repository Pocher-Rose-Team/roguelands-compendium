import RogueButton from "../../shared/components/rogue-button/rogue-button";
import "./compendium-menu.css";
import { Link } from "react-router-dom";
import ShoppingCartButton from "../shopping-cart/shopping-cart-button";

export default function CompendiumMenu() {
  return (
    <div className="compendium-menu">
      <Link to="/">
        <img className="logo" src="/logo192.png" alt="logo" />
      </Link>
      <div className="menu-wrapper">
        <RogueButton text="Store" route={"/store"} />
        <RogueButton text="Crafting" route={"/crafting"} />
        <RogueButton text="Loot tables" route={"/loot-tables"} />
        <RogueButton text="Biomes" route={"/biomes"} />
        {/*<RogueButton text="Search" route={"/search"} />*/}
        {/*<RogueButton text="Editor" route={"/editor"} />*/}
      </div>
      <ShoppingCartButton />
    </div>
  );
}
