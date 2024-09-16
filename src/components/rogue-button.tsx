import { Button } from "@mui/material";
import "./rogue-button.css";
import { useNavigate } from "react-router-dom";

interface RogueButtonAttributes {
  text?: string;
  route?: string;
  onClick?: () => {};
}

export default function RogueButton({ text, route, onClick }: RogueButtonAttributes) {
  const navigate = useNavigate();
  const buttonClick = () => {
    if (onClick) {
      onClick();
    }
    if (route) {
      navigate(route);
    }
  };

  return (
    <Button
      className="rogue-button"
      style={{ fontWeight: "bold" }}
      color="secondary"
      onClick={buttonClick}
    >
      {text ?? "Rogue Button"}
    </Button>
  );
}
