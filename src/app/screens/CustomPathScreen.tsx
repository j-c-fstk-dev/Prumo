import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../state/AppStore';
import { Reveal } from '../components/Reveal';
import { CUSTOM_LIMITS, isCustomPathReady, type CustomPathInput, type ProductId } from '../../domain/diagnosis';

const FORMATS: { id: ProductId; label: string; hint: string }[] = [
  { id: 'servico', label: 'Fazer pela pessoa', hint: 'Você resolve o problema pra ela.' },
  { id: 'sessao', label: 'Uma conversa de 1 hora', hint: 'Uma chamada que termina com um plano.' },
  { id: 'guia', label: 'Um guia com modelo pronto', hint: 'Material curto que você cria uma vez e vende várias.' },
  { id: 'minicurso', label: 'Mini-curso em vídeo', hint: 'Aulas curtas gravadas no celular.' },
];

const inputClass =
  'w-full px-3 py-2.5 text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-primary';

/** "Quero criar o meu": a pessoa desenha o próprio caminho, com ajuda opcional da IA (etapa 23) */
export const CustomPathScreen: React.FC = () => {
  const { actions } = useApp();
  const [form, setForm] = useState<CustomPathInput>({ offer: '', audience: '', pain: '', productId: 'servico' });
  const [idea, setIdea] = useState('');
  const [asking, setAsking] = useState(false);
  const [notice, setNotice] = useState('');
  const ready = isCustomPathReady(form);

  const askAi = async () => {
    if (idea.trim().length < 5 || asking) return;
    setAsking(true);
    setNotice('');
    const r = await actions.suggestPath(idea.trim());
    setAsking(false);
    if (r.mode === 'live' && r.idea) {
      soundEffects.playSelectOption();
      const format = FORMATS.some((f) => f.id === r.idea!.format) ? (r.idea.format as ProductId) : 'servico';
      setForm({ offer: r.idea.offer, audience: r.idea.audience, pain: r.idea.pain, productId: format });
      setNotice('Pronto! Dá uma olhada e ajuste o que quiser.');
    } else if (r.mode === 'limited') {
      setNotice('A IA já ajudou bastante por hoje. Preencha os campos abaixo do seu jeito: funciona igual.');
    } else if (r.mode === 'crisis') {
      setNotice('Parece que você não está bem. Se precisar conversar, o CVV atende de graça, 24 h: ligue 188 ou acesse cvv.org.br.');
    } else {
      setNotice('A IA não respondeu agora. Preencha os campos abaixo do seu jeito: funciona igual.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 select-none overflow-y-auto animate-fadeIn">
      <div className="space-y-3">
        <Reveal i={0}>
          <button
            onClick={() => {
              soundEffects.playBack();
              actions.go('result');
            }}
            className="-ml-2 min-h-11 inline-flex items-center gap-1 text-sm text-muted hover:text-ink cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar às sugestões
          </button>
          <h2 className="text-2xl font-bold font-display text-ink leading-tight">Criar o meu caminho</h2>
          <p className="text-sm text-muted leading-relaxed mt-1">
            Não curtiu as sugestões? Sem problema. Conta a sua ideia e a jornada se adapta a ela.
          </p>
        </Reveal>

        <Reveal i={1}>
          <div className="p-3.5 rounded-xl bg-primary-soft/60 border border-primary/20 space-y-2">
            <strong className="text-sm text-ink flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" /> Quer ajuda pra organizar a ideia?
            </strong>
            <textarea
              rows={3}
              value={idea}
              maxLength={1000}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ex: sou bom em violão e queria ensinar adultos que sempre tiveram vontade de tocar"
              className={`${inputClass} resize-none`}
              aria-label="Sua ideia com suas palavras"
            />
            <button
              onClick={askAi}
              disabled={idea.trim().length < 5 || asking}
              className="w-full min-h-10 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-40 text-on-primary text-sm font-semibold cursor-pointer"
            >
              {asking ? 'Organizando…' : 'Organizar com a IA'}
            </button>
            <p className="text-xs text-muted leading-snug">
              Esse texto vai para a IA só para montar a sugestão. Você revisa tudo antes de usar.
            </p>
            {notice && <p className="text-[13px] text-ink font-medium">{notice}</p>}
          </div>
        </Reveal>

        <Reveal i={2}>
          <div className="space-y-2.5">
            <label className="block">
              <span className="text-sm font-semibold text-ink block mb-1">O que você vai oferecer?</span>
              <input
                value={form.offer}
                maxLength={CUSTOM_LIMITS.offer}
                onChange={(e) => setForm({ ...form, offer: e.target.value })}
                placeholder="Ex: aulas de violão para iniciantes"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink block mb-1">Pra quem?</span>
              <input
                value={form.audience}
                maxLength={CUSTOM_LIMITS.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                placeholder="Ex: adultos que sempre quiseram tocar"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink block mb-1">Que problema isso resolve?</span>
              <input
                value={form.pain}
                maxLength={CUSTOM_LIMITS.pain}
                onChange={(e) => setForm({ ...form, pain: e.target.value })}
                placeholder="Ex: não saber por onde começar"
                className={inputClass}
              />
            </label>
          </div>
        </Reveal>

        <Reveal i={3}>
          <span className="text-sm font-semibold text-ink block mb-1.5">Como você quer começar?</span>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Formato">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                role="radio"
                aria-checked={form.productId === f.id}
                onClick={() => {
                  soundEffects.playSoftTap();
                  setForm({ ...form, productId: f.id });
                }}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                  form.productId === f.id ? 'border-primary bg-primary-soft' : 'border-line bg-surface'
                }`}
              >
                <strong className="text-[13px] text-ink block">{f.label}</strong>
                <span className="text-xs text-muted leading-snug block mt-0.5">{f.hint}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="pt-4">
        <button
          disabled={!ready}
          onClick={() => {
            actions.chooseCustomPath(form);
            actions.go('result');
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold text-base rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Usar este caminho
        </button>
        {!ready && <p className="text-xs text-muted text-center mt-1.5">Preencha os 3 campos pra continuar.</p>}
      </div>
    </div>
  );
};
