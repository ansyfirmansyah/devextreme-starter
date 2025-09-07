import React, { useCallback, useState } from "react";
// Halaman ini hanya bertindak sebagai container untuk grid.
// Tidak ada state, tidak ada useEffect, tidak ada handler. Sangat bersih.
import OutletsGrid from "./components/OutletsGrid";
import { Popup } from "devextreme-react/popup";
import Form, { SimpleItem, GroupItem } from "devextreme-react/form";

const OutletsPage = () => {
  const [isViewPopupVisible, setIsViewPopupVisible] = useState(false);
  const [viewingOutlet, setViewingOutlet] = useState(null);

  const handleViewClick = useCallback((outletData) => {
    setViewingOutlet(outletData); // Simpan data yang akan ditampilkan
    setIsViewPopupVisible(true); // Tampilkan popup
  }, []);

  const handlePopupHiding = useCallback(() => {
    setIsViewPopupVisible(false);
    setViewingOutlet(null);
  }, []);
  return (
    <>
      <OutletsGrid onViewClick={handleViewClick} />

      {/* 4. Tambahkan komponen Popup di sini */}
      <Popup
        visible={isViewPopupVisible}
        onHiding={handlePopupHiding}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showTitle={true}
        title="View Outlet Details"
        width={700}
        height={250}
      >
        {/* Di dalam popup, kita render Form yang read-only */}
        <Form
          formData={viewingOutlet}
          readOnly={true}
          labelLocation="top"
          colCount={2}
        >
          {/* Definisikan field yang ingin ditampilkan */}
          <SimpleItem dataField="outlet_kode" caption="Kode Outlet" />
          <SimpleItem dataField="outlet_nama" caption="Nama Outlet" />
        </Form>
      </Popup>
    </>
  );
};

export default OutletsPage;
