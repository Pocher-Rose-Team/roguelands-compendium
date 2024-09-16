import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./layout";
import CraftingPage from "./context/crafting/crafting-page";
import MainPage from "./context/main/main-page";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="crafting" element={<CraftingPage />} />
          <Route path="search" element={<CraftingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
