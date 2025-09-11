import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

/**
 * Factory function untuk membuat DevExtreme data store dengan konfigurasi standar.
 * @param {string} keyField - Nama primary key (e.g., "klas_id").
 * @param {object} apiEndpoints - Objek berisi URL untuk get, post, put, delete dari apiConfig.
 * @param {string} entityName - Nama entitas untuk pesan notifikasi (e.g., "Klasifikasi").
 * @returns DevExtreme Data Store
 */
export const createCrudStore = (keyField, apiEndpoints, entityName) => {
  return createStore({
    key: keyField,
    loadUrl: apiEndpoints.get,
    insertUrl: apiEndpoints.post,
    updateUrl: apiEndpoints.put,
    deleteUrl: apiEndpoints.delete,
    onInserted: () => notify(`${entityName} created successfully`, "success", 2000),
    onUpdated: () => notify(`${entityName} updated successfully`, "success", 2000),
    onRemoved: () => notify(`${entityName} deleted successfully`, "success", 2000),
  });
};