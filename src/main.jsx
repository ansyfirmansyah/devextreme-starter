import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

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

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { setupDevExtremeAuthInterceptor } from "./services/devextremeAuthInterceptor.js";

setupDevExtremeAuthInterceptor();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
