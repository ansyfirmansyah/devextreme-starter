import React, { useCallback, useEffect, useRef, useState } from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  NumericRule,
  RangeRule,
  StringLengthRule,
} from "devextreme-react/form";

import FormActions from "../../../components/ui/FormActions";
import { DropDownBox, TreeView } from "devextreme-react";
import { refKlasifikasiDataSource } from "../../../services/barangService";
import BarangFormOutletGrid from "./BarangFormOutletGrid";

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
  // const [selectedValueKlas, setSelectedValueKlas] = useState(null);
  const [isDropDownOpenKlas, setIsDropDownOpenKlas] = useState(false);
  const [lookupRefKlas, setLookupRefKlas] = useState(null);

  // DataSource untuk klasifikasi
  useEffect(() => {
    // Ambil instance dari data source
    const ds = refKlasifikasiDataSource();

    // Load datanya
    ds.load()
      .then((data) => {
        // Simpan hasilnya di state
        setLookupRefKlas(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data klasifikasi:", error);
      });

    // Array dependensi kosong '[]' memastikan ini hanya berjalan sekali
  }, []);

  // Handler saat item di TreeView klasifikasi dipilih
  const onTreeViewKlasSelectionChanged = useCallback((e) => {
    // Jika tidak (dipicu oleh program), hentikan eksekusi fungsi ini.
    if (!e.event) {
      return;
    }
    const newValue = e.itemData.klas_id;

    // LANGSUNG UPDATE STATE FORM UTAMA
    // Ini akan otomatis me-render ulang Form dengan nilai baru
    setFormData((prevFormData) => ({
      ...prevFormData,
      klas_id: newValue,
    }));

    // Tutup dropdown
    setIsDropDownOpenKlas(false);
  }, []); // Dependency tidak perlu karena setFormData stabil

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
          // Sinkronisasi sekarang membaca dari formData
          const currentValue = formData.klas_id;
          if (currentValue) {
            e.component.selectItem(currentValue);
          } else {
            e.component.unselectAll();
          }
        }}
      />
    );
  }, [lookupRefKlas]);

  // Handler untuk submit form
  const handleSubmit = (e) => {
    // Mencegah form me-reload halaman
    e.preventDefault();
    // untuk mode readonly, jangan lakukan apa-apa
    if (readOnly) return;

    // Validasi form secara manual
    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();

    // Validasi manual untuk field yang menggunakan render
    const customValidationErrors = [];

    if (!formData.klas_id) {
      customValidationErrors.push({
        field: "klas_id",
        message: "Klasifikasi harus dipilih",
      });
    }

    // Jika valid, panggil onSave dengan data dari form
    if (validationResult.isValid && customValidationErrors.length === 0) {
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
          onFormDataChange={setFormData}
          colCount={2}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={readOnly}
        >
          <GroupItem caption="Barang Details">
            <SimpleItem dataField="barang_kode" label={{ text: "Kode" }}>
              <RequiredRule />
              <StringLengthRule max={10} message="Kode max 10 karakter" />
            </SimpleItem>
            <SimpleItem dataField="barang_nama" label={{ text: "Nama Barang" }}>
              <RequiredRule />
              <StringLengthRule max={100} message="Nama Barang max 100 karakter" />
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
              label={{ text: "Klasifikasi" }}
              render={() => (
                <DropDownBox
                  // value sekarang membaca langsung dari formData
                  readOnly={readOnly}
                  value={formData.klas_id}
                  opened={isDropDownOpenKlas}
                  onOptionChanged={(e) => {
                    if (e.name === "opened") setIsDropDownOpenKlas(e.value);
                  }}
                  // onValueChanged di DropDownBox menangani saat tombol 'clear' ditekan
                  onValueChanged={(e) => {
                    setFormData((prev) => ({ ...prev, klas_id: e.value }));
                  }}
                  valueExpr="klas_id"
                  displayExpr="display"
                  dataSource={lookupRefKlas}
                  placeholder="Pilih klasifikasi..."
                  showClearButton={true}
                  contentRender={contentRenderKlas}
                  isValid={formData.klas_id ? true : false}
                  validationError={
                    formData.klas_id
                      ? null
                      : { message: "Klasifikasi harus dipilih" }
                  }
                />
              )}
            >
              {/* flag required ini tidak berfungsi, jadi validasi manual di handleSubmit */}
              <RequiredRule />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Outlet Information">
            <BarangFormOutletGrid
            tempId={formData.temptable_outlet_id}
            readOnly={readOnly}
            />
          </GroupItem>
          <GroupItem caption="Diskon Information">
          </GroupItem>
        </Form>
        <FormActions readOnly={readOnly} onCancel={onCancel} onBack={onBack} />
      </form>
    </div>
  );
};

export default BarangForm;
