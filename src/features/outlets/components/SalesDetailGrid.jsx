import React from "react";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { API_ENDPOINTS } from "../../../config/apiConfig";

// Komponen ini menerima 'outletData' dari master grid sebagai prop
const SalesDetailGrid = ({ data: masterRawData }) => {

  // Buat data source baru untuk detail grid ini.
  // Perhatikan bagaimana kita menambahkan 'outletId' sebagai parameter tambahan.
  const salesDataSource = createStore({
    key: "sales_id",
    loadUrl: API_ENDPOINTS.outlets.getSales,
    // Tambahkan parameter kustom yang akan selalu dikirim saat load data
    loadParams: {
      outletId: masterRawData.key, // 'outletData.key' berisi ID dari baris master (outlet)
    },
  });

  return (
    <div style={{ padding: "0px 20px" }}>
      <h4>Daftar Sales untuk Outlet: {masterRawData.data.outlet_kode}</h4>
      <DataGrid
        dataSource={salesDataSource}
        showBorders={true}
        columnAutoWidth={true}
        remoteOperations={true}
      >
        <Paging defaultPageSize={5} />
        <Column dataField="sales_kode" caption="Kode Sales" />
        <Column dataField="sales_nama" caption="Nama Sales" />
      </DataGrid>
    </div>
  );
};

export default SalesDetailGrid;
