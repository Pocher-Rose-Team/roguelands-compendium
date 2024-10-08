import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./layout";
import CraftingPage from "./context/crafting/crafting-page";
import MainPage from "./context/main/main-page";
import SearchPage from "./context/search/search-page";
import ItemEditor from "./context/item-editor/item-editor";
import LootTablePage from "./context/loot-table/loot-table-page";
import BiomeDetailPage from "./context/biome/biome-detail-page";
import BiomeOverviewPage from "./context/biome/biome-overview-page";
import Store from "./context/store/store-page";
import CheckoutPage from "./context/checkout/checkout-page";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="roguelands-compendium" element={<RootLayout />}>
          <Route path="" element={<MainPage />} />
          <Route path="crafting" element={<CraftingPage />} />
          <Route path="loot-tables" element={<LootTablePage />} />
          <Route path="biomes" element={<BiomeOverviewPage />} />
          <Route path="biomes/:biomekey" element={<BiomeDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="editor/:itemname" element={<ItemEditor />} />
          <Route path="editor" element={<ItemEditor />} />
          <Route path="store" element={<Store />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
