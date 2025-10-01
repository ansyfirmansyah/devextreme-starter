## Cara jalankan dev server di HTTPS, jika diperlukan:
1. npm install --save-dev @vitejs/plugin-basic-ssl
2. tambahkan config di vite.config.js:
    2a. plugins: [basicSsl()]
    2b. server: https: true

## run aplikasi (tanpa build):
1. pnpm dev

## Build dan run aplikasi:
1. pnpm build
2. pnpm preview (jika ingin dijalankan dengan random port) atau npx serve dist (jika ingin dijalankan dari package serve sesuai port vite)