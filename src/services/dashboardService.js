import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";

/**
 * Mengambil data KPI (Key Performance Indicators) dari backend.
 * @returns {Promise<Object>} Data KPI dashboard
 */
export const getKpiData = async () => {
  const response = await fetch(API_ENDPOINTS.dashboard.kpi);
  if (!response.ok) {
    // Jika gagal, lempar error agar bisa ditangani di komponen pemanggil
    throw new Error("Gagal memuat data KPI.");
  }
  return await response.json();
};

/**
 * Membuat data source untuk grafik tren penjualan (14 hari terakhir).
 * Data source ini digunakan oleh komponen DevExtreme Chart.
 * @returns {DevExtreme.data.Store} Data source untuk chart tren penjualan
 */
export const getSalesTrendDataSource = () => {
  return createStore({
    key: "date", // Primary key pada data tren penjualan
    loadUrl: API_ENDPOINTS.dashboard.salesTrend, // Endpoint backend untuk data tren penjualan
  });
};