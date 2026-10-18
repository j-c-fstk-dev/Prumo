import { createRoot } from 'react-dom/client';
import '../index.css';
import { installErrorReporting } from '../utils/telemetry';
import { Landing } from './Landing';

installErrorReporting();
createRoot(document.getElementById('root')!).render(<Landing />);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
