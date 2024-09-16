import { Outlet } from "react-router-dom";
import CompendiumMenu from "./root/compendium-menu";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: '"Outfit", sans-serif',
  },
});

export default function RootLayout() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CompendiumMenu />
        <Outlet />
      </ThemeProvider>
    </div>
  );
}
