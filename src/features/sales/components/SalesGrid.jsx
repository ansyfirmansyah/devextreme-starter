import React from "react";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  Editing,
  RequiredRule,
  Toolbar,
  Item,
  Scrolling,
  HeaderFilter,
  Lookup,
  Pager, // 1. Impor komponen Lookup
} from "devextreme-react/data-grid";
import { createStore } from "devextreme-aspnet-data-nojquery";
import notify from "devextreme/ui/notify";

import { API_ENDPOINTS } from "../../../config/apiConfig"; // (Asumsi kita tambahkan endpoint sales)

import PageHeader from "../../../components/ui/GridHeader";
import ActionCell from "../../../components/ui/ActionCell";

// EKSPOR dataSource agar bisa diimpor di file lain
export const salesStore = createStore({
  key: "sales_id",
  loadUrl: API_ENDPOINTS.sales.get,
  insertUrl: API_ENDPOINTS.sales.post,
  updateUrl: API_ENDPOINTS.sales.put,
  deleteUrl: API_ENDPOINTS.sales.delete,
  onInserted: () => notify("Sales created successfully", "success", 2000),
  onUpdated: () => notify("Sales updated successfully", "success", 2000),
  onRemoved: () => notify("Sales deleted successfully", "success", 2000),
});

const SalesGrid = ({ dataSource, onAddClick, onViewClick, onEditClick, onDeleteClick }) => {
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => onViewClick(data.sales_id)}
        onEdit={() => onEditClick(data.sales_id)}
        onDelete={() => onDeleteClick(data.sales_id)}
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
      <PageHeader
        title="Sales"
        buttonText="Add Sales"
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

      <Column dataField="sales_kode" caption="Kode Sales">
        <RequiredRule />
      </Column>
      <Column dataField="sales_nama" caption="Nama Sales">
        <RequiredRule />
      </Column>
      <Column dataField="outlet_display" caption="Outlet">
        <RequiredRule />
      </Column>

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

export default SalesGrid;
