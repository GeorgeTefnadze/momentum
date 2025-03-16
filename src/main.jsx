import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import RouterManager from "./RouterManager.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterManager />
  </StrictMode>
);
