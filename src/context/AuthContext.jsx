import React, { createContext, useState, useContext } from "react";
import {
  logout as authServiceLogout,
} from "../services/authService";
import { eraseCookie, getCookie, setCookieAccessToken, setCookieRefreshToken } from "../services/cookieService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData"); // Masih pakai localStorage untuk data non-sensitif
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const login = (userData, accessToken, refreshToken) => {
    setCookieAccessToken(accessToken);
    setCookieRefreshToken(refreshToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

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

  const value = { user, login, logout };

  // Jangan render aplikasi sampai pengecekan sesi selesai
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
