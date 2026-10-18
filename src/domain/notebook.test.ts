import { describe, expect, it } from 'vitest';
import { calculateDiagnosis } from './diagnosis';
import { exportNotebook, filterNotes, highlightParts, profileValues, searchNotebook, type Note } from './notebook';

const d = calculateDiagnosis(
  { q1_help: ['design'], q2_themes: ['artes'], q3_hours: ['medio'], q4_timeline: ['medio'], q5_exposure: ['sem_camera'], q6_tools: ['canva'] },
  'âncora',
);

const note = (id: string, text: string, tag: Note['tag'], updatedAt: number, taskTitle?: string): Note => ({
  id,
  text,
  tag,
  taskTitle,
  createdAt: updatedAt,
  updatedAt,
});

describe('caderno', () => {
  it('a ficha vem preenchida pelo resultado e o que a pessoa edita tem prioridade', () => {
    const p = profileValues(d, { audience: 'Lojinhas do meu bairro', promise: 'Eu ajudo lojas a parecerem profissionais' });
    expect(p.offer).toBe(d.product);
    expect(p.audience).toBe('Lojinhas do meu bairro');
    expect(p.price).toMatch(/R\$/);
    expect(p.promise).toContain('Eu ajudo');
    // Apagar um campo de propósito vale (string vazia não volta para o padrão)
    expect(profileValues(d, { offer: '' }).offer).toBe('');
    expect(profileValues(null, {}).offer).toBe('');
  });

  it('filtra por etiqueta e busca sem ligar para acento, mais recentes primeiro', () => {
    const notes = [
      note('a', 'Ideia de logo com cores da padaria', 'ideia', 1),
      note('b', 'Maria disse que pagaria R$ 50', 'conversa', 3, 'Mostrar pra 3 pessoas'),
      note('c', 'Começar pelo Instagram não funcionou', 'aprendizado', 2),
    ];
    expect(filterNotes(notes).map((n) => n.id)).toEqual(['b', 'c', 'a']);
    expect(filterNotes(notes, { tag: 'conversa' }).map((n) => n.id)).toEqual(['b']);
    expect(filterNotes(notes, { query: 'comecar' }).map((n) => n.id)).toEqual(['c']);
    expect(filterNotes(notes, { query: 'mostrar pra' }).map((n) => n.id)).toEqual(['b']);
  });

  it('exporta tudo em texto simples, agrupado', () => {
    const text = exportNotebook({
      userName: 'Jo',
      profile: profileValues(d, {}),
      notes: [note('a', 'Testar no sábado', 'ideia', 1), note('b', 'Dica do coach', 'coach', 2, 'Dizer em 1 frase o que você resolve')],
      taskNotes: [
        { title: 'Mostrar pra 3 pessoas', text: 'Ana: sim. Beto: não.' },
        { title: 'Vazia', text: '  ' },
      ],
      now: new Date(2026, 9, 18),
    });
    expect(text).toContain('Caderno do Prumo · Jo · 18/10/2026');
    expect(text).toContain(`O que eu ofereço: ${d.product}`);
    expect(text).toContain('== 💡 Ideias ==');
    expect(text).toContain('Testar no sábado');
    expect(text).toContain('== 🧭 Do coach ==');
    expect(text).toContain('Ana: sim. Beto: não.');
    expect(text).not.toContain('Vazia');
  });
});

describe('busca no caderno', () => {
  const data = {
    profile: profileValues(d, { promise: 'Eu ajudo lojas a parecerem profissionais' }),
    notes: [note('a', 'Testar a oferta no grupo do bairro', 'ideia', 1), note('b', 'Dica: começar pelo preço menor', 'coach', 2, 'Escolher o preço de teste')],
    taskNotes: [{ taskId: 't3', title: 'Mostrar pra 3 pessoas', text: 'Ana disse que pagaria R$ 50' }],
  };

  it('acha qualquer palavra em qualquer parte: ficha, anotações e tarefas', () => {
    expect(searchNotebook('lojas', data).map((r) => r.kind)).toEqual(['ficha']);
    expect(searchNotebook('bairro', data).map((r) => r.kind)).toEqual(['nota']);
    expect(searchNotebook('Ana', data).map((r) => r.kind)).toEqual(['tarefa']);
    // pela tarefa ligada à nota e sem acento
    expect(searchNotebook('preco teste', data).some((r) => r.kind === 'nota' && r.note.id === 'b')).toBe(true);
  });

  it('várias palavras: todas precisam aparecer, em qualquer ordem', () => {
    expect(searchNotebook('grupo oferta', data)).toHaveLength(1);
    expect(searchNotebook('grupo inexistente', data)).toHaveLength(0);
    expect(searchNotebook('   ', data)).toHaveLength(0);
  });

  it('marca os trechos encontrados mantendo os acentos do texto original', () => {
    const parts = highlightParts('Começar pelo preço', 'preco comecar');
    expect(parts.filter((p) => p.hit).map((p) => p.text)).toEqual(['Começar', 'preço']);
    expect(parts.map((p) => p.text).join('')).toBe('Começar pelo preço');
    const emoji = highlightParts('🗣️ Ana disse sim', 'ana');
    expect(emoji.filter((p) => p.hit).map((p) => p.text)).toEqual(['Ana']);
  });
});
