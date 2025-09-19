import React from 'react';
import { 
    Toolbar, Item
} from 'devextreme-react/data-grid';

/**
 * Komponen header grid standar.
 * Menampilkan judul, tombol "Add", dan search panel.
 * @param {string} title - Judul grid
 * @param {string} buttonText - Teks tombol "Add"
 * @param {function} onButtonClick - Handler klik tombol "Add"
 */
const GridHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <Toolbar>
      {/* Judul grid di sebelah kiri */}
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      {/* Tombol "Add" di sebelah kanan */}
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
            class: "grid-add-button" 
          },
          onClick: onButtonClick,
        }}
      />
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
 * @param {string} buttonTextUpload - Teks tombol "Upload"
 * @param {function} onButtonClickUpload - Handler klik tombol "Upload"
 */
export const GridHeaderWithUpload = ({ title, buttonText, onButtonClick, buttonTextUpload, onButtonClickUpload }) => {
  return (
    <Toolbar>
      {/* Judul grid di sebelah kiri */}
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      {/* Tombol "Add" di sebelah kanan */}
      <Item
        widget="dxButton"
        location="after"
        options={{
          text: buttonText,
          icon: "add",
          stylingMode: "contained",
          type: "normal",
          elementAttr: { 
            class: "grid-add-button" 
          },
          onClick: onButtonClick,
        }}
      />
      {/* Tombol "Upload" di sebelah kanan */}
      <Item
        widget="dxButton"
        location="after"
        options={{
          text: buttonTextUpload,
          icon: "upload",
          stylingMode: "contained",
          type: "normal",
          elementAttr: { 
            class: "grid-secondary-button" 
          },
          onClick: onButtonClickUpload,
        }}
      />
      {/* Search panel di kanan */}
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

/**
 * Komponen header grid dengan tombol "Add" yang muncul di menu (bukan di toolbar).
 * Cocok untuk grid yang ingin tombol tambah baris di menu context.
 * @param {string} title - Judul grid
 */
export const GridHeaderWithAddInMenu = ({ title }) => {
  return (
    <Toolbar>
      {/* Judul grid di sebelah kiri */}
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      {/* Tombol "Add" muncul di menu grid, bukan di toolbar */}
      <Item name="addRowButton" showText="inMenu" />
      {/* Search panel di kanan */}
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export default GridHeader;