import React, { useState, useCallback, useEffect } from "react";
import SelectBox from "devextreme-react/select-box";
import Button from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import {
  addTempDetail,
  delTempDetail,
  refBarangDataSource,
  refBarangDiskonDataSource,
  refDetailJualDataSource,
} from "../../../services/penjualanService";
import DataGrid, {
  Column,
  Paging,
  Selection,
  Editing,
  Button as GridButton,
  Pager,
} from "devextreme-react/data-grid";
import { NumberBox, Popup, TextBox } from "devextreme-react";
import {
  DeleteIcon,
  SearchIcon,
} from "../../../components/icon/actionCellIcon";

const PenjualanFormDetailGrid = ({ tempId, outletId, readOnly }) => {
  // Dropdown
  const [lookupRefBarang, setLookupRefBarang] = useState(null);
  const [lookupRefBarangDiskon, setLookupRefBarangDiskon] = useState(null);
  const [selectedBarangId, setSelectedBarangId] = useState(null);
  const [selectedBarangDiskonId, setSelectedBarangDiskonId] = useState(null);

  const [currentQty, setCurrentQty] = useState(null);
  const [currentHarga, setCurrentHarga] = useState(null);
  const [currentBarangDisplay, setCurrentBarangDisplay] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Popup
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [tempSelectedRowKey, setTempSelectedRowKey] = useState(null);

  // Get List Barang
  useEffect(() => {
    const ds = refBarangDataSource(outletId || 0);
    ds.load()
      .then((data) => {
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
    ds.load()
      .then((data) => {
        setLookupRefBarangDiskon(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data diskon:", error);
      });
  }, [selectedBarangId, currentQty]);

  // --- HANDLER POP UP ---
  const handleOpenPopup = () => {
    if (!outletId) {
      notify("Harap pilih outlet terlebih dahulu!", "error", 2000);
      return; // Stop eksekusi jika outlet belum dipilih
    }

    // Jika lolos validasi, buka popup
    setTempSelectedRowKey(selectedBarangId); // Set pilihan awal di grid sama dengan yg sudah terpilih
    setIsPopupVisible(true);
  };

  // --- HANDLER SELECTED POP UP ---
  const handleSelectAndClose = () => {
    const selectedData = lookupRefBarang.find(
      (item) => item.barang_id === tempSelectedRowKey
    );
    if (selectedData) {
      setCurrentBarangDisplay(selectedData.barang_nama);
      setSelectedBarangId(selectedData.barang_id);
      setCurrentHarga(selectedData.barang_harga);
    }
    setIsPopupVisible(false);
  };

  // --- HANDLER ADD DENGAN API ---
  const handleAdd = useCallback(async () => {
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
      setCurrentBarangDisplay(""); // Reset display nama barang juga
    } catch (error) {
      console.error("Gagal menyimpan data ke server:", error);
      notify(error?.message || "Gagal menyimpan ke database!", "error", 2000);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedBarangId,
    currentHarga,
    currentQty,
    selectedBarangDiskonId,
    tempId,
  ]);

  // --- HANDLER DELETE DENGAN API ---
  const handleDelete = useCallback(
    async (e) => {
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
    },
    [tempId]
  );

  return (
    <div>
      {/* Tampilkan loading indicator saat proses API berjalan */}
      {isLoading && <LoadingSpinner />}

      {!readOnly && (
        <div className="grid grid-cols-12 gap-x-4 gap-y-2 items-end p-4 mb-4 border rounded-md bg-bi-slate-50 border-bi-slate-200">
          {/* START BARANG PICKER */}
          <div className="col-span-12 sm:col-span-3">
            <label className="text-sm font-medium text-gray-700">Barang</label>
            <div className="flex items-center">
              <TextBox
                value={currentBarangDisplay}
                readOnly={true}
                placeholder="Pilih Barang..."
                stylingMode="outlined"
                elementAttr={{
                  class: "rounded-r-none",
                }}
              />
              {/* Tombol Search sekarang di-style langsung di sini */}
              <Button
                onClick={handleOpenPopup}
                disabled={!outletId}
                elementAttr={{ class: "form-search-button" }}
              >
                <SearchIcon />
              </Button>
            </div>
          </div>
          <Popup
            visible={isPopupVisible}
            onHiding={() => setIsPopupVisible(false)}
            dragEnabled={false}
            closeOnOutsideClick={true}
            showTitle={true}
            title="Pilih Barang"
            width={800}
            height={500}
          >
            <DataGrid
              dataSource={lookupRefBarang}
              keyExpr="barang_id"
              hoverStateEnabled={true}
              selectedRowKeys={[tempSelectedRowKey]} // Gunakan state sementara
              onSelectionChanged={(e) => {
                // Hanya update state sementara saat user klik baris
                setTempSelectedRowKey(e.selectedRowKeys[0]);
              }}
              onRowDblClick={handleSelectAndClose} // Opsi: double click untuk langsung memilih
            >
              <Selection mode="single" />
              <Paging defaultPageSize={10} />

              <Column dataField="barang_kode" caption="Kode Barang" />
              <Column dataField="display" caption="Nama Barang" />
              <Column
                dataField="barang_harga"
                caption="Harga"
                format={"#,##0.##"}
              />
            </DataGrid>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "20px",
              }}
            >
              <Button
                text="Batal"
                onClick={() => setIsPopupVisible(false)}
                type="normal"
              />
              <Button
                text="Pilih"
                onClick={handleSelectAndClose}
                type="default"
                style={{ marginLeft: "10px" }}
                disabled={!tempSelectedRowKey} // Tombol "Pilih" disable jika belum ada yang dipilih
              />
            </div>
          </Popup>
          {/* END BARANG PICKER */}

          {/* --- HARGA --- */}
          <div className="col-span-6 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Harga</label>
            <NumberBox
              value={currentHarga}
              min={0}
              format={"#,##0.##"}
              stylingMode="outlined"
              readOnly={true}
            />
          </div>

          {/* --- QTY --- */}
          <div className="col-span-6 sm:col-span-1">
            <label className="text-sm font-medium text-gray-700">Qty</label>
            <NumberBox
              value={currentQty}
              min={0}
              onValueChange={setCurrentQty}
              format={"#"}
              stylingMode="outlined"
            />
          </div>

          {/* --- DISKON --- */}
          <div className="col-span-12 sm:col-span-4">
            <label className="text-sm font-medium text-gray-700">
              Diskon yang tersedia
            </label>
            <SelectBox
              dataSource={lookupRefBarangDiskon}
              valueExpr="barangd_id"
              displayExpr="display"
              placeholder="Pilih Diskon..."
              value={selectedBarangDiskonId}
              onValueChange={(e) => setSelectedBarangDiskonId(e)}
              stylingMode="outlined"
              disabled={!selectedBarangId || !currentQty}
            />
          </div>

          {/* --- ADD BUTTON --- */}
          <div className="col-span-12 sm:col-span-2">
            <Button
              text="Add Detail"
              icon="add"
              type="default"
              onClick={handleAdd}
              disabled={
                !selectedBarangId || !currentHarga || !currentQty || isLoading
              }
              elementAttr={{ class: "grid-add-button w-full" }}
            />
          </div>
        </div>
      )}
      <DataGrid
        dataSource={refDetailJualDataSource(tempId)}
        showBorders={true}
        onRowRemoving={handleDelete}
        className="mt-4"
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
            rowData.juald_qty * rowData.juald_harga - rowData.juald_disk
          }
          dataType="number"
          caption="Total"
          format={"#,##0.##"}
        />
        <Editing mode="row" allowDeleting={true} useIcons={false} />
        {!readOnly && (
          <Column type="buttons" width={80}>
            <GridButton
              name="delete"
              render={() => (
                <div className="flex items-center justify-center h-full">
                  <div className="p-1 text-red-500 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-700">
                    <DeleteIcon />
                  </div>
                </div>
              )}
            />
          </Column>
        )}
      </DataGrid>
    </div>
  );
};

export default PenjualanFormDetailGrid;
