// File ini bertindak sebagai "API Client"
// Ia mensimulasikan panggilan ke backend.
// Nantinya, Anda hanya perlu mengganti isi file ini dengan panggilan http (fetch/axios)
// tanpa perlu mengubah kode di komponen React.

import { initialCustomers, provinces, cities } from '../data/mockData';

// Kita buat salinan data agar tidak memodifikasi data asli secara langsung
let customersDB = [...initialCustomers];
const NETWORK_DELAY = 500; // Simulasi jeda waktu jaringan (dalam milidetik)

// --- PROSES HIDRASI ---
// Fungsi ini mengubah data mentah (dengan ID) menjadi data yang kaya (dengan objek)
const hydrateCustomer = (rawCustomer) => {
  if (!rawCustomer) return null;

  // Cari objek province dan city dari master data berdasarkan ID
  const province = provinces.find(p => p.id === rawCustomer.province?.id);
  const city = cities.find(c => c.id === rawCustomer.city?.id);

  // Buat objek baru yang sudah terhidrasi
  const hydrated = {
    ...rawCustomer,
    province: province || null, // Ganti provinceId dengan objek province
    city: city || null,         // Ganti cityId dengan objek city
  };

  // Hapus foreign key yang sudah tidak perlu
  delete hydrated.provinceId;
  delete hydrated.cityId;

  return hydrated;
};

/**
 * --- KONTRAK API UNTUK BACKEND ---
 * Endpoint: GET /api/customers
 * Method: GET
 * Request Param (opsional): sort, filter, pagination (untuk DataGrid)
 * Response Body (sukses):
 * {
 * "data": [ { ID, CompanyName, City, Province, ... } ],
 * "totalCount": 100 
 * }
 * ------------------------------------
 */
export const getCustomers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Hidrasi setiap customer sebelum dikirim ke UI
      const hydratedCustomers = customersDB.map(hydrateCustomer);
      resolve(hydratedCustomers);
    }, NETWORK_DELAY);
  });
};

/**
 * --- KONTRAK API UNTUK BACKEND ---
 * Endpoint: GET /api/customers/:id
 * Method: GET
 * Request Param: id (customer ID)
 * Response Body (sukses):
 * { ID, CompanyName, City, Province, ... }
 * ------------------------------------
 */
export const getCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = customersDB.find(c => c.id === id);
      if (customer) {
        // Hidrasi satu customer
        resolve(hydrateCustomer(customer));
      } else {
        reject(new Error('Customer not found.'));
      }
    }, NETWORK_DELAY);
  });
};


/**
 * --- KONTRAK API UNTUK BACKEND ---
 * Endpoint: POST /api/customers
 * Method: POST
 * Request Body:
 * {
 * "CompanyName": "PT. Coba Jaya",
 * "City": "Surabaya",
 * ...
 * }
 * Response Body (sukses):
 * {
 * "ID": 5, // ID baru dari database
 * "CompanyName": "PT. Coba Jaya",
 * "City": "Surabaya",
 * ...
 * }
 * ------------------------------------
 */
export const createCustomer = (customerDataFromForm) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!customerDataFromForm.companyName) {
        return reject(new Error('Company Name is required.'));
      }
      
      // 2. Simpan data mentah ke "database"
      const newId = customersDB.length > 0 ? Math.max(...customersDB.map(c => c.id)) + 1 : 1;
      const newRawCustomer = { ...customerDataFromForm, id: newId };
      customersDB.push(newRawCustomer);

      // 3. Hidrasi kembali data yang baru dibuat untuk dikirim ke UI
      resolve(hydrateCustomer(newRawCustomer));
    }, NETWORK_DELAY);
  });
};

/**
 * --- KONTRAK API UNTUK BACKEND ---
 * Endpoint: PUT /api/customers/:id
 * Method: PUT
 * Request Body:
 * {
 * "companyName": "PT. Mitra Sejati (Updated)",
 * ...
 * }
 * Response Body (sukses):
 * {
 * "id": 1,
 * "companyName": "PT. Mitra Sejati (Updated)",
 * ...
 * }
 * ------------------------------------
 */
export const updateCustomer = (customerId, customerData) => {
  console.log(`SERVICE: Updating customer ID: ${customerId} with data:`, customerData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Cari index customer di "database"
      const customerIndex = customersDB.findIndex(c => c.id === customerId);

      if (customerIndex === -1) {
        console.error(`SERVICE: Failed, customer with ID ${customerId} not found for update.`);
        return reject(new Error('Customer not found for update.'));
      }

      // Pastikan ID asli tidak ikut terganti oleh data baru dari form
      const updatedCustomer = { ...customerData, id: customerId };
      
      // Ganti data lama dengan data baru di dalam array
      customersDB[customerIndex] = updatedCustomer;
      
      console.log('SERVICE: Success updating customer.', updatedCustomer);
      resolve(updatedCustomer);
    }, NETWORK_DELAY);
  });
};

/**
 * --- KONTRAK API UNTUK BACKEND ---
 * Endpoint: DELETE /api/customers/:id
 * Method: DELETE
 * Response Body (sukses):
 * { "success": true, "deletedId": 1 }
 * ------------------------------------
 */
export const deleteCustomer = (customerId) => {
  console.log(`SERVICE: Deleting customer ID: ${customerId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = customersDB.length;
      // Filter array untuk membuat array baru tanpa customer yang dihapus
      customersDB = customersDB.filter(c => c.id !== customerId);

      if (customersDB.length < initialLength) {
        console.log(`SERVICE: Success deleting customer ID: ${customerId}`);
        resolve({ success: true, deletedId: customerId });
      } else {
        console.error(`SERVICE: Failed, customer with ID ${customerId} not found for deletion.`);
        reject(new Error('Customer not found for deletion.'));
      }
    }, NETWORK_DELAY);
  });
};