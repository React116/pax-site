import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor kütüphaneler
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-helmet-async')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/mongoose') || id.includes('node_modules/@radix-ui')) {
            return 'vendor-misc';
          }

          // Dashboard sayfaları — admin path'ine girince yüklenir
          if (id.includes('/src/pages/') || id.includes('/src/layouts/')) {
            return 'dashboard';
          }
        },
      },
    },
  },
})
