import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { readFileSync } from 'node:fs';
import {defineConfig} from 'vitest/config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    // Versão do app (aparece no "Sobre" e nos registros de erro)
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
    // Várias páginas (etapa 39): apresentação em /, o app em /app/ e as páginas legais
    build: {
      rollupOptions: {
        input: {
          apresentacao: path.resolve(import.meta.dirname, 'index.html'),
          app: path.resolve(import.meta.dirname, 'app/index.html'),
          privacidade: path.resolve(import.meta.dirname, 'privacidade/index.html'),
          termos: path.resolve(import.meta.dirname, 'termos/index.html'),
        },
      },
    },
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
