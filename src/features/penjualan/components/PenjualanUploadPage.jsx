import React, { useCallback, useState, useRef } from "react";
// Impor komponen dan utilitas DevExtreme
import { Button, DataGrid, Tabs } from "devextreme-react";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import { confirm } from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";
import { useNavigate } from "react-router-dom";

// Impor komponen spinner loading
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
// Impor service untuk upload dan preview penjualan
import {
  commitPenjualanUpload,
  previewPenjualanUpload,
} from "../../../services/penjualanService";
import { API_ENDPOINTS } from "../../../config/apiConfig";
import {
  renderDateCell,
  renderHeader,
} from "../../../components/ui/GridCellRenderers";

/**
 * Halaman upload data Penjualan dari file Excel.
 * Fitur:
 * - Pilih file Excel
 * - Preview data sebelum submit
 * - Validasi data sebelum import
 * - Download template Excel
 */
const PenjualanUploadPage = () => {
  // State untuk loading spinner
  const [isLoading, setIsLoading] = useState(false);
  // State untuk file yang akan di-upload
  const [fileToUpload, setFileToUpload] = useState(null);
  // State untuk nama file yang dipilih
  const [fileName, setFileName] = useState("");
  // State untuk data hasil preview
  const [previewDataHeader, setPreviewDataHeader] = useState([]);
  const [previewDataDetail, setPreviewDataDetail] = useState([]);
  // Hook untuk navigasi halaman
  const navigate = useNavigate();
  // Ref untuk input file agar bisa di-reset
  const inputFileRef = useRef(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  /**
   * Handler perubahan file input.
   * Menyimpan file dan nama file ke state.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      setFileName(file.name); // Simpan nama file untuk ditampilkan
    }
  };

  /**
   * Handler tombol "Preview Data".
   * Mengirim file ke backend untuk di-preview dan validasi.
   */
  const handleProcessUpload = async () => {
    if (!fileToUpload) {
      notify("Pilih file Excel terlebih dahulu.", "error", 2000);
      return;
    }
    setIsLoading(true);
    setPreviewDataHeader([]);
    setPreviewDataDetail([]);
    try {
      const result = await previewPenjualanUpload(fileToUpload);
      setPreviewDataHeader(result.data?.header);
      setPreviewDataDetail(result.data?.detail);
      if (
        result.data &&
        (result.data.header?.length > 0 || result.data.detail?.length > 0)
      ) {
        notify(
          "File berhasil diproses. Silakan periksa kolom status untuk melanjutkan.",
          "info",
          3000
        );
      } else {
        notify("Tidak ada data yang ditemukan di dalam file.", "warning", 4000);
      }
    } catch (error) {
      notify(error.message, "error", 5000);
    } finally {
      setIsLoading(false);
      // Reset input file setelah selesai
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
      setFileToUpload(null);
      setFileName("");
    }
  };

  /**
   * Handler tombol "Submit Valid Data".
   * Mengirim data valid ke backend untuk di-import.
   * Jika ada data tidak valid, tampilkan konfirmasi sebelum lanjut.
   */
  const handleSubmit = async () => {
    const validRowsHeader = previewDataHeader.filter((row) => row.isValid);
    const validRowsDetail = previewDataDetail.filter((row) => row.isValid);
    if (validRowsHeader.length === 0) {
      notify("Tidak ada data header yang valid untuk disubmit.", "error");
      return;
    }

    const hasInvalidRowsHeader = previewDataHeader.some((row) => !row.isValid);
    const hasInvalidRowsDetail = previewDataDetail.some((row) => !row.isValid);
    if (hasInvalidRowsHeader) {
      if (hasInvalidRowsDetail) {
        const result = await confirm(
          `Ada ${
            previewDataHeader.length - validRowsHeader.length
          } baris data header dan ada ${
            previewDataDetail.length - validRowsDetail.length
          } baris data detail yang tidak valid dan tidak akan diimpor. Lanjutkan?`,
          "Konfirmasi"
        );
        if (!result) return;
      } else {
        const result = await confirm(
          `Ada ${
            previewDataHeader.length - validRowsHeader.length
          } baris yang tidak valid dan tidak akan diimpor. Lanjutkan?`,
          "Konfirmasi"
        );
        if (!result) return;
      }
    } else if (hasInvalidRowsDetail) {
      const result = await confirm(
        `Ada ${
          previewDataDetail.length - validRowsDetail.length
        } baris data detail yang tidak valid dan tidak akan diimpor. Lanjutkan?`,
        "Konfirmasi"
      );
      if (!result) return;
    }

    setIsLoading(true);
    try {
      const result = await commitPenjualanUpload({
        header: validRowsHeader,
        detail: validRowsDetail,
      });
      notify(result.message || "Data berhasil diimpor.", "success", 2000);
      navigate("/penjualan");
    } catch (error) {
      notify(error.message, "error", 5000);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handler tombol "Cancel".
   * Kembali ke halaman penjualan.
   */
  const handleCancel = useCallback(() => navigate("/penjualan"), [navigate]);

  // Tombol submit disable jika tidak ada data valid atau sedang loading
  const isSubmitDisabled =
    previewDataHeader.length === 0 ||
    !previewDataHeader.some((row) => row.isValid) ||
    isLoading;

  /**
   * Styling baris grid: beri warna khusus jika data tidak valid.
   */
  const onRowPrepared = (e) => {
    if (e.rowType === "data" && !e.data.isValid) {
      e.rowElement.classList.add("invalid-row");
    }
  };

  const tabItems = [{ text: "Header" }, { text: "Detail" }];
  const handleTabClick = (e) => {
    setSelectedTabIndex(e.itemIndex);
  };

  return (
    <div className="form-container">
      {/* Spinner loading saat proses upload/submit */}
      {isLoading && <LoadingSpinner />}

      {/* Form upload dan preview hanya tampil jika tidak loading */}
      {!isLoading && (
        <>
          {/* Panel upload dan tombol aksi */}
          <div className="p-4 mb-4 border rounded-md bg-bi-slate-50 border-bi-slate-200">
            <h3 className="text-lg font-semibold text-bi-slate-700 mb-4">
              Upload Penjualan from Excel
            </h3>

            {/* Grup tombol: select file, preview, dan download template */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Grup 1: Tombol Select & Preview */}
              <div className="flex items-center gap-x-4">
                {/* Tombol pilih file Excel */}
                <div className="flex items-center">
                  <label
                    htmlFor="excel-upload"
                    className="grid-secondary-button cursor-pointer flex items-center justify-center"
                    style={{ padding: "8px 16px" }}
                  >
                    Select Excel file
                  </label>
                  <input
                    id="excel-upload"
                    type="file"
                    ref={inputFileRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    className="hidden"
                  />
                </div>

                {/* Tampilkan nama file jika sudah dipilih */}
                {fileName && (
                  <div className="flex items-center gap-2 p-2 bg-gray-100 border rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {fileName}
                    </span>
                  </div>
                )}

                {/* Tombol preview data */}
                <Button
                  text="Preview Data"
                  type="default"
                  icon="find"
                  onClick={handleProcessUpload}
                  disabled={!fileToUpload}
                  elementAttr={{ class: "grid-add-button" }}
                />
              </div>

              {/* Grup 2: Tombol Download Template */}
              <a
                href={API_ENDPOINTS.penjualan.downloadTemplate}
                className="grid-secondary-button no-underline flex items-center justify-center text-sm"
                style={{ padding: "8px 16px", textDecoration: "none" }}
              >
                Download Template
              </a>
            </div>
          </div>

          {/* Preview data hasil upload */}
          {(previewDataHeader.length > 0 || previewDataDetail.length > 0) && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-bi-slate-700 mb-2">
                Data Preview
              </h3>
              <div className="mb-2">
                <Tabs
                  dataSource={tabItems}
                  selectedIndex={selectedTabIndex}
                  onItemClick={handleTabClick}
                />
              </div>
              {selectedTabIndex === 0 && (
                <DataGrid
                  dataSource={previewDataHeader}
                  keyExpr="rowNumber"
                  showBorders={true}
                  height={previewDataHeader.length >= 10 ? 380 : 220}
                  onRowPrepared={onRowPrepared}
                  columnAutoWidth={true}
                >
                  <Paging defaultPageSize={10} />
                  <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[5, 10, 20]}
                    showInfo={true}
                  />
                  {/* Kolom preview data */}
                  <Column
                    dataField="rowNumber"
                    caption="Baris"
                    alignment="center"
                    headerCellRender={() => renderHeader("Baris")}
                  />
                  <Column
                    dataField="jualh_kode"
                    caption="Kode"
                    headerCellRender={() => renderHeader("Kode")}
                  />
                  <Column
                    dataField="jualh_date"
                    caption="Tanggal Penjualan"
                    headerCellRender={() => renderHeader("Tanggal Penjualan")}
                    cellRender={renderDateCell}
                  />
                  <Column
                    dataField="outlet"
                    caption="Outlet"
                    headerCellRender={() => renderHeader("Outlet")}
                  />
                  <Column
                    dataField="sales"
                    caption="Sales"
                    headerCellRender={() => renderHeader("Sales")}
                  />
                  {/* Kolom status validasi */}
                  <Column
                    dataField="validationMessage"
                    caption="Status"
                    headerCellRender={() => renderHeader("Status")}
                    cellRender={({ data }) => {
                      const isValid = data.isValid;
                      const textColor = isValid
                        ? "text-green-600"
                        : "text-red-600";
                      const icon = isValid ? "✔" : "✖";
                      return (
                        <span className={`font-semibold ${textColor}`}>
                          {icon} {data.validationMessage}
                        </span>
                      );
                    }}
                  />
                </DataGrid>
              )}
              {selectedTabIndex === 1 && (
                <DataGrid
                  dataSource={previewDataDetail}
                  keyExpr="rowNumber"
                  showBorders={true}
                  height={previewDataDetail.length >= 10 ? 380 : 220}
                  onRowPrepared={onRowPrepared}
                  columnAutoWidth={true}
                >
                  <Paging defaultPageSize={10} />
                  <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[5, 10, 20]}
                    showInfo={true}
                  />
                  {/* Kolom preview data */}
                  <Column
                    dataField="rowNumber"
                    caption="Baris"
                    alignment="center"
                    headerCellRender={() => renderHeader("Baris")}
                  />
                  <Column
                    dataField="jualh_kode"
                    caption="Kode"
                    headerCellRender={() => renderHeader("Kode")}
                  />
                  <Column
                    dataField="barang"
                    caption="Barang"
                    headerCellRender={() => renderHeader("Barang")}
                  />
                  <Column
                    dataField="juald_harga"
                    caption="Harga"
                    headerCellRender={() => renderHeader("Harga")}
                  />
                  <Column
                    dataField="juald_qty"
                    caption="Qty"
                    headerCellRender={() => renderHeader("Qty")}
                  />
                  <Column
                    dataField="diskon"
                    caption="Diskon"
                    headerCellRender={() => renderHeader("Diskon")}
                  />
                  {/* Kolom status validasi */}
                  <Column
                    dataField="validationMessage"
                    caption="Status"
                    headerCellRender={() => renderHeader("Status")}
                    cellRender={({ data }) => {
                      const isValid = data.isValid;
                      const textColor = isValid
                        ? "text-green-600"
                        : "text-red-600";
                      const icon = isValid ? "✔" : "✖";
                      return (
                        <span className={`font-semibold ${textColor}`}>
                          {icon} {data.validationMessage}
                        </span>
                      );
                    }}
                  />
                </DataGrid>
              )}
            </div>
          )}

          {/* Tombol aksi bawah: Cancel dan Submit */}
          <div className="flex justify-end gap-4 pt-5 mt-5 border-t border-bi-slate-200">
            <Button
              text="Cancel"
              onClick={handleCancel}
              stylingMode="outlined"
              type="normal"
              disabled={isLoading}
            />
            <Button
              text="Submit Valid Data"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              type="default"
              elementAttr={{ class: "form-save-button" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PenjualanUploadPage;
