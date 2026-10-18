import { describe, expect, it } from 'vitest';
import { normalize, suggestOptions, supportsTextMatch } from './textMatch';

describe('normalize', () => {
  it('remove acentos, pontuação e maiúsculas', () => {
    expect(normalize('Orçamento, Finanças e SAÚDE!')).toBe('orcamento financas e saude');
  });
});

describe('suggestOptions', () => {
  it('reconhece palavras com acento e no plural', () => {
    expect(suggestOptions('q1_help', 'Ajudo amigos com o orçamento e as planilhas do mês')).toEqual(['planilhas']);
  });

  it('ordena pela quantidade de palavras encontradas e limita a 2', () => {
    const s = suggestOptions('q1_help', 'Faço logos e artes no Canva, às vezes escrevo legendas');
    expect(s[0]).toBe('design');
    expect(s).toContain('textos');
    expect(s.length).toBeLessThanOrEqual(2);
  });

  it('casa só no começo da palavra (evita falso positivo)', () => {
    // "corrida" não deve sugerir design por causa de "cores"; "contato" não casa "contas"
    expect(suggestOptions('q1_help', 'gosto de corrida')).toEqual(['saude']);
    expect(suggestOptions('q1_help', 'mantenho contato com amigos')).toEqual([]);
  });

  it('ignora opções já marcadas ou recusadas', () => {
    expect(suggestOptions('q1_help', 'planilhas e orçamento', ['planilhas'])).toEqual([]);
  });

  it('não sugere nada para texto curto ou fora do catálogo', () => {
    expect(suggestOptions('q1_help', 'oi')).toEqual([]);
    expect(suggestOptions('q1_help', 'faço bolos de aniversário')).toEqual([]);
  });

  it('funciona para temas de interesse', () => {
    expect(suggestOptions('q2_themes', 'Adoro podcasts de investimentos')).toEqual(['financas', 'comunicacao']);
  });

  it('entende o texto também nas perguntas de escolha única', () => {
    expect(suggestOptions('q1_preference', 'Fico horas montando apresentações bonitas')).toEqual(['criar']);
    expect(suggestOptions('q5_exposure', 'Gravo áudio de boa, mas vídeo me trava')[0]).toBeDefined();
    expect(suggestOptions('q5_rejection', 'fico chateado mas no outro dia tento de novo')).toContain('resiliente');
    expect(suggestOptions('q5_obstacle', 'o cansaço depois do trabalho')).toEqual(['tempo']);
    expect(suggestOptions('q6_tools', 'uso muito o tiktok')).toEqual(['instagram']);
    expect(suggestOptions('q1_preference', 'brinco com as crianças')).toEqual([]);
  });

  it('perguntas de número ou da âncora não têm sugestão', () => {
    expect(supportsTextMatch('q1_help')).toBe(true);
    expect(supportsTextMatch('q2_themes')).toBe(true);
    expect(supportsTextMatch('q3_hours')).toBe(false);
    expect(supportsTextMatch('q7_pride')).toBe(false);
    expect(suggestOptions('q7_pride', 'planilhas')).toEqual([]);
  });
});
