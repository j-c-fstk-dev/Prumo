import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vitest/config';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    // Vitest roda só os testes de regra de negócio; os ponta a ponta (e2e/) são do Playwright
    test: {
      exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    },
    server: {
      // DISABLE_HMR=true desliga HMR e file watching (útil em máquinas mais fracas).
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
