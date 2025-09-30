import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <h2 className="text-4xl font-bold text-red-600 mb-4">403</h2>
      <h3 className="text-2xl font-semibold text-bi-slate-800 mb-2">
        Akses Ditolak
      </h3>
      <p className="text-bi-slate-600 mb-8 max-w-md">
        Maaf, Anda tidak memiliki hak untuk mengakses halaman yang Anda tuju.
        Silakan hubungi administrator sistem jika Anda merasa ini adalah sebuah
        kesalahan.
      </p>
      <Link
        to="/"
        className="px-6 py-2 text-sm font-medium text-white bg-bi-blue-700 rounded-md hover:bg-bi-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bi-blue-500"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
