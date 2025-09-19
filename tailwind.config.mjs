/** @type {import('tailwindcss').Config} */
export default {
  // Baris ini untuk mematikan CSS Reset dari Tailwind
  corePlugins: {
    preflight: false,
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // theme: {} Dihapus karena di v4, kustomisasi tema pindah ke file CSS
  // plugins: [] Dihapus karena kosong
};