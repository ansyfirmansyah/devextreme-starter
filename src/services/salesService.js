// Service ini untuk integrasi dengan API baik itu createStore maupun data untuk dropdown.
import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";

/**
 * Store utama untuk operasi CRUD sales.
 * Digunakan di SalesGrid dan SalesForm.
 * Gunakan createStore dari devextreme-aspnet-data-nojquery.
 * Pastikan API_ENDPOINTS diatur dengan benar di config/apiConfig.js
 * @type {DevExtreme.data.Store}
 */
export const salesStore = createCrudStore(
  "sales_id",
  API_ENDPOINTS.sales,
  "Sales"
);

/**
 * Mendapatkan data lookup outlet untuk dropdown pada form sales.
 * Tidak menggunakan paging/filter, hanya untuk kebutuhan dropdown.
 * Endpoint: GET /api/outlets/lookup
 * Response: [ { "id": 1, "namaOutlet": "Mall Kelapa Gading" }, ... ]
 * @returns {DevExtreme.data.Store}
 */
export const getOutletLookupStore = () => {
  return createStore({
    key: "outlet_id",
    loadUrl: API_ENDPOINTS.outlets.lookup,
  });
};

/**
 * Melakukan upload file Excel sales ke backend untuk preview dan validasi.
 * Mengirim file sebagai FormData ke endpoint previewUpload.
 * Backend akan mengembalikan data hasil parsing dan validasi.
 * @param {File} file - File Excel yang akan di-upload
 * @returns {Promise<Object>} - Data hasil preview dari backend
 * @throws {Error} - Jika upload gagal atau backend mengembalikan error
 */
export const previewSalesUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_ENDPOINTS.sales.previewUpload, {
    // Definisikan endpoint upload di apiConfig.js
    method: "POST",
    body: formData,
    // Headers TIDAK perlu di-set untuk multipart/form-data, browser akan menanganinya
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Gabungkan pesan error dari backend menjadi satu string
    const errorMessage = errorData.errors
      ? errorData.errors.join("\n")
      : errorData.message;
    throw new Error(errorMessage || "Failed to upload file.");
  }

  return await response.json();
};

/**
 * Submit data sales yang sudah valid ke backend untuk di-import.
 * Payload berupa array data sales yang lolos validasi.
 * @param {Array<Object>} payload - Data sales valid yang akan di-import
 * @returns {Promise<Object>} - Respons dari backend (berisi pesan sukses/gagal)
 * @throws {Error} - Jika proses import gagal
 */
export const commitSalesUpload = async (payload) => {
  try {
    const response = await fetch(API_ENDPOINTS.sales.commitUpload, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    }).catch((error) => {
      throw error;
    });

    // Jika respons tidak berhasil (misal, error 404)
    if (!response.ok) {
      // Parse respons sebagai JSON untuk mendapatkan pesan error dari server
      const responseData = await response.json();
      throw new Error(
        responseData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Parse respons sebagai JSON
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};