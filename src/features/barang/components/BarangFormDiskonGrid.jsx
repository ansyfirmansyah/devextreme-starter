import React, { useState, useCallback, useEffect } from "react";
import SelectBox from "devextreme-react/select-box";
import Button from "devextreme-react/button";
import DataGrid, {
  Column,
  Editing,
  Pager,
  Paging,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import {
  addTempDiskon,
  delTempDiskon,
  refDetailDiskonDataSource,
} from "../../../services/barangService";
import { NumberBox } from "devextreme-react";

const BarangFormDiskonGrid = ({ tempId, harga, readOnly }) => {
  const [qty, setQty] = useState(0);
  const [disc, setDisc] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Lakukan sesuatu ketika harga berubah
  }, [harga]);

  // --- HANDLER ADD DENGAN API ---
  const handleAdd = useCallback(async () => {
    if (qty <= 0 || disc <= 0) return;
    setIsLoading(true);
    try {
      const payload = new URLSearchParams({
        diskon: disc,
        qty: qty,
        harga: harga,
        temptable_diskon_id: tempId.toString(),
      });
      await addTempDiskon(payload);
      notify("Diskon berhasil ditambahkan!", "success", 1500);
      setQty(0);
      setDisc(0);
    } catch (error) {
      console.error("Gagal menyimpan data ke server:", error);
      notify(error?.message || "Gagal menyimpan ke database!", "error", 2000);
    } finally {
      setIsLoading(false);
    }
  }, [qty, disc]);

  // --- HANDLER DELETE DENGAN API ---
  const handleDelete = useCallback(async (e) => {
    // 🛡️ 1. Ambil data baris yang akan dihapus
    const dataToDelete = e.data;
    // 2. Batalkan aksi default DataGrid. Kita akan kontrol 100%
    e.cancel = true;
    if (!dataToDelete) return;
    setIsLoading(true);
    try {
      // 3. Panggil API untuk menghapus data dari database
      const payload = new URLSearchParams({
        key: dataToDelete.barangd_id.toString(),
        temptable_diskon_id: tempId.toString(),
      });
      await delTempDiskon(payload);
      notify("Diskon berhasil dihapus!", "success", 1500);
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

      {!readOnly && (
        <div style={{ display: "flex", gap: "10px", alignContent: "right" }}>
          <NumberBox
            value={qty}
            onValueChanged={(e) => setQty(e.value)}
            min={0}
            placeholder="Qty..."
            width={100}
            format="#0"
            showSpinButtons={true}
          />
          <NumberBox
            value={disc}
            onValueChanged={(e) => setDisc(e.value)}
            min={0}
            placeholder="Diskon..."
            width={200}
            format="#,##0.##"
          />
          <Button
            text="Add"
            icon="add"
            type="default"
            onClick={handleAdd}
            disabled={qty <= 0 || isLoading || disc <= 0}
          />
        </div>
      )}
      <DataGrid
        dataSource={refDetailDiskonDataSource(tempId)}
        showBorders={true}
        style={{ marginTop: "10px" }}
        onRowRemoving={handleDelete} // <-- Handler Delete di sini
      >
        <Paging defaultPageSize={5} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />

        <Column dataField="barangd_qty" caption="Kuantitas" format="#0"/>
        <Column dataField="barangd_disc" caption="Diskon" format="#,##0.##"/>
        {!readOnly && (
          <Editing
            mode="row"
            allowDeleting={true}
            useIcons={true}
            confirmDelete={true}
          />
        )}
      </DataGrid>
    </div>
  );
};

export default BarangFormDiskonGrid;
