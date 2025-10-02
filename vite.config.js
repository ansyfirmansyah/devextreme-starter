import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Integrasi Tailwind CSS
    visualizer({
      // Visualizer untuk analisis bundle yang dihasilkan saat build
      open: true, // Otomatis buka hasilnya di browser setelah build
      filename: "dist/stats.html", // Lokasi file hasil analisis
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  // Bagian 'resolve' untuk DevExtreme tetap kita pertahankan
  resolve: {
    alias: {
      // inferno: "inferno/dist/index.dev.esm.js",
      // Pastikan menggunakan versi produksi dari Inferno untuk performa optimal
      inferno: "inferno/dist/inferno.min.js",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Pisahkan bundle untuk Dependency agar caching lebih efektif
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
