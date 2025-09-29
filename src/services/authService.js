import { API_ENDPOINTS } from "../config/apiConfig";
import api from "../services/api";

/**
 * Mengirim kredensial login ke backend.
 * @param {string} userId - User ID yang dimasukkan pengguna.
 * @param {string} password - Password yang dimasukkan pengguna.
 * @returns {Promise<Object>} - Data respons dari backend jika sukses.
 * @throws {Error} - Jika login gagal atau terjadi error jaringan.
 */
export const login = async (userId, password, deviceInfo) => {
  const response = await fetch(API_ENDPOINTS.auth.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password, deviceInfo }),
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.message || 'Login failed.');
  }

  return responseData.data; // Mengembalikan data user dan token
};

export const refreshToken = async (accessToken, refreshToken) => {
    const response = await fetch(API_ENDPOINTS.auth.refresh, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
    });
    
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || "Failed to refresh token.");
    }
    return responseData?.data; // Mengembalikan { newAccessToken, newRefreshToken }
};

/**
 * Mengirim request logout ke backend untuk menghapus sesi spesifik.
 * @param {string} refreshToken - Refresh token dari sesi yang akan di-logout.
 */
export const logout = async (refreshToken) => {
    // Kirim refreshToken di dalam body request
    await api(API_ENDPOINTS.auth.logout, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }), // <-- UBAH DI SINI
    });
};

/**
 * Mengirim detail awal registrasi untuk validasi.
 * @param {object} details - Berisi userName, email, address, phoneNumber.
 * @returns {Promise<string>} - Token temporer jika validasi berhasil.
 */
export const checkRegistrationDetails = async (details) => {
  const response = await api(API_ENDPOINTS.auth.registerCheckDetails, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });

  const responseData = await response.json();
  if (!response.ok || !responseData.success) {
    throw new Error(responseData.message || 'Gagal memvalidasi data.');
  }
  return responseData.data.tempToken;
};

/**
 * Mengirim password untuk menyelesaikan registrasi.
 * @param {string} tempToken - Token dari langkah pertama.
 * @param {string} password - Password yang sudah divalidasi.
 * @param {string} deviceInfo - Informasi device dan browser
 * @returns {Promise<string>} - User ID baru yang berhasil dibuat.
 */
export const completeRegistration = async (tempToken, password, deviceInfo) => {
  const response = await api(API_ENDPOINTS.auth.registerComplete, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tempToken, password, deviceInfo }),
  });

  const responseData = await response.json();
  if (!response.ok || !responseData.success) {
    throw new Error(responseData.message || 'Registrasi gagal.');
  }
  return responseData.data.userId;
};