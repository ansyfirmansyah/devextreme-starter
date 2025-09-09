import React, { useState, useCallback, useEffect } from "react";
import SelectBox from "devextreme-react/select-box";
import Button from "devextreme-react/button";
import DataGrid, { Column, Editing, Pager, Paging } from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import {
  addTempOutlet,
  delTempOutlet,
  refDetailOutletDataSource,
  refOutletDataSource,
} from "../../../services/barangService";

const BarangFormOutletGrid = ({ tempId, readOnly }) => {
  const [selectedOutletId, setSelectedOutletId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lookupRefOutlet, setLookupRefOutlet] = useState(null);

  // DataSource untuk klasifikasi
  useEffect(() => {
    // Ambil instance dari data source
    const ds = refOutletDataSource();

    // Load datanya
    ds.load()
      .then((data) => {
        // Simpan hasilnya di state
        setLookupRefOutlet(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data outlet:", error);
      });

    // Array dependensi kosong '[]' memastikan ini hanya berjalan sekali
  }, []);

  // --- HANDLER ADD DENGAN API ---
  const handleAddOutlet = useCallback(async () => {
    if (!selectedOutletId) return;
    setIsLoading(true);
    try {
      const payload = new URLSearchParams({
        outlet_id: selectedOutletId.toString(),
        temptable_outlet_id: tempId.toString(),
      });
      await addTempOutlet(payload);
      notify("Outlet berhasil ditambahkan!", "success", 1500);
      setSelectedOutletId(null); // Reset SelectBox setelah berhasil
    } catch (error) {
      console.error("Gagal menyimpan data ke server:", error);
      notify(error?.message || "Gagal menyimpan ke database!", "error", 2000);
    } finally {
      setIsLoading(false);
    }
  }, [selectedOutletId]);

  // --- HANDLER DELETE DENGAN API ---
  const handleDeleteOutlet = useCallback(async (e) => {
    // 🛡️ 1. Ambil data baris yang akan dihapus
    const outletToDelete = e.data;
    // 2. Batalkan aksi default DataGrid. Kita akan kontrol 100%
    e.cancel = true;
    if (!outletToDelete) return;
    setIsLoading(true);
    try {
      // 3. Panggil API untuk menghapus data dari database
      const payload = new URLSearchParams({
        key: outletToDelete.barango_id.toString(),
        temptable_outlet_id: tempId.toString(),
      });
      await delTempOutlet(payload);
      notify("Outlet berhasil dihapus!", "success", 1500);
    } catch (error) {
      notify(error?.message || "Gagal menyimpan ke database!", "error", 2000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      {/* Tampilkan loading indicator saat proses API berjalan */}
      {isLoading && <LoadingSpinner />}

      {/* <div className="dx-field-label">Outlet</div> */}
      {!readOnly && (
        <div style={{ display: "flex", gap: "10px", alignContent: "right" }}>
          <SelectBox
            dataSource={lookupRefOutlet}
            valueExpr="outlet_id"
            displayExpr="display"
            placeholder="Pilih Outlet..."
            value={selectedOutletId}
            onValueChanged={(e) => setSelectedOutletId(e.value)}
            width={300}
          />
          <Button
            text="Add"
            icon="add"
            type="default"
            onClick={handleAddOutlet}
            disabled={!selectedOutletId || isLoading}
          />
        </div>
      )}
      <DataGrid
        dataSource={refDetailOutletDataSource(tempId)}
        showBorders={true}
        style={{ marginTop: "10px" }}
        onRowRemoving={handleDeleteOutlet} // <-- Handler Delete di sini
      >
        <Paging defaultPageSize={5} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />

        <Column dataField="outlet_kode" caption="Kode"/>
        <Column dataField="outlet_nama" caption="Nama Outlet"/>
        {!readOnly && <Editing
          mode="row"
          allowDeleting={true}
          useIcons={true}
          confirmDelete={true}
        />}
      </DataGrid>
    </div>
  );
};

export default BarangFormOutletGrid;
