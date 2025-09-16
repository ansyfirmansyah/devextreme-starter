import { createStore } from "devextreme-aspnet-data-nojquery";

import { createCrudStore } from "./serviceHelper";
import { API_ENDPOINTS } from "../config/apiConfig";

/**
 * Store utama untuk operasi CRUD penjualan.
 * Digunakan di JualGrid dan JualForm.
 * Gunakan createStore dari devextreme-aspnet-data-nojquery.
 * Pastikan API_ENDPOINTS diatur dengan benar di config/apiConfig.js
 */
export const penjualanStore = createCrudStore(
  "jualh_id",
  API_ENDPOINTS.penjualan,
  "Penjualan"
);

/* START GET REFERENSI */
export const refKodePenjualanDataSource = () => {
  return createStore({
    key: "jualh_kode",
    loadUrl: API_ENDPOINTS.penjualan.refKode,
  });
};

export const refKodeOutletDataSource = () => {
  return createStore({
    key: "outlet_kode",
    loadUrl: API_ENDPOINTS.outlets.refKode,
  });
};

export const refBarangDataSource = (outletId) => {
  return createStore({
    key: "barang_id",
    loadUrl: API_ENDPOINTS.penjualan.refBarang,
    loadParams: {
      outlet_id: outletId,
    },
  });
};

export const refBarangDiskonDataSource = (barangId, qty) => {
  return createStore({
    key: "barangd_id",
    loadUrl: API_ENDPOINTS.penjualan.refBarangDiskon,
    loadParams: {
      barang_id: barangId,
      qty: qty,
    },
  });
};

export const refOutletDataSource = () => {
  return createStore({
    key: "outlet_id",
    loadUrl: API_ENDPOINTS.penjualan.refOutlet,
  });
};

export const refSalesDataSource = (outletId) => {
  return createStore({
    key: "outlet_id",
    loadUrl: API_ENDPOINTS.penjualan.refSales,
    loadParams: {
      outlet_id: outletId,
    },
  });
};
/* END GET REFERENSI */

/* START TEMP TABLE */
// API untuk inisialisasi data di tabel temp (jual detail) saat form dibuka (create, view maupun edit)
export const initTemp = async (jualhId, url) => {
  try {
    // Gunakan URLSearchParams untuk mengirim data sebagai application/x-www-form-urlencoded
    const payload = new URLSearchParams({
      jualh_id: jualhId.toString(),
    });
    // Kirim request POST ke API
    const response = await fetch(url, {
      method: "POST",
      body: payload,
    });

    // Jika respons tidak berhasil (misal, error 404)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse respons sebagai JSON
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Teruskan error agar bisa ditangani di pemanggilnya
    throw error;
  }
};
// Inisialisasi data di tabel temp
export const initTempDetail = async (jualhId) => {
  return await initTemp(jualhId, API_ENDPOINTS.penjualan.initTempDetailJual);
};

// API untuk menambah atau menghapus data di tabel temp (jual detail)
export const addDelTemp = async (payload, url, method) => {
  try {
    const response = await fetch(url, {
      method: method,
      body: payload,
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
// Fungsi untuk menambah data di tabel temp jual detail
export const addTempDetail = async (payload) => {
  return await addDelTemp(
    payload,
    API_ENDPOINTS.penjualan.getTempDetailJual,
    "POST"
  );
};
// Fungsi untuk menghapus data di tabel temp outlet
export const delTempDetail = async (payload) => {
  return await addDelTemp(
    payload,
    API_ENDPOINTS.penjualan.getTempDetailJual,
    "DELETE"
  );
};
// DataSource untuk Detail Grid Detail di form (dari tabel temp)
export const refDetailJualDataSource = (tempId) => {
  return createStore({
    key: "juald_id",
    loadUrl: API_ENDPOINTS.penjualan.getTempDetailJual,
    loadParams: {
      temptable_detail_id: tempId,
    },
  });
};
/* END TEMP TABLE */
