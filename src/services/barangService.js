// Service ini spesifik untuk kebutuhan di luar createStore, seperti mengisi dropdown.
import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";

/**
 * Store utama untuk operasi CRUD barang.
 * Digunakan di BarangGrid dan BarangForm.
 * Gunakan createStore dari devextreme-aspnet-data-nojquery.
 * Pastikan API_ENDPOINTS diatur dengan benar di config/apiConfig.js
 */
export const klasifikasiStore = createCrudStore(
  "barang_id",
  API_ENDPOINTS.klasifikasi,
  "Barang"
);

/**
 * --- KONTRAK API BARU UNTUK BACKEND ---
 * Endpoint: GET /api/klasifikasi/parent/lookup?klas_id=123
 * Parameter Query: klas_id (opsional) - ID klasifikasi yang sedang diedit, untuk mengecualikan diri sendiri dan anak-anaknya
 * Response Body: [ { "klas_id": 1, "klas_nama": "Mall Kelapa Gading" }, ... ]
 * Fungsi ini HANYA untuk mengisi dropdown. Tidak perlu paging/filter.
 */
export const createParentDataSource = (existingId) => {
  // DataSource untuk SelectBox, dengan parameter dinamis
  return createStore({
    key: "klas_id",
    loadUrl: API_ENDPOINTS.klasifikasi.parentLookup,
    // API ini butuh parameter klas_id untuk mengecualikan diri sendiri dan children-nya
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.data.klas_id = existingId;
    },
  });
};

// DataSource untuk Master-Detail Grid Outlet
export const outletDataSource = (masterRawData) => {
  return createStore({
    key: "barango_id",
    loadUrl: API_ENDPOINTS.barang.detailOutlet,
    // Tambahkan parameter kustom yang akan selalu dikirim saat load data
    loadParams: {
      headerId: masterRawData.key, // 'outletData.key' berisi ID dari baris master (outlet)
    },
  });
};

// DataSource untuk Master-Detail Grid Diskon
export const diskonDataSource = (masterRawData) => {
  return createStore({
    key: "barangd_id",
    loadUrl: API_ENDPOINTS.barang.detailDiskon,
    loadParams: {
      headerId: masterRawData.key,
    },
  });
};

// DataSource untuk SelectBox Referensi Klasifikasi
export const refKlasifikasiDataSource = () => {
  return createStore({
    key: "klas_id",
    loadUrl: API_ENDPOINTS.barang.refKlasifikasi,
  });
};

// DataSource untuk SelectBox Referensi Outlet
export const refOutletDataSource = () => {
  return createStore({
    key: "outlet_id",
    loadUrl: API_ENDPOINTS.barang.refOutlet,
  });
};

// API untuk inisialisasi data di tabel temp (outlet/diskon) saat form dibuka (create, view maupun edit)
export const initTemp = async (barangId, url) => {
  try {
    // Gunakan URLSearchParams untuk mengirim data sebagai application/x-www-form-urlencoded
    const payload = new URLSearchParams({
      barang_id: barangId.toString(),
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

// Inisialisasi data di tabel temp outlet
export const initTempOutlet = async (barangId) => {
  return await initTemp(barangId, API_ENDPOINTS.barang.initTempOutlet);
};
// Inisialisasi data di tabel temp diskon
export const initTempDiskon = async (barangId) => {
  return await initTemp(barangId, API_ENDPOINTS.barang.initTempDiskon);
};

// API untuk menambah atau menghapus data di tabel temp (outlet/diskon)
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

// Fungsi untuk menambah data di tabel temp outlet
export const addTempOutlet = async (payload) => {
  return await addDelTemp(payload, API_ENDPOINTS.barang.getTempOutlet, "POST");
};
// Fungsi untuk menambah data di tabel temp diskon
export const addTempDiskon = async (payload) => {
  return await addDelTemp(payload, API_ENDPOINTS.barang.getTempDiskon, "POST");
};
// Fungsi untuk menghapus data di tabel temp outlet
export const delTempOutlet = async (payload) => {
  return await addDelTemp(
    payload,
    API_ENDPOINTS.barang.getTempOutlet,
    "DELETE"
  );
};
// Fungsi untuk menghapus data di tabel temp diskon
export const delTempDiskon = async (payload) => {
  return await addDelTemp(
    payload,
    API_ENDPOINTS.barang.getTempDiskon,
    "DELETE"
  );
};

// DataSource untuk Detail Grid Outlet di form (dari tabel temp)
export const refDetailOutletDataSource = (tempId) => {
  return createStore({
    key: "barango_id",
    loadUrl: API_ENDPOINTS.barang.getTempOutlet,
    loadParams: {
      temptable_outlet_id: tempId,
    },
  });
};

// DataSource untuk Detail Grid Diskon di form (dari tabel temp)
export const refDetailDiskonDataSource = (tempId) => {
  return createStore({
    key: "barangd_id",
    loadUrl: API_ENDPOINTS.barang.getTempDiskon,
    loadParams: {
      temptable_diskon_id: tempId,
    },
  });
};
