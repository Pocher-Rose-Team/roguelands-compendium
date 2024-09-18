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
    <Button
      className="standard-button"
      onClick={buttonClick}
      sx={{
        color: "#fff",
        fontSize: "1.2em",
        backgroundColor: "#525252",
        borderRadius: 0,
        border: "3px solid #373737",
        outline: "3px solid #151515",
        padding: "0px 20px",
        textShadow: "4px 4px #000",
        textTransform: "capitalize",
      }}
    >
      <span>{text ?? "Standard Button"}</span>
    </Button>
  );
}
