import React, { useCallback } from "react";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  Editing,
  RequiredRule,
  Pager,
  Toolbar,
  Item,
  Button as GridButton,
  HeaderFilter,
  MasterDetail,
} from "devextreme-react/data-grid";
// 1. Ganti impor ODataStore dengan createStore
import { createStore } from "devextreme-aspnet-data-nojquery";
import SalesDetailGrid from "./SalesDetailGrid";
import { API_ENDPOINTS } from "../../../config/apiConfig";
import notify from "devextreme/ui/notify";

// 2. Konfigurasi dataSource menggunakan createStore
// URL ini adalah placeholder. Ganti dengan endpoint API .NET MVC Anda.
const dataSource = createStore({
  key: "outlet_id", // Primary Key, pastikan sama dengan model di backend
  loadUrl: API_ENDPOINTS.outlets.get,
  insertUrl: API_ENDPOINTS.outlets.post,
  updateUrl: API_ENDPOINTS.outlets.put,
  deleteUrl: API_ENDPOINTS.outlets.delete,

  // Event ini akan dipanggil setelah server mengkonfirmasi data berhasil ditambah
  onInserted: () => {
    notify("Outlet created successfully", "success", 2000);
  },
  // Event ini akan dipanggil setelah server mengkonfirmasi data berhasil diubah
  onUpdated: () => {
    notify("Outlet updated successfully", "success", 2000);
  },
  // Event ini akan dipanggil setelah server mengkonfirmasi data berhasil dihapus
  onRemoved: () => {
    notify("Outlet deleted successfully", "success", 2000);
  },
});

const OutletsGrid = ({ onViewClick }) => {
  const onRowExpanding = useCallback((e) => {
    e.component.collapseAll(-1);
  }, []);

  return (
    <DataGrid
      dataSource={dataSource} // Gunakan dataSource yang baru
      height="100%"
      showBorders={true}
      rowAlternationEnabled={true}
      remoteOperations={true} // Flag untuk memberitahu grid agar semua operasi (pagination, filter, sorting) dilakukan di server.
      onRowExpanding={onRowExpanding}
    >
      <Toolbar>
        <Item location="before">
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 500 }}>
            Outlets
          </h2>
        </Item>
        <Item name="addRowButton" showText="inMenu" />
        <Item location="after" name="searchPanel" />
      </Toolbar>
      <SearchPanel visible={true} width={240} placeholder="Search..." />
      <FilterRow visible={true} />
      <HeaderFilter visible={true} />
      <Paging defaultPageSize={10} />
      <Pager
        showPageSizeSelector={true}
        allowedPageSizes={[5, 10, 20]}
        showInfo={true}
      />

      <Editing
        mode="popup"
        allowAdding={true}
        allowUpdating={true}
        allowDeleting={true}
        useIcons={true}
        popup={{
          title: "Outlet Info",
          showTitle: true,
          width: 700,
          height: 250, // Sesuaikan tinggi form
        }}
        form={{
          items: [
            // Cukup definisikan field di sini, tidak perlu grup
            { dataField: "outlet_kode" },
            { dataField: "outlet_nama" },
          ],
        }}
      />

      {/* 3. Sesuaikan kolom agar cocok dengan model data Outlets Anda */}
      <Column dataField="outlet_kode" caption="Kode Outlet">
        <RequiredRule />
      </Column>
      <Column dataField="outlet_nama" caption="Nama Outlet">
        <RequiredRule />
      </Column>
      <Column type="buttons" caption="Actions" width={110}>
        <GridButton
          icon="eyeopen" // Ikon mata untuk 'View'
          hint="View Details"
          // Saat diklik, panggil prop 'onViewClick' dengan data baris lengkap
          onClick={(e) => onViewClick(e.row.data)}
        />
        <GridButton name="edit" />
        <GridButton name="delete" />
      </Column>

      <MasterDetail enabled={true} component={SalesDetailGrid} />
    </DataGrid>
  );
};

export default OutletsGrid;
