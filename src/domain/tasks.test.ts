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
