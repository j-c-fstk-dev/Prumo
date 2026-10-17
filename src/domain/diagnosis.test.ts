import { describe, expect, it } from 'vitest';
import { applyAlternative, calculateDiagnosis, type Answers } from './diagnosis';

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
