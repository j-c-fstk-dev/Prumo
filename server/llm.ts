/**
 * Camada genérica de LLM: o resto do servidor não sabe qual provedor está em uso.
 *
 * Configuração por variáveis de ambiente (ver .env.example):
 *   LLM_PROVIDER  gemini | anthropic | openai   (openai = qualquer API compatível: Z.ai, OpenRouter, Groq, Ollama...)
 *   LLM_API_KEY   chave do provedor
 *   LLM_MODEL     id do modelo (opcional; cada provedor tem um padrão)
 *   LLM_BASE_URL  só para "openai": URL base da API compatível
 *
 * Compatibilidade: sem LLM_PROVIDER, mas com GEMINI_API_KEY definida, usa Gemini.
 */

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface GenerateOptions {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

type ProviderName = 'gemini' | 'anthropic' | 'openai';

interface LlmConfig {
  provider: ProviderName;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

const DEFAULT_MODELS: Record<ProviderName, string> = {
  gemini: 'gemini-3.8-flash',
  anthropic: 'claude-haiku-5-5',
  openai: 'glm-5.1',
};

const PLACEHOLDER_KEYS = new Set(['', 'MY_GEMINI_API_KEY', 'MY_LLM_API_KEY']);

export function getLlmConfig(): LlmConfig | null {
  const env = process.env;
  let provider = env.LLM_PROVIDER?.trim().toLowerCase() as ProviderName | undefined;
  let apiKey = env.LLM_API_KEY?.trim() ?? '';

  if (!provider && env.GEMINI_API_KEY) {
    provider = 'gemini';
    apiKey = env.GEMINI_API_KEY.trim();
  }

  if (!provider || !(provider in DEFAULT_MODELS) || PLACEHOLDER_KEYS.has(apiKey)) {
    return null;
  }
  if (provider === 'openai' && !env.LLM_BASE_URL) {
    console.warn('LLM_PROVIDER=openai exige LLM_BASE_URL; coach ficará em modo offline.');
    return null;
  }

  return {
    provider,
    apiKey,
    model: env.LLM_MODEL?.trim() || DEFAULT_MODELS[provider],
    baseUrl: env.LLM_BASE_URL?.trim().replace(/\/+$/, ''),
  };
}

async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<any> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`LLM HTTP ${res.status}: ${detail.slice(0, 500)}`);
  }
  return res.json();
}

async function generateGemini(cfg: LlmConfig, opts: GenerateOptions): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent`;
  const data = await postJson(url, { 'x-goog-api-key': cfg.apiKey }, {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: opts.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: { temperature: opts.temperature, maxOutputTokens: opts.maxTokens },
  });
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p.text ?? '').join('').trim();
}

async function generateAnthropic(cfg: LlmConfig, opts: GenerateOptions): Promise<string> {
  const data = await postJson('https://api.anthropic.com/v1/messages', {
    'x-api-key': cfg.apiKey,
    'anthropic-version': '2023-06-01',
  }, {
    model: cfg.model,
    max_tokens: opts.maxTokens ?? 1024,
    temperature: opts.temperature,
    system: opts.system,
    messages: opts.messages,
  });
  const blocks = data?.content ?? [];
  return blocks.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('').trim();
}

async function generateOpenAiCompatible(cfg: LlmConfig, opts: GenerateOptions): Promise<string> {
  const data = await postJson(`${cfg.baseUrl}/chat/completions`, {
    Authorization: `Bearer ${cfg.apiKey}`,
  }, {
    model: cfg.model,
    temperature: opts.temperature,
    max_tokens: opts.maxTokens,
    messages: [{ role: 'system', content: opts.system }, ...opts.messages],
  });
  return (data?.choices?.[0]?.message?.content ?? '').trim();
}

const ADAPTERS: Record<ProviderName, (cfg: LlmConfig, opts: GenerateOptions) => Promise<string>> = {
  gemini: generateGemini,
  anthropic: generateAnthropic,
  openai: generateOpenAiCompatible,
};

export async function generateReply(cfg: LlmConfig, opts: GenerateOptions): Promise<string> {
  return ADAPTERS[cfg.provider](cfg, opts);
}
