import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";
import { DataSource } from 'devextreme-react/common/data';
import api from "./api";

/**
 * Store utama untuk operasi CRUD role.
 */
export const roleStore = createCrudStore(
  "roleId", // Primary key di DTO adalah 'RoleId'
  API_ENDPOINTS.roles,
  "Role"
);

/**
 * DataSource untuk mengambil role berdasarkan id.
 */
export const getRoleById = async (id) => {
  if (!id) throw new Error("ID is required.");
  const response = await api(`${API_ENDPOINTS.roles.get}/${id}`);
  const responseData = await response.json();
  if (!response.ok || !responseData.success) {
    throw new Error(responseData.message || 'Failed to fetch contact details.');
  }
  return responseData.data;
};

/**
 * DataSource untuk mengambil daftar semua modul/hak akses.
 * Digunakan di form untuk mengisi pilihan di TagBox.
 */
export const getModuleDataSource = () => {
  return createStore({
    key: "mod_kode",
    loadUrl: API_ENDPOINTS.roles.modules,
  });
};

/**
 * DataSource untuk mengambil daftar semua modul/hak akses yang telah ditambahkan key group.
 * Digunakan di form untuk mengisi pilihan di TagBox.
 */
export const getGroupedModuleDataSource = () => {
  return createStore({
    key: "mod_kode",
    loadUrl: API_ENDPOINTS.roles.groupedmodules,
  });
};