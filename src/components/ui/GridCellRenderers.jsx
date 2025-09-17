// komponen helper untuk merender header
export const renderHeader = (text) => {
  return (
    <div className="px-1 py-1 gap-2 font-semibold text-gray-600 uppercase">
      {text}
    </div>
  );
};

// [BARU] Fungsi untuk merender sel tanggal dengan warna kondisional
export const renderDateCell = (cellData) => {
  if (!cellData.value) return null;

  const date = new Date(cellData.value);
  const now = new Date(); // Kita asumsikan 'now' adalah saat ini

  // Set jam, menit, detik ke nol agar perbandingan hanya berdasarkan tanggal
  now.setHours(0, 0, 0, 0);

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();

  let colorClasses = "";

  // Logika pewarnaan
  if (dateYear > currentYear || (dateYear === currentYear && dateMonth >= currentMonth)) {
    // HIJAU: Bulan ini atau bulan-bulan setelahnya di tahun yang sama, atau tahun depan
    colorClasses = "bg-green-100 text-green-800";
  } else if (
    (dateYear === currentYear && dateMonth === currentMonth - 1) ||
    (currentMonth === 0 && dateYear === currentYear - 1 && dateMonth === 11) // Kasus khusus Januari -> Desember
  ) {
    // KUNING: Bulan lalu
    colorClasses = "bg-yellow-100 text-yellow-800";
  } else {
    // MERAH: Sisanya (lebih lama dari bulan lalu)
    colorClasses = "bg-red-100 text-red-800";
  }

  // Format tanggal untuk ditampilkan
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className={`px-3 py-1 text-xs font-semibold rounded-md inline-block ${colorClasses}`}>
      {formattedDate}
    </div>
  );
};