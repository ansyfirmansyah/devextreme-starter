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
import { penjualanStore } from "../../../services/penjualanService";

const PenjualanGrid = () => {
  // Gunakan useState untuk membuat DataSource sekali saja
  // Ini mencegah pembuatan ulang DataSource pada setiap render
  // yang bisa menyebabkan masalah pada DataGrid
  const [penjualanDataSource] = useState(() => new DataSource(penjualanStore));
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
        await penjualanStore.remove(id);
        await penjualanDataSource.reload();
      } catch (err) {
        notify(err?.message || "Failed to delete data.", "error", 3000);
      }
    }
  };

  // Render cell untuk kolom aksi (view, edit, delete)
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
    <DataGrid
      dataSource={penjualanDataSource}
      height="100%"
      showBorders={true}
      rowAlternationEnabled={true}
      remoteOperations={true}
    >
      // Header grid dengan tombol Add
      <PageHeader
        title="Penjualan"
        buttonText="Add Penjualan"
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
      <Column dataField="jualh_kode" caption="Kode"></Column>
      <Column dataField="jualh_date" caption="Tanggal Penjualan" dataType="date" format="dd-MMM-yyyy"></Column>
      <Column dataField="outlet_display" caption="Outlet"></Column>
      <Column dataField="sales_display" caption="Sales"></Column>
      <Column
        caption="Actions"
        width={120}
        alignment="center"
        cellRender={renderActionCell}
        allowFiltering={false}
        allowSorting={false}
      />
    </DataGrid>
  );
};

export default PenjualanGrid;
