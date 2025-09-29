import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  SimpleItem,
  ButtonItem,
  RequiredRule,
  EmailRule,
  CompareRule,
  StringLengthRule,
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import { Button } from "devextreme-react/button";
import {
  checkRegistrationDetails,
  completeRegistration,
} from "../../services/authService";

// Komponen Ikon untuk UI yang lebih baik (ikon sukses registrasi)
const SuccessIcon = () => (
  <svg
    className="w-24 h-24 text-green-500 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Panel branding di sisi kiri (hanya tampil di layar besar)
const BrandingPanel = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-bi-blue-700 to-bi-blue-900 items-center justify-center p-12 text-center text-white">
    <div>
      <svg
        className="w-24 h-24 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
      <h1 className="mt-6 text-4xl font-bold">Mulai Perjalanan Anda</h1>
      <p className="mt-4 text-lg text-bi-blue-200">
        Buat akun baru untuk mengakses semua fitur manajemen data kami.
      </p>
    </div>
  </div>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Status loading tombol
  const [step, setStep] = useState(1); // Step proses registrasi (1: data diri, 2: password, 3: selesai)
  const [formData, setFormData] = useState({}); // Data form yang diisi user
  const [tempToken, setTempToken] = useState(""); // Token sementara dari backend setelah step 1
  const [newUserId, setNewUserId] = useState(""); // User ID baru setelah registrasi sukses

  // Handler submit step 1: validasi data diri
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await checkRegistrationDetails(formData);
      setTempToken(token);
      setStep(2);
    } catch (error) {
      notify(error.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handler submit step 2: buat password & selesaikan registrasi
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = await completeRegistration(tempToken, formData.password);
      setNewUserId(userId);
      setStep(3);
    } catch (error) {
      notify(error.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  // Salin User ID ke clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(newUserId);
    notify("User ID berhasil disalin!", "success", 2000);
  };

  // Syarat password yang harus dipenuhi user
  const passwordRequirements = [
    "Minimal 8 karakter",
    "Mengandung huruf besar (A-Z)",
    "Mengandung huruf kecil (a-z)",
    "Mengandung angka (0-9)",
    "Mengandung karakter spesial (@$!%*?&)",
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <BrandingPanel />
      <div className="flex flex-col justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md mx-auto">
          {/* Step 1: Form data diri */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-bi-slate-800">
                Registrasi Akun
              </h2>
              <p className="mt-2 text-sm text-bi-slate-600">
                Langkah 1 dari 2: Isi data diri Anda.
              </p>
              <form onSubmit={handleStep1Submit} className="mt-8">
                <Form
                  formData={formData}
                  onFormDataChange={(e) => setFormData(e.formData)}
                  labelMode="floating"
                >
                  {/* Nama wajib diisi */}
                  <SimpleItem
                    dataField="userName"
                    editorOptions={{ stylingMode: "filled", placeholder: " " }}
                  >
                    <RequiredRule message="Nama harus diisi" />
                  </SimpleItem>
                  {/* Email wajib diisi dan harus valid */}
                  <SimpleItem
                    dataField="email"
                    editorOptions={{ stylingMode: "filled", placeholder: " " }}
                  >
                    <RequiredRule message="Email harus diisi" />
                    <EmailRule message="Format email tidak valid" />
                  </SimpleItem>
                  {/* Alamat opsional */}
                  <SimpleItem
                    dataField="address"
                    caption="Alamat (Opsional)"
                    editorOptions={{ stylingMode: "filled", placeholder: " " }}
                  />
                  {/* Nomor telepon opsional */}
                  <SimpleItem
                    dataField="phoneNumber"
                    caption="Nomor Telepon (Opsional)"
                    editorOptions={{ stylingMode: "filled", placeholder: " " }}
                  />
                  {/* Tombol submit step 1 */}
                  <ButtonItem
                    buttonOptions={{
                      text: loading ? "Memvalidasi..." : "Lanjut",
                      useSubmitBehavior: true,
                      disabled: loading,
                      height: "45px",
                      elementAttr: { class: "form-save-button mt-4" },
                    }}
                  />
                </Form>
              </form>
            </div>
          )}

          {/* Step 2: Form password */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-bi-slate-800">
                Buat Password Aman
              </h2>
              <p className="mt-2 text-sm text-bi-slate-600">
                Langkah 2 dari 2: Lindungi akun Anda.
              </p>
              <form onSubmit={handleStep2Submit} className="mt-8">
                <Form
                  formData={formData}
                  onFormDataChange={(e) => setFormData(e.formData)}
                  labelMode="floating"
                >
                  {/* Password wajib diisi dan minimal 8 karakter */}
                  <SimpleItem
                    dataField="password"
                    editorOptions={{
                      mode: "password",
                      stylingMode: "filled",
                      placeholder: " ",
                    }}
                  >
                    <RequiredRule />
                    <StringLengthRule
                      min={8}
                      message="Password min 8 karakter"
                    />
                  </SimpleItem>
                  {/* Konfirmasi password wajib dan harus sama */}
                  <SimpleItem
                    dataField="confirmPassword"
                    caption="Konfirmasi Password"
                    editorOptions={{
                      mode: "password",
                      stylingMode: "filled",
                      placeholder: " ",
                    }}
                  >
                    <RequiredRule />
                    <CompareRule
                      comparisonTarget={() => formData.password}
                      message="Password tidak cocok"
                    />
                  </SimpleItem>
                  {/* Tombol submit step 2 */}
                  <ButtonItem
                    buttonOptions={{
                      text: loading ? "Membuat Akun..." : "Selesai & Buat Akun",
                      useSubmitBehavior: true,
                      disabled: loading,
                      height: "45px",
                      elementAttr: { class: "form-save-button mt-4" },
                    }}
                  />
                </Form>
                {/* Syarat password */}
                <div className="mt-4 text-xs text-bi-slate-500">
                  <p className="font-semibold">Password harus memenuhi:</p>
                  <ul className="list-disc list-inside pl-2">
                    {passwordRequirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Registrasi sukses, tampilkan User ID */}
          {step === 3 && (
            <div className="text-center">
              <SuccessIcon />
              <h2 className="text-3xl font-bold text-bi-slate-800 mt-4">
                Registrasi Berhasil!
              </h2>
              <p className="mt-2 text-bi-slate-600">
                Akun Anda telah dibuat. <b>Harap simpan User ID di bawah ini</b>
                karena akan digunakan untuk login.
              </p>
              <div className="p-4 my-6 bg-blue-50 border-l-4 border-bi-blue-500 text-bi-blue-800">
                <p className="font-bold">User ID Anda:</p>
                <p className="text-3xl font-mono tracking-widest my-2">
                  {newUserId}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Tombol salin User ID */}
                <Button
                  text="Salin User ID"
                  icon="copy"
                  onClick={copyToClipboard}
                  type="default"
                  height="45px"
                  elementAttr={{ class: "form-save-button" }}
                />
                {/* Tombol lanjut ke login */}
                <Button
                  text="Lanjut ke Login"
                  onClick={() => navigate("/login")}
                  type="normal"
                  height="45px"
                  stylingMode="outlined"
                />
              </div>
            </div>
          )}

          {/* Link ke login jika belum selesai registrasi */}
          {step < 3 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-bi-slate-600">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-medium text-bi-blue-700 hover:underline"
                >
                  Login di sini
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
