import React from 'react';

const LoadingSpinner = () => {
  return (
    // Pusatkan spinner di tengah layar
    <div className="flex items-center justify-center w-full h-full">
      {/* Buat spinner dengan border dan animasi putar dari Tailwind */}
      <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;