import React, { useState } from "react";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";
import { useNavigate, useLocation } from "react-router-dom";
import { confirm } from "devextreme/ui/dialog";

import ActionCell from "../../../components/ui/ActionCell";
import { penjualanStore } from "../../../services/penjualanService";
import {
  renderDateCell,
  renderHeader,
} from "../../../components/ui/GridCellRenderers";
import { GridHeaderWithUpload } from "../../../components/ui/GridHeader";

/**
 * Komponen grid utama untuk fitur Penjualan.
 * Menampilkan data penjualan dalam bentuk tabel dengan fitur:
 * - Paging, filtering, search, dan header filter
 * - Tombol aksi (Add, Upload, View, Edit, Delete)
 * - Sinkronisasi page index saat navigasi
 */
const PenjualanGrid = () => {
  // DataSource hanya dibuat sekali untuk mencegah masalah pada DataGrid
  const [penjualanDataSource] = useState(() => new DataSource(penjualanStore));
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk menyimpan page index terakhir (agar tetap di halaman yang sama saat kembali)
  const [currentPageIndex, setCurrentPageIndex] = useState(
    location.state?.pageIndex || 0
  );

  /**
   * Handler untuk sinkronisasi page index saat halaman di grid berubah.
   * Disimpan ke state agar bisa dikembalikan saat navigasi.
   */
  const handleOptionChange = (e) => {
    if (e.fullName === "paging.pageIndex") {
      setCurrentPageIndex(e.value);
    }
  };

  // Handler untuk tombol aksi grid
  const handleAdd = () => navigate("new");
  const handleUpload = () => navigate("upload");
  const handleView = (id) => {
    // Simpan pageIndex ke state saat navigasi ke detail
    navigate(`${id}`, { state: { pageIndex: currentPageIndex } });
  };
  const handleEdit = (id) => {
    // Simpan pageIndex ke state saat navigasi ke edit
    navigate(`${id}/edit`, { state: { pageIndex: currentPageIndex } });
  };
  const handleDelete = async (id) => {
    // Konfirmasi sebelum hapus data
    const result = await confirm(
      "Are you sure you want to delete this data?",
      "Confirm Deletion"
    );
    if (result) {
      try {
        await penjualanStore.remove(id);
        await penjualanDataSource.reload();
      } catch (err) {
        notify(err?.message || "Failed to delete data.", "error", 3000);
      }
    }
  };

  /**
   * Render cell untuk kolom aksi (view, edit, delete).
   * Dikirim ke komponen ActionCell.
   */
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.jualh_id)}
        onEdit={() => handleEdit(data.jualh_id)}
        onDelete={() => handleDelete(data.jualh_id)}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataGrid
        dataSource={penjualanDataSource}
        height="100%"
        showBorders={false}
        rowAlternationEnabled={true}
        remoteOperations={true}
        onOptionChanged={handleOptionChange}
      >
        {/* Header grid dengan tombol Add dan Upload */}
        <GridHeaderWithUpload
          title="Penjualan"
          buttonText="Add Penjualan"
          onButtonClick={handleAdd}
          buttonTextUpload="Upload Penjualan"
          onButtonClickUpload={handleUpload}
        />
        {/* Panel pencarian */}
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        {/* Filter baris dan header */}
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        {/* Paging dan Pager */}
        <Paging defaultPageSize={5} pageIndex={currentPageIndex} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />
        {/* Kolom-kolom utama */}
        <Column
          dataField="jualh_kode"
          caption="Kode"
          headerCellRender={() => renderHeader("Kode")}
        />
        <Column
          dataField="jualh_date"
          caption="Tanggal Penjualan"
          dataType="date"
          cellRender={renderDateCell}
          headerCellRender={() => renderHeader("Tanggal Penjualan")}
        />
        <Column
          dataField="outlet_display"
          caption="Outlet"
          headerCellRender={() => renderHeader("Outlet")}
        />
        <Column
          dataField="sales_display"
          caption="Sales"
          headerCellRender={() => renderHeader("Sales")}
        />
        {/* Kolom aksi */}
        <Column
          caption="Actions"
          width={120}
          alignment="center"
          cellRender={renderActionCell}
          allowFiltering={false}
          allowSorting={false}
          headerCellRender={() => renderHeader("Actions")}
        />
      </DataGrid>
    </div>
  );
};

export default PenjualanGrid;
