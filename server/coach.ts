/**
 * Lógica do Coach Prumo, sem depender de Express nem de Cloudflare: o servidor local
 * (server.ts) e o Worker (worker/index.ts) chamam as mesmas funções.
 */

import { generateReply, getLlmConfig, type ChatMessage, type LlmEnv } from './llm.ts';
import { crisisReply, detectCrisis } from './safety.ts';
import { TOOL_CATEGORIES, type ToolCategoryId } from '../src/data/ferramentas.ts';

/** Limites contra abuso e custo: mensagens longas demais são recusadas, o resto é cortado */
export const LIMITS = {
  message: 1000,
  historyItems: 6,
  historyItemChars: 1000,
  contextChars: 300,
} as const;

export type CoachMode = 'live' | 'offline' | 'crisis';

export interface CoachResult {
  status: number;
  body: { reply?: string; isLiveAI?: boolean; mode?: CoachMode; error?: string };
}

const clip = (v: unknown, max: number = LIMITS.contextChars): string =>
  typeof v === 'string' ? v.replace(/[\r\n]+/g, ' ').slice(0, max) : '';

/** Só os campos conhecidos, cortados no tamanho máximo: nada além disso entra no prompt */
function sanitizeContext(raw: any) {
  const d = raw?.diagnosis ?? {};
  const t = raw?.currentTask ?? {};
  return {
    userName: clip(raw?.userName, 60),
    macroGoal: clip(raw?.macroGoal, 40),
    personalAnchor: clip(raw?.personalAnchor),
    diagnosis: {
      niche: clip(d.niche),
      nicheDescription: clip(d.nicheDescription),
      product: clip(d.product),
      audience: clip(d.audience),
      channel: clip(d.channel),
      timeline: clip(d.timeline),
      obstacle: clip(d.obstacle),
      planB: clip(d.planB),
    },
    currentTask: {
      title: clip(t.title),
      whatToDo: clip(t.whatToDo, 600),
      chapterTitle: clip(t.chapterTitle),
      toolCategories: Array.isArray(t.toolCategories) ? t.toolCategories : [],
    },
  };
}

/**
 * Caixa de ferramentas da tarefa atual. O app manda só códigos de categoria; o texto vem do
 * catálogo curado do próprio servidor, então nada digitado pelo cliente entra no prompt por aqui.
 */
function formatTools(raw: unknown): string {
  if (!Array.isArray(raw)) return 'nenhuma';
  const lines = raw
    .filter((id): id is ToolCategoryId => typeof id === 'string' && id in TOOL_CATEGORIES)
    .slice(0, 6)
    .map((id) => {
      const c = TOOL_CATEGORIES[id];
      return `- ${c.label} (exemplos: ${c.examples.map((e) => e.name).join(', ')}). Dica: ${c.tip}`;
    });
  return lines.join('\n') || 'nenhuma';
}

function buildSystemPrompt(userContext: ReturnType<typeof sanitizeContext>): string {
  return `Você é o Coach Prumo, o mentor inteligente do aplicativo Prumo.
Seu papel é guiar criadores e empreendedores a tirarem suas ideias do papel com clareza, serenidade e foco no menor esforço viável.

DADOS REAIS DO USUÁRIO ATUAL:
- Nome: ${userContext?.userName || 'Criador'}
- Objetivo Macro: ${userContext?.macroGoal || 'Renda extra'}
- Âncora Emocional (Promessa do Eu Futuro para 90 dias): "${userContext?.personalAnchor || 'Criar meu método próprio com dignidade e paz'}"
- Nicho Recomendado: ${userContext?.diagnosis?.niche || 'Geral'}
- Descrição do Nicho: ${userContext?.diagnosis?.nicheDescription || ''}
- Produto Ideal: ${userContext?.diagnosis?.product || 'Mini-produto digital'}
- Público-Alvo: ${userContext?.diagnosis?.audience || 'Iniciantes'}
- Canal Recomendado: ${userContext?.diagnosis?.channel || 'Instagram / Comunidades'}
- Prazo Estimado: ${userContext?.diagnosis?.timeline || '60 a 90 dias'}
- Obstáculo que a pessoa previu: ${userContext?.diagnosis?.obstacle || 'não informado'}
- Plano B combinado (se o obstáculo aparecer): ${userContext?.diagnosis?.planB || 'não informado'}
- Tarefa Atual no Roteiro: ${userContext?.currentTask?.title || 'Definir proposta de valor'}
- O que fazer na tarefa atual: ${userContext?.currentTask?.whatToDo || ''}

CAIXA DE FERRAMENTAS DA TAREFA ATUAL (lista curada pelo app):
${formatTools(userContext?.currentTask?.toolCategories)}

DIRETRIZES FUNDAMENTAIS DO COACH PRUMO:
1. Tom de voz: Mentoria acolhedora, serena, humana e prática (inspirada na profundidade emocional do Fabulous e no pragmatismo do método Prumo). Nunca use linguagem agressiva de marketing agressivo ou fórmulas mágicas.
2. Concisão e Calma: Responda em no máximo 2 a 3 parágrafos curtos ou bullet points fáceis de ler na tela do celular. Pessoas com sobrecarga mental precisam de clareza imediata e tranquilidade.
3. Menor Esforço Viável (MEV): Sempre proponha uma micro-ação que possa ser feita em 15 minutos hoje mesmo para destravar a pessoa.
4. Conexão Pessoal: Chame o usuário pelo nome (${userContext?.userName || 'Criador'}) com carinho natural. Quando oportuno, lembre-o com delicadeza da sua promessa pessoal ("${userContext?.personalAnchor || ''}") ou conecte com ${userContext?.diagnosis?.product || 'seu produto'}.
5. Idioma: Português do Brasil, fluente, acolhedor e natural.
6. Obstáculo: se a pessoa disser que travou, lembre com gentileza do plano B que ela mesma combinou antes de sugerir algo novo.
7. Ferramentas: recomende primeiro o TIPO de ferramenta e, se ajudar, no máximo 2 exemplos da caixa de ferramentas acima. NUNCA afirme preços, planos gratuitos, limites ou condições de uso: isso muda o tempo todo e você pode estar desatualizado; diga para conferir no site da ferramenta. Se a pessoa perguntar por outra ferramenta, fale de forma geral e deixe claro que ela deve confirmar as condições atuais. Para IA, oriente a usar como rascunho e revisar com a própria voz, sem colar dados pessoais de clientes.
8. Bem-estar: você não é terapeuta nem profissional de saúde. Se a pessoa falar de sofrimento intenso, risco à própria vida ou de se machucar, deixe o plano de lado, acolha com cuidado e indique o CVV (ligue 188 ou chat em cvv.org.br, 24 h, gratuito) e, em perigo imediato, o SAMU (192).
9. Não dê aconselhamento médico, jurídico ou financeiro específico e nunca prometa renda ou resultado garantido.`;
}

function generateFallbackReply(message: string, userContext: ReturnType<typeof sanitizeContext>): string {
  const name = userContext?.userName || 'Criador';
  const taskTitle = userContext?.currentTask?.title || 'sua próxima tarefa';
  const niche = userContext?.diagnosis?.niche || 'seu nicho';
  const product = userContext?.diagnosis?.product || 'seu produto';
  const anchor = userContext?.personalAnchor;
  const lower = message.toLowerCase();

  if (lower.includes('quem chamar') || lower.includes('validar') || lower.includes('pessoas')) {
    return `${name}, para validar ${product}, a regra de ouro é: comece por 3 pessoas que já te conhecem ou te pediram conselhos.\n\nEnvie uma mensagem leve: "Oi! Montei um roteiro rápido de 10 min sobre ${niche} e queria seu olhar sincero de quem vive isso na prática. Posso te mandar?". Zero pressão de venda, foco 100% em escuta sincera.`;
  }

  if (lower.includes('preço') || lower.includes('cobrar') || lower.includes('valor')) {
    return `${name}, para o primeiro teste de ${product}, use a calculadora de preço de teste no kit da tarefa de preço: ela parte do seu tempo e da faixa de referência do seu formato.\n\nNesta primeira rodada, o objetivo não é maximizar margem, e sim quebrar a barreira da primeira transação e colher retornos sinceros de quem realmente pagou.`;
  }

  if (lower.includes('vergonha') || lower.includes('medo') || lower.includes('insegur') || lower.includes('travei')) {
    return `É completamente normal sentir esse frio na barriga, ${name}. Lembra da sua promessa: "${anchor || 'fazer com dignidade e paz'}".\n\nVocê não precisa se expor para uma multidão nem parecer um especialista perfeito. Você só precisa estar um passo à frente de quem você quer ajudar hoje. Qual é a menor coisa viável que você pode fazer nos próximos 15 minutos em relação a "${taskTitle}"?`;
  }

  return `${name}, o segredo para destravar em "${taskTitle}" é focar no Menor Esforço Viável (MEV).\n\nEm vez de tentar construir a versão completa de ${product}, pegue uma única dor específica do seu público de ${niche} e resolva em 1 página de checklist ou PDF. 15 minutos de foco agora é tudo que você precisa para dar esse passo. O que acha de começarmos agora?`;
}

export async function handleCoachChat(body: any, env?: LlmEnv): Promise<CoachResult> {
  const message = body?.message;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return { status: 400, body: { error: 'Mensagem inválida ou ausente.' } };
  }
  if (message.length > LIMITS.message) {
    return { status: 413, body: { error: `A mensagem pode ter até ${LIMITS.message} caracteres.` } };
  }

  const userContext = sanitizeContext(body?.userContext);

  // Protocolo de crise: antes de qualquer IA, e sem enviar a mensagem a ninguém
  if (detectCrisis(message)) {
    return { status: 200, body: { reply: crisisReply(userContext.userName), isLiveAI: false, mode: 'crisis' } };
  }

  const llm = getLlmConfig(env);
  if (!llm) {
    return { status: 200, body: { reply: generateFallbackReply(message, userContext), isLiveAI: false, mode: 'offline' } };
  }

  const messages: ChatMessage[] = [];
  if (Array.isArray(body?.history)) {
    for (const h of body.history.slice(-LIMITS.historyItems)) {
      if (typeof h?.text !== 'string') continue;
      messages.push({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text.slice(0, LIMITS.historyItemChars) });
    }
  }
  // Os provedores exigem que a conversa comece pelo usuário
  while (messages.length && messages[0].role === 'assistant') messages.shift();
  messages.push({ role: 'user', content: message });

  try {
    const reply = await generateReply(llm, {
      system: buildSystemPrompt(userContext),
      messages,
      temperature: 0.7,
      maxTokens: 1024,
    });
    // Resposta vazia (ex.: modelo que gasta o limite de tokens "pensando") conta como falha, não como IA ao vivo
    if (!reply) throw new Error('LLM devolveu resposta vazia');
    return { status: 200, body: { reply, isLiveAI: true, mode: 'live' } };
  } catch (error) {
    // O erro vai para o log do servidor; a pessoa recebe a resposta offline marcada como tal
    console.error('Erro na chamada do Coach IA:', error);
    return { status: 200, body: { reply: generateFallbackReply(message, userContext), isLiveAI: false, mode: 'offline' } };
  }
}

const REPORT_REASONS = ['ofensiva', 'perigosa', 'errada', 'outro'] as const;

/**
 * Denúncia de resposta da IA (política de IA generativa da Google Play). Registra no log do
 * servidor só o texto da resposta denunciada e o motivo, nunca a mensagem da pessoa.
 */
export function handleReport(body: any): CoachResult {
  const reason = REPORT_REASONS.includes(body?.reason) ? body.reason : 'outro';
  const reply = clip(body?.reply, 2000);
  if (!reply) return { status: 400, body: { error: 'Resposta denunciada ausente.' } };
  console.warn(JSON.stringify({ type: 'coach_report', at: new Date().toISOString(), reason, reply }));
  return { status: 200, body: {} };
}

export function handleHealth(env?: LlmEnv): { status: number; body: { status: 'ok'; service: string; ai: string } } {
  const llm = getLlmConfig(env);
  return { status: 200, body: { status: 'ok', service: 'Prumo Coach API', ai: llm ? `${llm.provider}/${llm.model}` : 'offline' } };
}
