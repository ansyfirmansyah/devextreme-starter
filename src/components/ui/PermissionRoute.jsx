import React from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { Navigate } from "react-router-dom";

/**
 * Komponen ini bertindak sebagai gerbang untuk sebuah rute.
 * Ia memeriksa apakah pengguna memiliki hak akses yang diperlukan sebelum merender halaman.
 * @param {object} props
 * @param {string} props.permissionCode - Kode hak akses yang dibutuhkan untuk mengakses rute ini.
 * @param {React.ReactElement} props.element - Komponen halaman yang akan dirender jika akses diizinkan.
 */
const PermissionRoute = ({ permissionCode, element }) => {
  const { user, isAuthLoading } = useAuth();

  // Selama sesi masih divalidasi, tampilkan spinner.
  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  // Periksa apakah daftar hak akses pengguna mengandung kode yang dibutuhkan.
  const hasPermission = user?.permissions?.includes(permissionCode);

  if (!hasPermission) {
    // Jika tidak punya hak, alihkan ke halaman "Unauthorized".
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika punya hak, render komponen halaman yang diminta.
  return element;
};

export default PermissionRoute;
