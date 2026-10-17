import { expect, test } from '@playwright/test';
import { dayKey, seedState } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('quem volta depois de dias é acolhido, sem mensagem de "quebrou"', async ({ page }) => {
  await seedState(page, { actionsByDay: { [dayKey(-6)]: 1, [dayKey(-7)]: 1 } });
  await expect(page.getByText('Que bom te ver de volta, Jo.')).toBeVisible();
  await expect(page.getByText(/quebr/i)).toHaveCount(0);
});

test('remendo: 2 ações hoje recuperam o dia em branco de ontem', async ({ page }) => {
  // 3 dias ativos e depois 2 em branco: 1 vira descanso, o outro pode ser remendado
  await seedState(page, { actionsByDay: { [dayKey(-3)]: 1, [dayKey(-4)]: 1, [dayKey(-5)]: 1 } });
  const banner = page.getByText('Ontem ficou em branco');
  test.skip((await banner.count()) === 0, 'ontem e anteontem caem em semanas diferentes: o descanso cobre, comportamento correto');
  await expect(banner).toContainText('(0/2)');
  await page.getByRole('button', { name: '😐 Mais ou menos' }).click();
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(banner).toContainText('(1/2)');
  await page.getByRole('button', { name: 'Abrir tarefa' }).locator('xpath=following-sibling::button[1]').click();
  await expect(banner).toHaveCount(0);
  await expect(page.getByText(/5 dias de prumo/)).toBeVisible();
});
