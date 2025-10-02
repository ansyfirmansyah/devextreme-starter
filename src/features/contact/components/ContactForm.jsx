import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  EmailRule,
  PatternRule,
  NumericRule,
  StringLengthRule,
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import 'devextreme-react/switch';
import 'devextreme/ui/switch';

import FormActions from "../../../components/ui/FormActions";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import {
  contactStore,
  getCityDataSource,
  getContactById,
  getContactStatusDataSource,
  getCountryDataSource,
  getLeadSourceDataSource,
} from "../../../services/contactService";

const phonePattern = /^[0-9\s\-+()]*$/;

const newContactTemplate = {
  full_name: "",
  email: "",
  is_subscribed: false,
  date_added: new Date(),
};

const ContactForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!id;
  const isReadOnly = isEditMode && !location.pathname.endsWith("/edit");

  // State untuk menyimpan daftar negara, status, sumber prospek dan kota
  const [lookupRefCountries, setLookupRefCountries] = useState(null);
  const [lookupRefStatuses, setLookupRefStatuses] = useState(null);
  const [lookupRefSources, setLookupRefSources] = useState(null);
  const [lookupRefCities, setLookupRefCities] = useState(null);
  // useEffect untuk memuat data lookup (negara, status, sumber prospek) saat komponen pertama kali dimuat
  useEffect(() => {
    const loadLookups = async () => {
      try {
        // Ambil semua data lookup secara paralel
        const [countriesData, statusesData, sourcesData] =
          await Promise.all([
            getCountryDataSource().load(),
            getContactStatusDataSource().load(),
            getLeadSourceDataSource().load(),
          ]);

        // Simpan data ke state masing-masing
        setLookupRefCountries(countriesData);
        setLookupRefStatuses(statusesData);
        setLookupRefSources(sourcesData);
      } catch (error) {
        notify("Gagal memuat data untuk dropdown.", "error", 2000);
      }
    };

    loadLookups();
  }, []); // Dependensi kosong memastikan ini hanya berjalan sekali
  // useEffect untuk memuat daftar kota setiap kali negara berubah
  useEffect(() => {
    if (!formData?.country_id) {
      setLookupRefCities(null);
      return;
    }
    const ds = getCityDataSource(formData?.country_id);
    // Load datanya
    ds.load()
      .then((data) => {
        // Simpan hasilnya di state
        setLookupRefCities(data);
      })
      .catch((error) => {
        console.error("Gagal memuat data sales:", error);
      });
  }, [formData?.country_id]);
  // Handler untuk perubahan di select box negara
  const handleSelectBoxCountry = (e) => {
    setFormData({ ...formData, country_id: e.value });
  };

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      getContactById(id)
        .then((data) => {
          setFormData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          notify(err?.message || "Failed to load data.", "error", 3000);
          navigate("/contacts");
          setIsLoading(false);
        });
    } else {
      setFormData({ ...newContactTemplate });
    }
  }, [id, isEditMode, navigate]);

  // Handler untuk tombol Cancel / Back, -1 artinya kembali ke halaman sebelumnya sesuai history browser
  // useCallback agar tidak terjadi infinite loop pada useEffect di parent component
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
          await contactStore.update(id, dataToSave);
        } else {
          // insert data via store (API)
          await contactStore.insert(dataToSave);
        }
        // Setelah sukses, kembali ke halaman grid
        handleCancel();
      } catch (err) {
        notify(err?.message || "Failed to save data.", "error", 3000);
      }
    }
  };

  if (isLoading || !formData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <Form
          ref={formRef}
          formData={formData}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={isReadOnly}
        >
          <GroupItem colCount={2}>
            <GroupItem caption="Informasi Utama">
              <SimpleItem dataField="full_name" label={{ text: "Nama" }}>
                <RequiredRule message="Nama Lengkap harus diisi" />
                <StringLengthRule max={200} />
              </SimpleItem>
              <SimpleItem dataField="email" label={{ text: "Email" }}>
                <RequiredRule message="Email harus diisi" />
                <EmailRule message="Format email tidak valid" />
                <StringLengthRule max={100} />
              </SimpleItem>
              <SimpleItem
                dataField="phone_number"
                label={{ text: "Nomor Telepon" }}
              >
                <PatternRule
                  pattern={phonePattern}
                  message="Hanya angka dan simbol telepon yang diizinkan"
                />
                <StringLengthRule max={25} />
              </SimpleItem>
              <SimpleItem
                dataField="is_subscribed"
                editorType="dxSwitch"
                editorOptions={{
                  switchedOnText: "Ya",
                  switchedOffText: "Tidak",
                  width: 50,
                }}
                label={{ text: "Berlangganan Newsletter" }}
              />
            </GroupItem>

            <GroupItem caption="Informasi Pekerjaan">
              <SimpleItem dataField="company" label={{ text: "Perusahaan" }}>
                <StringLengthRule max={100} />
              </SimpleItem>
              <SimpleItem dataField="job_title" label={{ text: "Jabatan" }}>
                <StringLengthRule max={100} />
              </SimpleItem>
              <SimpleItem
                dataField="estimated_value"
                label={{ text: "Perkiraan Nilai (Rp)" }}
                editorType="dxNumberBox"
                editorOptions={{ format: "#,##0" }}
              >
                <NumericRule />
              </SimpleItem>
            </GroupItem>
          </GroupItem>

          <GroupItem caption="Alamat" colCount={2}>
            <SimpleItem
              dataField="address"
              colSpan={2}
              editorType="dxTextArea"
              editorOptions={{ height: 60 }}
              label={{ text: "Alamat" }}
            >
              <StringLengthRule max={255} />
            </SimpleItem>
            <SimpleItem
              dataField="country_id"
              label={{ text: "Negara" }}
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: lookupRefCountries,
                valueExpr: "country_id",
                displayExpr: "country_name",
                searchEnabled: true,
                placeholder: "Pilih Negara...",
                onValueChanged: handleSelectBoxCountry,
              }}
            >
              <RequiredRule message="Kota harus diisi" />
            </SimpleItem>
            <SimpleItem
              dataField="city_id"
              label={{ text: "Kota" }}
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: lookupRefCities,
                valueExpr: "city_id",
                displayExpr: "city_name",
                searchEnabled: true,
                placeholder: "Pilih Kota...",
              }}
            >
              <RequiredRule message="Kota harus diisi" />
            </SimpleItem>
            <SimpleItem
              dataField="postal_code"
              label={{ text: "Kode Pos" }}
              editorType="dxNumberBox"
              editorOptions={{ showSpinButtons: false }}
            >
              <NumericRule />
            </SimpleItem>
          </GroupItem>

          <GroupItem caption="Status & Lainnya" colCount={4}>
            <SimpleItem
              dataField="contact_status_id"
              label={{ text: "Status" }}
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: lookupRefStatuses,
                valueExpr: "contact_status_id",
                displayExpr: "contact_status_name",
                placeholder: "Pilih Status...",
              }}
            >
              <RequiredRule message="Status diisi" />
            </SimpleItem>
            <SimpleItem
              dataField="lead_source_id"
              label={{ text: "Sumber Prospek" }}
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: lookupRefSources,
                valueExpr: "lead_source_id",
                displayExpr: "lead_source_name",
                placeholder: "Pilih Sumber Prospek...",
              }}
            >
              <RequiredRule message="Sumber Prospek harus diisi" />
            </SimpleItem>
            <SimpleItem
              dataField="date_added"
              label={{ text: "Tanggal Didaftarkan" }}
              editorType="dxDateBox"
              editorOptions={{
                displayFormat: "dd-MMM-yyyy",
              }}
            />
            <SimpleItem
              dataField="last_contacted_date"
              label={{ text: "Terakhir Dihubungi" }}
              editorType="dxDateBox"
              editorOptions={{
                displayFormat: "dd-MMM-yyyy",
                showClearButton: true,
              }}
            />
          </GroupItem>

          <GroupItem colCount={1}>
            <SimpleItem
              dataField="notes"
              label={{ text: "Catatan" }}
              editorType="dxTextArea"
              editorOptions={{ height: 100 }}
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

export default ContactForm;
