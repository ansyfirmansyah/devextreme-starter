import React from "react";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { salesByOutletStore } from "../../../services/outletService";

// Komponen ini menerima 'outletData' dari master grid sebagai prop
const SalesDetailGrid = ({ data: masterRawData }) => {
  return (
    <div style={{ padding: "0px 20px" }}>
      <h4>Daftar Sales untuk Outlet: {masterRawData.data.outlet_kode}</h4>
      <DataGrid
        dataSource={salesByOutletStore(masterRawData.key)}
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
