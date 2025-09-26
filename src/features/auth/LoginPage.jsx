import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, SimpleItem, ButtonItem, RequiredRule } from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';
import { login as authServiceLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { UAParser } from 'ua-parser-js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ userId: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const parser = new UAParser();
    const result = parser.getResult();
    const deviceInfo = `${result.browser.name} v${result.browser.version} on ${result.os.name} v${result.os.version}`;

    try {
      // Panggil service, sekarang hanya mengembalikan data user
      const { accessToken, refreshToken, userId, userName } = await authServiceLogin(formData.userId, formData.password, deviceInfo);
      // Panggil login dari context dengan data user
      // Tidak ada lagi token yang perlu diurus di sini
      login({ userId, userName }, accessToken, refreshToken);

      notify('Login berhasil!', 'success', 2000);
      navigate('/');
    } catch (error) {
      notify(error.message, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- SISI KIRI: BRANDING (HILANG DI LAYAR KECIL) --- */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-tr from-bi-blue-700 to-bi-blue-900">
        <div className="flex flex-col items-center justify-center h-full p-12 text-white">
          <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <h1 className="mt-6 text-4xl font-bold">DevExtreme Starter</h1>
          <p className="mt-4 text-lg text-center text-bi-blue-200">
            Manajemen data menjadi lebih mudah, cepat, dan modern.
          </p>
        </div>
      </div>

      {/* --- SISI KANAN: FORM LOGIN --- */}
      <div className="flex flex-col justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md mx-auto">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-bi-slate-800">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-bi-slate-600">
              Welcome back! Please enter your details.
            </p>
          </div>
          <div className="mt-8">
            <form onSubmit={handleSubmit}>
              <Form formData={formData} labelMode="floating">
                <SimpleItem dataField="userId" editorType="dxTextBox"
                  editorOptions={{
                    stylingMode: 'filled',
                    placeholder: 'Enter your User ID'
                  }}>
                  <RequiredRule message="User ID is required" />
                </SimpleItem>
                <SimpleItem dataField="password"
                  editorOptions={{
                    mode: 'password',
                    stylingMode: 'filled',
                    placeholder: 'Enter your password'
                  }}>
                  <RequiredRule message="Password is required" />
                </SimpleItem>
                <ButtonItem
                  horizontalAlignment="stretch"
                  buttonOptions={{
                    text: loading ? 'Signing in...' : 'Sign In',
                    type: 'default',
                    useSubmitBehavior: true,
                    disabled: loading,
                    height: '45px', // Tombol lebih besar
                    elementAttr: { class: 'form-save-button' }
                  }}
                />
              </Form>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;