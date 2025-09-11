// Service ini untuk integrasi dengan API baik itu createStore maupun data untuk dropdown.
import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from "../config/apiConfig";

export const outletStore = createStore({
  key: "outlet_id", // Primary Key, pastikan sama dengan model di backend
  loadUrl: API_ENDPOINTS.outlets.get,
  insertUrl: API_ENDPOINTS.outlets.post,
  updateUrl: API_ENDPOINTS.outlets.put,
  deleteUrl: API_ENDPOINTS.outlets.delete,

  // Event ini akan dipanggil setelah server mengkonfirmasi data berhasil ditambah
  onInserted: () => {
    notify("Outlet created successfully", "success", 2000);
  },
  // Event ini akan dipanggil setelah server mengkonfirmasi data berhasil diubah
  onUpdated: () => {
    notify("Outlet updated successfully", "success", 2000);
  },
  // Event ini akan dipanggil setelah server mengkonfirmasi data berhasil dihapus
  onRemoved: () => {
    notify("Outlet deleted successfully", "success", 2000);
  },
});

export const salesByOutletStore = (outletId) => {
  return createStore({
    key: "sales_id",
    loadUrl: API_ENDPOINTS.outlets.getSales,
    // Tambahkan parameter kustom yang akan selalu dikirim saat load data
    loadParams: {
      outletId: outletId, // ID dari baris master (outlet)
    },
  });
};
