import { useEffect } from "react";
import { useState } from "react";

import KpiCard from "./components/KpiCard";
import SalesChart from "./components/SalesChart";
import { ICONS } from "../../components/icon/menuIcon";
import { getKpiData } from "../../services/dashboardService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import TopItemsCard from './components/TopItemsCard';
import notify from "devextreme/ui/notify";

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil data KPI dashboard saat komponen pertama kali di-mount
    async function fetchData() {
      try {
        const data = await getKpiData();
        setDashboardData(data?.data);
      } catch (error) {
        // Tampilkan error di konsol jika gagal mengambil data
        console.error(error);
        notify(error?.message || "Failed to fetch data.", "error", 3000);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Tampilkan spinner loading saat data masih dimuat
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 
        Layout utama dashboard:
        - Menggunakan grid 12 kolom untuk fleksibilitas responsif
        - Baris 1: 2 KPI utama (Penjualan & Transaksi)
        - Baris 2: 3 kartu Top Items (Produk, Outlet, Sales)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KPI: Penjualan Bulan Ini */}
        <div className="lg:col-span-6">
          <KpiCard
            title="Penjualan Bulan Ini"
            value={`Rp ${new Intl.NumberFormat("id-ID").format(
              dashboardData?.salesMonth || 0
            )}`}
            icon={ICONS.money}
            color="blue"
          />
        </div>
        {/* KPI: Transaksi Bulan Ini */}
        <div className="lg:col-span-6">
          <KpiCard
            title="Transaksi Bulan Ini"
            value={dashboardData?.transactionsMonth || 0}
            icon={ICONS.cart}
            color="green"
          />
        </div>

        {/* Top Produk Terlaris */}
        <div className="lg:col-span-4">
          <TopItemsCard
            title="Produk Terlaris Bulan Ini"
            items={dashboardData?.topProducts}
            icon={ICONS.product}
            color="yellow"
          />
        </div>
        {/* Top Outlet Teramai */}
        <div className="lg:col-span-4">
          <TopItemsCard
            title="Outlet Teramai Bulan Ini"
            items={dashboardData?.topOutlets}
            icon={ICONS.outlets}
            color="red"
          />
        </div>
        {/* Top Sales Terbaik */}
        <div className="lg:col-span-4">
          <TopItemsCard
            title="Sales Terbaik Bulan Ini"
            items={dashboardData?.topSales}
            icon={ICONS.sales}
            color="blue"
          />
        </div>
      </div>

      {/* 
        Bagian grafik penjualan bulanan.
        Menampilkan tren penjualan dalam bentuk chart.
      */}
      <div>
        <SalesChart />
      </div>
    </div>
  );
};

export default HomePage;