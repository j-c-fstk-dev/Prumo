import { defineConfig } from '@playwright/test';

/**
 * Testes ponta a ponta: percorrem o app de verdade no navegador.
 * Rodar: npm run test:e2e
 * Neste repositório, PW_CHROMIUM_PATH pode apontar para um Chromium já instalado.
 */
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 390, height: 844 },
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  webServer: {
    command: `npx tsx server.ts`,
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Sem provedor de IA: o coach responde em modo offline (respostas ao vivo são simuladas no teste)
    env: { PORT: String(PORT), DISABLE_HMR: 'true', LLM_PROVIDER: '', GEMINI_API_KEY: '' },
  },
});
