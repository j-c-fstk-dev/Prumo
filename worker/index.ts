/**
 * Cloudflare Worker do Prumo: serve o app (pasta dist/) e a API do coach.
 * A lógica do coach é a mesma do servidor local (server/coach.ts).
 * As chaves da IA ficam como secrets do Worker (painel da Cloudflare ou `wrangler secret put`).
 */

import { handleCoachChat, handleHealth, handleIdea, handleMessageSuggestion, handleReport, type LiveCallGuard } from '../server/coach.ts';
import type { LlmEnv } from '../server/llm.ts';
import { clientErrorLog } from '../server/log.ts';
import { buildRules, cleanClientId, type LimitEnv, type LimitRule } from '../server/limits.ts';

export { UsageLimiter } from './limiter.ts';

interface LimiterStub {
  consume(rules: LimitRule[]): Promise<{ allowed: boolean; blockedBy?: string }>;
}

interface Env extends LlmEnv, LimitEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Durable Object do limite de uso (wrangler.jsonc). Sem ele, o coach roda sem limite. */
  LIMITER?: { idFromName(name: string): unknown; get(id: unknown): LimiterStub };
}

/** Limite de uso por aparelho, por IP e total do dia (server/limits.ts) */
function usageGuard(request: Request, env: Env, body: unknown): LiveCallGuard | undefined {
  const limiter = env.LIMITER;
  if (!limiter) return undefined;
  const ip = request.headers.get('cf-connecting-ip') ?? 'sem-ip';
  const clientId = cleanClientId((body as { clientId?: unknown })?.clientId);
  return () => limiter.get(limiter.idFromName('coach')).consume(buildRules(env, { clientId, ip }, new Date()));
}

const MAX_BODY_BYTES = 64 * 1024;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function readJson(request: Request): Promise<unknown | Response> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return json(413, { error: 'Requisição grande demais.' });
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json(413, { error: 'Requisição grande demais.' });
  try {
    return JSON.parse(text);
  } catch {
    return json(400, { error: 'JSON inválido.' });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/health' && request.method === 'GET') {
      return json(200, handleHealth(env).body);
    }

    if (['/api/coach/chat', '/api/coach/report', '/api/coach/idea', '/api/coach/message'].includes(pathname)) {
      if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
      const body = await readJson(request);
      if (body instanceof Response) return body;
      const guard = usageGuard(request, env, body);
      const result =
        pathname === '/api/coach/chat'
          ? await handleCoachChat(body, env, guard)
          : pathname === '/api/coach/idea'
            ? await handleIdea(body, env, guard)
            : pathname === '/api/coach/message'
              ? await handleMessageSuggestion(body, env, guard)
              : handleReport(body);
      return json(result.status, result.body);
    }

    // Erros do app (src/utils/telemetry.ts): aparecem nos logs do Worker, sem dados da pessoa
    if (pathname === '/api/log') {
      if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
      const body = await readJson(request);
      if (body instanceof Response) return body;
      console.error(JSON.stringify(clientErrorLog(body)));
      return new Response(null, { status: 204 });
    }

    if (pathname.startsWith('/api/')) return json(404, { error: 'Rota não encontrada.' });

    // Tudo o mais é o app (com fallback para index.html: é uma SPA)
    return env.ASSETS.fetch(request);
  },
};
