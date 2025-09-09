import React, { useState, useEffect } from 'react';

// Fungsi bantuan untuk menambahkan nol di depan angka tunggal (e.g., 9 -> "09")
const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
};

const RealTimeClock = () => {
  // 1. State untuk menyimpan objek Date saat ini
  const [currentTime, setCurrentTime] = useState(new Date());

  // 2. useEffect untuk setup interval yang akan berjalan setiap detik
  useEffect(() => {
    // Jalankan interval setiap 1000ms (1 detik)
    const intervalId = setInterval(() => {
      setCurrentTime(new Date()); // Update state dengan waktu yang baru
    }, 1000);

    // 3. Cleanup function: Hentikan interval saat komponen di-unmount
    // Ini sangat penting untuk mencegah memory leak!
    return () => clearInterval(intervalId);
  }, []); // Array dependensi kosong '[]' berarti effect ini hanya berjalan sekali saat mount

  // 4. Format waktu untuk ditampilkan sesuai keinginan
  const year = currentTime.getFullYear();
  const month = currentTime.toLocaleString('id-ID', { month: 'long' }); // Menggunakan locale Indonesia untuk nama bulan
  const day = currentTime.getDate();
  const hours = padTo2Digits(currentTime.getHours());
  const minutes = padTo2Digits(currentTime.getMinutes());
  const seconds = padTo2Digits(currentTime.getSeconds());

  const formattedTime = `${day} ${month} ${year} ${hours}:${minutes}:${seconds} WIB`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
      <i className="dx-icon dx-icon-clock"></i>
      <span>{formattedTime}</span>
    </div>
  );
};

export default RealTimeClock;