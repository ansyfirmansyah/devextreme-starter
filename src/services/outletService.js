// Service ini untuk integrasi dengan API baik itu createStore maupun data untuk dropdown.
import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";

export const klasifikasiStore = createCrudStore(
  "outlet_id",
  API_ENDPOINTS.outlets,
  "Outlet"
);

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
