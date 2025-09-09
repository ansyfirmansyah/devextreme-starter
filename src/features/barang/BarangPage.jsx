import React, { useState, useCallback } from "react";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import DataSource from "devextreme/data/data_source";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import BarangGrid, { barangStore } from "./components/BarangGrid";
import BarangForm from "./components/BarangForm";
import { Guid } from "devextreme/common";
import { initTempDiskon, initTempOutlet } from "../../services/barangService";

// Template data kosong untuk form create
const newBarangTemplate = {
  barang_kode: "",
  barang_nama: "",
  barang_harga: 0,
  klas_id: null,
  temptable_outlet_id: null,
  temptable_diskon_id: null,
};

const BarangPage = () => {
  // Buat dataSource yang selalu ada (tidak di-reset)
  const [barangDataSource] = useState(() => new DataSource(barangStore));
  // State untuk mode tampilan: 'grid', 'form', 'view'
  const [viewMode, setViewMode] = useState("grid");
  // State untuk data yang sedang aktif di form (bisa null)
  const [activeFormData, setActiveFormData] = useState(null);
  // State untuk loading saat fetch data tunggal
  const [isLoading, setIsLoading] = useState(false);

  // Handler untuk simpan data dari form (create/update)
  const handleSave = useCallback(
    async (data) => {
      try {
        // Dapatkan store dari dataSource yang selalu ada
        const store = barangDataSource.store();

        if (data.barang_id) {
          // Mode Update
          await store.update(data.barang_id, data);
        } else {
          // Mode Create
          await store.insert(data);
        }

        // Grid akan refresh otomatis karena kembali ke mode grid
        setViewMode("grid");
      } catch (err) {
        notify(err?.message || "Failed to save data.", "error", 3000);
      }
    },
    [barangDataSource]
  ); // Hanya perlu data source

  // Handler untuk tombol Add
  const handleAddClick = useCallback(async () => {
    // init temptable_id dengan Guid baru
    const temptableOutlet = await initTempOutlet(0);
    console.log("initTempOutlet response:", temptableOutlet);
    const temptableDiskon = await initTempDiskon(0);
    console.log("temptableDiskon response:", temptableDiskon);
    // Set data form ke template baru
    setActiveFormData({
      ...newBarangTemplate,
      temptable_outlet_id: temptableOutlet?.temptable_outlet_id || new Guid(),
      temptable_diskon_id: temptableDiskon?.temptable_diskon_id || new Guid(),
    });
    setViewMode("form");
  }, []);

  // Handler untuk tombol View
  const handleViewClick = useCallback(
    async (id) => {
      try {
        setIsLoading(true);
        const store = barangDataSource.store();
        // Gunakan store untuk fetch by key
        const data = await store.byKey(id);
        // Form menggunakan data yang sudah ditemukan, bukan template kosong
        setActiveFormData(data);
        setViewMode("view");
      } catch (err) {
        console.error("Load data error:", err);
        notify(err?.message || "Failed to load data.", "error", 3000);
      } finally {
        setIsLoading(false);
      }
    },
    [barangDataSource]
  );

  // Handler untuk tombol Edit
  const handleEditClick = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const store = barangDataSource.store();
      // Gunakan store untuk fetch by key
      const data = await store.byKey(id);
      // Form menggunakan data yang sudah ditemukan, bukan template kosong
      setActiveFormData(data);
      setViewMode("form");
    } catch (err) {
      console.error("Load data error:", err);
      notify(err?.message || "Failed to load data.", "error", 3000);
    } finally {
      setIsLoading(false);
    }
  }, [barangDataSource]);

  // Handler untuk tombol Delete
  const handleDeleteClick = useCallback(
    async (id) => {
      const result = await confirm(
        "Are you sure you want to delete this data?",
        "Confirm Deletion"
      );
      if (result) {
        try {
          // Dapatkan store dari dataSource yang selalu ada
          const store = barangDataSource.store();
          await store.remove(id);
          // Refresh data di grid
          await barangDataSource.reload();
        } catch (err) {
          console.error(err);
          notify(err?.message || "Failed to delete data.", "error", 3000);
        }
      }
    },
    [barangDataSource]
  );

  // Handler untuk batal di form (kembali ke grid)
  const handleCancel = useCallback(() => setViewMode("grid"), []);

  // Render loading spinner jika sedang loading data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render form jika mode-nya 'form' atau 'view'
  if (viewMode === "form" || viewMode === "view") {
    return (
      <BarangForm
        initialData={activeFormData}
        onSave={handleSave}
        onCancel={handleCancel}
        readOnly={viewMode === "view"}
        onBack={handleCancel}
      />
    );
  }

  return (
    // Render grid jika mode-nya 'grid'
    <BarangGrid
      dataSource={barangDataSource}
      onAddClick={handleAddClick}
      onViewClick={handleViewClick}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteClick}
    />
  );
};

export default BarangPage;
