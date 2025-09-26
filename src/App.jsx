/**
 * File ini sekarang berfungsi sebagai pusat routing aplikasi.
 */
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout utama yang akan membungkus semua halaman
import MainLayout from "./components/ui/MainLayout";
// Impor konfigurasi navigasi

// Impor halaman default
import { navigationRoutes } from "./config/navigationConfig";
import { NotFound, Privacy, Terms } from "./features/SamplePages";
import HomePage from "./features/dashboard/HomePage";
import LoginPage from "./features/auth/LoginPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";

const App = () => {
  // Helper rekursif yang lebih sederhana untuk me-render rute
  const renderRoutes = (routes) => {
    return routes.flatMap((route) => {
      // Buat rute jika ada komponen
      const currentRoute = route.component ? (
        <Route
          key={route.id}
          // Path sekarang selalu diambil langsung dari config, tanpa wildcard
          path={`${route.path}/*`} // Tambahkan '/*' agar nested routes di dalam komponen bisa berfungsi
          element={<route.component />}
        />
      ) : null;

      // Proses sub-menu jika ada
      const childRoutes = route.items ? renderRoutes(route.items) : [];

      return [currentRoute, ...childRoutes].filter(Boolean);
    });
  };

  return (
    <Routes>
      {/* Rute untuk halaman login, di luar layout utama */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute-rute yang menggunakan MainLayout */}
      {/* Bungkus semua rute yang butuh login dengan ProtectedRoute */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Rute default */}
        <Route index element={<HomePage />} />
        {/* Render semua rute dari config */}
        {renderRoutes(navigationRoutes)}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* Fallback route untuk halaman yang tidak ditemukan */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
