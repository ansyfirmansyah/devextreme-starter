/**
 * ProtectedRoute.jsx
 * ------------------
 * Komponen pembungkus untuk proteksi rute yang membutuhkan autentikasi.
 *
 * - Menampilkan spinner selama proses autentikasi/pengecekan sesi.
 * - Jika user belum login, redirect ke halaman login.
 * - Jika user sudah login, render children (halaman yang diproteksi).
 *
 * Dependencies:
 * - React Router (Navigate)
 * - AuthContext (useAuth)
 * - LoadingSpinner (komponen UI)
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner"; // Impor spinner

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useAuth(); // Ambil user dan status loading

  if (isAuthLoading) {
    // Selama pengecekan sesi berlangsung, tampilkan spinner
    return <LoadingSpinner />;
  }

  if (!user) {
    // Jika pengecekan selesai dan tidak ada user, redirect ke login
    return <Navigate to="/login" replace />;
  }

  // Jika pengecekan selesai dan ada user, izinkan akses
  return children;
};

export default ProtectedRoute;
