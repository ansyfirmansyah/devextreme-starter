import React, { useState } from "react";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
  MasterDetail,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";
import { useNavigate } from "react-router-dom";
import { confirm } from "devextreme/ui/dialog";

import PageHeader from "../../../components/ui/GridHeader";
import ActionCell from "../../../components/ui/ActionCell";
import DetailGrid from "./DetailGrid";
import { barangStore } from "../../../services/barangService";

const BarangGrid = () => {
  // Gunakan useState untuk membuat DataSource sekali saja
  // Ini mencegah pembuatan ulang DataSource pada setiap render
  // yang bisa menyebabkan masalah pada DataGrid
  const [barangDataSource] = useState(() => new DataSource(barangStore));
  const navigate = useNavigate();

  /* Handler untuk tombol Add, View, Edit, Delete */
  const handleAdd = () => navigate("new");
  const handleView = (id) => navigate(`${id}`);
  const handleEdit = (id) => navigate(`${id}/edit`);
  const handleDelete = async (id) => {
    const result = await confirm(
      "Are you sure you want to delete this data?",
      "Confirm Deletion"
    );
    if (result) {
      try {
        await barangStore.remove(id);
        await barangDataSource.reload();
      } catch (err) {
        notify(err?.message || "Failed to delete data.", "error", 3000);
      }
    }
  };

  // Render cell untuk kolom aksi (view, edit, delete)
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.barang_id)}
        onEdit={() => handleEdit(data.barang_id)}
        onDelete={() => handleDelete(data.barang_id)}
      />
    );
  };

  return (
    <DataGrid
      dataSource={barangDataSource}
      height="100%"
      showBorders={true}
      rowAlternationEnabled={true}
      remoteOperations={true}
    >
      // Header grid dengan tombol Add
      <PageHeader
        title="Master Barang"
        buttonText="Add Barang"
        onButtonClick={handleAdd}
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
