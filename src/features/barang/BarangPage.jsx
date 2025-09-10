import React from "react";
import { Route, Routes } from "react-router-dom";

import BarangGrid from "./components/BarangGrid";
import BarangForm from "./components/BarangForm";

/**
 * Komponen ini sekarang bertindak sebagai "Router" untuk fitur Barang.
 * Ia tidak lagi mengelola state 'viewMode' atau 'activeFormData'.
 * Tugasnya hanya mendefinisikan rute mana yang akan me-render Grid dan rute mana yang akan me-render Form.
 */
const BarangPage = () => {
  return (
    <Routes>
      <Route index element={<BarangGrid />} />
      <Route path="new" element={<BarangForm />} />
      <Route path=":id" element={<BarangForm />} />
      <Route path=":id/edit" element={<BarangForm />} />
    </Routes>
  );
};

export default BarangPage;
