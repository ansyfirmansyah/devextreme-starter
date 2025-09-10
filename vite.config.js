import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({ // Gunakan fungsi untuk akses 'mode'
  plugins: [react()],
  resolve: {
    alias: {
      // Solusi untuk warning "production build of Inferno"
      // https://github.com/DevExpress/devextreme-react/issues/1353
      ...(mode === 'development' && {
        inferno: 'inferno/dist/index.dev.esm.js',
      }),
    },
  },
}));
