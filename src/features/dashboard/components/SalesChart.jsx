import React from 'react';
import Chart, {
  ArgumentAxis,
  Series,
  Tooltip,
  Legend,
  ValueAxis,
  Title,
} from 'devextreme-react/chart';
import { getSalesTrendDataSource } from '../../../services/dashboardService';

// Ambil data tren penjualan (14 hari terakhir) dari service
const salesDataSource = getSalesTrendDataSource();

const SalesChart = () => {
  return (
    // Kartu chart dengan padding, background putih, rounded, dan shadow
    <div className="p-5 bg-white rounded-lg shadow-sm">
      <Chart
        dataSource={salesDataSource}
        height={400}
      >
        {/* Judul chart */}
        <Title text="Tren Penjualan (14 Hari Terakhir)" />
        {/* Sumbu X: tanggal (tipe datetime, interval harian) */}
        <ArgumentAxis argumentType="datetime" tickInterval="day" />
        {/* Sumbu Y: total omzet */}
        <ValueAxis>
          <Title text="Total Omzet (Rp)" />
        </ValueAxis>
        {/* Series: garis penjualan */}
        <Series
          valueField="totalSales"
          argumentField="date"
          type="line"
          color="#1d4ed8" // bi-blue-700
          name="Penjualan"
        />
        {/* Tooltip: tampilkan nilai omzet dengan format Rupiah */}
        <Tooltip enabled={true} customizeTooltip={(arg) => ({
          text: `Rp ${new Intl.NumberFormat('id-ID').format(arg.valueText)}`
        })} />
        {/* Legend disembunyikan karena hanya ada 1 series */}
        <Legend visible={false} />
      </Chart>
    </div>
  );
};

export default SalesChart;