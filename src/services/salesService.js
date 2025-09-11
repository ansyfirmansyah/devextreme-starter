// Service ini untuk integrasi dengan API baik itu createStore maupun data untuk dropdown.
import { createStore } from 'devextreme-aspnet-data-nojquery';

import { API_ENDPOINTS } from '../config/apiConfig';
import { createCrudStore } from './serviceHelper';

/**
 * Store utama untuk operasi CRUD sales.
 * Digunakan di SalesGrid dan SalesForm.
 * Gunakan createStore dari devextreme-aspnet-data-nojquery.
 * Pastikan API_ENDPOINTS diatur dengan benar di config/apiConfig.js
 */
export const salesStore = createCrudStore(
  "sales_id",
  API_ENDPOINTS.sales,
  "Sales"
);

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

