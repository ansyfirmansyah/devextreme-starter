import React, { useState, useEffect } from "react";
import Form, { SimpleItem, GroupItem } from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import { getUserProfile } from "../../services/accountService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

// Helper untuk memformat tanggal atau menampilkan '-' jika null
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfileData(data);
      } catch (error) {
        notify(error.message, "error", 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profileData) {
    return (
      <div className="text-center text-red-500">Gagal memuat data profil.</div>
    );
  }

  // Siapkan data untuk ditampilkan, termasuk format tanggal
  const displayData = {
    ...profileData,
    registrationDate: formatDate(profileData.registrationDate),
    lastLoginDate: formatDate(profileData.lastLoginDate),
    lastPasswordChangeDate: formatDate(profileData.lastPasswordChangeDate),
    role: profileData.role || "-", // Tampilkan strip jika role null
  };

  return (
    <div className="form-container max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-bi-slate-800 mb-6">Profil Saya</h2>
      <Form
        formData={displayData}
        readOnly={true}
        labelLocation="left"
        labelMode="outside"
        colCount={2}
      >
        <GroupItem caption="Informasi Personal">
          <SimpleItem dataField="userName" label={{ text: "Nama" }} />
          <SimpleItem dataField="email" label={{ text: "Email" }} />
          <SimpleItem dataField="address" label={{ text: "Alamat" }} />
          <SimpleItem dataField="phoneNumber" label={{ text: "Telepon" }} />
        </GroupItem>

        <GroupItem caption="Informasi Akun">
          <SimpleItem dataField="role" label={{ text: "Role" }} />
          <SimpleItem
            dataField="registrationDate"
            label={{ text: "Tanggal Daftar" }}
          />
          <SimpleItem
            dataField="lastLoginDate"
            label={{ text: "Terakhir Login" }}
          />
          <SimpleItem
            dataField="lastPasswordChangeDate"
            label={{ text: "Terakhir Ganti Password" }}
          />
        </GroupItem>
      </Form>
    </div>
  );
};

export default UserProfilePage;
