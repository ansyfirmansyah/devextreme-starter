import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Impor tema DevExtreme dan CSS khusus
import "devextreme/dist/css/dx.light.css";
// CSS untuk Analytics Core (wajib)
import "@devexpress/analytics-core/dist/css/dx-analytics.common.css";
import "@devexpress/analytics-core/dist/css/dx-analytics.light.css";
// CSS spesifik untuk Web Document Viewer (wajib)
import "devexpress-reporting/dist/css/dx-webdocumentviewer.css";
// CSS custom
import "./App.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
