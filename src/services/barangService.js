// Service ini spesifik untuk kebutuhan di luar createStore, seperti mengisi dropdown.
import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";

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

const a = () => {
  try {
    
  } catch (error) {
    
  }
}

export const initTemp = async (barangId, url) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ barang_id: barangId }),
    });
    console.log("Response:", response);

    if (!response.ok) {
      // Jika respons tidak berhasil (misal, error 404)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse respons sebagai JSON
    console.log("Success:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const initTempOutlet = async (barangId) => {
  return await initTemp(barangId, API_ENDPOINTS.barang.initTempOutlet);
}

export const initTempDiskon = async (barangId) => {
  return await initTemp(barangId, API_ENDPOINTS.barang.initTempDiskon);
}
