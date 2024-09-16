import { Outlet } from "react-router-dom";
import CompendiumMenu from "./root/compendium-menu";

export default function RootLayout() {
  return (
    <div>
      <CompendiumMenu />
      <Outlet />
    </div>
  );
}
