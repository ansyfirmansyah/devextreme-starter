import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Perbaiki impor: Semua komponen terkait TreeList diimpor dari 'devextreme-react/tree-list'
import {
  TreeList,
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
} from "devextreme-react/tree-list";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import DataSource from "devextreme/data/data_source";

// 2. Perbaiki path impor dengan menambahkan ekstensi file
import PageHeader from "../../../components/ui/GridHeader";
import ActionCell from "../../../components/ui/ActionCell";
import { klasifikasiStore } from "../../../services/klasifikasiService";

const KlasifikasiGrid = () => {
  // Gunakan useState untuk membuat DataSource sekali saja
  // Ini mencegah pembuatan ulang DataSource pada setiap render
  // yang bisa menyebabkan masalah pada TreeList
  const [klasifikasiDataSource] = useState(
    () => new DataSource(klasifikasiStore)
  );
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
        await klasifikasiStore.remove(id);
        await klasifikasiDataSource.reload();
      } catch (err) {
        notify(err?.message || "Failed to delete data.", "error", 3000);
      }
    }
  };

  // Render fungsi khusus untuk kolom Actions
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.klas_id)}
        onEdit={() => handleEdit(data.klas_id)}
        onDelete={() => handleDelete(data.klas_id)}
      />
    );
  };

  return (
    <TreeList
      dataSource={klasifikasiDataSource}
      height="100%"
      showBorders={true}
      rowAlternationEnabled={true}
      remoteOperations={true}
      keyExpr="klas_id"
      parentIdExpr="klas_parent_id"
      rootValue={null}
    >
      <PageHeader
        title="Klasifikasi Management"
        buttonText="Add Klasifikasi"
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

