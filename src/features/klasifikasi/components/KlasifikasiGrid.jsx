import React from "react";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
} from "devextreme-react/data-grid";
import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from "../../../config/apiConfig";

import PageHeader from "../../../components/ui/GridHeader";
import ActionCell from "../../../components/ui/ActionCell";
import { TreeList } from "devextreme-react";

// Buat store untuk DataGrid dan ekspor untuk digunakan di KlasifikasiPage
export const klasifikasiStore = createStore({
  // primary key disesuaikan dengan nama primary key di tabel database
  key: "klas_id",
  // List API yang digunakan untuk operasi CRUD
  loadUrl: API_ENDPOINTS.klasifikasi.get,
  insertUrl: API_ENDPOINTS.klasifikasi.post,
  updateUrl: API_ENDPOINTS.klasifikasi.put,
  deleteUrl: API_ENDPOINTS.klasifikasi.delete,
  // Event handler untuk menampilkan notifikasi
  onInserted: () => notify("Data created successfully", "success", 2000),
  onUpdated: () => notify("Data updated successfully", "success", 2000),
  onRemoved: () => notify("Data deleted successfully", "success", 2000),
});

const KlasifikasiGrid = ({
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
        onView={() => onViewClick(data.klas_id)}
        onEdit={() => onEditClick(data.klas_id)}
        onDelete={() => onDeleteClick(data.klas_id)}
      />
    );
  };

  return (
    <TreeList
      dataSource={dataSource}
      height="100%"
      showBorders={true}
      rowAlternationEnabled={true}
      remoteOperations={true}
      keyExpr="klas_id"
      parentIdExpr="klas_parent_id"
      rootValue={null}
    >
      // Header grid dengan tombol Add
      <PageHeader
        title="Klasifikasi Management"
        buttonText="Add Klasifikasi"
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
      <Column dataField="klas_kode" caption="Kode Klasifikasi"></Column>
      <Column dataField="klas_nama" caption="Nama Klasifikasi"></Column>
      <Column dataField="klas_parent_display" caption="Induk"></Column>
      <Column
        caption="Actions"
        width={120}
        alignment="center"
        cellRender={renderActionCell}
        allowFiltering={false}
        allowSorting={false}
      />
    </TreeList>
  );
};

export default KlasifikasiGrid;
