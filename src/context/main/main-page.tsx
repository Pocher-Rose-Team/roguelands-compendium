import "./main-page.css";
import RogueButton from "../../shared/components/rogue-button/rogue-button";
import StandardImage from "../../shared/components/standard-image/standard-image";

export default function MainPage() {
  return (
    <div className="main-page-container">
      <div className="logo-container">
        <StandardImage src="/img/ui/roguelandsTitle.png" alt="roguelands-title" />
        <StandardImage src="/img/ui/kompendiumTitle.png" alt="kompendium-title" />
      </div>
      <div className="button-container desktop">
        <div className="button-group">
          <RogueButton text="Store" route={"/roguelands-compendium/store"} />
        </div>
        <div className="button-group">
          <RogueButton text="Crafting" route={"/roguelands-compendium/crafting"} />
          <RogueButton text="Loot tables" route={"/roguelands-compendium/loot-tables"} />
        </div>
        <div className="button-group">
          <RogueButton text="Biomes" route={"/roguelands-compendium/biomes"} />
        </div>
      </div>
      <div className="button-container mobile">
        <div className="button-group">
          <RogueButton text="Store" route={"/roguelands-compendium/store"} />
        </div>
        <div className="button-group">
          <RogueButton text="Crafting" route={"/roguelands-compendium/crafting"} />
        </div>
        <div className="button-group">
          <RogueButton text="Loot tables" route={"/roguelands-compendium/loot-tables"} />
        </div>
        <div className="button-group">
          <RogueButton text="Biomes" route={"/roguelands-compendium/biomes"} />
        </div>
      </div>
    </div>
  );
}
