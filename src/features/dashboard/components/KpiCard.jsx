import React from 'react';

/**
 * Komponen kartu KPI (Key Performance Indicator)
 * Menampilkan judul, nilai, dan ikon dengan warna yang dapat dikustomisasi.
 *
 * Props:
 * - title: string, judul KPI
 * - value: string/number, nilai KPI
 * - icon: ReactNode, ikon yang akan ditampilkan
 * - color: string, varian warna (blue, green, yellow, red)
 */
const KpiCard = ({ title, value, icon, color = 'blue' }) => {
  // Variasi warna background dan teks untuk ikon
  const colorVariants = {
    blue: 'bg-bi-blue-100 text-bi-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    // Kartu utama dengan padding, background putih, rounded, dan shadow
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Layout horizontal: info KPI di kiri, ikon di kanan */}
      <div className="flex items-start justify-between gap-4">
        {/* Bagian info KPI */}
        <div className="flex-grow">
          {/* Judul KPI, font kecil dan warna abu */}
          <p className="text-sm font-medium text-bi-slate-500 truncate">{title}</p>
          {/* Nilai KPI, font besar dan tebal, responsif */}
          <p className="text-2xl lg:text-3xl font-bold text-bi-slate-800 break-words">
            {value}
          </p>
        </div>
        {/* Ikon bulat dengan warna sesuai varian */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${colorVariants[color]}`}>
          {/* Ikon di-resize agar proporsional */}
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;