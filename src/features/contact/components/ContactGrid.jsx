import React, { useState } from "react";
import DataSource from "devextreme/data/data_source";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Pager,
} from "devextreme-react/data-grid";

import { contactStore } from "../../../services/contactService";
import { navigationRoutes } from "../../../config/navigationConfig";
import GridHeader from "../../../components/ui/GridHeader";
import {
  renderContactStatusCell,
  renderDateCell,
  renderHeader,
} from "../../../components/ui/GridCellRenderers";
import ActionCell from "../../../components/ui/ActionCell";
import notify from "devextreme/ui/notify";
import { useEffect } from "react";

const ContactGrid = () => {
  // Gunakan useState untuk membuat DataSource sekali saja
  // Ini mencegah pembuatan ulang DataSource pada setiap render
  // yang bisa menyebabkan masalah pada DataGrid
  const [contactDataSource] = useState(() => new DataSource(contactStore));
  const navigate = useNavigate();

  // Gunakan useSearchParams untuk interaksi dengan URL query params
  const [searchParams, setSearchParams] = useSearchParams();

  // Fungsi untuk membaca page index dari URL saat komponen pertama kali dimuat
  const getInitialPageIndex = () => {
    const pageParam = searchParams.get("page");
    const pageNumber = parseInt(pageParam, 10);
    // URL menggunakan page=1, page=2, sedangkan DataGrid 0-indexed
    return !isNaN(pageNumber) && pageNumber > 0 ? pageNumber - 1 : 0;
  };

  // Ambil permissions dari navigationConfig
  const permissions = useMemo(
    () =>
      navigationRoutes.find((route) => route.path === "/contacts")
        ?.permissions || {},
    []
  );

  // State untuk menyimpan page index terakhir (agar tetap di halaman yang sama saat kembali)
  const [currentPageIndex, setCurrentPageIndex] = useState(getInitialPageIndex);
  useEffect(() => {
    const pageParam = searchParams.get('page');
    // Parse pageParam menjadi integer, 10 adalah radix untuk desimal agar tidak menjadi oktal atau hex
    const pageNumber = parseInt(pageParam, 10);
    const pageIndexFromUrl = !isNaN(pageNumber) && pageNumber > 0 ? pageNumber - 1 : 0;

    // Sinkronkan state komponen jika berbeda dengan URL
    if (pageIndexFromUrl !== currentPageIndex) {
      setCurrentPageIndex(pageIndexFromUrl);
    }
  }, [searchParams]); // Efek ini akan berjalan setiap kali query parameter URL berubah

  /**
   * Handler untuk sinkronisasi page index saat halaman di grid berubah.
   * Disimpan ke state agar bisa dikembalikan saat navigasi.
   */
  const handleOptionChange = (e) => {
    if (e.fullName === "paging.pageIndex") {
      const newPageIndex = e.value;
      setCurrentPageIndex(newPageIndex);
      // Update URL. Tambah 1 agar URL lebih user-friendly (page=1, page=2, dst.)
      setSearchParams({ page: (newPageIndex + 1).toString() });
    }
  };

  /* Handler untuk tombol Add, View, Edit, Delete */
  const handleAdd = () => navigate("new");
  const handleView = (id) => navigate(`${id}`);
  const handleEdit = (id) => navigate(`${id}/edit`);
  const handleDelete = async (id) => {
    const result = await confirm(
      "Apakah Anda yakin ingin menghapus kontak ini?",
      "Konfirmasi Hapus"
    );
    if (result) {
      try {
        await contactStore.remove(id);
        await contactDataSource.reload();
      } catch (err) {
        notify(err?.message || "Gagal menghapus data.", "error", 3000);
      }
    }
  };

  // Render fungsi khusus untuk kolom Actions
  const renderActionCell = ({ data }) => {
    return (
      <ActionCell
        onView={() => handleView(data.contact_id)}
        onEdit={() => handleEdit(data.contact_id)}
        onDelete={() => handleDelete(data.contact_id)}
        editPermissionCode={permissions.edit}
        deletePermissionCode={permissions.delete}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataGrid
        dataSource={contactDataSource}
        height="100%"
        showBorders={true}
        rowAlternationEnabled={true}
        remoteOperations={true}
        onOptionChanged={handleOptionChange}
      >
        // Header grid dengan tombol Add
        <GridHeader
          title="Contacts"
          buttonText="Add Contact"
          onButtonClick={handleAdd}
          addPermissionCode={permissions.create}
        />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        // Pagination dengan sinkronisasi ke URL
        <Paging defaultPageSize={5} pageIndex={currentPageIndex} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />
        <Column
          dataField="full_name"
          caption="Nama"
          headerCellRender={() => renderHeader("Nama")}
        ></Column>
        <Column
          dataField="email"
          caption="Email"
          headerCellRender={() => renderHeader("Email")}
        ></Column>
        <Column
          dataField="company"
          caption="Company"
          headerCellRender={() => renderHeader("Company")}
        ></Column>
        <Column
          dataField="date_added"
          caption="Tanggal Didaftarkan"
          dataType="date"
          cellRender={renderDateCell}
          headerCellRender={() => renderHeader("Tanggal Didaftarkan")}
        />
        <Column
          dataField="contact_status_name"
          caption="Status"
          cellRender={renderContactStatusCell}
          headerCellRender={() => renderHeader("Status")}
        ></Column>
        <Column
          caption="Actions"
          width={120}
          alignment="center"
          cellRender={renderActionCell}
          allowFiltering={false}
          allowSorting={false}
          headerCellRender={() => renderHeader("Actions")}
        />
      </DataGrid>
    </div>
  );
};

export default ContactGrid;
