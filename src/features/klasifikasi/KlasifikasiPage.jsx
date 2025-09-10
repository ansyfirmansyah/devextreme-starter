import React from "react";
// 1. Impor Routes dan Route
import { Routes, Route } from "react-router-dom";

// 2. Impor komponen Grid dan Form (path diperbaiki)
import KlasifikasiGrid from "./components/KlasifikasiGrid.jsx";
import KlasifikasiForm from "./components/KlasifikasiForm.jsx";

/**
 * Komponen ini sekarang bertindak sebagai "Router" untuk fitur Klasifikasi.
 * Ia tidak lagi mengelola state 'viewMode' atau 'activeFormData'.
 * Tugasnya hanya mendefinisikan rute mana yang akan me-render Grid dan rute mana yang akan me-render Form.
 */
const KlasifikasiPage = () => {
  return (
    // 3. Gunakan <Routes> untuk mendefinisikan rute-rute di dalam fitur ini
    <Routes>
      {/* Rute 'index' (path: /klasifikasi) akan me-render komponen Grid. 
        Komponen ini sekarang bertanggung jawab penuh atas tampilan daftar data.
      */}
      <Route index element={<KlasifikasiGrid />} />

      {/* Rute '/new' (path: /klasifikasi/new) akan me-render Form.
        Form akan tahu ini adalah mode 'create' dari URL-nya.
      */}
      <Route path="new" element={<KlasifikasiForm />} />

      {/* Rute '/:id' (path: /klasifikasi/123) juga me-render Form.
        Form akan tahu ini mode 'view' dan akan mengambil data berdasarkan 'id'.
      */}
      <Route path=":id" element={<KlasifikasiForm />} />

      {/* Rute '/:id/edit' (path: /klasifikasi/123/edit) juga me-render Form.
        Form akan tahu ini mode 'edit' dan akan mengambil data berdasarkan 'id'.
      */}
      <Route path=":id/edit" element={<KlasifikasiForm />} />
    </Routes>
  );
};

export default KlasifikasiPage;