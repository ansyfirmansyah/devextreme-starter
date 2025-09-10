import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
// useParams untuk mendapatkan 'id' dari URL
// useNavigate untuk navigasi programatik
// useLocation untuk memeriksa path saat ini
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  StringLengthRule,
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";

import FormActions from "../../../components/ui/FormActions.jsx";
import {
  createParentDataSource,
  klasifikasiStore,
} from "../../../services/klasifikasiService.js";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.jsx";

// Template data kosong untuk form create
const newKlasifikasiTemplate = {
  klas_kode: "",
  klas_nama: "",
  klas_parent_id: null,
};

// Form tidak lagi menerima props initialData, onSave, onCancel, dll.
const KlasifikasiForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Dapatkan 'id' dari URL jika ada
  const location = useLocation(); // Untuk memeriksa path saat ini

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tentukan mode form berdasarkan URL
  const isEditMode = !!id; // Jika ada id, berarti mode edit/view
  // Jika di mode edit tapi bukan di path '/edit', berarti read-only (view mode)
  const isReadOnly = isEditMode && !location.pathname.endsWith("/edit");

  // useEffect untuk mengambil data jika dalam mode edit/view
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // Ambil data dari store (API) langsung
      klasifikasiStore.byKey(id).then(
        (data) => {
          setFormData(data);
          setIsLoading(false);
        },
        (err) => {
          notify(err?.message || "Failed to load data.", "error", 3000);
          navigate("/klasifikasi");
          setIsLoading(false);
        }
      );
    } else {
      // Jika mode 'new', gunakan template kosong
      setFormData({ ...newKlasifikasiTemplate });
    }
  }, [id, isEditMode, navigate]);

  // DataSource untuk dropdown parent, dengan pengecualian diri sendiri dan anak-anaknya
  const parentDataSource = useMemo(() => createParentDataSource(id || 0), [id]);

  // Handler untuk kembali ke halaman grid
  const handleCancel = useCallback(() => navigate("/klasifikasi"), [navigate]);

  // Handler untuk menyimpan data
  const handleSubmit = async (e) => {
    // Mencegah reload halaman
    e.preventDefault();
    if (isReadOnly) return;

    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();

    if (validationResult.isValid) {
      try {
        const dataToSave = formInstance.option("formData");
        if (isEditMode) {
          // update data via store (API)
          await klasifikasiStore.update(id, dataToSave);
        } else {
          // insert data via store (API)
          await klasifikasiStore.insert(dataToSave);
        }
        // Setelah sukses, kembali ke halaman grid
        handleCancel();
      } catch (err) {
        notify(err?.message || "Failed to save data.", "error", 3000);
      }
    }
  };

  // Tampilkan loading spinner saat data sedang diambil
  if (isLoading || !formData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <Form
          ref={formRef}
          formData={formData}
          colCount={2}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={isReadOnly}
        >
          <GroupItem caption="Klasifikasi Details">
            <SimpleItem dataField="klas_kode" label={{ text: "Kode" }}>
              <RequiredRule />
              <StringLengthRule max={10} message="Kode max 10 karakter" />
            </SimpleItem>
            <SimpleItem
              dataField="klas_nama"
              label={{ text: "Nama Klasifikasi" }}
            >
              <RequiredRule />
              <StringLengthRule max={100} message="Nama max 100 karakter" />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Parent Information">
            {/* Menggunakan Simple Item agar langsung binding ke formData */}
            <SimpleItem
              dataField="klas_parent_id"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: parentDataSource,
                valueExpr: "klas_id",
                displayExpr: "display",
                searchEnabled: true,
                placeholder: "Pilih Klasifikasi Induk...",
                showClearButton: true,
              }}
              label={{ text: "Klasifikasi Induk" }}
            ></SimpleItem>
          </GroupItem>
        </Form>
        {/* Tombol Back dan Cancel sekarang memanggil handler navigasi yang sama */}
        <FormActions
          readOnly={isReadOnly}
          onCancel={handleCancel}
          onBack={handleCancel}
        />
      </form>
    </div>
  );
};

export default KlasifikasiForm;
