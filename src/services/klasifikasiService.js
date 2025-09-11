// Service ini untuk integrasi dengan API baik itu createStore maupun data untuk dropdown.
import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";

/**
 * Store utama untuk operasi CRUD klasifikasi.
 * Digunakan di KlasifikasiGrid dan KlasifikasiForm.
 * Gunakan createStore dari devextreme-aspnet-data-nojquery.
 * Pastikan API_ENDPOINTS diatur dengan benar di config/apiConfig.js
 */
export const klasifikasiStore = createCrudStore(
  "klas_id",
  API_ENDPOINTS.klasifikasi,
  "Klasifikasi"
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
