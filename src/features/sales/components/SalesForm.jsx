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
  StringLengthRule,
} from "devextreme-react/form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import notify from "devextreme/ui/notify";

import {
  getOutletLookupStore,
  salesStore,
} from "../../../services/salesService";
import FormActions from "../../../components/ui/FormActions";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

// Template data kosong untuk form create
const newSalesTemplate = {
  sales_kode: "",
  sales_nama: "",
  outlet_id: null,
};

const SalesForm = () => {
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
      salesStore.byKey(id).then(
        (data) => {
          setFormData(data);
          setIsLoading(false);
        },
        (err) => {
          notify(err?.message || "Failed to load data.", "error", 3000);
          navigate("/sales");
          setIsLoading(false);
        }
      );
    } else {
      // Jika mode 'new', gunakan template kosong
      setFormData({ ...newSalesTemplate });
    }
  }, [id, isEditMode, navigate]);

  // Data source untuk dropdown Outlet di form
  const outletDataSource = useMemo(() => getOutletLookupStore(), [id]);

  // Handler untuk kembali ke halaman grid
  const handleCancel = useCallback(() => navigate("/sales"), [navigate]);

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    // Mencegah form me-reload halaman
    e.preventDefault();
    // untuk mode readonly, jangan lakukan apa-apa
    if (isReadOnly) return;

    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();

    if (validationResult.isValid) {
      try {
        const dataToSave = formInstance.option("formData");
        if (isEditMode) {
          // update data via store (API)
          await salesStore.update(id, dataToSave);
        } else {
          // insert data via store (API)
          await salesStore.insert(dataToSave);
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
      {/* Kita bungkus dengan tag <form> agar 'useSubmitBehavior' berfungsi */}
      <form onSubmit={handleSubmit}>
        <Form
          ref={formRef}
          formData={formData}
          colCount={2}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={isReadOnly}
        >
          <GroupItem caption="Sales Details">
            <SimpleItem dataField="sales_kode" label={{ text: "Kode" }}>
              <RequiredRule />
              <StringLengthRule max={10} message="Kode max 10 karakter" />
            </SimpleItem>
            <SimpleItem dataField="sales_nama" label={{ text: "Nama Sales" }}>
              <RequiredRule />
              <StringLengthRule max={100} message="Nama max 100 karakter" />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Outlet Information">
            <SimpleItem
              dataField="outlet_id"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: outletDataSource,
                valueExpr: "outlet_id",
                displayExpr: "display",
                searchEnabled: true,
                placeholder: "Pilih Outlet...",
              }}
              label={{ text: "Outlet" }}
            >
              <RequiredRule message="Outlet is required" />
            </SimpleItem>
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

export default SalesForm;
