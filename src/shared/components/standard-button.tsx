import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./standard-button.css";

interface StandardButtonAttributes {
  text?: string;
  route?: string;
  onClick?: () => void;
}

export default function StandardButton({ text, route, onClick }: StandardButtonAttributes) {
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
    <Button className="standard-button" onClick={buttonClick}>
      {text ?? "Standard Button"}
    </Button>
  );
}
