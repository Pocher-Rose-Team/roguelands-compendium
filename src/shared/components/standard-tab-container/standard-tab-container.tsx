import { SxProps, Tabs, Theme } from "@mui/material";
import React, { ReactNode } from "react";
import "./standard-tab-container.css";

interface StandardTabContainerAttributes {
  value?: string | number;
  onChange?: (event: any, value: any) => void;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export default function StandardTabContainer({
  value,
  onChange,
  sx,
  children,
}: StandardTabContainerAttributes) {
  return (
    <Tabs className="standard-tab-container" value={value} onChange={onChange} sx={sx}>
      {children}
    </Tabs>
  );
}
