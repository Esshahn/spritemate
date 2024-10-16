import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'window.jQuery': 'jQuery',
    'window.$': 'jQuery',
  },
  optimizeDeps: {
    include: ['jquery', 'jquery-ui']
  }
});