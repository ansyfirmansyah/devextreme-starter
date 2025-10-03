import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
  Export,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import DataSource from "devextreme/data/data_source";

// Library untuk export PDF dan Excel
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportDataGridToXlsx } from "devextreme/excel_exporter";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import saveAs from "file-saver";

import ActionCell from "../../../components/ui/ActionCell";
import { salesStore } from "../../../services/salesService";
import { GridHeaderWithUpload } from "../../../components/ui/GridHeader";
import { navigationRoutes } from "../../../config/navigationConfig";

const SalesGrid = () => {
  // Gunakan useState untuk membuat DataSource sekali saja
  // Ini mencegah pembuatan ulang DataSource pada setiap render
  // yang bisa menyebabkan masalah pada DataGrid
  const [salesDataSource] = useState(() => new DataSource(salesStore));
  const navigate = useNavigate();

  // Gunakan useSearchParams untuk interaksi dengan URL query params
  const [searchParams, setSearchParams] = useSearchParams();

  // Fungsi untuk membaca page index dari URL saat komponen pertama kali dimuat
  const getInitialPageIndex = () => {
    const pageParam = searchParams.get("page");
    const pageNumber = parseInt(pageParam, 10);
    // URL menggunakan page=1, page=2, sedangkan DataGrid 0-indexed
    return !isNaN(pageNumber) && pageNumber > 0 ? pageNumber - 1 : 0;
  };

  // State untuk menyimpan page index terakhir (agar tetap di halaman yang sama saat kembali)
  const [currentPageIndex, setCurrentPageIndex] = useState(getInitialPageIndex);
  useEffect(() => {
    const pageParam = searchParams.get("page");
    // Parse pageParam menjadi integer, 10 adalah radix untuk desimal agar tidak menjadi oktal atau hex
    const pageNumber = parseInt(pageParam, 10);
    const pageIndexFromUrl =
      !isNaN(pageNumber) && pageNumber > 0 ? pageNumber - 1 : 0;

    // Sinkronkan state komponen jika berbeda dengan URL
    if (pageIndexFromUrl !== currentPageIndex) {
      setCurrentPageIndex(pageIndexFromUrl);
    }
  }, [searchParams]); // Efek ini akan berjalan setiap kali query parameter URL berubah

  /**
   * Handler untuk sinkronisasi page index saat halaman di grid berubah.
   * Disimpan ke state agar bisa dikembalikan saat navigasi.
   */
  const handleOptionChange = (e) => {
    if (e.fullName === "paging.pageIndex") {
      const newPageIndex = e.value;
      setCurrentPageIndex(newPageIndex);
      // Update URL. Tambah 1 agar URL lebih user-friendly (page=1, page=2, dst.)
      setSearchParams({ page: (newPageIndex + 1).toString() });
    }
  };

  // Ambil permissions dari navigationConfig
  const permissions = useMemo(
    () =>
      navigationRoutes.find((route) => route.path === "/sales")?.permissions ||
      {},
    []
  );

  /* Handler untuk tombol Add, View, Edit, Delete */
  const handleAdd = () => navigate("new");
  const handleView = (id) => navigate(`${id}`);
  const handleEdit = (id) => navigate(`${id}/edit`);
  const handleUpload = () => navigate("upload");
  const handleDelete = async (id) => {
    const result = await confirm(
      "Are you sure you want to delete this data?",
      "Confirm Deletion"
    );
    if (result) {
      try {
        await salesStore.remove(id);
        await salesDataSource.reload();
      } catch (err) {
        notify(err?.message || "Failed to delete data.", "error", 3000);
      }
    }
  };

  // Handler eksport data
  const onExporting = (e) => {
    e.cancel = true; // Selalu batalkan proses default
    console.log("masuk 1 pada jam: ", new Date().toISOString());

    // Buat datasource sementara untuk mengambil semua data
    const tempDataSource = new DataSource({
      store: salesStore,
      filter: salesDataSource.filter(),
      sort: salesDataSource.sort(),
      paginate: false,
      requireTotalCount: false,
    });

    console.log("masuk 2 pada jam: ", new Date().toISOString());
    // notify("Mempersiapkan data untuk ekspor...", "info", 2000);

    const cekData = tempDataSource.load();
    console.log("cek data", cekData);

    tempDataSource
      .load()
      .then((allData) => {
        console.log("masuk 3 pada jam: ", new Date().toISOString());
        if (e.format === "xlsx") {
          // --- LOGIKA UNTUK EXCEL ---
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Sales");
          exportDataGridToXlsx({
            component: e.component,
            worksheet: worksheet,
            autoFilterEnabled: true,
            dataSource: allData,
          }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
              saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                "SalesData.xlsx"
              );
            });
            notify("Ekspor ke Excel berhasil!", "success", 2000);
          });
        } else if (e.format === "pdf") {
          // --- LOGIKA UNTUK PDF ---
          const doc = new jsPDF();
          exportDataGridToPdf({
            jsPDFDocument: doc,
            component: e.component,
            dataSource: allData,
          }).then(() => {
            doc.save("SalesData.pdf");
            notify("Ekspor ke PDF berhasil!", "success", 2000);
          });
        } else if (e.format === "csv") {
          // --- LOGIKA UNTUK CSV ---
          // DevExtreme tidak punya fungsi CSV bawaan, kita buat manual sederhana
          const header = e.component
            .getVisibleColumns()
            .map((c) => c.caption || c.dataField)
            .join(",");
          const rows = allData
            .map((row) =>
              e.component
                .getVisibleColumns()
                .map((c) => row[c.dataField])
                .join(",")
            )
            .join("\\n");

          const csvContent = `${header}\\n${rows}`;
          saveAs(
            new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
            "SalesData.csv"
          );
          notify("Ekspor ke CSV berhasil!", "success", 2000);
        }
      })
      .catch((err) => {
        notify("Gagal mengambil semua data untuk ekspor.", "error", 3000);
      });
  };

  // Render fungsi khusus untuk kolom Actions
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.sales_id)}
        onEdit={() => handleEdit(data.sales_id)}
        onDelete={() => handleDelete(data.sales_id)}
        editPermissionCode={permissions.edit}
        deletePermissionCode={permissions.delete}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataGrid
        dataSource={salesDataSource}
        onExporting={onExporting}
        height="100%"
        showBorders={true}
        rowAlternationEnabled={true}
        remoteOperations={true}
        onOptionChanged={handleOptionChange}
      >
        // Header grid dengan tombol Add
        <GridHeaderWithUpload
          title="Sales"
          buttonText="Add Sales"
          onButtonClick={handleAdd}
          buttonTextUpload="Upload Sales"
          onButtonClickUpload={handleUpload}
          addPermissionCode={permissions.create}
          uploadPermissionCode={permissions.upload}
        />
        <Export enabled={true} formats={['xlsx', 'pdf', 'csv']} />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Paging defaultPageSize={5} pageIndex={currentPageIndex} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />
        <Column dataField="sales_kode" caption="Kode Sales"></Column>
        <Column dataField="sales_nama" caption="Nama Sales"></Column>
        <Column dataField="outlet_display" caption="Outlet"></Column>
        <Column
          caption="Actions"
          width={120}
          alignment="center"
          cellRender={renderActionCell}
          allowFiltering={false}
          allowSorting={false}
        />
      </DataGrid>
    </div>
  );
};

export default SalesGrid;
