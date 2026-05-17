import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In local dev, proxy /.netlify/functions to netlify dev server
      '/.netlify': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      }
    }
  }
})
