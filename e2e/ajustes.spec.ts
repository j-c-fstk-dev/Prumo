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
  await expect(page.getByText('Do que você mais gosta?')).toBeVisible();
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

test('em tela baixa, o compromisso rola até o botão de segurar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await onboard(page);
  await page.getByRole('button', { name: /Assumir meu prumo/ }).click();
  const hold = page.getByRole('button', { name: /Segure aqui/ });
  // Rola como uma pessoa (roda do mouse), não por código: tela travada não rola assim
  await page.mouse.move(195, 300);
  for (let i = 0; i < 10; i++) await page.mouse.wheel(0, 300);
  await expect(hold).toBeInViewport({ ratio: 1 });
});

test('resultado mostra 3 caminhos diferentes e deixa criar o próprio', async ({ page }) => {
  await onboard(page);
  const cards = page.getByRole('button', { name: 'Escolher este caminho' });
  await expect(cards).toHaveCount(2);

  // Trocar por uma sugestão: ela vira o caminho principal
  const altName = (await cards.first().locator('xpath=..').locator('strong').textContent())!;
  await cards.first().click();
  await expect(page.getByRole('heading', { name: altName })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Escolher este caminho' })).toHaveCount(2);

  // Criar o próprio (sem IA no ambiente de teste: avisa e segue pelos campos)
  await page.getByRole('button', { name: /Quero criar o meu/ }).click();
  await expect(page.getByRole('heading', { name: 'Criar o meu caminho' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Usar este caminho' })).toBeDisabled();
  await page.getByLabel('Sua ideia com suas palavras').fill('quero ensinar violão pra adultos');
  await page.getByRole('button', { name: 'Organizar com a IA' }).click();
  await expect(page.getByText(/A IA não respondeu agora/)).toBeVisible();

  await page.getByPlaceholder('Ex: aulas de violão para iniciantes').fill('Aulas de violão para iniciantes');
  await page.getByPlaceholder('Ex: adultos que sempre quiseram tocar').fill('adultos que sempre quiseram tocar');
  await page.getByPlaceholder('Ex: não saber por onde começar').fill('não saber por onde começar');
  await page.getByRole('radio', { name: /Uma conversa de 1 hora/ }).click();
  await page.getByRole('button', { name: 'Usar este caminho' }).click();

  await expect(page.getByRole('heading', { name: 'Aulas de violão para iniciantes' })).toBeVisible();
  await expect(page.getByText(/Adultos que sempre quiseram tocar pagam por/)).toBeVisible();
  // As 3 sugestões continuam disponíveis
  await expect(page.getByRole('button', { name: 'Escolher este caminho' })).toHaveCount(3);
});
