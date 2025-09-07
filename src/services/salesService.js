// Service ini spesifik untuk kebutuhan di luar createStore, seperti mengisi dropdown.
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { API_ENDPOINTS } from '../config/apiConfig';

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

