import React, { useState, useCallback, useRef } from "react";
import notify from "devextreme/ui/notify";
import DataSource from 'devextreme/data/data_source';

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import SalesGrid, { salesStore } from "./components/SalesGrid";
import SalesForm from "./components/SalesForm";

const newSalesTemplate = {
  sales_kode: "",
  sales_nama: "",
  outlet_id: null,
};

const salesDataSource = new DataSource(salesStore);

const SalesPage = () => {
  const [salesDataSource] = useState(() => new DataSource(salesStore));
  const [viewMode, setViewMode] = useState("grid");
  const [activeFormData, setActiveFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading hanya untuk aksi, bukan load awal

  const handleSave = useCallback(async (data) => {
    try {
      // 4. Dapatkan store dari dataSource yang selalu ada
      const store = salesDataSource.store();

      if (data.sales_id) { // Mode Update
        await store.update(data.sales_id, data);
      } else { // Mode Create
        await store.insert(data);
      }

      setViewMode('grid');
      // Perintahkan dataSource untuk memuat ulang data agar grid ter-update
      // await salesDataSource.reload();
    } catch (err) {
      console.log('errornyaa---> ' + err);
      notify(err ? err : 'Failed to save sales data.', 'error', 3000);
    }
  }, []);

  const handleAddClick = useCallback(() => {
    setActiveFormData({ ...newSalesTemplate });
    setViewMode("form");
  }, []);

  const handleViewClick = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const data = await salesStore.byKey(id); // Menggunakan store untuk fetch by key
      setActiveFormData(data);
      setViewMode("view");
    } catch (err) {
      console.error('Load data error:', err);
      notify('Failed to load sales data.', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEditClick = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const data = await salesStore.byKey(id); // Menggunakan store untuk fetch by key
      setActiveFormData(data);
      setViewMode("form");
    } catch (err) {
      console.error('Load data error:', err);
      notify('Failed to load sales data.', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteClick = useCallback(async (id) => {
    const result = await confirm('Are you sure you want to delete this sales data?', 'Confirm Deletion');
    if (result) {
      try {
        // 4. Dapatkan store dari dataSource yang selalu ada
        const store = salesDataSource.store();
        await store.remove(id);
        // Grid akan refresh otomatis karena onRemoved, tapi ini lebih aman
        await salesDataSource.reload();
      } catch (err) {
        console.error(err);
        notify('Failed to delete sales data.', 'error', 3000);
      }
    }
  }, []);

  const handleCancel = useCallback(() => setViewMode("grid"), []);

  // Tidak ada lagi 'isLoading' untuk load awal karena grid mengurusnya sendiri
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (viewMode === 'form' || viewMode === 'view') {
    return <SalesForm
      initialData={activeFormData}
      onSave={handleSave}
      onCancel={handleCancel}
      readOnly={viewMode === 'view'}
      onBack={handleCancel}
    />;
  }

  return (
    // 6. Teruskan instance dataSource ke SalesGrid
    <SalesGrid
      dataSource={salesDataSource}
      onAddClick={handleAddClick}
      onViewClick={handleViewClick}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteClick}
    />
  );
};

export default SalesPage;
