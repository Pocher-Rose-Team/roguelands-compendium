import "./main-page.css";
import RogueButton from "../../shared/components/rogue-button/rogue-button";

export default function MainPage() {
  return (
    <div className="main-page-container">
      <div className="logo-container">
        <img src="/img/ui/roguelandsTitle.png" alt="roguelands-title" />
        <img src="/img/ui/kompendiumTitle.png" alt="kompendium-title" />
      </div>
      <div className="button-container">
        <div className="button-group">
          <RogueButton text="Store" route={"/store"} />
        </div>
        <div className="button-group">
          <RogueButton text="Crafting" route={"/crafting"} />
          <RogueButton text="Loot tables" route={"/loot-tables"} />
        </div>
        <div className="button-group">
          <RogueButton text="Biomes" route={"/biomes"} />
        </div>
      </div>
    </div>
  );
}
