// File ini adalah satu-satunya sumber kebenaran untuk semua navigasi.
// Menambah menu baru di masa depan hanya perlu dilakukan di sini.

import React from "react";

import CustomersPage from "../features/customers/CustomersPage";
import OutletsPage from "../features/outlets/OutletsPage";
import SalesPage from "../features/sales/SalesPage";
import KlasifikasiPage from "../features/klasifikasi/KlasifikasiPage";
import BarangPage from "../features/barang/BarangPage";
import StrukPenjualanPage from "../features/reports/struk/StrukPenjualanPage";
import OutletSummaryPage from "../features/reports/struk/OutletSummaryPage";
import PenjualanPage from "../features/penjualan/PenjualanPage";
import { ICONS } from "../components/icon/menuIcon";
import HomePage from "../features/dashboard/HomePage";
import RolesPage from "../features/role/RolesPage";
import ContactPage from "../features/contact/ContactPage";

export const navigationRoutes = [
  {
    id: 0,
    text: "Home",
    icon: ICONS.home,
    path: "/home",
    component: HomePage,
    permissionCode: "MENU_HOME", // Contoh hak akses
  },
  {
    id: 1,
    text: "Sample Page",
    icon: ICONS.file,
    path: "/sample",
    component: CustomersPage,
    permissionCode: "MENU_SAMPLE",
  },
  {
    id: 2,
    text: "Outlets",
    icon: ICONS.outlets,
    path: "/outlets",
    component: OutletsPage,
    permissionCode: "MENU_OUTLETS",
    permissions: {
      create: "OUTLET_CREATE",
      edit: "OUTLET_EDIT",
      delete: "OUTLET_DELETE",
    },
  },
  {
    id: 3,
    text: "Sales",
    icon: ICONS.sales,
    path: "/sales",
    component: SalesPage,
    permissionCode: "MENU_SALES",
    permissions: {
      create: "SALES_CREATE",
      edit: "SALES_EDIT",
      delete: "SALES_DELETE",
      upload: "SALES_UPLOAD",
    },
  },
  {
    id: 4,
    text: "Product Classification",
    icon: ICONS.box,
    path: "/klasifikasi",
    component: KlasifikasiPage,
    permissionCode: "MENU_KLASIFIKASI",
    permissions: {
      create: "KLASIFIKASI_CREATE",
      edit: "KLASIFIKASI_EDIT",
      delete: "KLASIFIKASI_DELETE",
    },
  },
  {
    id: 5,
    text: "Products",
    icon: ICONS.product,
    path: "/barang",
    component: BarangPage,
    permissionCode: "MENU_BARANG",
    permissions: {
      create: "BARANG_CREATE",
      edit: "BARANG_EDIT",
      delete: "BARANG_DELETE",
    },
  },
  {
    id: 6,
    text: "Transactions",
    icon: ICONS.cart,
    path: "/penjualan",
    component: PenjualanPage,
    permissionCode: "MENU_PENJUALAN",
    permissions: {
      create: "PENJUALAN_CREATE",
      edit: "PENJUALAN_EDIT",
      delete: "PENJUALAN_DELETE",
      upload: "PENJUALAN_UPLOAD",
    },
  },
  {
    id: 7,
    text: "Contacts",
    icon: ICONS.contacts,
    path: "/contacts",
    component: ContactPage,
    permissionCode: "MENU_CONTACTS",
    permissions: {
      create: "CONTACT_CREATE",
      edit: "CONTACT_EDIT",
      delete: "CONTACT_DELETE",
    },
  },
  {
    id: 8,
    text: "Role Management",
    icon: ICONS.circleStack,
    path: "/roles",
    component: RolesPage,
    permissionCode: "MENU_ROLES",
    permissions: {
      create: "ROLES_CREATE",
      edit: "ROLES_EDIT",
      delete: "ROLES_DELETE",
    },
  },
  {
    id: 999,
    text: "Reports",
    icon: ICONS.reports,
    expanded: false,
    permissionCode: "MENU_REPORTS", // Hak akses untuk menu induk
    items: [
      {
        id: 9991,
        parentId: 999,
        text: "Transaction Receipts",
        icon: ICONS.money,
        path: "/reports/struk-penjualan",
        component: StrukPenjualanPage,
        permissionCode: "MENU_REPORTS_STRUK",
      },
      {
        id: 9992,
        parentId: 999,
        text: "Outlet Summary",
        icon: ICONS.money,
        path: "/reports/outlet-summary",
        component: OutletSummaryPage,
        permissionCode: "MENU_REPORTS_OUTLET",
      },
    ],
  },
];
