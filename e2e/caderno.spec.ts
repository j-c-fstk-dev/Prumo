import { expect, test } from '@playwright/test';
import { commitAndSeal, onboard } from './helpers';

// Caderno do projeto (docs/etapas/27-caderno.md)
test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('caderno: ficha preenchida, anotações, nota da tarefa, resposta do coach salva e tudo persiste', async ({ page }) => {
  await onboard(page);
  await commitAndSeal(page);

  // Nota da tarefa
  await page.getByRole('button', { name: 'Abrir tarefa' }).click();
  await page.getByPlaceholder(/O que você fez, o que as pessoas disseram/).fill('Ana disse que pagaria.');
  await page.locator('button:has(svg.lucide-arrow-left)').first().click();

  // Coach: salvar e copiar uma resposta
  await page.getByRole('button', { name: 'Coach' }).click();
  await page.getByRole('button', { name: 'Entendi e quero usar' }).click();
  await page.getByPlaceholder('Escreva sua dúvida...').fill('Qual preço devo colocar?');
  await page.getByRole('button', { name: 'Enviar' }).click();
  await page.getByRole('button', { name: 'Salvar no caderno' }).click();
  await expect(page.getByRole('button', { name: 'No caderno' })).toBeVisible();
  await page.getByRole('button', { name: 'Copiar' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('preço');

  // Caderno
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ficha do meu produto' })).toBeVisible();
  await expect(page.getByText('Preço de teste')).toBeVisible();
  await page.getByRole('button', { name: 'Editar', exact: true }).first().click();
  await page.getByLabel('Minha frase').fill('Eu ajudo pessoas em transição a se apresentar');
  await page.getByRole('button', { name: 'Pronto' }).click();

  await page.getByLabel('Nova anotação').fill('Testar oferta no grupo do bairro');
  await page.getByRole('radio', { name: /Ideias/ }).click();
  await page.getByRole('button', { name: 'Salvar anotação' }).click();

  await expect(page.getByText('Testar oferta no grupo do bairro')).toBeVisible();
  await expect(page.getByText(/🧭 Do coach ·/)).toBeVisible();
  await expect(page.getByText('Ana disse que pagaria.')).toBeVisible();

  // Busca em todo o caderno (ícone de lupa): anotações, ficha e notas das tarefas
  await page.getByRole('button', { name: 'Buscar no caderno' }).click();
  const busca = page.getByLabel('Buscar em todo o caderno');
  await busca.fill('bairro');
  await expect(page.getByText('1 resultado')).toBeVisible();
  await expect(page.locator('mark', { hasText: 'bairro' })).toBeVisible();
  await busca.fill('transicao');
  await expect(page.getByText(/Ficha · Minha frase/)).toBeVisible();
  await busca.fill('ana pagaria');
  await expect(page.getByText(/✍️ Tarefa/)).toBeVisible();
  await busca.fill('xyzabc');
  await expect(page.getByText('Nada encontrado no caderno.')).toBeVisible();
  await page.getByRole('button', { name: 'Fechar busca' }).click();
  await expect(page.getByRole('heading', { name: 'Ficha do meu produto' })).toBeVisible();

  // Persiste depois de recarregar
  await page.reload();
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await expect(page.getByText('Testar oferta no grupo do bairro')).toBeVisible();
  await expect(page.getByText('Eu ajudo pessoas em transição a se apresentar')).toBeVisible();
});

test('pessoas: adicionar, mensagem pronta com WhatsApp, etapas, teste "2 de 5", próximo passo e busca', async ({ page }) => {
  await onboard(page);
  await commitAndSeal(page);
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await page.getByRole('tab', { name: /Pessoas/ }).click();
  await expect(page.getByText('0 de 0 pessoas disseram sim')).toBeVisible();

  // Adicionar
  await page.getByRole('button', { name: 'Adicionar pessoa' }).click();
  await page.getByLabel('Nome', { exact: true }).fill('Ana Souza');
  await page.getByLabel('WhatsApp').fill('(11) 98765-4321');
  await page.getByRole('radio', { name: 'Indicação' }).click();
  await page.getByLabel('Nota').fill('Quer começar em novembro');
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
  await expect(page.getByText('Ana Souza')).toBeVisible();

  // Mensagem pronta com o primeiro nome e link do WhatsApp
  await page.getByRole('button', { name: 'Mensagem pronta' }).click();
  await expect(page.getByLabel('Mensagem para Ana Souza')).toHaveValue(/^Oi, Ana!/);
  const wa = page.getByRole('link', { name: 'WhatsApp' });
  await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/5511987654321\?text=Oi%2C%20Ana!/);

  // Mudar de etapa conta no teste
  await page.getByLabel('Etapa de Ana Souza').selectOption('interessado');
  await expect(page.getByText('1 de 1 pessoa disse sim')).toBeVisible();

  // Próximo passo atrasado aparece em "Pra hoje"
  await page.getByLabel('Próximo passo com Ana Souza', { exact: true }).fill('Mandar proposta');
  await page.getByLabel('Data do próximo passo com Ana Souza').fill('2026-01-01');
  await expect(page.getByText('Pra hoje')).toBeVisible();

  // Busca do caderno acha a pessoa pela nota
  await page.getByRole('button', { name: 'Buscar no caderno' }).click();
  await page.getByLabel('Buscar em todo o caderno').fill('novembro');
  await expect(page.getByText(/👥 Pessoa · ✨ Interessado/)).toBeVisible();
  await page.getByRole('button', { name: 'Fechar busca' }).click();

  // Persiste
  await page.reload();
  await page.getByRole('button', { name: 'Caderno', exact: true }).click();
  await page.getByRole('tab', { name: /Pessoas \(1\)/ }).click();
  await expect(page.getByLabel('Etapa de Ana Souza')).toHaveValue('interessado');
});
