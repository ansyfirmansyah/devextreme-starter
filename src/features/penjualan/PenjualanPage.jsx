import React from "react";
import { Route, Routes } from "react-router-dom";

import PenjualanForm from "./components/PenjualanForm";
import PenjualanGrid from "./components/PenjualanGrid";

/**
 * Komponen ini sekarang bertindak sebagai "Router" untuk fitur Penjualan.
 * Ia tidak lagi mengelola state 'viewMode' atau 'activeFormData'.
 * Tugasnya hanya mendefinisikan rute mana yang akan me-render Grid dan rute mana yang akan me-render Form.
 */
const PenjualanPage = () => {
  return (
    <Routes>
      <Route index element={<PenjualanGrid />} />
      <Route path="new" element={<PenjualanForm />} />
      <Route path=":id" element={<PenjualanForm />} />
      <Route path=":id/edit" element={<PenjualanForm />} />
    </Routes>
  );
};

export default PenjualanPage;
