import React from "react";
import { Toolbar, Item } from "devextreme-react/data-grid";
import { usePermissions } from "../../hooks/usePermissions";

/**
 * Komponen header grid standar.
 * Menampilkan judul, tombol "Add", dan search panel.
 * @param {string} title - Judul grid
 * @param {string} buttonText - Teks tombol "Add"
 * @param {function} onButtonClick - Handler klik tombol "Add"
 * @param {string} addPermissionCode - Kode hak akses untuk menampilkan tombol "Add"
 */
const GridHeader = ({
  title,
  buttonText,
  onButtonClick,
  addPermissionCode,
}) => {
  const { hasPermission } = usePermissions();
  return (
    <Toolbar>
      {/* Judul grid di sebelah kiri */}
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      {/* Tombol "Add" di sebelah kanan */}
      {hasPermission(addPermissionCode) && (
        <Item
          widget="dxButton"
          location="after"
          options={{
            text: buttonText,
            icon: "add",
            stylingMode: "contained", // Membuatnya terlihat seperti tombol solid
            // Ubah 'default' menjadi 'normal' agar style DevExtreme tidak menimpa Tailwind
            type: "normal",
            elementAttr: {
              class: "grid-add-button",
            },
            onClick: onButtonClick,
          }}
        />
      )}
      {/* Search panel di kanan */}
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

/**
 * Komponen header grid dengan dua tombol aksi:
 * - Tombol "Add"
 * - Tombol "Upload"
 * Cocok untuk grid yang punya fitur upload data.
 * @param {string} title - Judul grid
 * @param {string} buttonText - Teks tombol "Add"
 * @param {function} onButtonClick - Handler klik tombol "Add"
 * @param {string} addPermissionCode - Kode hak akses untuk tombol "Add"
 * @param {string} buttonTextUpload - Teks tombol "Upload"
 * @param {function} onButtonClickUpload - Handler klik tombol "Upload"
 * @param {string} uploadPermissionCode - Kode hak akses untuk tombol "Upload"
 */
export const GridHeaderWithUpload = ({
  title,
  buttonText,
  onButtonClick,
  addPermissionCode,
  buttonTextUpload,
  onButtonClickUpload,
  uploadPermissionCode,
}) => {
  const { hasPermission } = usePermissions();
  return (
    <Toolbar>
      {/* Judul grid di sebelah kiri */}
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      {/* Tombol "Add" di sebelah kanan */}
      {hasPermission(addPermissionCode) && (
        <Item
          widget="dxButton"
          location="after"
          options={{
            text: buttonText,
            icon: "add",
            stylingMode: "contained",
            type: "normal",
            elementAttr: {
              class: "grid-add-button",
            },
            onClick: onButtonClick,
          }}
        />
      )}
      {/* Tombol "Upload" di sebelah kanan */}
      {hasPermission(uploadPermissionCode) && (
        <Item
          widget="dxButton"
          location="after"
          options={{
            text: buttonTextUpload,
            icon: "upload",
            stylingMode: "contained",
            type: "normal",
            elementAttr: {
              class: "grid-secondary-button",
            },
            onClick: onButtonClickUpload,
          }}
        />
      )}
      {/* Search panel di kanan */}
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

/**
 * Komponen header grid dengan tombol "Add" yang muncul di menu (bukan di toolbar).
 * Cocok untuk grid yang ingin tombol tambah baris di menu context.
 * @param {string} title - Judul grid
 * @param {string} addPermissionCode - Kode hak akses untuk tombol "Add"
 */
export const GridHeaderWithAddInMenu = ({ title, addPermissionCode }) => {
  const { hasPermission } = usePermissions();
  return (
    <Toolbar>
      {/* Judul grid di sebelah kiri */}
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      {/* Tombol "Add" muncul di menu grid, bukan di toolbar */}
      {hasPermission(addPermissionCode) && (
        <Item name="addRowButton" showText="inMenu" />
      )}
      {/* Search panel di kanan */}
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export default GridHeader;
