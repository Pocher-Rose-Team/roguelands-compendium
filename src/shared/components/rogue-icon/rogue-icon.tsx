import { Item } from "../../model/item";
import { CSSProperties, useEffect, useState } from "react";
import { ItemService } from "../../service/item-service";
import { map } from "rxjs";
import StandardImage from "../standard-image/standard-image";

interface RogueItemAttributes {
  itemId: ItemId;
  size?: number;
  style?: CSSProperties;
}

export enum ItemId {
  CREDIT = 52,
  SCRAP_METAL = 57,
}

export default function RogueIcon({ itemId, size, style }: RogueItemAttributes) {
  const itemService = new ItemService();
  const [item, setItem] = useState<Item>();
  const _size = size ?? 24;

  useEffect(() => {
    itemService
      .getAllItemsAsMapById()
      .pipe(map((idsMap) => idsMap.get(itemId)))
      .subscribe({ next: (item) => setItem(item as Item) });
  }, []);

  return (
    <div style={{ position: "relative", width: _size, height: _size, ...style }}>
      {item && (
        <StandardImage
          className="disable-select"
          src={item.path}
          alt={item.name}
          style={{
            pointerEvents: "none",
            width: _size * 2.5,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
}
