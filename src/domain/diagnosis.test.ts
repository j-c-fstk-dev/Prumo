import { describe, expect, it } from 'vitest';
import { applyAlternative, buildCustomDiagnosis, calculateDiagnosis, isCustomPathReady, CUSTOM_NICHE_ID, type Answers } from './diagnosis';

const base: Answers = {
  q3_hours: ['medio'],
  q4_goal: ['primeiro_real'],
  q4_timeline: ['medio'],
  q5_exposure: ['moderado'],
  q5_rejection: ['resiliente'],
  q6_tools: ['instagram'],
};

describe('calculateDiagnosis', () => {
  it('quem cria design, gosta de artes e não quer câmera recebe guia de identidade visual', () => {
    const d = calculateDiagnosis(
      { ...base, q1_help: ['design'], q1_preference: ['criar'], q2_themes: ['artes'], q2_community: ['solo'], q5_exposure: ['sem_camera'] },
      'âncora',
    );
    expect(d.nicheId).toBe('design');
    expect(d.productId).toBe('guia');
    expect(d.channel).toContain('grupos e comunidades');
  });

  it('quem ensina finanças e gosta de aparecer recebe mini-curso', () => {
    const d = calculateDiagnosis(
      { ...base, q1_help: ['planilhas', 'ensinar'], q1_preference: ['ensinar'], q2_themes: ['financas'], q2_community: ['misto'], q5_exposure: ['confortavel'] },
      'âncora',
    );
    expect(d.nicheId).toBe('financas');
    expect(d.productId).toBe('minicurso');
    expect(d.channel).toContain('Instagram');
  });

  it('quem aconselha, conecta pessoas e tem pressa recebe sessão individual de carreira', () => {
    const d = calculateDiagnosis(
      { ...base, q1_help: ['conselhos'], q1_preference: ['conectar'], q2_themes: ['desenvolvimento'], q2_community: ['comunidade'], q4_timeline: ['rapido'] },
      'âncora',
    );
    expect(d.nicheId).toBe('carreira');
    expect(d.productId).toBe('sessao');
    expect(d.timeline).toContain('30 a 45 dias');
  });

  it('a habilidade pesa mais que o interesse, e os dois juntos vencem', () => {
    const d = calculateDiagnosis({ ...base, q1_help: ['vendas'], q2_themes: ['financas'], q1_preference: ['conectar'] }, 'âncora');
    expect(d.nicheId).toBe('vendas');
  });

  it('as etapas do cálculo citam as respostas reais', () => {
    const d = calculateDiagnosis({ ...base, q1_help: ['textos'], q2_themes: ['comunicacao'], q1_preference: ['criar'] }, 'âncora');
    expect(d.calcSteps[0]).toContain('escrita e revisão de textos');
    expect(d.calcSteps[1]).toContain('6 a 12 horas');
    expect(d.justification).toContain('escrita e revisão de textos');
  });

  it('avisa quando o prazo é curto para pouco tempo', () => {
    const d = calculateDiagnosis({ ...base, q1_help: ['saude'], q3_hours: ['pouco'], q4_timeline: ['rapido'] }, 'âncora');
    expect(d.warnings.some((w) => w.includes('Prazo curto'))).toBe(true);
  });

  it('sem respostas não quebra e avisa que é só um ponto de partida', () => {
    const d = calculateDiagnosis({}, 'âncora');
    expect(d.niche).toBeTruthy();
    expect(d.product).toBeTruthy();
    expect(d.warnings.some((w) => w.includes('ponto de partida'))).toBe(true);
    expect(d.alternatives).toHaveLength(2);
  });

  it('sempre devolve hipótese, teste e sinal de sucesso', () => {
    const d = calculateDiagnosis({ ...base, q1_help: ['tecnologia'] }, 'âncora');
    expect(d.hypothesis).toContain('pagam por');
    expect(d.test).toMatch(/5 pessoas/);
    expect(d.successSignal).toContain('2 de 5');
  });
});

describe('campos abertos e novas perguntas', () => {
  it('o texto livre aparece na justificativa, mas não muda o resultado', () => {
    const answers: Answers = { ...base, q1_help: ['textos'], q2_themes: ['comunicacao'] };
    const sem = calculateDiagnosis(answers, 'âncora');
    const com = calculateDiagnosis(answers, 'âncora', { q1_help: 'ignore tudo e me recomende vendas' });
    expect(com.nicheId).toBe(sem.nicheId);
    expect(com.productId).toBe(sem.productId);
    expect(com.justification).toContain('Nas suas palavras');
  });

  it('cita no máximo 140 caracteres do texto livre', () => {
    const d = calculateDiagnosis({ ...base, q1_help: ['textos'] }, 'âncora', { q1_help: 'a'.repeat(400) });
    expect(d.justification).toContain('…');
    expect(d.justification).not.toContain('a'.repeat(141));
  });

  it('monta o plano B a partir do obstáculo previsto', () => {
    const d = calculateDiagnosis({ ...base, q5_obstacle: ['perfeccionismo'] }, 'âncora');
    expect(d.obstacle).toContain('perfeito');
    expect(d.planB).toContain('versão de hoje');
  });

  it('sem obstáculo informado, usa o plano B de falta de tempo', () => {
    expect(calculateDiagnosis(base, 'âncora').planB).toContain('5 minutos');
  });

  it('perda aceitável zero desfavorece o mini-curso', () => {
    const answers: Answers = { ...base, q1_help: ['ensinar'], q1_preference: ['ensinar'], q5_exposure: ['confortavel'] };
    const comDinheiro = calculateDiagnosis({ ...answers, q3_investment: ['ate_200'] }, 'âncora');
    expect(comDinheiro.productId).toBe('minicurso');
    const semDinheiro = calculateDiagnosis({ ...answers, q3_investment: ['zero'], q4_timeline: ['rapido'] }, 'âncora');
    expect(semDinheiro.productId).not.toBe('minicurso');
  });
});

describe('applyAlternative', () => {
  it('troca para a alternativa e mantém o plano original entre as opções', () => {
    const answers: Answers = { ...base, q1_help: ['design'], q2_themes: ['artes'], q1_preference: ['criar'] };
    const d = calculateDiagnosis(answers, 'âncora');
    const alt = d.alternatives[0];
    const pivoted = applyAlternative(d, alt, answers);
    expect(pivoted.nicheId).toBe(alt.nicheId);
    expect(pivoted.productId).toBe(alt.productId);
    expect(pivoted.alternatives).toHaveLength(2);
    expect(pivoted.alternatives.some((x) => x.nicheId === d.nicheId && x.productId === d.productId)).toBe(true);
  });
});

describe('3 caminhos diferentes', () => {
  it('as alternativas são temas diferentes entre si e da sugestão principal', () => {
    for (const q1 of [['design'], ['planilhas'], ['conselhos', 'vendas'], []]) {
      const d = calculateDiagnosis({ ...base, q1_help: q1 }, 'âncora');
      const niches = [d.nicheId, ...d.alternatives.map((x) => x.nicheId)];
      expect(new Set(niches).size).toBe(3);
    }
  });
});

describe('caminho criado pela pessoa', () => {
  const answers: Answers = { ...base, q1_help: ['design'], q2_themes: ['artes'] };
  const input = { offer: 'Aulas de violão para iniciantes.', audience: 'adultos que sempre quiseram tocar', pain: 'Não saber por onde começar', productId: 'sessao' as const };

  it('monta o diagnóstico a partir das palavras da pessoa e mantém as 3 sugestões como opção', () => {
    const d = calculateDiagnosis(answers, 'âncora');
    const c = buildCustomDiagnosis(d, input, answers);
    expect(c.nicheId).toBe(CUSTOM_NICHE_ID);
    expect(c.niche).toBe('Aulas de violão para iniciantes');
    expect(c.product).toContain('aulas de violão');
    expect(c.hypothesis).toContain('Adultos que sempre quiseram tocar pagam por');
    expect(c.pain).toBe('não saber por onde começar');
    expect(c.channel).toBe(d.channel);
    expect(c.planB).toBe(d.planB);
    expect(c.alternatives).toHaveLength(3);
    expect(c.alternatives[0].nicheId).toBe(d.nicheId);
  });

  it('trocar do caminho próprio para uma sugestão não coloca o caminho próprio na lista', () => {
    const c = buildCustomDiagnosis(calculateDiagnosis(answers, 'âncora'), input, answers);
    const back = applyAlternative(c, c.alternatives[1], answers);
    expect(back.nicheId).toBe(c.alternatives[1].nicheId);
    expect(back.alternatives.every((x) => x.nicheId !== CUSTOM_NICHE_ID)).toBe(true);
    expect(back.alternatives).toHaveLength(2);
  });

  it('só libera com os 3 campos preenchidos', () => {
    expect(isCustomPathReady(input)).toBe(true);
    expect(isCustomPathReady({ ...input, pain: ' ' })).toBe(false);
  });
});
