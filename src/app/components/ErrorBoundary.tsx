import React from 'react';
import { reportError } from '../../utils/telemetry';

/**
 * Se uma tela quebrar, mostra um aviso calmo em vez de uma tela branca, e registra o erro (etapa 38).
 * Os dados ficam salvos no aparelho: recarregar resolve na maioria dos casos.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    reportError(error, { kind: 'render' });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="text-3xl" aria-hidden="true">🧭</span>
        <h1 className="text-xl font-bold font-display">Algo saiu do prumo por aqui.</h1>
        <p className="text-sm text-muted max-w-[280px] leading-relaxed">
          Suas respostas, tarefas e anotações continuam salvas neste celular. Recarregar costuma resolver.
        </p>
        <button
          onClick={() => location.reload()}
          className="mt-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold cursor-pointer"
        >
          Recarregar
        </button>
      </div>
    );
  }
}
