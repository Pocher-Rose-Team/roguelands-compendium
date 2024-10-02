import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import ShoppingCartButton from "./root/shopping-cart/shopping-card-button";
import CompendiumMenu from "./root/menu/compendium-menu";

const theme = createTheme({
  typography: {
    fontFamily: '"Motion Control", sans-serif',
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <div className="root-layout">
        <CompendiumMenu />
        <ShoppingCartButton />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}
