/** Tipos mínimos do runtime da Cloudflare usados aqui (evita uma dependência só para tipos) */
declare module 'cloudflare:workers' {
  export abstract class DurableObject<Env = unknown> {
    protected ctx: DurableObjectState;
    protected env: Env;
    constructor(ctx: DurableObjectState, env: Env);
  }
}

interface SqlCursor {
  toArray(): Record<string, unknown>[];
}

interface DurableObjectState {
  storage: { sql: { exec(query: string, ...bindings: unknown[]): SqlCursor } };
}
