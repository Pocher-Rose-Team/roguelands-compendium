import { Item } from "../../shared/model/item";
import StandardTextField from "../../shared/components/standard-textfield/standard-textfield";
import "./checkout-page.css";
import RogueIcon from "../../shared/components/rogue-icon/rogue-icon";
import RogueContainer from "../../shared/components/rogue-container/rogue-container";
import React from "react";

interface CheckoutEntryProps {
  item: Item;
  amount: number;
  valueChange?: (value: number, item: string) => void;
}

export default function CheckoutEntry({ item, amount, valueChange }: CheckoutEntryProps) {
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (valueChange) {
      valueChange(+event.target.value, item.name);
    }
  };

  return (
    <RogueContainer className="checkout-entry">
      <RogueIcon itemId={item?.id ?? 0} size={50} />
      <div className="entry-details">
        <h2>{item?.representation}</h2>
        <span>
          {item?.description && item?.description.length !== 0
            ? item.description
            : "No Description"}
        </span>
      </div>
      <div className="space"></div>

      <StandardTextField type="number" value={amount} onChange={handleValueChange} />
    </RogueContainer>
  );
}
