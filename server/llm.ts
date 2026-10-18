/**
 * Camada genérica de LLM: o resto do servidor não sabe qual provedor está em uso.
 *
 * Configuração por variáveis de ambiente (ver .env.example):
 *   LLM_PROVIDER  gemini | anthropic | openai   (openai = qualquer API compatível: Z.ai, OpenRouter, Groq, Ollama...)
 *   LLM_API_KEY   chave do provedor
 *   LLM_MODEL     id do modelo (opcional; cada provedor tem um padrão)
 *   LLM_BASE_URL  só para "openai": URL base da API compatível
 *   LLM_EXTRA_BODY  opcional: JSON com campos extras para o corpo da requisição do provedor
 *                   (ex.: Z.ai sem raciocínio: {"thinking":{"type":"disabled"}}). Não sobrescreve os campos do app.
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
  extraBody?: Record<string, unknown>;
}

const DEFAULT_MODELS: Record<ProviderName, string> = {
  gemini: 'gemini-3.8-flash',
  anthropic: 'claude-haiku-5-5',
  openai: 'glm-5.1',
};

const PLACEHOLDER_KEYS = new Set(['', 'MY_GEMINI_API_KEY', 'MY_LLM_API_KEY']);

export type LlmEnv = Partial<Record<'LLM_PROVIDER' | 'LLM_API_KEY' | 'LLM_MODEL' | 'LLM_BASE_URL' | 'LLM_EXTRA_BODY' | 'GEMINI_API_KEY', string>>;

/**
 * Lê a configuração das variáveis de ambiente. No Node vem de process.env; no Cloudflare Worker,
 * do objeto `env` recebido pela requisição.
 */
export function getLlmConfig(env: LlmEnv = (globalThis as { process?: { env: LlmEnv } }).process?.env ?? {}): LlmConfig | null {
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
    extraBody: parseExtraBody(env.LLM_EXTRA_BODY),
  };
}

function parseExtraBody(raw?: string): Record<string, unknown> | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch {
    // cai no aviso abaixo
  }
  console.warn('LLM_EXTRA_BODY não é um objeto JSON válido; ignorado.');
  return undefined;
}

async function postJson(cfg: LlmConfig, url: string, headers: Record<string, string>, body: Record<string, unknown>): Promise<any> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    // Campos do app vêm por último: o extra nunca troca modelo, mensagens ou prompt
    body: JSON.stringify({ ...cfg.extraBody, ...body }),
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
  const data = await postJson(cfg, url, { 'x-goog-api-key': cfg.apiKey }, {
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
  const data = await postJson(cfg, 'https://api.anthropic.com/v1/messages', {
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
  const data = await postJson(cfg, `${cfg.baseUrl}/chat/completions`, {
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
