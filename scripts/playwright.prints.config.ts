import { defineConfig } from '@playwright/test';
import base from '../playwright.config';

/** Prints reais do app para a página de apresentação: npm run prints (etapa 39) */
export default defineConfig({
  ...base,
  testDir: '.',
  testMatch: 'prints.spec.ts',
  retries: 0,
  reporter: 'list',
  // O servidor roda a partir da raiz do projeto
  webServer: base.webServer && { ...base.webServer, cwd: '..' },
});
