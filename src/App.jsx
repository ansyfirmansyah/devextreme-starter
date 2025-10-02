/**
 * App.jsx
 * -------
 * Pusat routing aplikasi React.
 *
 * - Mengatur semua rute aplikasi, termasuk login, register, dan halaman-halaman utama.
 * - Menggunakan MainLayout sebagai layout utama untuk halaman yang membutuhkan autentikasi.
 * - Rute diambil dari konfigurasi navigationRoutes dan dirender secara rekursif.
 * - Mendukung proteksi rute (ProtectedRoute) dan pengecekan permission (PermissionRoute).
 * - Menyediakan fallback untuk halaman tidak ditemukan dan akses ditolak.
 *
 * Dependencies:
 * - React Router (Routes, Route)
 * - MainLayout, ProtectedRoute, PermissionRoute
 * - navigationRoutes (config navigasi)
 * - Berbagai halaman fitur
 */

import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout utama yang akan membungkus semua halaman
import MainLayout from "./components/ui/MainLayout";
// Impor konfigurasi navigasi
import { navigationRoutes } from "./config/navigationConfig";

// Impor halaman default
import { Privacy, Terms } from "./features/SamplePages";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import ChangePasswordPage from "./features/account/ChangePasswordPage";
import UserProfilePage from "./features/account/UserProfilePage";
import LandingPage from "./features/dashboard/LandingPage";
import PermissionRoute from "./components/ui/PermissionRoute";
import UnauthorizedPage from "./components/ui/UnauthorizedPage";
import NotFoundPage from "./components/ui/NotFoundPage";

const App = () => {
  // Helper rekursif untuk me-render rute dari konfigurasi
  const renderRoutes = (routes) => {
    return routes.flatMap((route) => {
      // Buat rute jika ada komponen
      const currentRoute = route.component ? (
        <Route
          key={route.id}
          // Path diambil dari config, tambahkan '/*' agar nested routes berfungsi
          path={`${route.path}/*`}
          element={
            // Gunakan PermissionRoute untuk pengecekan hak akses
            <PermissionRoute
              permissionCode={route.permissionCode}
              element={<route.component />}
            />
          }
        />
      ) : null;

      // Proses sub-menu jika ada
      const childRoutes = route.items ? renderRoutes(route.items) : [];

      // Gabungkan rute saat ini dan child routes
      return [currentRoute, ...childRoutes].filter(Boolean);
    });
  };

  return (
    <Routes>
      {/* Rute untuk halaman login dan registrasi, di luar layout utama */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
        {/* Rute default (landing) */}
        <Route index element={<LandingPage />} />
        {/* Render semua rute dari config */}
        {renderRoutes(navigationRoutes)}
        {/* Rute tambahan */}
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* Halaman khusus untuk akses ditolak */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* Fallback route untuk halaman yang tidak ditemukan */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
