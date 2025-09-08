import React from "react";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { diskonDataSource, outletDataSource } from "../../../services/barangService";

// Komponen ini menerima 'outletData' dari master grid sebagai prop
const DetailGrid = ({ data: masterRawData }) => {
  return (
    <div style={{ padding: "0px 20px" }}>
      <h4>Daftar Outlet untuk Barang: {masterRawData.data.barang_nama}</h4>
      <DataGrid
        dataSource={outletDataSource(masterRawData)}
        showBorders={true}
        columnAutoWidth={true}
        remoteOperations={true}
      >
        <Paging defaultPageSize={5} />
        <Column dataField="outlet_kode" caption="Kode Outlet" />
        <Column dataField="outlet_nama" caption="Nama Outlet" />
      </DataGrid>
      <h4>Daftar Diskon untuk Barang: {masterRawData.data.barang_nama}</h4>
      <DataGrid
        dataSource={diskonDataSource(masterRawData)}
        showBorders={true}
        columnAutoWidth={true}
        remoteOperations={true}
      >
        <Paging defaultPageSize={5} />
        <Column dataField="barangd_qty" caption="Kuantitas" />
        <Column dataField="barangd_disc" caption="Diskon" />
      </DataGrid>
    </div>
  );
};

export default DetailGrid;
