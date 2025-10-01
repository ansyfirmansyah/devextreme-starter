import React from "react";
import { DeleteIcon, EditIcon, ViewIcon } from "../icon/actionCellIcon";
import { usePermissions } from "../../hooks/usePermissions";

// SVG Ikon bisa juga dibuat komponen terpisah jika ingin lebih rapi,
// tapi untuk contoh ini kita taruh inline.

const ActionCell = ({
  onView,
  onEdit,
  onDelete,
  editPermissionCode,
  deletePermissionCode,
}) => {
  const { hasPermission } = usePermissions();

  return (
    <div className="flex items-center justify-center h-full gap-2">
      {/* Tombol View (Mata) - Tidak perlu permisiion karena selalu tampil */}
      <button
        onClick={onView}
        title="View Details"
        className="p-1 text-bi-slate-500 rounded-full hover:bg-bi-blue-100 hover:text-bi-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bi-blue-500 transition-colors"
      >
        <ViewIcon />
      </button>

      {/* Tombol Edit (Pensil) - Tampil jika punya hak */}
      {hasPermission(editPermissionCode) && (
        <button
          onClick={onEdit}
          title="Edit Data"
          className="p-1 text-bi-slate-500 rounded-full hover:bg-bi-blue-100 hover:text-bi-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bi-blue-500 transition-colors"
        >
          <EditIcon />
        </button>
      )}

      {/* Tombol Delete (Sampah) - Tampil jika punya hak */}
      {hasPermission(deletePermissionCode) && (
        <button
          onClick={onDelete}
          title="Delete Data"
          className="p-1 text-red-500 rounded-full hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default ActionCell;
