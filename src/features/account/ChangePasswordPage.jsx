import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  SimpleItem,
  ButtonItem,
  RequiredRule,
  CompareRule,
  StringLengthRule,
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import { changePassword } from "../../services/accountService";
import { useAuth } from "../../context/AuthContext";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  // state untuk buka atau sensor password
  const [currentPasswordMode, setCurrentPasswordMode] = useState('password');
  const [newPasswordMode, setNewPasswordMode] = useState('password');
  const [confirmNewPasswordMode, setConfirmNewPasswordMode] = useState('password');
  const currentPasswordButton = {
    name: 'currentPassword', location: 'after',
    options: { icon: currentPasswordMode === 'password' ? 'eyeopen' : 'eyeclose', stylingMode: 'text', onClick: () => setCurrentPasswordMode(prev => prev === 'password' ? 'text' : 'password') }
  };
  const newPasswordButton = {
    name: 'newPassword', location: 'after',
    options: { icon: newPasswordMode === 'password' ? 'eyeopen' : 'eyeclose', stylingMode: 'text', onClick: () => setNewPasswordMode(prev => prev === 'password' ? 'text' : 'password') }
  };
  const confirmNewPasswordButton = {
    name: 'confirmNewPassword', location: 'after',
    options: { icon: confirmNewPasswordMode === 'password' ? 'eyeopen' : 'eyeclose', stylingMode: 'text', onClick: () => setConfirmNewPasswordMode(prev => prev === 'password' ? 'text' : 'password') }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      notify(
        "Password berhasil diubah, silahkan login dengan password baru!",
        "success",
        2000
      );
      setFormData({}); // Kosongkan form setelah berhasil
      logout();
      navigate("/login");
    } catch (error) {
      notify(error.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-bi-slate-800 mb-4">
        Ganti Password
      </h2>
      <p className="text-sm text-bi-slate-600 mb-6">
        Mengganti password untuk user:{" "}
        <span className="font-semibold">{user?.userName}</span>
      </p>
      <form onSubmit={handleSubmit}>
        <Form
          formData={formData}
          onFormDataChange={(e) => setFormData(e.formData)}
          labelLocation="top"
        >
          <SimpleItem
            dataField="currentPassword"
            caption="Password Saat Ini"
            editorType="dxTextBox"
            editorOptions={{ mode: currentPasswordMode, buttons: [currentPasswordButton] }}
          >
            <RequiredRule message="Password saat ini harus diisi" />
          </SimpleItem>

          <SimpleItem
            dataField="newPassword"
            caption="Password Baru"
            editorType="dxTextBox"
            editorOptions={{ mode: newPasswordMode, buttons: [newPasswordButton] }}
          >
            <RequiredRule message="Password baru harus diisi" />
            <StringLengthRule min={8} message="Password minimal 8 karakter" />
          </SimpleItem>

          <SimpleItem
            dataField="confirmNewPassword"
            caption="Konfirmasi Password Baru"
            editorType="dxTextBox"
            editorOptions={{ mode: confirmNewPasswordMode, buttons: [confirmNewPasswordButton] }}
          >
            <RequiredRule message="Konfirmasi password harus diisi" />
            <CompareRule
              comparisonTarget={() => formData.newPassword}
              message="Password baru tidak cocok"
            />
          </SimpleItem>

          <ButtonItem
            horizontalAlignment="right"
            buttonOptions={{
              text: loading ? "Menyimpan..." : "Simpan Perubahan",
              type: "default",
              useSubmitBehavior: true,
              disabled: loading,
              elementAttr: { class: "form-save-button mt-4" },
            }}
          />
        </Form>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
