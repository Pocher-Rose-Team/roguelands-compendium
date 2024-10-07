import { useNavigate } from "react-router-dom";
import { Button, SxProps, Theme } from "@mui/material";
import "./standard-button.css";

interface StandardButtonAttributes {
  text?: string;
  startIcon?: React.ReactNode;
  route?: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export default function StandardButton({
  text,
  startIcon,
  route,
  onClick,
  sx,
}: StandardButtonAttributes) {
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
      startIcon={startIcon}
      onClick={buttonClick}
      sx={{
        color: "#fff",
        fontSize: "1.2em",
        backgroundColor: "#525252",
        borderRadius: 0,
        border: "3px solid #373737",
        outline: "3px solid #151515",
        padding: "0px 20px",
        textShadow: "3px 3px #000",
        textTransform: "capitalize",
        ...sx,
      }}
    >
      <span>{text ?? "Standard Button"}</span>
    </Button>
  );
}
