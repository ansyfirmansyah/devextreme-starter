import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  NumericRule,
  RangeRule,
  StringLengthRule,
} from "devextreme-react/form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DropDownBox, TreeView } from "devextreme-react";
import notify from "devextreme/ui/notify";

import FormActions from "../../../components/ui/FormActions";
import {
  barangStore,
  initTempDiskon,
  initTempOutlet,
  refKlasifikasiDataSource,
} from "../../../services/barangService";
import BarangFormOutletGrid from "./BarangFormOutletGrid";
import BarangFormDiskonGrid from "./BarangFormDiskonGrid";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

// Template data kosong untuk form create
const newBarangTemplate = {
  barang_kode: "",
  barang_nama: "",
  barang_harga: 0,
  klas_id: null,
  temptable_outlet_id: null,
  temptable_diskon_id: null,
};

const BarangForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Dapatkan 'id' dari URL jika ada
  const location = useLocation(); // Untuk memeriksa path saat ini

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropDownOpenKlas, setIsDropDownOpenKlas] = useState(false);

  // Tentukan mode form berdasarkan URL
  const isEditMode = !!id; // Jika ada id, berarti mode edit/view
  // Jika di mode edit tapi bukan di path '/edit', berarti read-only (view mode)
  const isReadOnly = isEditMode && !location.pathname.endsWith("/edit");

  // useEffect untuk mengambil data jika dalam mode edit/view
  useEffect(() => {
    async function initData() {
      if (isEditMode) {
        setIsLoading(true);
        // Ambil data dari store (API) langsung
        barangStore.byKey(id).then(
          async (data) => {
            // init temptable_id dengan Guid baru
            const temptableOutlet = await initTempOutlet(id);
            const temptableDiskon = await initTempDiskon(id);
            // Form menggunakan data yang sudah ditemukan, bukan template kosong
            setFormData({
              ...data,
              temptable_outlet_id:
                temptableOutlet?.temptable_outlet_id || new Guid(),
              temptable_diskon_id:
                temptableDiskon?.temptable_diskon_id || new Guid(),
            });
            setIsLoading(false);
          },
          (err) => {
            notify(err?.message || "Failed to load data.", "error", 3000);
            navigate("/barang");
            setIsLoading(false);
          }
        );
      } else {
        // init temptable_id dengan Guid baru
        const temptableOutlet = await initTempOutlet(0);
        const temptableDiskon = await initTempDiskon(0);
        // Set data form ke template baru
        setFormData({
          ...newBarangTemplate,
          temptable_outlet_id:
            temptableOutlet?.temptable_outlet_id || new Guid(),
          temptable_diskon_id:
            temptableDiskon?.temptable_diskon_id || new Guid(),
        });
      }
    }
    initData();
  }, [id, isEditMode, navigate]);

  // Data source untuk dropdown Outlet di form
  const lookupRefKlas = useMemo(() => refKlasifikasiDataSource(), [id]);

  // Handler untuk kembali ke halaman grid
  const handleCancel = useCallback(() => navigate("/barang"), [navigate]);

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    // Mencegah form me-reload halaman
    e.preventDefault();
    // untuk mode readonly, jangan lakukan apa-apa
    if (isReadOnly) return;

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
      try {
        const dataToSave = formInstance.option("formData");
        if (isEditMode) {
          // update data via store (API)
          await barangStore.update(id, dataToSave);
        } else {
          // insert data via store (API)
          await barangStore.insert(dataToSave);
        }
        // Setelah sukses, kembali ke halaman grid
        handleCancel();
      } catch (err) {
        notify(err?.message || "Failed to save data.", "error", 3000);
      }
    }
  };

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
  }, [formData]); // Dependency tidak perlu karena setFormData stabil

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
          const currentValue = formData?.klas_id;
          if (currentValue) {
            e.component.selectItem(currentValue);
          } else {
            e.component.unselectAll();
          }
        }}
      />
    );
  }, [lookupRefKlas, formData]);

  // !!PENTING!! Jika ada kondisi yang akan return component, taruh di paling bawah sebelum return asli-nya
  // supaya tidak terjadi "Hook Count Mismatch"
  if (isLoading || !formData) {
    return <LoadingSpinner />;
  }

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
          readOnly={isReadOnly}
        >
          <GroupItem caption="Barang Details">
            <SimpleItem dataField="barang_kode" label={{ text: "Kode" }}>
              <RequiredRule />
              <StringLengthRule max={10} message="Kode max 10 karakter" />
            </SimpleItem>
            <SimpleItem dataField="barang_nama" label={{ text: "Nama Barang" }}>
              <RequiredRule />
              <StringLengthRule
                max={100}
                message="Nama Barang max 100 karakter"
              />
            </SimpleItem>
            <SimpleItem
              dataField="barang_harga"
              label={{ text: "Harga" }}
              editorType="dxNumberBox"
              editorOptions={{
                min: 0, // Mencegah nilai negatif melalui spin button
                format: "#,##0.##", // Format angka (opsional, untuk tampilan)
                onValueChanged: (e) => {
                  setFormData((prev) => ({
                    ...prev,
                    barang_harga: parseFloat(e.component.option("value")) || 0,
                  }));
                },
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
                  readOnly={isReadOnly}
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
              readOnly={isReadOnly}
            />
          </GroupItem>
          <GroupItem caption="Diskon Information">
            <BarangFormDiskonGrid
              tempId={formData.temptable_diskon_id}
              harga={formData.barang_harga}
              readOnly={isReadOnly}
            />
          </GroupItem>
        </Form>
        <FormActions
          readOnly={isReadOnly}
          onCancel={handleCancel}
          onBack={handleCancel}
        />
      </form>
    </div>
  );
};

export default BarangForm;
