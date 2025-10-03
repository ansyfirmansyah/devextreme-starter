import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";

/**
 * Store utama untuk operasi CRUD user role.
 */
export const userRoleStore = createCrudStore(
  "userId", // Primary key di DTO adalah 'RoleId'
  API_ENDPOINTS.userRoles,
  "User Role"
);

/**
 * DataSource untuk mengambil daftar semua role.
 * Digunakan di form untuk mengisi pilihan di TagBox.
 */
export const getRoleDataSource = () => {
  return createStore({
    key: "roleId",
    loadUrl: API_ENDPOINTS.roles.get,
  });
};