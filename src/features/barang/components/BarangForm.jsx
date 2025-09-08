import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  NumericRule,
  RangeRule,
} from "devextreme-react/form";

import FormActions from "../../../components/ui/FormActions";
import { refKlasifikasiDataSource } from "../../../services/barangService";
import { DropDownBox, NumberBox, TreeList } from "devextreme-react";
import { Selection } from "devextreme-react/cjs/tree-list";

const BarangForm = ({
  initialData,
  onSave,
  onCancel,
  readOnly = false,
  onBack,
}) => {
  const formRef = useRef(null);
  const treeListRef = useRef(null);
  
  // Existing id dari initialData, atau 0 jika create
  const [existingId, setExistingId] = useState(initialData?.barang_id || 0);
  
  // State untuk menyimpan nilai yang dipilih di dropdown tree
  const [selectedKlasifikasi, setSelectedKlasifikasi] = useState(
    initialData?.klas_id || null
  );

  // State untuk menyimpan loaded data
  const [loadedData, setLoadedData] = useState([]);
  const [displayText, setDisplayText] = useState("");

  // Memoized data source untuk tree
  const klasifikasiDataSource = useMemo(() => {
    console.log("Creating klasifikasi data source");
    return refKlasifikasiDataSource();
  }, []);

  // Function untuk load data dari store
  const loadKlasifikasiData = useCallback(async () => {
    try {
      console.log("Loading klasifikasi data...");
      const data = await klasifikasiDataSource.load();
      console.log("Loaded data:", data);
      setLoadedData(data);
      
      // Set display text jika ada selected value
      if (selectedKlasifikasi) {
        const selectedItem = data.find(item => item.klas_id === selectedKlasifikasi);
        if (selectedItem) {
          setDisplayText(selectedItem.display || selectedItem.klas_nama || "");
        }
      }
    } catch (error) {
      console.error("Error loading klasifikasi data:", error);
    }
  }, [klasifikasiDataSource, selectedKlasifikasi]);

  // Load data saat component mount
  useEffect(() => {
    loadKlasifikasiData();
  }, [loadKlasifikasiData]);

  // Function untuk mendapatkan display text berdasarkan selected value
  const getDisplayText = useCallback((value) => {
    if (!value || !loadedData.length) return "";
    
    const findItem = (items, id) => {
      for (const item of items) {
        if (item.klas_id === id) {
          return item;
        }
        if (item.children && item.children.length > 0) {
          const found = findItem(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(loadedData, value);
    return item ? item.display || item.klas_nama : "";
  }, [loadedData]);

  // Function untuk mengecek apakah item adalah leaf (child terakhir)
  const isLeafNode = useCallback((item) => {
    return !item.children || item.children.length === 0;
  }, []);

  // Handler untuk selection change pada tree
  const handleTreeSelectionChanged = useCallback((e) => {
    const selectedRowKeys = e.selectedRowKeys;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const selectedKey = selectedRowKeys[0];
      const selectedItem = e.component.getNodeByKey(selectedKey)?.data;
      
      // Hanya allow selection jika ini adalah leaf node (child)
      if (selectedItem && isLeafNode(selectedItem)) {
        setSelectedKlasifikasi(selectedKey);
        
        // Update display text
        setDisplayText(selectedItem.display || selectedItem.klas_nama || "");
        
        // Update form data
        const formInstance = formRef.current?.instance();
        if (formInstance) {
          formInstance.updateData("klas_id", selectedKey);
        }
      } else {
        // Jika bukan leaf node, clear selection
        e.component.clearSelection();
      }
    }
  }, [isLeafNode]);

  // Custom render untuk DropDownBox content
  const renderTreeList = useCallback((args) => {
    console.log("renderTreeList called, loadedData:", loadedData);
    
    if (!loadedData.length) {
      return <div style={{ padding: '10px' }}>Loading...</div>;
    }
    
    return (
      <TreeList
        ref={treeListRef}
        dataSource={loadedData}
        keyExpr="klas_id"
        parentIdExpr="klas_parent_id"
        displayExpr="display"
        showBorders={false}
        selection={{ mode: "single" }}
        selectedRowKeys={selectedKlasifikasi ? [selectedKlasifikasi] : []}
        onSelectionChanged={handleTreeSelectionChanged}
        onRowClick={(e) => {
          // Prevent selection of parent nodes on row click
          if (!isLeafNode(e.data)) {
            e.event.preventDefault();
            return;
          }
        }}
        onCellClick={(e) => {
          // Handle expand/collapse on parent node click
          if (!isLeafNode(e.data) && e.column.dataField === "display") {
            if (e.component.isRowExpanded(e.key)) {
              e.component.collapseRow(e.key);
            } else {
              e.component.expandRow(e.key);
            }
          }
        }}
        rootValue={null}
        autoExpandAll={false}
        showRowLines={true}
        showColumnLines={false}
        columnAutoWidth={true}
      >
        <Selection mode="single" />
      </TreeList>
    );
  }, [loadedData, selectedKlasifikasi, handleTreeSelectionChanged, isLeafNode]);

  // Handler untuk dropdown value change
  const handleDropdownValueChanged = useCallback((e) => {
    console.log("Dropdown value changed:", e.value);
    setSelectedKlasifikasi(e.value);
    
    // Update display text
    if (e.value && loadedData.length) {
      const selectedItem = loadedData.find(item => item.klas_id === e.value);
      if (selectedItem) {
        setDisplayText(selectedItem.display || selectedItem.klas_nama || "");
      }
    } else {
      setDisplayText("");
    }
  }, [loadedData]);

  // Handler untuk submit form
  const handleSubmit = (e) => {
    // Mencegah form me-reload halaman
    e.preventDefault();
    // untuk mode readonly, jangan lakukan apa-apa
    if (readOnly) return;

    // Validasi form secara manual
    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();

    // Jika valid, panggil onSave dengan data dari form
    if (validationResult.isValid) {
      onSave(formInstance.option("formData"));
    }
  };

  return (
    <div className="form-container">
      {/* Kita bungkus dengan tag <form> agar 'useSubmitBehavior' berfungsi */}
      <form onSubmit={handleSubmit}>
        <Form
          ref={formRef}
          formData={initialData}
          colCount={2}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={readOnly}
        >
          <GroupItem caption="Barang Details">
            <SimpleItem dataField="barang_kode" label={{ text: "Kode" }}>
              <RequiredRule />
            </SimpleItem>
            <SimpleItem dataField="barang_nama" label={{ text: "Nama Barang" }}>
              <RequiredRule />
            </SimpleItem>
            <SimpleItem
              dataField="barang_harga"
              label={{ text: "Harga" }}
              editorType="dxNumberBox"
              editorOptions={{
                min: 0, // Mencegah nilai negatif melalui spin button
                format: "#,##0.##", // Format angka (opsional, untuk tampilan)
                showSpinButtons: true, // Menampilkan tombol panah atas/bawah
              }}
            >
              {/* Aturan: Wajib diisi */}
              <RequiredRule message="Harga harus diisi" />
              {/* Aturan: Harus berupa angka */}
              <NumericRule message="Input harus berupa angka" />
              {/* Aturan: Nilai minimum adalah 0 */}
              <RangeRule min={0} message="Harga tidak boleh kurang dari 0" />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Klasifikasi Information">
            <SimpleItem
              dataField="klas_id"
              editorType="dxDropDownBox"
              editorOptions={{
                value: selectedKlasifikasi,
                displayExpr: () => displayText,
                placeholder: "Pilih Klasifikasi...",
                showClearButton: true,
                onValueChanged: handleDropdownValueChanged,
                contentTemplate: renderTreeList,
                dropDownOptions: {
                  height: 400,
                  width: 500,
                },
                acceptCustomValue: false,
                onOpened: () => {
                  console.log("Dropdown opened");
                  // Reload data jika diperlukan
                  if (!loadedData.length) {
                    loadKlasifikasiData();
                  }
                },
              }}
              label={{ text: "Klasifikasi" }}
            >
              <RequiredRule message="Klasifikasi harus dipilih" />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Outlet Information">
            {/* Tambahkan field outlet di sini jika diperlukan */}
          </GroupItem>
          <GroupItem caption="Diskon Information">
            {/* Tambahkan field diskon di sini jika diperlukan */}
          </GroupItem>
        </Form>
        <FormActions readOnly={readOnly} onCancel={onCancel} onBack={onBack} />
      </form>
    </div>
  );
};

export default BarangForm;