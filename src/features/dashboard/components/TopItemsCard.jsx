import React from "react";

/**
 * Komponen kartu untuk menampilkan daftar Top Items (Produk, Outlet, Sales, dll)
 *
 * Props:
 * - title: string, judul kartu
 * - items: array, daftar item yang akan ditampilkan
 * - icon: ReactNode, ikon yang akan ditampilkan di header
 * - color: string, varian warna ikon (yellow, red, blue)
 */
const TopItemsCard = ({ title, items = [], icon, color = "yellow" }) => {
  // Variasi warna background dan teks untuk ikon
  const colorVariants = {
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-bi-blue-100 text-bi-blue-700",
  };

  return (
    // Kartu utama dengan padding, background putih, rounded, dan shadow
    <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col h-full">
      {/* Header kartu: judul & ikon */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-bi-slate-500">{title}</h3>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${colorVariants[color]}`}
        >
          {/* Ikon di-resize agar proporsional */}
          {React.cloneElement(icon, { className: "w-4 h-4" })}
        </div>
      </div>

      {/* Daftar item/top list, scrollable jika lebih dari maxHeight */}
      <div
        className="flex-grow overflow-y-auto pr-2"
        style={{ maxHeight: "120px" }}
      >
        {items.length > 0 ? (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li
                key={index}
                className="text-lg font-bold text-bi-slate-800 truncate"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          // Pesan jika tidak ada data
          <p className="text-sm text-bi-slate-400 italic">Tidak ada data</p>
        )}
      </div>
    </div>
  );
};

export default TopItemsCard;