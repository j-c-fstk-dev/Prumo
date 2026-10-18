import { expect, test } from '@playwright/test';
import { commitAndSeal, onboard, passSplash } from './helpers';

test('jornada completa: diagnóstico, carta, tarefas, check-in, capítulo e recarga', async ({ page }) => {
  await onboard(page, 'Jo', { confirmText: 'Ajudo amigos com as planilhas do orçamento' });

  // A sugestão confirmada (planilhas) muda o nicho para organização da rotina
  await expect(page.getByRole('heading', { name: /Organização e rotina/ })).toBeVisible();
  await expect(page.getByText(/Prazo curto/)).toBeVisible();
  await expect(page.getByText(/Sua aposta/)).toBeVisible();

  await commitAndSeal(page);

  // Constelação e "quando vou fazer"
  await expect(page.getByText('0 de 4 estrelas')).toBeVisible();
  await page.getByRole('button', { name: 'Abrir tarefa' }).click();
  await page.getByRole('button', { name: 'no almoço' }).click();
  await page.getByRole('button', { name: 'Voltar' }).or(page.locator('button:has(svg.lucide-arrow-left)')).first().click();
  await expect(page.getByText('⏰ Combinado: no almoço')).toBeVisible();

  // Tarefa pessoal
  await page.getByRole('button', { name: 'Adicionar' }).click();
  await page.getByPlaceholder('O que você quer fazer?').fill('Pagar a conta de luz');
  await page.getByRole('button', { name: 'antes de dormir' }).click();
  await page.getByRole('button', { name: 'Salvar tarefa' }).click();
  await expect(page.getByText('Pagar a conta de luz')).toBeVisible();

  // Check-in e sequência
  await page.getByRole('button', { name: '😌 Foi bem' }).click();
  await page.getByPlaceholder('O que você fez hoje, mesmo que pequeno?').fill('Escrevi minha promessa');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByText('✦ 1 dia de prumo')).toBeVisible();

  // Concluir o capítulo 1 inteiro → celebração uma única vez
  await page.getByRole('button', { name: 'Roteiro' }).click();
  await page.getByRole('button', { name: 'Cap. 1: Ideia clara' }).click();
  const list = page.locator('div.max-h-\\[440px\\]');
  while (await list.locator('svg.lucide-circle').count()) {
    await list.locator('svg.lucide-circle').first().click();
  }
  await expect(page.getByText('Sua constelação está completa')).toBeVisible();
  await page.getByRole('button', { name: /Seguir para o Capítulo 2/ }).click();
  await page.getByRole('button', { name: 'Início' }).click();
  await expect(page.getByText(/^Capítulo 2:/)).toBeVisible();

  // Recarregar: tudo continua salvo no aparelho e a celebração não repete
  await page.reload();
  await passSplash(page);
  await expect(page.getByText(/^Olá, Jo/)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Escrevi minha promessa')).toBeVisible();
  await expect(page.getByText('Pagar a conta de luz')).toBeVisible();
  await expect(page.getByText('Sua constelação está completa')).toHaveCount(0);
});
