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
  addTempDetail,
  delTempDetail,
  refBarangDataSource,
  refBarangDiskonDataSource,
  refDetailJualDataSource,
} from "../../../services/penjualanService";
import { NumberBox } from "devextreme-react";

const PenjualanFormDetailGrid = ({ tempId, outletId, readOnly }) => {
  // Dropdown
  const [lookupRefBarang, setLookupRefBarang] = useState(null);
  const [lookupRefBarangDiskon, setLookupRefBarangDiskon] = useState(null);
  const [selectedBarangId, setSelectedBarangId] = useState(null);
  const [selectedBarangDiskonId, setSelectedBarangDiskonId] = useState(null);

  const [currentQty, setCurrentQty] = useState(null);
  const [currentHarga, setCurrentHarga] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get List Barang
  useEffect(() => {
    const ds = refBarangDataSource(outletId || 0);
    // Load datanya
    ds.load()
      .then((data) => {
        // Simpan hasilnya di state
        setLookupRefBarang(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data barang:", error);
      });
  }, [outletId]);

  // Get List Diskon
  useEffect(() => {
    const ds = refBarangDiskonDataSource(
      selectedBarangId || 0,
      currentQty || 0
    );
    // Load datanya
    ds.load()
      .then((data) => {
        // Simpan hasilnya di state
        setLookupRefBarangDiskon(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data diskon:", error);
      });
  }, [selectedBarangId, currentQty]);

  // --- HANDLER ADD DENGAN API ---
  const handleAdd = useCallback(async () => {
    console.log("cek >> " + selectedBarangDiskonId);
    if (!selectedBarangId || !currentQty || !currentHarga) return;
    setIsLoading(true);
    try {
      const payload = new URLSearchParams({
        barang_id: selectedBarangId.toString(),
        juald_harga: currentHarga,
        juald_qty: currentQty,
        barangd_id: selectedBarangDiskonId || null,
        temptable_detail_id: tempId.toString(),
      });
      await addTempDetail(payload);
      notify("Detail berhasil ditambahkan!", "success", 1500);
      setSelectedBarangId(null); // Reset SelectBox setelah berhasil
      setSelectedBarangDiskonId(null);
      setCurrentHarga(null);
      setCurrentQty(null);
    } catch (error) {
      console.error("Gagal menyimpan data ke server:", error);
      notify(error?.message || "Gagal menyimpan ke database!", "error", 2000);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBarangId, currentHarga, currentQty, selectedBarangDiskonId]);

  // --- HANDLER DELETE DENGAN API ---
  const handleDelete = useCallback(async (e) => {
    // 🛡️ 1. Ambil data baris yang akan dihapus
    const detailToDelete = e.data;
    // 2. Batalkan aksi default DataGrid. Kita akan kontrol 100%
    e.cancel = true;
    if (!detailToDelete) return;
    setIsLoading(true);
    try {
      // 3. Panggil API untuk menghapus data dari database
      const payload = new URLSearchParams({
        key: detailToDelete.juald_id.toString(),
        temptable_detail_id: tempId.toString(),
      });
      await delTempDetail(payload);
      notify("Detail berhasil dihapus!", "success", 1500);
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
        <div style={{ display: "flex", gap: "10px", alignItems:"end" }}>
          <SelectBox
            label="Barang"
            dataSource={lookupRefBarang}
            valueExpr="barang_id"
            displayExpr="display"
            placeholder="Pilih Barang..."
            value={selectedBarangId}
            onItemClick={(e) => {
              setSelectedBarangId(e.itemData.barang_id);
              setCurrentHarga(e.itemData.barang_harga);
            }}
            width={300}
            labelMode="outside"
          />
          <NumberBox
            value={currentHarga}
            label="Harga"
            min={0}
            width={100}
            format={"#,##0.##"}
            labelMode="outside"
            disabled={true}
          />
          <NumberBox
            value={currentQty}
            label="Qty"
            min={0}
            onValueChange={(e) => setCurrentQty(e)}
            width={100}
            format={"#"}
            labelMode="outside"
          />
          <SelectBox
            label="Diskon yang tersedia"
            dataSource={lookupRefBarangDiskon}
            valueExpr="barangd_id"
            displayExpr="display"
            placeholder="Pilih Diskon..."
            value={selectedBarangDiskonId}
            onItemClick={(e) => {
              console.log("cek pilih diskon");
              setSelectedBarangDiskonId(e.itemData.barangd_id);
            }}
            width={300}
            disabled={!selectedBarangId || !currentQty}
            labelMode="outside"
          />
          <Button
            text="Add Detail"
            icon="add"
            type="default"
            onClick={handleAdd}
            disabled={
              !selectedBarangId || !currentHarga || !currentQty || isLoading
            }
          />
        </div>
      )}
      <DataGrid
        dataSource={refDetailJualDataSource(tempId)}
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

        <Column dataField="barang_kode" caption="Kode" />
        <Column dataField="barang_nama" caption="Nama Barang" />
        <Column dataField="juald_qty" caption="Qty" />
        <Column dataField="juald_harga" caption="Harga" format={"#,##0.##"} />
        <Column
          calculateCellValue={(rowData) =>
            rowData.juald_qty * rowData.juald_harga
          }
          dataType="number"
          caption="Total Harga"
          format={"#,##0.##"}
        />
        <Column dataField="juald_disk" caption="Diskon" format={"#,##0.##"} />
        <Column
          calculateCellValue={(rowData) =>
            (rowData.juald_qty * rowData.juald_harga) - rowData.juald_disk
          }
          dataType="number"
          caption="Total"
          format={"#,##0.##"}
        />
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

export default PenjualanFormDetailGrid;
