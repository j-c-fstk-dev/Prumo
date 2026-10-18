import { expect, test } from '@playwright/test';
import { commitAndSeal, onboard, openApp } from './helpers';

// Ajustes do 1º teste com usuários (docs/etapas/19-ajustes-do-teste.md)

test('escrita própria: sugestão vira resposta na escolha única e o botão Salvar confirma', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Começar diagnóstico' }).click();
  await page.getByPlaceholder('Seu nome').fill('Jo');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Pular' }).click();

  // 1ª pergunta (habilidades): qualquer opção
  const valueSignal = page.getByRole('button', { name: 'Entendido, vamos lá' });
  if (await valueSignal.isVisible()) await valueSignal.click();
  await page.locator('div.max-h-\\[300px\\] > div').first().click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 2ª pergunta (papel preferido): agora aceita texto
  await expect(page.getByText('qual papel você mais gosta de exercer?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
  await page.getByRole('button', { name: /Detalhar com suas próprias palavras/ }).click();
  await page.locator('textarea').fill('Fico horas montando apresentações bonitas');
  await page.getByRole('button', { name: 'Sim' }).click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();

  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.locator('textarea')).toBeHidden();
  await expect(page.getByText('Salvo ✓')).toBeVisible();
  await expect(page.getByText(/montando apresentações bonitas/)).toBeVisible();
});

test('âncora aparece inteira e o botão de assumir explica como segurar', async ({ page }) => {
  await onboard(page);

  await page.getByRole('button', { name: /Assumir meu prumo/ }).click();
  const hold = page.getByRole('button', { name: /Segure aqui/ });
  await expect(page.getByText(/segure o dedo/)).toBeVisible();
  await hold.click(); // toque rápido não sela
  await expect(page.getByText(/Mantenha o dedo apertado/)).toBeVisible();
  await page.getByRole('button', { name: 'Voltar ao diagnóstico' }).click();

  await commitAndSeal(page);
  const anchor = page.getByText('Sua âncora', { exact: true }).locator('xpath=following-sibling::p');
  await expect(anchor).toBeVisible();
  const cut = await anchor.evaluate((el) => el.scrollWidth > el.clientWidth || getComputedStyle(el).textOverflow === 'ellipsis');
  expect(cut).toBe(false);
});

test('apresentação inicial explica o que é prumo, a constelação e a jornada', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Começar diagnóstico' }).click();
  await page.getByPlaceholder('Seu nome').fill('Jo');
  await page.getByRole('button', { name: 'Continuar' }).click();

  await expect(page.getByText('Mas afinal, o que é prumo?')).toBeVisible();
  await page.getByRole('button', { name: 'Próximo' }).click();
  await expect(page.getByText('Cada passo acende uma estrela')).toBeVisible();
  await page.getByRole('button', { name: 'Próximo' }).click();
  await expect(page.getByText('Como funciona')).toBeVisible();
  await page.getByRole('button', { name: 'Próximo' }).click();
  await expect(page.getByText('E isso é só o começo')).toBeVisible();
  await page.getByRole('button', { name: 'Bora começar' }).click();
  await expect(page.getByRole('button', { name: 'Entendido, vamos lá' })).toBeVisible();
});
