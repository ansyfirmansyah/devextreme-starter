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
import { roleStore } from "../../../services/roleService";
import { renderHeader } from "../../../components/ui/GridCellRenderers";

const RolesGrid = () => {
  const [roleDataSource] = useState(() => new DataSource(roleStore));
  const navigate = useNavigate();

  const handleAdd = () => navigate("new");
  const handleView = (id) => navigate(`${id}`); 
  const handleEdit = (id) => navigate(`${id}/edit`); 
  const handleDelete = async (id) => {
    const result = await confirm(
      "Apakah Anda yakin ingin menghapus role ini?",
      "Konfirmasi Hapus"
    );
    if (result) {
      try {
        await roleStore.remove(id);
        await roleDataSource.reload();
      } catch (err) {
        notify(err?.message || "Gagal menghapus data.", "error", 3000);
      }
    }
  };

  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.roleId)}
        onEdit={() => handleEdit(data.roleId)}
        onDelete={() => handleDelete(data.roleId)}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataGrid
        dataSource={roleDataSource}
        height="100%"
        showBorders={true}
        rowAlternationEnabled={true}
        remoteOperations={true}
      >
        <PageHeader
          title="Manajemen Role"
          buttonText="Tambah Role"
          onButtonClick={handleAdd}
        />
        <SearchPanel visible={true} width={240} placeholder="Cari..." />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />
        <Column dataField="roleId" caption="Role ID" headerCellRender={() => renderHeader("Role")}/>
        <Column dataField="roleCatatan" caption="Catatan" headerCellRender={() => renderHeader("Description")}/>
        <Column
          caption="Aksi"
          width={120}
          alignment="center"
          cellRender={renderActionCell}
          allowFiltering={false}
          allowSorting={false}
          headerCellRender={() => renderHeader("Actions")}
        />
      </DataGrid>
    </div>
  );
};

export default RolesGrid;