import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls
      }
    }),
    vuetify()
  ],
  define: {
    'process.env': {
      VITE_APP_TITLE: process.env.NODE_ENV === 'development'
        ? 'Sistema de Análise de Consumo Energético (Dev)'
        : 'Sistema de Análise de Consumo Energético',
      VITE_APP_API_URL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/api'
        : 'https://api.consumo-energia.com/api',
      VITE_APP_VERSION: process.env.NODE_ENV === 'development'
        ? '1.0.0-dev'
        : '1.0.0'
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/variables.scss" as *;
          @use "@/assets/styles/mixins.scss" as *;
        `
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
