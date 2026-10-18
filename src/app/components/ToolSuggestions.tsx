import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { TOOL_CATEGORIES, TOOLBOX_REVISED_AT, type ToolCategoryId } from '../../data/ferramentas';

const revisedLabel = (() => {
  const [y, m] = TOOLBOX_REVISED_AT.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
})();

/**
 * "Pode te ajudar": categorias de ferramenta para a tarefa (camada 1) com exemplos curados
 * (camada 2). Sem preços: condições mudam e a pessoa confere no site.
 */
export const ToolSuggestions: React.FC<{ categories?: ToolCategoryId[] }> = ({ categories }) => {
  const [open, setOpen] = useState<ToolCategoryId | null>(null);
  if (!categories?.length) return null;

  return (
    <div className="p-3.5 rounded-xl bg-surface border border-line">
      <strong className="text-sm text-ink block mb-2">🧰 Pode te ajudar</strong>
      <div className="space-y-1.5">
        {categories.map((id) => {
          const c = TOOL_CATEGORIES[id];
          const isOpen = open === id;
          return (
            <div key={id} className="rounded-lg bg-surface-2">
              <button
                onClick={() => setOpen(isOpen ? null : id)}
                className="w-full flex items-center justify-between gap-2 p-2.5 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>
                  <span className="text-sm font-semibold text-ink block">{c.label}</span>
                  <span className="text-[13px] text-muted block">{c.description}</span>
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-2.5 pb-2.5 space-y-2 animate-fadeIn">
                  <p className="text-[13px] text-ink leading-relaxed">💡 {c.tip}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.examples.map((e) =>
                      e.url ? (
                        <a
                          key={e.name}
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-line text-[13px] text-primary"
                        >
                          {e.name} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span key={e.name} className="px-2.5 py-1 rounded-full bg-surface border border-line text-[13px] text-ink">
                          {e.name}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted mt-2 leading-snug">
        Exemplos revisados em {revisedLabel}. Preços e condições mudam: confira no site antes de usar. O Prumo não recebe nada por
        essas indicações.
      </p>
    </div>
  );
};
