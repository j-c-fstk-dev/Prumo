/**
 * Cloudflare Worker do Prumo: serve o app (pasta dist/) e a API do coach.
 * A lógica do coach é a mesma do servidor local (server/coach.ts).
 * As chaves da IA ficam como secrets do Worker (painel da Cloudflare ou `wrangler secret put`).
 */

import { handleCoachChat, handleHealth, handleReport } from '../server/coach.ts';
import type { LlmEnv } from '../server/llm.ts';

interface Env extends LlmEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
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

    if (pathname === '/api/coach/chat' || pathname === '/api/coach/report') {
      if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
      const body = await readJson(request);
      if (body instanceof Response) return body;
      const result = pathname === '/api/coach/chat' ? await handleCoachChat(body, env) : handleReport(body);
      return json(result.status, result.body);
    }

    if (pathname.startsWith('/api/')) return json(404, { error: 'Rota não encontrada.' });

    // Tudo o mais é o app (com fallback para index.html: é uma SPA)
    return env.ASSETS.fetch(request);
  },
};
