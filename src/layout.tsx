import { Outlet } from "react-router-dom";
import CompendiumMenu from "./root/compendium-menu";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: '"Motion Control", sans-serif',
  },
});

export default function RootLayout() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CompendiumMenu />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </ThemeProvider>
    </div>
  );
}
