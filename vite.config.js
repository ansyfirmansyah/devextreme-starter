import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Langsung panggil di sini
  ],
  server: {
    port: 3000,
    open: true,
  },
  // Bagian 'resolve' untuk DevExtreme tetap kita pertahankan
  resolve: {
    alias: {
      inferno: "inferno/dist/index.dev.esm.js",
    },
  },
});
