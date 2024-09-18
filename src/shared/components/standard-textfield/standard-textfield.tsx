import { SxProps, TextField, Theme } from "@mui/material";
import "./standard-textfield.css";
import React from "react";

interface StandardTextFieldAttributes {
  fullWidth?: boolean;
  label?: string;
  value?: string | number;
  type?: React.HTMLInputTypeAttribute;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  margin?: "dense" | "normal" | "none";
  sx?: SxProps<Theme>;
}

export default function StandardTextField({
  fullWidth,
  label,
  value,
  type,
  onChange,
  margin,
  sx,
}: StandardTextFieldAttributes) {
  return (
    <TextField
      fullWidth={fullWidth}
      className="standard-textfield"
      label={label}
      value={value}
      type={type}
      onChange={onChange}
      margin={margin}
      sx={sx}
    />
  );
}
