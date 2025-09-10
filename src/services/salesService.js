// Service ini untuk integrasi dengan API baik itu createStore maupun data untuk dropdown.
import { createStore } from 'devextreme-aspnet-data-nojquery';
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * Store utama untuk operasi CRUD sales.
 * Digunakan di SalesGrid dan SalesForm.
 * Gunakan createStore dari devextreme-aspnet-data-nojquery.
 * Pastikan API_ENDPOINTS diatur dengan benar di config/apiConfig.js
 */
export const salesStore = createStore({
  // primary key disesuaikan dengan nama primary key di tabel database
  key: "sales_id",
  // List API yang digunakan untuk operasi CRUD
  loadUrl: API_ENDPOINTS.sales.get,
  insertUrl: API_ENDPOINTS.sales.post,
  updateUrl: API_ENDPOINTS.sales.put,
  deleteUrl: API_ENDPOINTS.sales.delete,
  // Event handler untuk menampilkan notifikasi
  onInserted: () => notify("Sales created successfully", "success", 2000),
  onUpdated: () => notify("Sales updated successfully", "success", 2000),
  onRemoved: () => notify("Sales deleted successfully", "success", 2000),
});

/**
 * --- KONTRAK API BARU UNTUK BACKEND ---
 * Endpoint: GET /api/outlets/lookup
 * Response Body: [ { "id": 1, "namaOutlet": "Mall Kelapa Gading" }, ... ]
 * Fungsi ini HANYA untuk mengisi dropdown. Tidak perlu paging/filter.
 * Di backend, ini cukup: return await _db.Outlets.Select(o => new { o.id, o.namaOutlet }).ToListAsync();
 */
export const getOutletLookupStore = () => {
    return createStore({
        key: 'outlet_id',
        loadUrl: API_ENDPOINTS.outlets.lookup
    });
};

