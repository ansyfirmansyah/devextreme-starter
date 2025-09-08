import React, { useState, useCallback } from "react";
import notify from "devextreme/ui/notify";
import {confirm} from "devextreme/ui/dialog";
import DataSource from 'devextreme/data/data_source';

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import KlasifikasiGrid, { klasifikasiStore } from "./components/KlasifikasiGrid";
import KlasifikasiForm from "./components/KlasifikasiForm";

// Template data kosong untuk form create
const newKlasifikasiTemplate = {
  klas_kode: "",
  klas_nama: "",
  klas_parent_id: null,
};

const KlasifikasiPage = () => {
  // Buat dataSource yang selalu ada (tidak di-reset)
  const [klasifikasiDataSource] = useState(() => new DataSource(klasifikasiStore));
  // State untuk mode tampilan: 'grid', 'form', 'view'
  const [viewMode, setViewMode] = useState("grid");
  // State untuk data yang sedang aktif di form (bisa null)
  const [activeFormData, setActiveFormData] = useState(null);
  // State untuk loading saat fetch data tunggal
  const [isLoading, setIsLoading] = useState(false);

  // Handler untuk simpan data dari form (create/update)
  const handleSave = useCallback(async (data) => {
    try {
      // Dapatkan store dari dataSource yang selalu ada
      const store = klasifikasiDataSource.store();

      if (data.klas_id) { // Mode Update
        await store.update(data.klas_id, data);
      } else { // Mode Create
        await store.insert(data);
      }

      // Grid akan refresh otomatis karena kembali ke mode grid
      setViewMode('grid');
    } catch (err) {
      notify(err?.message || 'Failed to save data.', 'error', 3000);
    }
  }, [klasifikasiDataSource]); // Hanya perlu data source

  // Handler untuk tombol Add
  const handleAddClick = useCallback(() => {
    // Set data form ke template baru
    setActiveFormData({ ...newKlasifikasiTemplate });
    setViewMode("form");
  }, []);

  // Handler untuk tombol View
  const handleViewClick = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const store = klasifikasiDataSource.store();
      // Gunakan store untuk fetch by key
      const data = await store.byKey(id);
      // Form menggunakan data yang sudah ditemukan, bukan template kosong
      setActiveFormData(data);
      setViewMode("view");
    } catch (err) {
      console.error('Load data error:', err);
      notify(err?.message || 'Failed to load data.', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  }, [klasifikasiDataSource]);

  // Handler untuk tombol Edit
  const handleEditClick = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const store = klasifikasiDataSource.store();
      // Gunakan store untuk fetch by key
      const data = await store.byKey(id);
      // Form menggunakan data yang sudah ditemukan, bukan template kosong
      setActiveFormData(data);
      setViewMode("form");
    } catch (err) {
      console.error('Load data error:', err);
      notify(err?.message || 'Failed to load data.', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handler untuk tombol Delete
  const handleDeleteClick = useCallback(async (id) => {
    const result = await confirm('Are you sure you want to delete this data?', 'Confirm Deletion');
    if (result) {
      try {
        // Dapatkan store dari dataSource yang selalu ada
        const store = klasifikasiDataSource.store();
        await store.remove(id);
        // Refresh data di grid
        await klasifikasiDataSource.reload();
      } catch (err) {
        console.error(err);
        notify(err?.message || 'Failed to delete data.', 'error', 3000);
      }
    }
  }, [klasifikasiDataSource]);

  // Handler untuk batal di form (kembali ke grid)
  const handleCancel = useCallback(() => setViewMode("grid"), []);

  // Render loading spinner jika sedang loading data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render form jika mode-nya 'form' atau 'view'
  if (viewMode === 'form' || viewMode === 'view') {
    return <KlasifikasiForm
      initialData={activeFormData}
      onSave={handleSave}
      onCancel={handleCancel}
      readOnly={viewMode === 'view'}
      onBack={handleCancel}
    />;
  }

  return (
    // Render grid jika mode-nya 'grid'
    <KlasifikasiGrid
      dataSource={klasifikasiDataSource}
      onAddClick={handleAddClick}
      onViewClick={handleViewClick}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteClick}
    />
  );
};

export default KlasifikasiPage;
