// File ini adalah satu-satunya sumber kebenaran untuk semua navigasi.
// Menambah menu baru di masa depan hanya perlu dilakukan di sini.

import React from "react";

import CustomersPage from "../features/customers/CustomersPage";
import OutletsPage from "../features/outlets/OutletsPage";
import {
  DropDownTreePage,
  SalesReportPage,
  StockReportPage,
} from "../features/SamplePages";
import SalesPage from "../features/sales/SalesPage";
import KlasifikasiPage from "../features/klasifikasi/KlasifikasiPage";
import BarangPage from "../features/barang/BarangPage";
import SampleAddToGrid from "../features/SampleAddToGrid";

// 1. Ubah struktur menjadi tree. Gunakan properti 'items' untuk sub-menu.
export const navigationRoutes = [
  // {
  //   id: 1,
  //   text: "Customers",
  //   icon: "group",
  //   component: CustomersPage,
  // },
  {
    id: 2,
    text: "Outlets",
    icon: "home",
    component: OutletsPage,
  },
  {
    id: 3,
    text: "Sales",
    icon: "user",
    component: SalesPage,
  },
  {
    id: 4,
    text: "Klasifikasi Barang",
    icon: "box",
    component: KlasifikasiPage,
  },
  {
    id: 5,
    text: "Master Barang",
    icon: "contentlayout",
    component: BarangPage,
  },
  // {
  //   id: 6,
  //   text: "Test Drop Down Tree",
  //   icon: "home",
  //   component: DropDownTreePage,
  // },
  // {
  //   id: 7,
  //   text: "Test Add to Grid",
  //   icon: "home",
  //   component: SampleAddToGrid,
  // },
  // {
  //   id: 999,
  //   text: 'Reports', // Menu ini tidak punya 'component', hanya sebagai folder
  //   icon: 'doc',
  //   expanded: false, // Kita bisa set defaultnya tertutup
  //   items: [ // Ini adalah sub-menunya
  //     {
  //       id: 9991,
  //       text: 'Sales Report',
  //       icon: 'money',
  //       component: SalesReportPage,
  //     },
  //     {
  //       id: 9992,
  //       text: 'Stock Report',
  //       icon: 'box',
  //       component: StockReportPage,
  //     }
  //   ]
  // },
];
