import { expect, test } from '@playwright/test';
import { seedState } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await seedState(page, {});
  await page.getByRole('button', { name: 'Coach' }).click();
});

test('pede consentimento antes do primeiro uso, explicando o que é enviado', async ({ page }) => {
  await expect(page.getByText('Antes de conversar com o Coach')).toBeVisible();
  await expect(page.getByText(/Ele não é terapia/)).toBeVisible();
  await expect(page.getByText(/o que você escreveu nas perguntas, suas cartas/)).toBeVisible();
  await page.getByRole('button', { name: 'Entendi e quero usar' }).click();
  await expect(page.getByPlaceholder('Escreva sua dúvida...')).toBeVisible();
  // O consentimento fica salvo
  await page.reload();
  await page.getByRole('button', { name: 'Coach' }).click();
  await expect(page.getByPlaceholder('Escreva sua dúvida...')).toBeVisible();
});

test('sem IA disponível, a resposta pronta é marcada como tal (nada de "online" falso)', async ({ page }) => {
  await page.getByRole('button', { name: 'Entendi e quero usar' }).click();
  await page.getByPlaceholder('Escreva sua dúvida...').fill('travei, tenho medo');
  await page.getByPlaceholder('Escreva sua dúvida...').press('Enter');
  await expect(page.getByText('Resposta pronta: a IA não respondeu desta vez.')).toBeVisible();
  await expect(page.getByText('IA indisponível agora · respostas prontas')).toBeVisible();
});

test('protocolo de crise: acolhe e mostra CVV 188 e SAMU 192 clicáveis', async ({ page }) => {
  await page.getByRole('button', { name: 'Entendi e quero usar' }).click();
  await page.getByPlaceholder('Escreva sua dúvida...').fill('não quero mais viver');
  await page.getByPlaceholder('Escreva sua dúvida...').press('Enter');
  await expect(page.getByRole('link', { name: 'Ligar 188 (CVV)' })).toHaveAttribute('href', 'tel:188');
  await expect(page.getByRole('link', { name: 'Ligar 192 (SAMU)' })).toHaveAttribute('href', 'tel:192');
  await expect(page.getByText(/não substituo ajuda profissional/)).toBeVisible();
});

test('resposta da IA pode ser denunciada, e a denúncia chega ao servidor', async ({ page }) => {
  // Simula a IA respondendo ao vivo; a denúncia vai para o servidor de verdade
  await page.route('**/api/coach/chat', (route) =>
    route.fulfill({ json: { reply: 'Uma resposta qualquer da IA.', isLiveAI: true, mode: 'live' } }),
  );
  const report = page.waitForResponse((r) => r.url().endsWith('/api/coach/report'));
  await page.getByRole('button', { name: 'Entendi e quero usar' }).click();
  await page.getByPlaceholder('Escreva sua dúvida...').fill('me ajuda?');
  await page.getByPlaceholder('Escreva sua dúvida...').press('Enter');
  await page.getByRole('button', { name: 'Denunciar' }).click();
  await page.getByRole('button', { name: 'Ofensiva' }).click();
  expect((await report).status()).toBe(200);
  await expect(page.getByText('Denúncia enviada. Obrigado.')).toBeVisible();
});
