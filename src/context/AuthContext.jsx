import React, { createContext, useState, useContext } from "react";
import {
  logout as authServiceLogout,
} from "../services/authService";
import { eraseCookie, getCookie, setCookieAccessToken, setCookieRefreshToken } from "../services/cookieService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData"); // Masih pakai localStorage untuk data non-sensitif
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, accessToken, refreshToken) => {
    setCookieAccessToken(accessToken);
    setCookieRefreshToken(refreshToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    const refreshToken = getCookie("refreshToken"); // <-- 1. Ambil refresh token dari cookie

    // Panggil API logout, bahkan jika refresh token tidak ada (untuk membersihkan sisi klien)
    await authServiceLogout(refreshToken);

    // 2. Hapus semua cookie dan data lokal
    eraseCookie("accessToken");
    eraseCookie("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
    window.location.href = "/login";
  };

  const value = { user, login, logout };

  // Jangan render aplikasi sampai pengecekan sesi selesai
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
