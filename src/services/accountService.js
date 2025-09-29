import { API_ENDPOINTS } from "../config/apiConfig";
import api from "./api"; // Menggunakan interceptor yang sudah ada

/**
 * Mengirim data untuk mengubah password pengguna yang sedang login.
 * @param {string} currentPassword - Password saat ini.
 * @param {string} newPassword - Password baru.
 * @returns {Promise<Object>} - Respons dari backend.
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api(API_ENDPOINTS.account.changePassword, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const responseData = await response.json();
  if (!response.ok || !responseData.success) {
    throw new Error(responseData.message || "Gagal mengubah password.");
  }
  return responseData;
};

/**
 * Mengambil data profil pengguna yang sedang login.
 * @returns {Promise<Object>} - Data profil pengguna.
 */
export const getUserProfile = async () => {
    const response = await api(API_ENDPOINTS.account.getProfile);
    const responseData = await response.json();
    if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Gagal mengambil data profil.');
    }
    return responseData.data;
};
