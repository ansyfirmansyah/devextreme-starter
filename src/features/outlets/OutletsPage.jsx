/* Ini contoh Page dengan Form yang auto dari devextreme (contoh form yang custom ada di page lain) */
import React, { useCallback, useState } from "react";
import { Popup } from "devextreme-react/popup";
import Form, {
  SimpleItem,
} from "devextreme-react/form";

import OutletsGrid from "./components/OutletsGrid";

const OutletsPage = () => {
  // state untuk view mode
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
        title="Outlet Info"
        width={700}
        height={250}
      >
        {/* Ini untuk render form khusus view, untuk create dan edit sudah auto dibuat datagrid */}
        <Form
          formData={viewingOutlet}
          readOnly={true} // selalu true karena khusus view
          labelLocation="top"
          colCount={2}
        >
          {/* Definisikan field yang ingin ditampilkan ketika view */}
          <SimpleItem dataField="outlet_kode" label={{ text: "Kode Outlet" }}>
          </SimpleItem>
          <SimpleItem dataField="outlet_nama" label={{ text: "Nama Outlet" }}>
          </SimpleItem>
        </Form>
      </Popup>
    </>
  );
};

export default OutletsPage;
