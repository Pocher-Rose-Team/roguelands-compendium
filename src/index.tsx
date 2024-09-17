import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./layout";
import CraftingPage from "./context/crafting/crafting-page";
import MainPage from "./context/main/main-page";
import SearchPage from "./context/search/search-page";
import ItemEditor from "./context/item-editor/item-editor";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="crafting" element={<CraftingPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="editor/:itemname" element={<ItemEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
