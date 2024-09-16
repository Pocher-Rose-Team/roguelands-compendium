import RogueButton from "../components/rogue-button";
import "./compendium-menu.css";
import { Link } from "react-router-dom";

export default function CompendiumMenu() {
  return (
    <div className="compendium-menu">
      <Link to="/">
        <img className="logo" src="/logo192.png" alt="logo" />
      </Link>
      <div className="menu-wrapper">
        <RogueButton text="Crafting" route={"/crafting"} />
        <RogueButton text="Search" route={"/search"} />
        <RogueButton text="Other" />
      </div>
    </div>
  );
}
