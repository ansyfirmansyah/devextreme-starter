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
import {
  getRoleDataSource,
  userRoleStore,
} from "../../../services/userService";

// Template data baru untuk role
const newRoleTemplate = {
  userId: "",
  roles: [],
};

const UserRolesForm = () => {
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
      userRoleStore.byKey(id).then(
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
  const roleDataSource = useMemo(() => getRoleDataSource(), []);

  // Handler tombol batal/kembali
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
          await userRoleStore.update(id, dataToSave);
        } else {
          await userRoleStore.insert(dataToSave);
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
          <GroupItem caption="Detail User Role">
            <SimpleItem
              dataField="userId"
              label={{ text: "ID" }}
              editorOptions={{ disabled: true }}
            ></SimpleItem>
            <SimpleItem
              dataField="userName"
              label={{ text: "Name" }}
              editorOptions={{ disabled: true }}
            ></SimpleItem>
            <SimpleItem
              dataField="userEmail"
              label={{ text: "Email" }}
              editorOptions={{ disabled: true }}
            ></SimpleItem>
          </GroupItem>
          {/* Grup hak akses */}
          <GroupItem caption="Role">
            <SimpleItem
              dataField="roles"
              label={{ text: "Pilih Roles" }}
              render={() => (
                <TagBox
                  dataSource={roleDataSource}
                  value={formData.roles}
                  onValueChange={(values) => {
                    setFormData((prev) => ({ ...prev, roles: values }));
                  }}
                  displayExpr="roleId"
                  valueExpr="roleId"
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

export default UserRolesForm;
