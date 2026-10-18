import { describe, expect, it } from 'vitest';
import { buildPlanTasks } from './tasks';

const plan = (productId: 'servico' | 'sessao' | 'guia' | 'minicurso', channel = 'Sua rede de contatos (WhatsApp) + Instagram') => ({
  productId,
  channel,
  test: 'Ofereça para 5 pessoas.',
});

describe('buildPlanTasks', () => {
  it('sem diagnóstico, devolve o roteiro base sem capítulos trancados', () => {
    const tasks = buildPlanTasks(null);
    expect(tasks).toHaveLength(7);
    expect(tasks.every((t) => !t.isLocked)).toBe(true);
  });

  it('a versão mínima muda conforme o formato do produto', () => {
    const titles = (['servico', 'sessao', 'guia', 'minicurso'] as const).map((p) => buildPlanTasks(plan(p)).find((t) => t.id === 't2')!.title);
    expect(new Set(titles).size).toBe(4);
    expect(titles[1]).toContain('sessão');
  });

  it('o preço de teste segue o formato', () => {
    expect(buildPlanTasks(plan('guia')).find((t) => t.id === 't4')!.whatToDo).toContain('R$ 19 a R$ 47');
    expect(buildPlanTasks(plan('servico')).find((t) => t.id === 't4')!.whatToDo).toContain('por entrega');
  });

  it('sem Instagram no canal, a tarefa de postagens vira ajuda em grupos', () => {
    const comInsta = buildPlanTasks(plan('guia')).find((t) => t.id === 't5')!;
    const semInsta = buildPlanTasks(plan('guia', 'Sua rede de contatos (WhatsApp) + grupos e comunidades online do seu tema')).find((t) => t.id === 't5')!;
    expect(comInsta.title).toContain('Instagram');
    expect(semInsta.title).toContain('grupos');
  });

  it('a tarefa de teste usa o teste da hipótese do diagnóstico', () => {
    const t6 = buildPlanTasks(plan('sessao')).find((t) => t.id === 't6')!;
    expect(t6.whatToDo).toContain('Ofereça para 5 pessoas.');
  });
});

describe('ferramentas por tarefa', () => {
  const ALL = ['servico', 'sessao', 'guia', 'minicurso'] as const;

  it('toda categoria sugerida existe no catálogo e tem exemplo', async () => {
    const { TOOL_CATEGORIES } = await import('../data/ferramentas');
    for (const p of ALL) {
      for (const t of buildPlanTasks(plan(p))) {
        for (const c of t.toolCategories ?? []) {
          expect(TOOL_CATEGORIES[c], `${t.id}/${c}`).toBeDefined();
          expect(TOOL_CATEGORIES[c].examples.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('a versão mínima sugere ferramentas do formato', () => {
    const tools = (p: (typeof ALL)[number]) => buildPlanTasks(plan(p)).find((t) => t.id === 't2')!.toolCategories;
    expect(tools('sessao')).toContain('agenda');
    expect(tools('minicurso')).toContain('gravacao');
    expect(tools('guia')).toContain('documentos');
  });

  it('o catálogo não afirma preço nem plano (isso muda e fica por conta do site)', async () => {
    const { TOOL_CATEGORIES } = await import('../data/ferramentas');
    // Só os textos que nós escrevemos (nomes de marca como "Mercado Pago" ficam de fora)
    const text = Object.values(TOOL_CATEGORIES)
      .map((c) => `${c.label} ${c.description} ${c.tip}`)
      .join(' ')
      .toLowerCase();
    expect(text).not.toMatch(/r\$|gr[aá]tis|gratuit|free|\bpago\b|plano pro|premium|\/m[eê]s|por m[eê]s/);
  });

  it('links de exemplo usam https', async () => {
    const { TOOL_CATEGORIES } = await import('../data/ferramentas');
    for (const c of Object.values(TOOL_CATEGORIES)) {
      for (const e of c.examples) if (e.url) expect(e.url).toMatch(/^https:\/\//);
    }
  });
});
