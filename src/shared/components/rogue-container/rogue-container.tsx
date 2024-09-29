import "./rogue-container.css";
import { ReactNode } from "react";

interface RogueContainerAttributes {
  children?: ReactNode;
  className?: string;
}

export default function RogueContainer({ children, className }: RogueContainerAttributes) {
  return <div className={`rogue-container ${className}`}>{children}</div>;
}
