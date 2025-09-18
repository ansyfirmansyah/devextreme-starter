import React, { useCallback, useState } from "react";
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
  StringLengthRule,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";

import SalesDetailGrid from "./SalesDetailGrid";
import { outletStore } from "../../../services/outletService";
import { GridHeaderWithAddInMenu } from "../../../components/ui/GridHeader";

const OutletsGrid = ({ onViewClick }) => {
  // init data source sekali saja karena untuk kebutuhan datagrid
  // sehingga bisa cek kondisi terkini, misal: halaman yang saat ini dibuka
  const [outletDataSource] = useState(() => new DataSource(outletStore));

  const onRowExpanding = useCallback((e) => {
    e.component.collapseAll(-1);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataGrid
        dataSource={outletDataSource}
        height="100%"
        showBorders={true}
        rowAlternationEnabled={true}
        remoteOperations={true} // Flag untuk memberitahu grid agar semua operasi (pagination, filter, sorting) dilakukan di server.
        onRowExpanding={onRowExpanding}
      >
        <GridHeaderWithAddInMenu title="Outlets" />
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
          <StringLengthRule max={10} message="Kode max 10 karakter" />
        </Column>
        <Column dataField="outlet_nama" caption="Nama Outlet">
          <RequiredRule />
          <StringLengthRule max={100} message="Nama max 10 karakter" />
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
    </div>
  );
};

export default OutletsGrid;
