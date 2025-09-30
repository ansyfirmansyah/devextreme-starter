/**
 * RolesForm.jsx
 * -------------
 * Komponen form untuk membuat dan mengedit data Role.
 *
 * Fitur:
 * - Mode tambah dan edit, otomatis berdasarkan parameter URL.
 * - Validasi input (wajib, panjang karakter).
 * - Pilihan hak akses (modul) menggunakan TagBox.
 * - Loading spinner saat data diambil.
 * - Notifikasi error jika gagal load/simpan.
 * - Read-only mode jika bukan halaman edit.
 *
 * Dependencies:
 * - React Router (useNavigate, useParams, useLocation)
 * - DevExtreme Form & TagBox
 * - roleService (roleStore, getModuleDataSource)
 * - FormActions, LoadingSpinner, notify
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  StringLengthRule,
} from "devextreme-react/form";
import TagBox from "devextreme-react/tag-box";
import notify from "devextreme/ui/notify";

import FormActions from "../../../components/ui/FormActions";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { getModuleDataSource, roleStore } from "../../../services/roleService";

// Template data baru untuk role
const newRoleTemplate = {
  roleId: "",
  roleCatatan: "",
  modKodes: [],
};

const RolesForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // State utama form
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mode edit jika ada id di URL
  const isEditMode = !!id;
  // Read-only jika bukan halaman edit
  const isReadOnly = isEditMode && !location.pathname.endsWith("/edit");

  // Ambil data role jika edit, atau set template baru jika tambah
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      roleStore.byKey(id).then(
        (data) => {
          setFormData(data);
          setIsLoading(false);
        },
        (err) => {
          notify(err?.message || "Gagal memuat data.", "error", 3000);
          navigate("/roles");
          setIsLoading(false);
        }
      );
    } else {
      setFormData({ ...newRoleTemplate });
    }
  }, [id, isEditMode, navigate]);

  // Data source modul untuk TagBox
  const moduleDataSource = useMemo(() => getModuleDataSource(), []);

  // Handler tombol batal/kembali
  const handleCancel = useCallback(() => navigate("/roles"), [navigate]);

  // Handler submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();

    if (validationResult.isValid) {
      try {
        const dataToSave = formInstance.option("formData");
        if (isEditMode) {
          await roleStore.update(id, dataToSave);
        } else {
          await roleStore.insert(dataToSave);
        }
        handleCancel();
      } catch (err) {
        notify(err?.message || "Gagal menyimpan data.", "error", 3000);
      }
    }
  };

  // Tampilkan spinner jika loading atau data belum ada
  if (isLoading || !formData) {
    return <LoadingSpinner />;
  }

  // Render form utama
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
          {/* Grup detail role */}
          <GroupItem caption="Detail Role">
            <SimpleItem
              dataField="roleId"
              label={{ text: "Role ID" }}
              editorOptions={{ disabled: isEditMode }}
            >
              <RequiredRule />
              <StringLengthRule max={40} />
            </SimpleItem>
            <SimpleItem dataField="roleCatatan" label={{ text: "Catatan" }}>
              <RequiredRule />
            </SimpleItem>
          </GroupItem>
          {/* Grup hak akses */}
          <GroupItem caption="Hak Akses">
            <SimpleItem
              dataField="modKodes"
              label={{ text: "Pilih Hak Akses (Modul)" }}
              render={() => (
                <TagBox
                  dataSource={moduleDataSource}
                  value={formData.modKodes}
                  onValueChange={(values) => {
                    setFormData((prev) => ({ ...prev, modKodes: values }));
                  }}
                  displayExpr="mod_catatan"
                  valueExpr="mod_kode"
                  searchEnabled={true}
                  placeholder="Ketik untuk mencari hak akses..."
                  showSelectionControls={true}
                  applyValueMode="useButtons"
                  readOnly={isReadOnly}
                />
              )}
            />
          </GroupItem>
        </Form>
        {/* Tombol aksi form */}
        <FormActions
          readOnly={isReadOnly}
          onCancel={handleCancel}
          onBack={handleCancel}
        />
      </form>
    </div>
  );
};

export default RolesForm;
