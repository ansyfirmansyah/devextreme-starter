import React, { useCallback, useEffect, useRef, useState } from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  StringLengthRule,
} from "devextreme-react/form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import notify from "devextreme/ui/notify";

import FormActions from "../../../components/ui/FormActions";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import {
  initTempDetail,
  penjualanStore,
  refOutletDataSource,
  refSalesDataSource,
} from "../../../services/penjualanService";
import PenjualanFormDetailGrid from "./PenjualanFormDetailGrid";

// Template data kosong untuk form create
const newPenjualanTemplate = {
  jualh_kode: "",
  jualh_date: null,
  sales_id: null,
  outlet_id: null,
  temptable_detail_id: null,
};

const PenjualanForm = () => {
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

  // Dropdown
  const [lookupRefOutlet, setLookupRefOutlet] = useState(null);
  const [lookupRefSales, setLookupRefSales] = useState(null);
  const [selectedOutletId, setSelectedOutletId] = useState(null);
  const [selectedSalesId, setSelectedSalesId] = useState(null);

  // useEffect untuk mengambil data jika dalam mode edit/view
  useEffect(() => {
    async function initData() {
      if (isEditMode) {
        setIsLoading(true);
        // Ambil data dari store (API) langsung
        penjualanStore.byKey(id).then(
          async (data) => {
            // init temptable_id dengan Guid baru
            const temptableDetail = await initTempDetail(id);
            // Form menggunakan data yang sudah ditemukan, bukan template kosong
            setFormData({
              ...data,
              temptable_detail_id:
                temptableDetail?.temptable_detail_id || new Guid(),
            });
            setIsLoading(false);
          },
          (err) => {
            notify(err?.message || "Failed to load data.", "error", 3000);
            navigate("/penjualan");
            setIsLoading(false);
          }
        );
      } else {
        // init temptable_id dengan Guid baru
        const temptableDetail = await initTempDetail(0);
        // Set data form ke template baru
        setFormData({
          ...newPenjualanTemplate,
          temptable_detail_id:
            temptableDetail?.temptable_detail_id || new Guid(),
        });
      }
    }
    initData();
  }, [id, isEditMode, navigate]);

  // Data source untuk dropdown di form
  useEffect(() => {
    const ds = refOutletDataSource();
    // Load datanya
    ds.load()
      .then((data) => {
        // Simpan hasilnya di state
        setLookupRefOutlet(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data outlet:", error);
      });
  }, []);
  useEffect(() => {
    if (!formData?.outlet_id) {
      setLookupRefSales(null);
      return;
    }
    const ds = refSalesDataSource(formData?.outlet_id);
    // Load datanya
    ds.load()
      .then((data) => {
        // Simpan hasilnya di state
        setLookupRefSales(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data sales:", error);
      });
  }, [formData?.outlet_id]);

  const handleSelectBoxOutlet = (e) => {
    setFormData({ ...formData, outlet_id: e.value });
  };

  // Handler untuk kembali ke halaman grid
  const handleCancel = useCallback(() => navigate("/penjualan"), [navigate]);

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    // Mencegah form me-reload halaman
    e.preventDefault();
    // untuk mode readonly, jangan lakukan apa-apa
    if (isReadOnly) return;

    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();

    // Jika valid, panggil onSave dengan data dari form
    if (validationResult.isValid) {
      try {
        const dataToSave = formInstance.option("formData");
        if (isEditMode) {
          // update data via store (API)
          await penjualanStore.update(id, dataToSave);
        } else {
          // insert data via store (API)
          await penjualanStore.insert(dataToSave);
        }
        // Setelah sukses, kembali ke halaman grid
        handleCancel();
      } catch (err) {
        notify(err?.message || "Failed to save data.", "error", 3000);
      }
    }
  };

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
          // colCount={1}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={isReadOnly}
        >
          <GroupItem caption="Header" colCount={4}>
            <SimpleItem
              dataField="jualh_kode"
              label={{ text: "Kode" }}
            >
              <RequiredRule />
              <StringLengthRule max={10} message="Kode max 10 karakter" />
            </SimpleItem>
            <SimpleItem
              dataField="jualh_date"
              label={{ text: "Tanggal Penjualan" }}
              editorType="dxDateBox"
              editorOptions={{
                displayFormat: "dd-MMM-yyyy",
              }}
            >
              <RequiredRule />
            </SimpleItem>
            <SimpleItem
              dataField="outlet_id"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: lookupRefOutlet,
                valueExpr: "outlet_id",
                displayExpr: "display",
                searchEnabled: true,
                placeholder: "Pilih Outlet...",
                onValueChanged: handleSelectBoxOutlet,
              }}
              label={{ text: "Outlet" }}
            >
              <RequiredRule />
            </SimpleItem>
            <SimpleItem
              dataField="sales_id"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: lookupRefSales,
                valueExpr: "sales_id",
                displayExpr: "display",
                searchEnabled: true,
                placeholder: "Pilih Sales...",
              }}
              label={{ text: "Sales" }}
            >
              <RequiredRule />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Detail">
            <PenjualanFormDetailGrid
              outletId={formData.outlet_id}
              tempId={formData.temptable_detail_id}
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

export default PenjualanForm;
