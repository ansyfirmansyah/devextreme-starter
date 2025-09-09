// File ini adalah satu-satunya sumber kebenaran untuk semua URL API.

// 1. Definisikan base URL dari API backend Anda.
// Di proyek Vite, kita bisa gunakan environment variable (dari file .env)
// agar bisa diganti-ganti untuk production.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:19999/api";

// 2. Definisikan semua endpoint yang kita butuhkan.
export const API_ENDPOINTS = {
  outlets: {
    get: `${API_BASE_URL}/outlets/get`,
    post: `${API_BASE_URL}/outlets/post`,
    put: `${API_BASE_URL}/outlets/put`,
    delete: `${API_BASE_URL}/outlets/delete`,
    // Endpoint untuk master-detail
    getSales: `${API_BASE_URL}/outlets/getSalesForOutlet`,
    // Endpoint untuk referensi di form lain
    lookup: `${API_BASE_URL}/outlets/lookup`,
  },
  sales: {
    get: `${API_BASE_URL}/sales/get`,
    post: `${API_BASE_URL}/sales/post`,
    put: `${API_BASE_URL}/sales/put`,
    delete: `${API_BASE_URL}/sales/delete`,
  },
  klasifikasi: {
    get: `${API_BASE_URL}/klasifikasi/get`,
    post: `${API_BASE_URL}/klasifikasi/post`,
    put: `${API_BASE_URL}/klasifikasi/put`,
    delete: `${API_BASE_URL}/klasifikasi/delete`,
    parentLookup: `${API_BASE_URL}/klasifikasi/parent/lookup`,
  },
  barang: {
    get: `${API_BASE_URL}/barang/get`,
    post: `${API_BASE_URL}/barang/post`,
    put: `${API_BASE_URL}/barang/put`,
    delete: `${API_BASE_URL}/barang/delete`,
    refKlasifikasi: `${API_BASE_URL}/barang/ref/klasifikasi`,
    refOutlet: `${API_BASE_URL}/barang/ref/outlet`,
    detailDiskon: `${API_BASE_URL}/barang/summary/diskons`,
    detailOutlet: `${API_BASE_URL}/barang/summary/outlets`,
    initTempDiskon: `${API_BASE_URL}/barang/detail/init/diskon`,
    initTempOutlet: `${API_BASE_URL}/barang/detail/init/outlet`,
    getTempDiskon: `${API_BASE_URL}/barang/detail/diskon`,
    getTempOutlet: `${API_BASE_URL}/barang/detail/outlet`,
  },
};
