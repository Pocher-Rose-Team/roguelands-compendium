import { Autocomplete, AutocompleteChangeDetails, SxProps, TextField, Theme } from "@mui/material";
import React from "react";
import "./standard-autocomplete.css";

interface StandardAutocompleteAttributes {
  fullWidth?: boolean;
  multiple?: boolean;
  label?: string;
  value?: any;
  options: any[];
  onChange?: (
    event: React.SyntheticEvent,
    value: any,
    reason: string,
    details?: AutocompleteChangeDetails<any>,
  ) => void;
  sx?: SxProps<Theme>;
}

export default function StandardAutocomplete({
  fullWidth,
  multiple,
  label,
  value,
  options,
  onChange,
  sx,
}: StandardAutocompleteAttributes) {
  return (
    <Autocomplete
      fullWidth={fullWidth}
      multiple={multiple}
      className="standard-autocomplete"
      options={options}
      value={value}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={onChange}
      sx={sx}
    />
  );
}
