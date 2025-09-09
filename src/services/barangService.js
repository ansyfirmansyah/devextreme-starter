// Service ini spesifik untuk kebutuhan di luar createStore, seperti mengisi dropdown.
import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";
import { Form } from "devextreme-react";

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

export const diskonDataSource = (masterRawData) => {
  return createStore({
    key: "barangd_id",
    loadUrl: API_ENDPOINTS.barang.detailDiskon,
    loadParams: {
      headerId: masterRawData.key,
    },
  });
};

export const refKlasifikasiDataSource = () => {
  return createStore({
    key: "klas_id",
    loadUrl: API_ENDPOINTS.barang.refKlasifikasi,
  });
};

export const refOutletDataSource = () => {
  return createStore({
    key: "outlet_id",
    loadUrl: API_ENDPOINTS.barang.refOutlet,
  });
};

export const initTemp = async (barangId, url) => {
  try {
    const payload = new URLSearchParams({
      barang_id: barangId.toString(),
    });
    const response = await fetch(url, {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      // Jika respons tidak berhasil (misal, error 404)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse respons sebagai JSON
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Teruskan error agar bisa ditangani di pemanggilnya
  }
};

export const initTempOutlet = async (barangId) => {
  return await initTemp(barangId, API_ENDPOINTS.barang.initTempOutlet);
};

export const initTempDiskon = async (barangId) => {
  return await initTemp(barangId, API_ENDPOINTS.barang.initTempDiskon);
};

export const addDelTemp = async (payload, url, method) => {
  try {
    const response = await fetch(url, {
      method: method,
      body: payload,
    }).catch((error) => {
      // This block handles network errors (e.g., "Failed to fetch")
      console.error("Network error:", error);
      throw error;
      // You can set an error state here to display a message to the user
    });
    console.error("Response-nya:", JSON.stringify(response));

    if (!response.ok) {
      const responseData = await response.json(); // Parse respons sebagai JSON
      console.error("Response data:", responseData);
      // Jika respons tidak berhasil (misal, error 404)
      throw new Error(
        responseData.message || `HTTP error! status: ${response.status}`
      );
    }

    const responseData = await response.json(); // Parse respons sebagai JSON
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Teruskan error agar bisa ditangani di pemanggilnya
  }
};

export const addTempOutlet = async (payload) => {
  console.log("addTempOutlet payload:", payload);
  return await addDelTemp(payload, API_ENDPOINTS.barang.getTempOutlet, "POST");
};

export const addTempDiskon = async (payload) => {
  return await addDelTemp(payload, API_ENDPOINTS.barang.getTempDiskon, "POST");
};

export const delTempOutlet = async (payload) => {
  console.log("addTempOutlet payload:", payload);
  return await addDelTemp(
    payload,
    API_ENDPOINTS.barang.getTempOutlet,
    "DELETE"
  );
};

export const delTempDiskon = async (payload) => {
  return await addDelTemp(
    payload,
    API_ENDPOINTS.barang.getTempDiskon,
    "DELETE"
  );
};

export const refDetailOutletDataSource = (tempId) => {
  return createStore({
    key: "barango_id",
    loadUrl: API_ENDPOINTS.barang.getTempOutlet,
    loadParams: {
      temptable_outlet_id: tempId,
    },
  });
};

export const refDetailDiskonDataSource = (tempId) => {
  return createStore({
    key: "barangd_id",
    loadUrl: API_ENDPOINTS.barang.getTempDiskon,
    loadParams: {
      temptable_diskon_id: tempId,
    },
  });
};
