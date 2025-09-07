import React, { useRef } from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
} from "devextreme-react/form";

import FormActions from "../../../components/ui/FormActions";
import { getOutletLookupStore } from "../../../services/salesService";

// Data source untuk dropdown Outlet di form
const outletDataSource = getOutletLookupStore();

const SalesForm = ({
  initialData,
  onSave,
  onCancel,
  readOnly = false,
  onBack,
}) => {
  console.log("initialData>>> " + initialData);

  const formRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah form me-reload halaman
    if (readOnly) return;

    // Validasi form secara manual
    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();
    console.log('formInstance-formData>> ' + formInstance.option("formData"));

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
          colCount={3}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={readOnly}
        >
          <SimpleItem dataField="sales_kode" caption="Kode">
            <RequiredRule />
          </SimpleItem>
          <SimpleItem dataField="sales_nama" caption="Nama Sales">
            <RequiredRule />
          </SimpleItem>
          <SimpleItem
            dataField="outlet_id"
            caption="Outlet"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: outletDataSource,
              valueExpr: "outlet_id",
              displayExpr: "display",
              searchEnabled: true,
            }}
          >
            <RequiredRule message="Outlet is required" />
          </SimpleItem>
        </Form>

        <FormActions readOnly={readOnly} onCancel={onCancel} onBack={onBack} />
      </form>
    </div>
  );
};

export default SalesForm;
