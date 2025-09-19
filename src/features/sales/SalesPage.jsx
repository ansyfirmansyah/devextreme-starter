import React from "react";
import { Route, Routes } from "react-router-dom";

import SalesGrid from "./components/SalesGrid";
import SalesForm from "./components/SalesForm";
import SalesUploadPage from "./components/SalesUploadPage";

/**
 * Komponen ini sekarang bertindak sebagai "Router" untuk fitur Sales.
 * Ia tidak lagi mengelola state 'viewMode' atau 'activeFormData'.
 * Tugasnya hanya mendefinisikan rute mana yang akan me-render Grid dan rute mana yang akan me-render Form.
 */
const SalesPage = () => {
  return (
    <Routes>
      <Route index element={<SalesGrid />} />
      <Route path="new" element={<SalesForm />} />
      <Route path="upload" element={<SalesUploadPage />} />
      <Route path=":id" element={<SalesForm />} />
      <Route path=":id/edit" element={<SalesForm />} />
    </Routes>
  );
};

export default SalesPage;
