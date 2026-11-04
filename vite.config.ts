import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    // ضبط المسار الفرعي لمستودع GitHub Pages: /Zom/
    base: command === 'build' ? '/Zom/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile(), // تجميع الأكواد والتنسيقات لمنع أخطاء الروابط والـ 404
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
