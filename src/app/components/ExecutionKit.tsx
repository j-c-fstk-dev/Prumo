import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, MessageCircle } from 'lucide-react';
import { buildKitText, kitForTask, suggestTestPrice, type KitContext, type KitItem } from '../../domain/kit';
import { useApp } from '../state/AppStore';

const inputClass = 'w-full px-3 py-2 bg-surface border border-line rounded-lg text-sm focus:outline-none focus:border-primary';

const TextTemplate: React.FC<{ item: KitItem; ctx: KitContext }> = ({ item, ctx }) => {
  const [text, setText] = useState(() => buildKitText(item.id as Exclude<KitItem['id'], 'preco'>, ctx));
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sem permissão de área de transferência: a pessoa pode selecionar e copiar à mão
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className={`${inputClass} leading-relaxed resize-y`}
        aria-label={item.title}
      />
      <p className="text-xs text-muted">Troque o que está entre [colchetes] e ajuste com a sua voz antes de usar.</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={copy} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiado' : 'Copiar'}
        </button>
        {item.isMessage && (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line bg-surface text-sm font-semibold text-primary"
          >
            <MessageCircle className="w-4 h-4" /> Abrir no WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

const PriceCalculator: React.FC<{ ctx: KitContext }> = ({ ctx }) => {
  const [hours, setHours] = useState('1');
  const [hourValue, setHourValue] = useState('30');
  const [cost, setCost] = useState('0');
  const num = (v: string) => Number(v.replace(',', '.')) || 0;
  const r = suggestTestPrice({ productId: ctx.productId, hoursPerSale: num(hours), hourValue: num(hourValue), costPerSale: num(cost) });
  const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const perSaleHint = ctx.productId === 'guia' || ctx.productId === 'minicurso' ? ' (horas de criação ÷ vendas que você espera no teste)' : '';

  return (
    <div className="space-y-2.5">
      <label className="block text-sm text-ink">
        Horas para entregar 1 venda{perSaleHint}
        <input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} className={`${inputClass} mt-1`} />
      </label>
      <label className="block text-sm text-ink">
        Quanto vale 1 hora do seu trabalho hoje (R$)
        <input inputMode="decimal" value={hourValue} onChange={(e) => setHourValue(e.target.value)} className={`${inputClass} mt-1`} />
      </label>
      <label className="block text-sm text-ink">
        Custos por venda: taxas, materiais (R$)
        <input inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} className={`${inputClass} mt-1`} />
      </label>
      <div className="p-3 rounded-lg bg-primary-soft border border-primary/20 space-y-1">
        <p className="text-sm text-ink">
          Seu tempo e custos pedem: <strong>{brl(r.floor)}</strong>
        </p>
        <p className="text-sm text-ink">
          Faixa de referência para este formato: {brl(r.range[0])} a {brl(r.range[1])}
        </p>
        <p className="text-base text-primary font-bold">Preço de teste sugerido: {brl(r.suggested)}</p>
        <p className="text-[13px] text-muted leading-snug">{r.note}</p>
      </div>
      <p className="text-xs text-muted">A faixa é uma referência inicial para testar, não uma regra. Depois do teste, ajuste pelo que as pessoas disseram.</p>
    </div>
  );
};

/** Kit de execução da tarefa: modelos prontos com o plano da pessoa (benefício Premium; 1 por capítulo no grátis). */
export const ExecutionKit: React.FC<{ taskId: string; chapterId: number }> = ({ taskId, chapterId }) => {
  const { userName, diagnosis, actions } = useApp();
  const [open, setOpen] = useState<string | null>(null);
  const items = kitForTask(taskId);
  if (!items.length) return null;

  const ctx: KitContext = {
    name: userName,
    audience: diagnosis.audience,
    pain: diagnosis.pain ?? 'esse problema',
    product: diagnosis.product,
    productId: diagnosis.productId,
  };

  return (
    <div className="p-3.5 rounded-xl bg-surface border border-line">
      <strong className="text-sm text-ink block mb-2">🛠️ Kit de execução</strong>
      <div className="space-y-1.5">
        {items.map((item) => {
          const isOpen = open === item.id;
          return (
            <div key={item.id} className="rounded-lg bg-surface-2">
              <button
                onClick={() => {
                  if (isOpen) return setOpen(null);
                  if (actions.openKit(item.id, chapterId)) setOpen(item.id);
                }}
                className="w-full flex items-center justify-between gap-2 p-2.5 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>
                  <span className="text-sm font-semibold text-ink block">{item.title}</span>
                  <span className="text-[13px] text-muted block">{item.description}</span>
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-2.5 pb-2.5 animate-fadeIn">
                  {item.kind === 'calculator' ? <PriceCalculator ctx={ctx} /> : <TextTemplate item={item} ctx={ctx} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
