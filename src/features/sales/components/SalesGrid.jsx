import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

import ActionCell from "../../../components/ui/ActionCell";
import { salesStore } from "../../../services/salesService";
import { GridHeaderWithUpload } from "../../../components/ui/GridHeader";
import { navigationRoutes } from "../../../config/navigationConfig";

const SalesGrid = () => {
  // Gunakan useState untuk membuat DataSource sekali saja
  // Ini mencegah pembuatan ulang DataSource pada setiap render
  // yang bisa menyebabkan masalah pada DataGrid
  const [salesDataSource] = useState(() => new DataSource(salesStore));
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil permissions dari navigationConfig
  const permissions = useMemo(
    () =>
      navigationRoutes.find((route) => route.path === "/sales")?.permissions ||
      {},
    []
  );

  // State untuk menyimpan page index terakhir (agar tetap di halaman yang sama saat kembali)
  const [currentPageIndex, setCurrentPageIndex] = useState(
    location.state?.pageIndex || 0
  );

  /**
   * Handler untuk sinkronisasi page index saat halaman di grid berubah.
   * Disimpan ke state agar bisa dikembalikan saat navigasi.
   */
  const handleOptionChange = (e) => {
    if (e.fullName === "paging.pageIndex") {
      setCurrentPageIndex(e.value);
    }
  };

  /* Handler untuk tombol Add, View, Edit, Delete */
  const handleAdd = () =>
    navigate("new", { state: { pageIndex: currentPageIndex } });
  const handleUpload = () => navigate("upload");
  const handleView = (id) => {
    // Simpan pageIndex ke state saat navigasi ke detail
    navigate(`${id}`, { state: { pageIndex: currentPageIndex } });
  };
  const handleEdit = (id) => {
    // Simpan pageIndex ke state saat navigasi ke edit
    navigate(`${id}/edit`, { state: { pageIndex: currentPageIndex } });
  };
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
        editPermissionCode={permissions.edit}
        deletePermissionCode={permissions.delete}
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
        onOptionChanged={handleOptionChange}
      >
        // Header grid dengan tombol Add
        <GridHeaderWithUpload
          title="Sales"
          buttonText="Add Sales"
          onButtonClick={handleAdd}
          buttonTextUpload="Upload Sales"
          onButtonClickUpload={handleUpload}
          addPermissionCode={permissions.create}
          uploadPermissionCode={permissions.upload}
        />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Paging defaultPageSize={10} pageIndex={currentPageIndex} />
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
