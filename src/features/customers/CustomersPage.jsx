import React, { useState, useCallback, useEffect } from "react";
import * as customerService from "../../services/customerService";
import { confirm } from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";

import CustomersGrid from "./components/CustomersGrid";
import CustomerForm from "./components/CustomersForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

// Template sekarang menggunakan camelCase dan null untuk objek
const newCustomerTemplate = {
  registrationDate: new Date(),
  companyName: "",
  phone: "",
  province: null,
  city: null,
  email: "",
  website: "",
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [activeFormData, setActiveFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError("Gagal memuat data customer.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependensi kosong karena fungsi ini tidak bergantung pada state/props lain

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveCustomer = useCallback(
    async (customerData) => {
      try {
        // Cek apakah data memiliki ID. Jika ya, berarti ini adalah UPDATE.
        let isUpdate = false;
        if (customerData.id) {
          isUpdate = true;
          await customerService.updateCustomer(customerData.id, customerData);
        } else {
          await customerService.createCustomer(customerData);
        }

        setViewMode("grid");
        setActiveFormData(null);
        notify(
          {
            message: `Customer ${
              isUpdate ? "updated" : "created"
            } successfully`,
            width: 350,
          },
          "success",
          2000
        );
        await loadData();
      } catch (err) {
        setError("Gagal menyimpan customer.");
        console.error(err);
        notify(
          { message: "Failed to save customer.", width: 300 },
          "error",
          3000
        );
      }
    },
    [loadData]
  ); // Tambahkan loadData sebagai dependensi

  const handleCancelForm = useCallback(() => {
    setViewMode("grid");
    setActiveFormData(null);
  }, []);

  const handleAddClick = useCallback(() => {
    setActiveFormData({ ...newCustomerTemplate });
    setViewMode("form");
  }, []);

  const handleBackFromView = useCallback(() => {
    setViewMode("grid");
    setActiveFormData(null);
  }, []);

  const handleViewClick = useCallback(async (customerId) => {
    try {
      setError(null);
      setIsLoading(true);
      const customerData = await customerService.getCustomerById(customerId);
      setActiveFormData(customerData);
      setViewMode("view");
    } catch (err) {
      setError("Gagal memuat detail customer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEditClick = useCallback(async (customerId) => {
    try {
      setError(null);
      setIsLoading(true);
      // Panggil service untuk mengambil data customer yang akan diedit
      const customerData = await customerService.getCustomerById(customerId);
      setActiveFormData(customerData);
      setViewMode("form"); // Buka form dalam mode edit (bukan read-only)
    } catch (err) {
      setError("Gagal memuat data customer untuk diedit.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteClick = useCallback(
    async (customerId) => {
      // Tampilkan dialog konfirmasi
      const result = await confirm(
        "Are you sure you want to delete this customer?",
        "Confirm Deletion"
      );

      // Jika pengguna menekan "Yes" (atau "OK"), result akan true
      if (result) {
        try {
          await customerService.deleteCustomer(customerId);
          notify(
            {
              message: "Customer deleted successfully",
              width: 300,
              // (Opsional) Atur posisi notifikasi
              position: {
                my: "top center",
                at: "top center",
              },
            },
            "success",
            2000
          ); // Tipe "success", hilang setelah 2 detik
          await loadData();
        } catch (err) {
          setError("Gagal menghapus customer.");
          console.error(err);
          notify(
            { message: "Failed to delete customer.", width: 300 },
            "error",
            3000
          );
        }
      }
    },
    [loadData]
  );

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }
  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (viewMode === "form" || viewMode === "view") {
    return (
      <CustomerForm
        initialData={activeFormData}
        onSave={handleSaveCustomer}
        onCancel={handleCancelForm}
        readOnly={viewMode === "view"}
        onBack={handleBackFromView}
      />
    );
  }

  return (
    <CustomersGrid
      customers={customers}
      onAddClick={handleAddClick}
      onViewClick={handleViewClick}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteClick}
    />
  );
};

export default CustomersPage;
