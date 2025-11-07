import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/REAL-ESTATE-AI-AGENT/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.vercel.app', // Replace with your actual backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

