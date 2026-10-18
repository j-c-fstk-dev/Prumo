import React, { Suspense, lazy } from 'react';
import { PrumoAppSimulator } from './components/prototype/PrumoAppSimulator';

// O DevHub (guias Android + código Kotlin de referência) é carregado sob demanda
// em /devhub para não pesar no bundle do app.
const DevHub = lazy(() => import('./DevHub'));

export default function App() {
  if (window.location.pathname.startsWith('/devhub')) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#5B615D]">Carregando DevHub...</div>}>
        <DevHub />
      </Suspense>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-canvas sm:bg-surface-2 flex items-center justify-center">
      <PrumoAppSimulator />
    </main>
  );
}
