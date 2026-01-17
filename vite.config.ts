import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: "/HIAST.Transportation.UI",
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5066',
        changeOrigin: true,
        secure: false,
      },
      '/notificationHub': {
        target: 'http://localhost:5066',
        changeOrigin: true,
        secure: false,
        ws: true // Enable WebSocket proxying
      },
    },
  },
})