// File ini adalah satu-satunya sumber kebenaran untuk semua navigasi.
// Menambah menu baru di masa depan hanya perlu dilakukan di sini.

import React from "react";

import CustomersPage from "../features/customers/CustomersPage";
import OutletsPage from "../features/outlets/OutletsPage";
import {
  HomePage,
  SalesReportPage,
  StockReportPage,
} from "../features/SamplePages";
import SalesPage from "../features/sales/SalesPage";
import KlasifikasiPage from "../features/klasifikasi/KlasifikasiPage";
import BarangPage from "../features/barang/BarangPage";
import StrukPenjualanPage from "../features/reports/struk/StrukPenjualanPage";
import SampleReport from "../features/reports/struk/SampleReport";

// 1. Ubah struktur menjadi tree. Gunakan properti 'items' untuk sub-menu.
export const navigationRoutes = [
  {
    id: 0,
    text: "Home",
    icon: "home",
    path: "/home",
    component: HomePage,
  },
  {
    id: 1,
    text: "Customers",
    icon: "group",
    path: "/customers",
    component: CustomersPage,
  },
  {
    id: 2,
    text: "Outlets",
    icon: "map",
    path: "/outlets",
    component: OutletsPage,
  },
  {
    id: 3,
    text: "Sales",
    icon: "user",
    path: "/sales",
    component: SalesPage,
  },
  {
    id: 4,
    text: "Klasifikasi Barang",
    icon: "box",
    path: "/klasifikasi",
    component: KlasifikasiPage,
  },
  {
    id: 5,
    text: "Master Barang",
    icon: "product",
    path: "/barang",
    component: BarangPage,
  },
  {
    id: 999,
    text: "Reports", // Menu ini tidak punya 'component', hanya sebagai folder
    icon: "doc",
    expanded: false, // Kita bisa set defaultnya tertutup
    items: [
      // Ini adalah sub-menunya
      {
        id: 9991,
        text: "Sample",
        icon: "box",
        path: "/reports/sample",
        component: SampleReport,
      },
      {
        id: 9992,
        text: "Struk Penjualan",
        icon: "money",
        path: "/reports/struk-penjualan",
        component: StrukPenjualanPage,
      },
    ],
  },
];
