import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': BACKEND_URL,
      '/prometheus': {
        target: PROMETHEUS_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prometheus/, '')
      }
    }
  }
});
