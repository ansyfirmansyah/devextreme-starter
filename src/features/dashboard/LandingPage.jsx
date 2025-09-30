/**
 * LandingPage.jsx
 * ----------------
 * Komponen ini bertanggung jawab untuk mengarahkan pengguna ke halaman pertama yang dapat diakses
 * berdasarkan permission yang dimiliki setelah proses autentikasi selesai.
 * 
 * - Jika autentikasi masih berlangsung atau data user belum tersedia, akan menampilkan spinner loading.
 * - Jika user memiliki permission, akan diarahkan ke rute pertama yang dapat diakses.
 * - Jika user tidak memiliki permission ke halaman manapun, akan menampilkan pesan akses ditolak.
 * 
 * Fungsi findFirstAccessibleRoute digunakan untuk mencari rute pertama yang dapat diakses secara rekursif
 * dari konfigurasi navigasi aplikasi.
 * 
 * Dependencies:
 * - React Router (useNavigate)
 * - AuthContext (useAuth)
 * - navigationConfig (navigationRoutes)
 * - LoadingSpinner (komponen UI)
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navigationRoutes } from "../../config/navigationConfig";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

// Fungsi bantuan untuk mencari rute pertama yang bisa diakses secara rekursif
const findFirstAccessibleRoute = (routes, permissions) => {
  for (const route of routes) {
    // Cek apakah rute itu sendiri bisa diakses dan punya path
    if (route.path && permissions.includes(route.permissionCode)) {
      return route;
    }
    // Jika ini adalah menu induk, cari di dalam sub-menunya
    if (route.items) {
      const foundInChildren = findFirstAccessibleRoute(
        route.items,
        permissions
      );
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return null; // Tidak ada rute yang bisa diakses di cabang ini
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth(); // Ambil user object lengkap & status loading

  useEffect(() => {
    // Jangan lakukan apa-apa jika auth masih loading atau jika tidak ada user
    if (isAuthLoading || !user) {
      return;
    }

    const permissions = user.permissions || [];
    const firstRoute = findFirstAccessibleRoute(navigationRoutes, permissions);

    if (firstRoute && firstRoute.path) {
      navigate(firstRoute.path, { replace: true });
    } else {
      console.error("Tidak ada rute yang bisa diakses untuk pengguna ini.");
      // State untuk menampilkan pesan error sudah ada di return
    }
  }, [user, isAuthLoading, navigate]); // Dependensi sekarang user dan isAuthLoading

  // Selama auth loading, atau jika user belum ada, tampilkan spinner
  if (isAuthLoading || !user) {
    return <LoadingSpinner />;
  }

  // Tampilan ini akan muncul jika user tidak memiliki hak akses ke halaman manapun
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold text-bi-slate-800 mb-4">
        Akses Ditolak
      </h2>
      <p className="text-bi-slate-600">
        Anda tidak memiliki hak akses untuk melihat halaman mana pun.
        <br />
        Silakan hubungi administrator sistem Anda.
      </p>
    </div>
  );
};

export default LandingPage;
