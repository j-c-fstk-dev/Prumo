import React from 'react';
import { CompassMark } from '../components/brand/CompassMark';
import { SITE } from './site';

/** Rodapé da apresentação e das páginas legais */
export const SiteFooter: React.FC = () => (
  <footer className="border-t border-line bg-surface">
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between text-sm">
      <a href="/" className="inline-flex items-center gap-2 text-ink font-display font-bold text-lg">
        <CompassMark size={26} className="text-primary" /> Prumo
      </a>
      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-muted" aria-label="Links do rodapé">
        <a href="/privacidade/" className="hover:text-ink">Política de privacidade</a>
        <a href="/termos/" className="hover:text-ink">Termos de uso</a>
        {SITE.email && (
          <a href={`mailto:${SITE.email}`} className="hover:text-ink">
            Contato
          </a>
        )}
        <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          Código-fonte (AGPL-3.0)
        </a>
      </nav>
    </div>
    <p className="max-w-5xl mx-auto px-4 pb-8 text-xs text-muted">
      O Prumo não promete renda. Ele ajuda você a escolher uma aposta pequena, testar com pessoas reais e decidir com o que aprendeu.
    </p>
  </footer>
);
