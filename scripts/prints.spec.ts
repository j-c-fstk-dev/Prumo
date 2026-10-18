import { expect, test } from '@playwright/test';
import { commitAndSeal, passSplash } from '../e2e/helpers';

/**
 * Gera os prints de public/landing/ a partir do app de verdade (tema claro, 390×844).
 * Rodar: npm run prints
 */
test.use({ colorScheme: 'light', deviceScaleFactor: 2, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' });

const shot = (page: import('@playwright/test').Page, name: string) =>
  page.screenshot({ path: `public/landing/${name}.jpg`, type: 'jpeg', quality: 72 });

test('prints da apresentação', async ({ page }) => {
  test.setTimeout(180_000);
  await page.route('**/api/coach/chat', (r) =>
    r.fulfill({
      json: {
        mode: 'live',
        reply:
          'Bora simplificar: escolha 3 pessoas que já te pediram ajuda com currículo e mande a mensagem pronta pra elas hoje. Não precisa de site nem de Instagram pra isso. Quem responder, você anota no Caderno.',
      },
    }),
  );
  await page.goto('/app/');
  await passSplash(page);
  await page.getByRole('button', { name: 'Começar diagnóstico' }).click();
  await page.getByPlaceholder('Seu nome').fill('Marina');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Pular' }).click();

  let answered = 0;
  for (let i = 0; i < 40; i++) {
    if (await page.getByText('Montando seu prumo').isVisible()) break;
    const value = page.getByRole('button', { name: 'Entendido, vamos lá' });
    if (await value.isVisible()) {
      await value.click();
      continue;
    }
    const cont = page.getByRole('button', { name: 'Continuar' });
    await expect(cont).toBeVisible();
    await page.locator('div.max-h-\\[300px\\] > div').first().click();
    // A 1ª pergunta, com uma opção marcada, vira o print das perguntas
    if (answered === 0) {
      await page.waitForTimeout(700);
      await shot(page, 'perguntas');
    }
    await cont.click();
    answered++;
  }
  await expect(page.getByText(/este é o seu prumo/)).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(2500);
  await shot(page, 'resultado');

  await commitAndSeal(page);
  await page.getByRole('button', { name: /Agora não/ }).click().catch(() => undefined);
  // Espera a chuva de estrelas da chegada terminar
  await page.waitForTimeout(6000);
  await shot(page, 'inicio');

  await page.getByRole('button', { name: 'Coach', exact: true }).click();
  const consent = page.getByRole('button', { name: /Entendi/ });
  if (await consent.isVisible().catch(() => false)) await consent.click();
  await page.getByRole('textbox').last().fill('Não sei por onde começar a divulgar');
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Bora simplificar/)).toBeVisible();
  await page.waitForTimeout(800);
  await shot(page, 'coach');

  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await page.getByRole('tab', { name: /Pessoas/ }).click();
  const people: [string, string][] = [
    ['Ana Souza', 'interessado'],
    ['Bruno Lima', 'conversou'],
    ['Carla Mendes', 'cliente'],
    ['Diego Rocha', 'contato'],
    ['Elisa Prado', 'contato'],
  ];
  for (const [name, stage] of people) {
    await page.getByRole('button', { name: 'Adicionar pessoa' }).click();
    await page.getByLabel('Nome', { exact: true }).fill(name);
    await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
    await page.getByLabel(`Etapa de ${name}`).selectOption(stage);
    await page.getByRole('button', { name: new RegExp(`^${name}, `) }).click();
  }
  await page.getByText('Seu teste').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await shot(page, 'pessoas');
});
