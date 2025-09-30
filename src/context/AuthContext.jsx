/**
 * AuthContext.jsx
 * ---------------
 * Context untuk manajemen autentikasi aplikasi.
 * 
 * - Menyediakan state user, permission, dan status loading autentikasi.
 * - Menyimpan dan memulihkan sesi user dari cookie dan localStorage.
 * - Menyediakan fungsi login dan logout.
 * - Logout juga menghapus token di backend jika ada refresh token.
 * 
 * Dependencies:
 * - React Context API
 * - React Router (useNavigate)
 * - authService (logout)
 * - cookieService (get/set/erase cookie)
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import { logout as authServiceLogout } from "../services/authService";
import {
  eraseCookie,
  getCookie,
  setCookieAccessToken,
  setCookieRefreshToken,
} from "../services/cookieService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // State loading autentikasi
  const navigate = useNavigate();

  // Efek ini berjalan sekali saat aplikasi pertama kali dimuat
  useEffect(() => {
    try {
      const accessToken = getCookie("accessToken");
      const storedUser = localStorage.getItem("userData");

      if (accessToken && storedUser) {
        // Jika ada token dan data user, kita bisa re-hidrasi state auth
        const userData = JSON.parse(storedUser);
        // Decode token JWT untuk ambil permission
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        const permissions = decodedToken.permission || [];

        // Gabungkan data user dari localStorage dengan permissions dari token
        setUser({ ...userData, permissions });
      }
    } catch (error) {
      console.error("Gagal memulihkan sesi:", error);
      // Jika ada error (misal token tidak valid), pastikan state bersih
      setUser(null);
    } finally {
      // Tandai bahwa proses pengecekan auth selesai
      setIsAuthLoading(false);
    }
  }, []); // Dependensi kosong berarti hanya berjalan sekali

  /**
   * Fungsi login: simpan token dan user ke cookie/localStorage, update state user.
   */
  const login = (userData, accessToken, refreshToken) => {
    const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    const permissions = decodedToken.permission || [];

    setCookieAccessToken(accessToken);
    setCookieRefreshToken(refreshToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser({ ...userData, permissions }); // Simpan user DAN permissions
  };

  /**
   * Fungsi logout: hapus token, data user, dan redirect ke login.
   * Jika ada refresh token, panggil API logout ke backend.
   */
  const logout = async () => {
    // Ambil refresh token dari cookie
    const refreshToken = getCookie("refreshToken");

    // jika refresh token ada maka consume API logout (untuk di-remove di sisi backend)
    if (refreshToken) {
      await authServiceLogout(refreshToken);
    }

    // Hapus semua cookie dan data lokal
    eraseCookie("accessToken");
    eraseCookie("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);

    // Kembali ke halaman login
    navigate("/login");
  };

  // Value context yang diekspos ke aplikasi
  const value = {
    user,
    permissions: user?.permissions, // Tetap expose permissions untuk kemudahan
    isAuthLoading, // Expose loading state
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook untuk mengakses context autentikasi.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};