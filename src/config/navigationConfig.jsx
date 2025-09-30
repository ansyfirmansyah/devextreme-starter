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

export const navigationRoutes = [
  {
    id: 0,
    text: "Home",
    icon: ICONS.home,
    path: "/home",
    component: HomePage,
    permissionCode: 'MENU_HOME' // Contoh hak akses
  },
  {
    id: 1,
    text: "Sample Page",
    icon: ICONS.file,
    path: "/sample",
    component: CustomersPage,
    permissionCode: 'MENU_SAMPLE'
  },
  {
    id: 2,
    text: "Outlets",
    icon: ICONS.outlets,
    path: "/outlets",
    component: OutletsPage,
    permissionCode: 'MENU_OUTLETS'
  },
  {
    id: 3,
    text: "Sales",
    icon: ICONS.sales,
    path: "/sales",
    component: SalesPage,
    permissionCode: 'MENU_SALES'
  },
  {
    id: 4,
    text: "Klasifikasi Barang",
    icon: ICONS.box,
    path: "/klasifikasi",
    component: KlasifikasiPage,
    permissionCode: 'MENU_KLASIFIKASI'
  },
  {
    id: 5,
    text: "Master Barang",
    icon: ICONS.product,
    path: "/barang",
    component: BarangPage,
    permissionCode: 'MENU_BARANG'
  },
  {
    id: 6,
    text: "Penjualan",
    icon: ICONS.cart,
    path: "/penjualan",
    component: PenjualanPage,
    permissionCode: 'MENU_PENJUALAN'
  },
  {
    id: 7,
    text: "Manajemen Role",
    icon: ICONS.circleStack, // Sementara pakai ikon sales, bisa diganti
    path: "/roles",
    component: RolesPage,
    permissionCode: 'MENU_ROLES'
  },
  {
    id: 999,
    text: "Reports",
    icon: ICONS.reports,
    expanded: false,
    permissionCode: 'MENU_REPORTS', // Hak akses untuk menu induk
    items: [
      {
        id: 9991,
        parentId: 999,
        text: "Struk Penjualan",
        icon: ICONS.money,
        path: "/reports/struk-penjualan",
        component: StrukPenjualanPage,
        permissionCode: 'MENU_REPORTS_STRUK'
      },
      {
        id: 9992,
        parentId: 999,
        text: "Outlet Summary",
        icon: ICONS.money,
        path: "/reports/outlet-summary",
        component: OutletSummaryPage,
        permissionCode: 'MENU_REPORTS_OUTLET'
      },
    ],
  },
];
