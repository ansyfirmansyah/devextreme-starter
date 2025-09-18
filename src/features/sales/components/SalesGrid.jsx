import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import DataSource from "devextreme/data/data_source";

import PageHeader from "../../../components/ui/GridHeader";
import ActionCell from "../../../components/ui/ActionCell";
import { salesStore } from "../../../services/salesService";

const SalesGrid = () => {
  // Gunakan useState untuk membuat DataSource sekali saja
  // Ini mencegah pembuatan ulang DataSource pada setiap render
  // yang bisa menyebabkan masalah pada DataGrid
  const [salesDataSource] = useState(() => new DataSource(salesStore));
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
        await salesStore.remove(id);
        await salesDataSource.reload();
      } catch (err) {
        notify(err?.message || "Failed to delete data.", "error", 3000);
      }
    }
  };

  // Render fungsi khusus untuk kolom Actions
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.sales_id)}
        onEdit={() => handleEdit(data.sales_id)}
        onDelete={() => handleDelete(data.sales_id)}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataGrid
        dataSource={salesDataSource}
        height="100%"
        showBorders={true}
        rowAlternationEnabled={true}
        remoteOperations={true}
      >
        // Header grid dengan tombol Add
        <PageHeader
          title="Sales"
          buttonText="Add Sales"
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
