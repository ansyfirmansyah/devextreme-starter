import React, { useMemo, useRef, useState } from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
} from "devextreme-react/form";

import FormActions from "../../../components/ui/FormActions";
import { createParentDataSource } from "../../../services/klasifikasiService";

const KlasifikasiForm = ({
  initialData,
  onSave,
  onCancel,
  readOnly = false,
  onBack,
}) => {
  const formRef = useRef(null);
  // Existing id dari initialData, atau 0 jika create
  const [existingId, setExistingId] = useState(initialData?.klas_id || 0);

  // Data Source untuk SelectBox Klasifikasi Induk
  // Menggunakan UseMemo agar dataSource tidak dibuat ulang setiap render
  // tapi hanya dibuat ulang jika existingId berubah
  const parentDataSource = useMemo(
    () => {
      return createParentDataSource(existingId);
    },
    [existingId] // dependency ke existingId
  );

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
          <GroupItem caption="Klasifikasi Details">
            <SimpleItem dataField="klas_kode" label={{ text: "Kode" }}>
              <RequiredRule />
            </SimpleItem>
            <SimpleItem
              dataField="klas_nama"
              label={{ text: "Nama Klasifikasi" }}
            >
              <RequiredRule />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Parent Information">
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
        <FormActions readOnly={readOnly} onCancel={onCancel} onBack={onBack} />
      </form>
    </div>
  );
};

export default KlasifikasiForm;
