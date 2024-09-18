import { Button } from "@mui/material";
import "./rogue-button.css";
import { useNavigate } from "react-router-dom";

interface RogueButtonAttributes {
  text?: string;
  route?: string;
  onClick?: () => void;
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
      color="secondary"
      onClick={buttonClick}
      sx={{
        color: "#fff",
        textShadow: "4px 4px #000;",
      }}
    >
      <span className="button-text">{text ?? "Rogue Button"}</span>
      <span>&nbsp;</span>
    </Button>
  );
}
