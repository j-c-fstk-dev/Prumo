import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installErrorReporting } from './utils/telemetry';

installErrorReporting();

createRoot(document.getElementById('root')!).render(<App />);

// Funciona sem internet depois da 1ª visita (etapa 37). Só no site publicado: em desenvolvimento
// o cache atrapalharia ver as mudanças.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
