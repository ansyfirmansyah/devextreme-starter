import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";

/**
 * Store utama untuk operasi CRUD role.
 */
export const roleStore = createCrudStore(
  "roleId", // Primary key di DTO adalah 'RoleId'
  API_ENDPOINTS.roles,
  "Role"
);

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