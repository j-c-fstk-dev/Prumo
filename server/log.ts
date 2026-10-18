/**
 * Registro de erro vindo do app (etapa 38). Só aceita campos curtos e conhecidos: o que chega
 * é um texto técnico, nunca conteúdo da pessoa.
 */
const FIELDS = { kind: 20, message: 300, stack: 600, source: 120, screen: 40, version: 20 } as const;

export function clientErrorLog(body: unknown): Record<string, string | boolean> {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const out: Record<string, string | boolean> = { type: 'client_error' };
  for (const [key, max] of Object.entries(FIELDS)) {
    const v = b[key];
    if (typeof v === 'string' && v) out[key] = v.slice(0, max);
  }
  if (typeof b.standalone === 'boolean') out.standalone = b.standalone;
  return out;
}
