import { TextField } from "@mui/material";
import "./standard-textfield.css";
import React from "react";

interface StandardTextFieldAttributes {
  fullWidth?: boolean;
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StandardTextField({
  fullWidth,
  label,
  value,
  onChange,
}: StandardTextFieldAttributes) {
  return (
    <TextField
      fullWidth={fullWidth}
      className="standard-textfield"
      label={label}
      value={value}
      onChange={onChange}
    />
  );
}
