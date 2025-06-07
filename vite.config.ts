import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL || 'http://localhost:8000/api'),
      BASE_URL: JSON.stringify(process.env.BASE_URL || '/')
    }
  }
}) 