import React from "react";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
  MasterDetail,
} from "devextreme-react/data-grid";
import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from "../../../config/apiConfig";

import PageHeader from "../../../components/ui/GridHeader";
import ActionCell from "../../../components/ui/ActionCell";
import DetailGrid from "./DetailGrid";

// Buat store untuk DataGrid dan ekspor untuk digunakan di BarangPage
export const barangStore = createStore({
  // primary key disesuaikan dengan nama primary key di tabel database
  key: "barang_id",
  // List API yang digunakan untuk operasi CRUD
  loadUrl: API_ENDPOINTS.barang.get,
  insertUrl: API_ENDPOINTS.barang.post,
  updateUrl: API_ENDPOINTS.barang.put,
  deleteUrl: API_ENDPOINTS.barang.delete,
  // Event handler untuk menampilkan notifikasi
  onInserted: () => notify("Data created successfully", "success", 2000),
  onUpdated: () => notify("Data updated successfully", "success", 2000),
  onRemoved: () => notify("Data deleted successfully", "success", 2000),
});

const BarangGrid = ({
  dataSource,
  onAddClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
}) => {
  // Render cell untuk kolom aksi (view, edit, delete)
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => onViewClick(data.barang_id)}
        onEdit={() => onEditClick(data.barang_id)}
        onDelete={() => onDeleteClick(data.barang_id)}
      />
    );
  };

  return (
    <DataGrid
      dataSource={dataSource}
      height="100%"
      showBorders={true}
      rowAlternationEnabled={true}
      remoteOperations={true}
    >
      // Header grid dengan tombol Add
      <PageHeader
        title="Master Barang"
        buttonText="Add Barang"
        onButtonClick={onAddClick}
      />
      <SearchPanel visible={true} width={240} placeholder="Search..." />
      <FilterRow visible={true} />
      <HeaderFilter visible={true} />
      <Paging defaultPageSize={10} />
      <Pager
        showPageSizeSelector={true}
        allowedPageSizes={[5, 10, 20]}
        showInfo={true}
      />
      <Column dataField="barang_kode" caption="Kode"></Column>
      <Column dataField="barang_nama" caption="Nama Barang"></Column>
      <Column dataField="klasifikasi_display" caption="Klasifikasi"></Column>
      <Column
        caption="Actions"
        width={120}
        alignment="center"
        cellRender={renderActionCell}
        allowFiltering={false}
        allowSorting={false}
      />
      <MasterDetail enabled={true} component={DetailGrid} />
    </DataGrid>
  );
};

export default BarangGrid;
