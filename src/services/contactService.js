import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../config/apiConfig";
import { createCrudStore } from "./serviceHelper";
import api from "./api";

/**
 * Store utama untuk operasi CRUD contact.
 */
export const contactStore = createCrudStore(
  "contact_id",
  API_ENDPOINTS.contacts,
  "Contacts"
);

/**
 * DataSource untuk mengambil daftar semua negara.
 */
export const getCountryDataSource = () => {
  return createStore({
    key: "country_id",
    loadUrl: API_ENDPOINTS.contacts.countries,
  });
};

/**
 * DataSource untuk mengambil daftar semua kota.
 */
export const getContactById = async (id) => {
  if (!id) throw new Error("ID is required.");
  // Panggil endpoint GET /api/contacts/{id}
  const response = await api(`${API_ENDPOINTS.contacts.get}/${id}`);
  const responseData = await response.json();
  if (!response.ok || !responseData.success) {
    throw new Error(responseData.message || 'Failed to fetch contact details.');
  }
  return responseData.data;
};

/**
 * DataSource untuk mengambil daftar semua kota.
 */
export const getCityDataSource = (countryId) => {
  // DataSource untuk SelectBox, dengan parameter dinamis
  return createStore({
    key: "city_id",
    loadUrl: API_ENDPOINTS.contacts.cities,
    // API ini butuh parameter country_id untuk filter kota berdasarkan negara
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.data.countryId = countryId;
    },
  });
};

/**
 * DataSource untuk mengambil daftar semua lead source.
 */
export const getLeadSourceDataSource = () => {
  return createStore({
    key: "lead_source_id",
    loadUrl: API_ENDPOINTS.contacts.leadSources,
  });
};

/**
 * DataSource untuk mengambil daftar semua status kontak.
 */
export const getContactStatusDataSource = () => {
  return createStore({
    key: "contact_status_id",
    loadUrl: API_ENDPOINTS.contacts.statuses,
  });
};