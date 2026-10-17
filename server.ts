import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getLlmConfig, generateReply, type ChatMessage } from './server/llm.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

function generateFallbackReply(message: string, userContext: any): string {
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
    return `${name}, para o primeiro lote de validação de ${product}, o preço ideal inicial fica entre R$ 27 e R$ 47.\n\nNesta primeira rodada, seu objetivo não é maximizar margem, e sim quebrar a barreira da primeira transação e colher feedbacks e depoimentos sinceros de quem realmente pagou.`;
  }

  if (lower.includes('vergonha') || lower.includes('medo') || lower.includes('insegur') || lower.includes('travei')) {
    return `É completamente normal sentir esse frio na barriga, ${name}. Lembra da sua promessa: "${anchor || 'fazer com dignidade e paz'}".\n\nVocê não precisa se expor para uma multidão nem parecer um especialista perfeito. Você só precisa estar um passo à frente de quem você quer ajudar hoje. Qual é a menor coisa viável que você pode fazer nos próximos 15 minutos em relação a "${taskTitle}"?`;
  }

  return `${name}, o segredo para destravar em "${taskTitle}" é focar no Menor Esforço Viável (MEV).\n\nEm vez de tentar construir a versão completa de ${product}, pegue uma única dor específica do seu público de ${niche} e resolva em 1 página de checklist ou PDF. 15 minutos de foco agora é tudo que você precisa para dar esse passo. O que acha de começarmos agora?`;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const llm = getLlmConfig();
  console.log(llm ? `Coach IA: ${llm.provider} (${llm.model})` : 'Coach IA: modo offline (sem LLM configurado)');

  // API endpoint do Coach Prumo (provedor de IA configurável, ver server/llm.ts)
  app.post('/api/coach/chat', async (req, res) => {
    try {
      const { message, history, userContext } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
      }

      if (!llm) {
        const fallback = generateFallbackReply(message, userContext);
        return res.json({ reply: fallback, isLiveAI: false });
      }

      const systemPrompt = `Você é o Coach Prumo, o mentor inteligente do aplicativo Prumo.
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
- Tarefa Atual no Roteiro: ${userContext?.currentTask?.title || 'Definir proposta de valor'}
- O que fazer na tarefa atual: ${userContext?.currentTask?.whatToDo || ''}

DIRETRIZES FUNDAMENTAIS DO COACH PRUMO:
1. Tom de voz: Mentoria acolhedora, serena, humana e prática (inspirada na profundidade emocional do Fabulous e no pragmatismo do método Prumo). Nunca use linguagem agressiva de marketing agressivo ou fórmulas mágicas.
2. Concisão e Calma: Responda em no máximo 2 a 3 parágrafos curtos ou bullet points fáceis de ler na tela do celular. Pessoas com sobrecarga mental precisam de clareza imediata e tranquilidade.
3. Menor Esforço Viável (MEV): Sempre proponha uma micro-ação que possa ser feita em 15 minutos hoje mesmo para destravar a pessoa.
4. Conexão Pessoal: Chame o usuário pelo nome (${userContext?.userName || 'Criador'}) com carinho natural. Quando oportuno, lembre-o com delicadeza da sua promessa pessoal ("${userContext?.personalAnchor || ''}") ou conecte com ${userContext?.diagnosis?.product || 'seu produto'}.
5. Idioma: Português do Brasil, fluente, acolhedor e natural.`;

      const messages: ChatMessage[] = [];

      // Histórico recente da conversa
      if (Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          if (typeof h?.text !== 'string') continue;
          messages.push({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text });
        }
      }
      // Os provedores exigem que a conversa comece pelo usuário
      while (messages.length && messages[0].role === 'assistant') messages.shift();

      messages.push({ role: 'user', content: message });

      const reply = await generateReply(llm, {
        system: systemPrompt,
        messages,
        temperature: 0.7,
        maxTokens: 1024,
      });

      const replyText = reply || 'Estou aqui com você. Como podemos simplificar esse próximo passo em apenas 15 minutos?';
      return res.json({ reply: replyText, isLiveAI: true });
    } catch (error: any) {
      console.error('Erro na chamada do Coach IA:', error);
      const fallback = generateFallbackReply(req.body?.message || '', req.body?.userContext);
      return res.json({ reply: fallback, isLiveAI: false });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Prumo Coach API', ai: llm ? `${llm.provider}/${llm.model}` : 'offline' });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prumo Full-Stack Server running on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
