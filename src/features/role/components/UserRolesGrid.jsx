import React, { useMemo, useState } from "react";
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
import { navigationRoutes } from "../../../config/navigationConfig";
import { usePermissions } from "../../../hooks/usePermissions";
import { userRoleStore } from "../../../services/userService";

const UserRolesGrid = () => {
  const [userRoleDataSource] = useState(() => new DataSource(userRoleStore));
  const navigate = useNavigate();

  // Ambil permissions dari navigationConfig
  const permissions = useMemo(
    () =>
      navigationRoutes.find((route) => route.path === "/roles")?.permissions ||
      {},
    []
  );

  // const handleAdd = () => navigate("new"); // Nonaktifkan tombol tambah user role
  const handleView = (id) => navigate(`user/${id}`);
  const handleEdit = (id) => navigate(`user/${id}/edit`);
  // tidak ada handleDelete karena user role tidak bisa dihapus langsung

  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.userId)}
        onEdit={() => handleEdit(data.userId)}
        editPermissionCode={permissions.edit}
        deletePermissionCode={"disabled"} // Nonaktifkan tombol hapus user role
      />
    );
  };

  const renderRoleCell = ({ data }) => {
    // Pastikan ada data roleNames dan merupakan array
    if (!data.roles || !Array.isArray(data.roles) || data.roles.length === 0) {
      return <span className="text-gray-400 italic">No roles</span>;
    }

    // Map setiap nama role menjadi sebuah 'badge'
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {data.roles.map((role, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            {role}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataGrid
        dataSource={userRoleDataSource}
        height="100%"
        showBorders={true}
        rowAlternationEnabled={true}
        remoteOperations={true}
      >
        <PageHeader
          title="User Role List"
          buttonText="Add"
          onButtonClick={null} // Nonaktifkan tombol tambah user role
          addPermissionCode={"disabled"} // Nonaktifkan tombol tambah user role
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
        <Column
          dataField="userId"
          caption="User ID"
          headerCellRender={() => renderHeader("User ID")}
        />
        <Column
          dataField="userName"
          caption="User Name"
          headerCellRender={() => renderHeader("User Name")}
        />
        <Column
          dataField="userEmail"
          caption="User Email"
          headerCellRender={() => renderHeader("Email")}
        />
        <Column
          dataField="roles"
          caption="Roles"
          allowSorting={false}
          allowFiltering={false}
          headerCellRender={() => renderHeader("Roles")}
          cellRender={renderRoleCell}
        />
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

export default UserRolesGrid;
