import { createStore } from "devextreme-aspnet-data-nojquery";

import { API_ENDPOINTS } from "../config/apiConfig";

// DataSource untuk SelectBox Referensi Kode Penjualan pada Report
export const refKodePenjualanDataSource = () => {
  return createStore({
    key: "jualh_kode",
    loadUrl: API_ENDPOINTS.penjualan.refKode,
  });
};