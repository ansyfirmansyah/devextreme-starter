import { getCookie, eraseCookie, setCookieAccessToken, setCookieRefreshToken } from "./cookieService";
import { refreshToken as refreshAuthToken } from "./authService";
import { API_ENDPOINTS } from "../config/apiConfig"; // Pastikan ini di-import jika belum

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = async (url, options = {}) => {
  const token = getCookie("accessToken");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  // Tambahkan withCredentials untuk cookie session check
  options.credentials = "include";

  // Simpan options awal untuk digunakan saat mengulang request
  const originalOptions = { ...options };

  try {
    const response = await fetch(url, options);

    if (response.status === 401 && url !== API_ENDPOINTS.auth.refresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalOptions.headers["Authorization"] = "Bearer " + newToken;
          return fetch(url, originalOptions);
        });
      }

      isRefreshing = true;
      const refreshToken = getCookie("refreshToken");
      const expiredAccessToken = getCookie("accessToken");

      if (refreshToken && expiredAccessToken) {
        return refreshAuthToken(expiredAccessToken, refreshToken)
          .then((res) => {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = res;
            setCookieAccessToken(newAccessToken);
            setCookieRefreshToken(newRefreshToken);
            processQueue(null, newAccessToken);

            // Ulangi request original dengan token baru
            originalOptions.headers["Authorization"] =
              "Bearer " + newAccessToken;
            return fetch(url, originalOptions);
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            eraseCookie("accessToken");
            eraseCookie("refreshToken");
            localStorage.removeItem("userData");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // Jika salah satu token tidak ada, langsung logout
        eraseCookie("accessToken");
        eraseCookie("refreshToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
        return Promise.reject(new Error("Sesi tidak valid."));
      }
    }

    // Jika response bukan 401, langsung kembalikan
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default api;
