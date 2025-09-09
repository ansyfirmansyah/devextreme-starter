import React, { useCallback, useRef, useState } from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  NumericRule,
  RangeRule,
} from "devextreme-react/form";

import FormActions from "../../../components/ui/FormActions";
import { DropDownBox, TreeView } from "devextreme-react";
import { refKlasifikasiDataSource } from "../../../services/barangService";

const BarangForm = ({
  initialData,
  onSave,
  onCancel,
  readOnly = false,
  onBack,
}) => {
  const formRef = useRef(null);

  // State untuk form data dan DropDownBox klasifikasi
  const [formData, setFormData] = useState(initialData);
  const [selectedValueKlas, setSelectedValueKlas] = useState(null);
  const [isDropDownOpenKlas, setIsDropDownOpenKlas] = useState(false);

  // DataSource untuk klasifikasi
  const lookupRefKlas = refKlasifikasiDataSource();

  // Handler saat item di TreeView klasifikasi dipilih
  const onTreeViewKlasSelectionChanged = useCallback((e) => {
    const value = e.itemData.klas_id;
    setSelectedValueKlas(value);
    setIsDropDownOpenKlas(false);
  }, []);

  // Handler saat nilai di DropDownBox klasifikasi berubah
  const onDropDownBoxKlasValueChanged = useCallback((e) => {
    setSelectedValueKlas(e.value);
    // Update formData dengan klas_id yang baru
    setFormData({ ...formData, klas_id: e.value });
  }, []);

  // Render konten TreeView untuk DropDownBox klasifikasi
  const contentRenderKlas = useCallback(() => {
    return (
      <TreeView
        dataSource={lookupRefKlas}
        dataStructure="plain"
        keyExpr="klas_id"
        parentIdExpr="klas_parent_id"
        displayExpr="display"
        selectionMode="single"
        selectByClick={true}
        onItemSelectionChanged={onTreeViewKlasSelectionChanged}
        onContentReady={(e) => {
          // Sinkronisasi saat dropdown dibuka
          if (selectedValueKlas) {
            e.component.selectItem(selectedValueKlas);
          } else {
            e.component.unselectAll();
          }
        }}
      />
    );
  }, [selectedValueKlas, onTreeViewKlasSelectionChanged]);

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
          formData={formData}
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
            <DropDownBox
              label="Klasifikasi"
              labelMode="outside"
              value={selectedValueKlas} // Nilai yang dipilih
              opened={isDropDownOpenKlas} // Status terbuka/tutup
              onOptionChanged={(e) => {
                if (e.name === "opened") {
                  setIsDropDownOpenKlas(e.value);
                }
              }}
              onValueChanged={onDropDownBoxKlasValueChanged}
              valueExpr="klas_id"
              displayExpr="display"
              dataSource={lookupRefKlas}
              placeholder="Pilih klasifikasi..."
              showClearButton={true}
              contentRender={contentRenderKlas} // Render TreeView di sini
            />
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
