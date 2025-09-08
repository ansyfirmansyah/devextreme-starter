import React, { useState, useRef, useCallback } from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';

// Untuk contoh, kita buat komponen Halaman dummy untuk laporan
export const SalesReportPage = () => <h2>Halaman Laporan Penjualan</h2>;
export const StockReportPage = () => <h2>Halaman Laporan Stok</h2>;

const barang = [
  { ID: '1', name: 'Elektronik', category: 'root' },
  { ID: '1_1', parentId: '1', name: 'Komputer & Laptop' },
  { ID: '1_1_1', parentId: '1_1', name: 'Laptop Gaming' },
  { ID: '1_1_2', parentId: '1_1', name: 'Laptop Kantor' },
  { ID: '1_2', parentId: '1', name: 'Smartphone' },
  { ID: '2', name: 'Test1', category: 'root' },
  { ID: '2_1', parentId: '2', name: 'Test1.1' },
  { ID: '3', name: 'Test2', category: 'root' },
];

export const DropDownTreePage = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const treeViewRef = useRef(null); // Ref untuk mengakses instance TreeView

  const onTreeViewItemSelectionChanged = useCallback((e) => {
    const value = e.itemData.ID;
    setSelectedValue(value);
    setIsDropDownOpen(false);
  }, []);

  // <-- PENTING: Handler untuk DropDownBox saat nilainya berubah
  const onDropDownBoxValueChanged = useCallback((e) => {
    // Update state utama
    setSelectedValue(e.value);

    // Jika nilainya null (karena tombol clear ditekan)
    if (e.value === null) {
      // Akses instance TreeView melalui ref dan hapus seleksinya
      if (treeViewRef.current) {
        treeViewRef.current.instance.unselectAll();
      }
    }
  }, []);

  const contentRender = useCallback(() => {
    return (
      <TreeView
        ref={treeViewRef} // <-- Kaitkan ref di sini
        dataSource={barang}
        dataStructure="plain"
        keyExpr="ID"
        parentIdExpr="parentId"
        displayExpr="name"
        selectionMode="single"
        selectByClick={true}
        onItemSelectionChanged={onTreeViewItemSelectionChanged}
        onContentReady={(e) => {
          // Sinkronisasi saat dropdown dibuka
          if (selectedValue) {
            e.component.selectItem(selectedValue);
          } else {
            e.component.unselectAll();
          }
        }}
      />
    );
  }, [selectedValue, onTreeViewItemSelectionChanged]);

  return (
    <div className="dx-fieldset" style={{ maxWidth: '400px' }}>
      <div className="dx-field">
        <div className="dx-field-label">Klasifikasi Barang</div>
        <div className="dx-field-value">
          <DropDownBox
            value={selectedValue}
            opened={isDropDownOpen}
            onOptionChanged={(e) => {
              if (e.name === 'opened') {
                setIsDropDownOpen(e.value);
              }
            }}
            onValueChanged={onDropDownBoxValueChanged} // <-- Gunakan handler ini
            valueExpr="ID"
            displayExpr="name"
            dataSource={barang}
            placeholder="Pilih klasifikasi..."
            showClearButton={true} // Tombol clear yang memicu ini
            contentRender={contentRender}
          />
        </div>
      </div>
      <p>Nilai terpilih: <strong>{selectedValue || 'Sudah di-clear'}</strong></p>
    </div>
  );
};


