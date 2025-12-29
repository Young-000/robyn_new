import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
      '@/application': path.resolve(__dirname, './src/application'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
