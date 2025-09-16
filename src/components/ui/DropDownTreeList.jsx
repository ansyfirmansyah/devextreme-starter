// File: TreeListEditor.js

import React, { useState } from "react";
import TreeList, { Selection } from "devextreme-react/tree-list";
import DropDownBox from "devextreme-react/drop-down-box";

// Data bisa di-impor atau di-fetch di sini
const klasifikasiData = [
  { klas_id: 1, klas_parent_id: null, display: "ASET" },
  { klas_id: 2, klas_parent_id: null, display: "KEWAJIBAN (LIABILITAS)" },
  { klas_id: 3, klas_parent_id: 1, display: "Aset Lancar" },
  // ... sisa data
];

// Ini adalah komponen editor kustom kita
const TreeListEditor = (props) => {
  // Ekstrak value dan onValueChanged dari props.editorOptions
  const { value, onValueChanged } = props.editorOptions;
  const [isOpened, setIsOpened] = useState(false);

  // Handler saat item di TreeList dipilih
  const handleSelectionChanged = (e) => {
    const selectedId = e.selectedRowKeys[0];
    // onValueChanged(selectedId); // Kirim nilai baru ke Form
    setIsOpened(false); // Tutup dropdown
  };

  // Fungsi untuk render TreeList
  const renderTreeList = () => {
    return (
      <TreeList
        dataSource={klasifikasiData}
        keyExpr="klas_id"
        parentIdExpr="klas_parent_id"
        rootValue={null}
        height={300}
        hoverStateEnabled={true}
        selectedRowKeys={value ? [value] : []} // Gunakan 'value' dari props
        onSelectionChanged={handleSelectionChanged}
      >
        <Selection mode="single" />
      </TreeList>
    );
  };

  return (
    <DropDownBox
      value={value} // Gunakan 'value' dari props
      opened={isOpened}
      onOptionChanged={(e) => {
        if (e.name === "opened") {
          setIsOpened(e.value);
        }
      }}
      dataSource={klasifikasiData}
      valueExpr="klas_id"
      displayExpr="display"
      placeholder="Pilih Klasifikasi..."
      showClearButton={true}
      contentRender={renderTreeList}
    />
  );
};

export default TreeListEditor;
