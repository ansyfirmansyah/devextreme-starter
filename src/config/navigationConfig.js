// File ini adalah satu-satunya sumber kebenaran untuk semua navigasi.
// Menambah menu baru di masa depan hanya perlu dilakukan di sini.

import React from 'react';

import CustomersPage from '../features/customers/CustomersPage';
import OutletsPage from '../features/outlets/OutletsPage';
import { SalesReportPage, StockReportPage } from '../features/SamplePages';
import SalesPage from '../features/sales/SalesPage';

// 1. Ubah struktur menjadi tree. Gunakan properti 'items' untuk sub-menu.
export const navigationRoutes = [
  { 
    id: 1, 
    text: 'Customers', 
    icon: 'group', 
    component: CustomersPage
  },
  { 
    id: 2, 
    text: 'Outlets', 
    icon: 'home', 
    component: OutletsPage
  },
    {
    id: 4, // Ganti ID agar unik
    text: 'Sales',
    icon: 'user',
    component: SalesPage,
  },
  {
    id: 3,
    text: 'Reports', // Menu ini tidak punya 'component', hanya sebagai folder
    icon: 'doc',
    expanded: false, // Kita bisa set defaultnya tertutup
    items: [ // Ini adalah sub-menunya
      {
        id: 31,
        text: 'Sales Report',
        icon: 'money',
        component: SalesReportPage,
      },
      {
        id: 32,
        text: 'Stock Report',
        icon: 'box',
        component: StockReportPage,
      }
    ]
  },
];

