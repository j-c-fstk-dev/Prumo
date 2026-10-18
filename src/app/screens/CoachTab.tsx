import React, { useState } from 'react';
import { BookmarkPlus, Check, Compass, Copy, Flag, Send, Sparkles } from 'lucide-react';
import { copyText } from '../../utils/share';
import { useApp, type CoachMessage } from '../state/AppStore';

const MAX_MESSAGE = 1000;

const REPORT_REASONS = [
  { id: 'ofensiva', label: 'Ofensiva' },
  { id: 'perigosa', label: 'Perigosa' },
  { id: 'errada', label: 'Errada ou enganosa' },
  { id: 'outro', label: 'Outro motivo' },
] as const;

/** Consentimento antes do 1º uso: o que vai para a IA e o que fica no aparelho (docs/pesquisa/07). */
const CoachConsent: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <div className="flex-1 flex flex-col justify-center p-5 animate-tab-fade">
    <div className="p-4 rounded-2xl bg-surface border border-line space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-primary-soft flex items-center justify-center text-primary">
          <Compass className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-ink">Antes de conversar com o Coach</h3>
      </div>
      <ul className="space-y-2 text-sm text-ink leading-relaxed list-disc pl-5">
        <li>
          O Coach usa <strong>inteligência artificial</strong> de um provedor externo, que pode processar os dados
          fora do Brasil.
        </li>
        <li>
          Vai para a IA: <strong>sua mensagem</strong>, seu primeiro nome, o resumo do seu plano (nicho, produto, canal) e a
          tarefa atual.
        </li>
        <li>
          Também vai um <strong>código aleatório do aparelho</strong> (sem nome nem contato), só para limitar quantas conversas
          cada pessoa tem por dia.
        </li>
        <li>
          <strong>Não vai:</strong> o que você escreveu nas perguntas, suas cartas e suas tarefas pessoais. Elas ficam só no seu celular.
        </li>
        <li>
          O Coach ajuda nas tarefas do plano. <strong>Ele não é terapia</strong> nem substitui profissionais de saúde, direito ou
          finanças. Respostas de IA podem errar: confira o que for importante.
        </li>
        <li>Se você estiver em sofrimento, o CVV atende de graça, 24 h: ligue 188.</li>
      </ul>
      <button onClick={onAccept} className="w-full py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-base rounded-xl cursor-pointer">
        Entendi e quero usar
      </button>
    </div>
  </div>
);

/** Resposta de crise: contatos de ajuda clicáveis. */
const CrisisLinks: React.FC = () => (
  <div className="mt-2 flex flex-wrap gap-1.5">
    <a href="tel:188" className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-[13px] font-semibold">Ligar 188 (CVV)</a>
    <a href="https://cvv.org.br" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full border border-primary text-primary text-[13px] font-semibold">
      Chat do CVV
    </a>
    <a href="tel:192" className="px-3 py-1.5 rounded-full border border-line text-ink text-[13px]">Ligar 192 (SAMU)</a>
  </div>
);

const ReportButton: React.FC<{ msg: CoachMessage; onReport: (reason: (typeof REPORT_REASONS)[number]['id']) => void }> = ({ msg, onReport }) => {
  const [open, setOpen] = useState(false);
  if (msg.reported) return <span className="text-xs text-muted">Denúncia enviada. Obrigado.</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer min-h-8" aria-expanded={open}>
        <Flag className="w-3 h-3" /> Denunciar
      </button>
      {open &&
        REPORT_REASONS.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              onReport(r.id);
              setOpen(false);
            }}
            className="px-2 py-0.5 rounded-full border border-line text-xs text-ink cursor-pointer"
          >
            {r.label}
          </button>
        ))}
    </span>
  );
};

/** Copiar a resposta ou guardar no Caderno (pedido do teste: "às vezes tem coisas relevantes") */
const CoachMessageActions: React.FC<{ text: string; onSave: () => void }> = ({ text, onSave }) => {
  const [done, setDone] = useState<'' | 'copied' | 'saved'>('');
  const show = (d: 'copied' | 'saved') => {
    setDone(d);
    setTimeout(() => setDone(''), 1800);
  };
  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={async () => {
          if (await copyText(text)) show('copied');
        }}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer min-h-8"
      >
        {done === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {done === 'copied' ? 'Copiado' : 'Copiar'}
      </button>
      <button
        onClick={() => {
          onSave();
          show('saved');
        }}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer min-h-8"
      >
        {done === 'saved' ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />} {done === 'saved' ? 'No caderno' : 'Salvar no caderno'}
      </button>
    </span>
  );
};

export const CoachTab: React.FC = () => {
  const { userName, nextStepTask, isTyping, coachMessages, coachConsentAt, actions } = useApp();
  const [inputMessage, setInputMessage] = useState('');

  if (!coachConsentAt) return <CoachConsent onAccept={actions.giveCoachConsent} />;

  // Saudação gerada na hora (não é salva): sempre fala da tarefa atual
  const greeting: CoachMessage = {
    sender: 'coach',
    text: `Oi, ${userName}! Sou o Coach Prumo. Na tarefa "${nextStepTask.title}", o que está travando hoje?`,
    time: '',
  };
  const messages = coachMessages.length ? coachMessages : [greeting];
  const lastCoach = [...coachMessages].reverse().find((m) => m.sender === 'coach');
  const offline = lastCoach?.mode === 'offline';
  const limited = lastCoach?.mode === 'limited';

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).slice(0, MAX_MESSAGE);
    if (!text.trim() || isTyping) return;
    setInputMessage('');
    actions.sendCoachMessage(text);
  };

  return (
    <div key="tab-coach" className="flex-1 flex flex-col justify-between p-4 select-none animate-tab-fade min-h-0">
      {/* Cabeçalho: status real (não promete "online" quando a IA está fora) */}
      <div className="pb-2 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-ink">Coach Prumo</h3>
              <span className="text-xs bg-primary-soft text-primary px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> IA
              </span>
            </div>
            <span className={`text-xs flex items-center gap-1 ${offline || limited ? 'text-gold-ink' : 'text-muted'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${offline || limited ? 'bg-gold' : 'bg-success'}`} />
              {limited
                ? 'Conversas de hoje esgotadas · volta amanhã'
                : offline
                  ? 'IA indisponível agora · respostas prontas'
                  : `Conhece o plano de ${userName}`}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted mt-1.5">Ajuda nas tarefas do plano. Não é terapia. Respostas de IA podem errar.</p>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-primary text-on-primary rounded-br-xs'
                  : msg.mode === 'crisis'
                    ? 'bg-gold-soft border border-gold-line text-ink rounded-bl-xs'
                    : 'bg-surface border border-line text-ink rounded-bl-xs shadow-xs'
              }`}
            >
              {msg.text}
              {msg.mode === 'crisis' && <CrisisLinks />}
              {msg.mode === 'offline' && (
                <span className="block text-xs text-gold-ink mt-1.5">Resposta pronta: a IA não respondeu desta vez.</span>
              )}
              {msg.mode === 'limited' && (
                <span className="block text-xs text-gold-ink mt-1.5">Limite de conversas com a IA por hoje.</span>
              )}
              <span className={`flex items-center justify-between gap-2 text-xs mt-1 ${msg.sender === 'user' ? 'text-on-primary/70 justify-end' : 'text-muted'}`}>
                {msg.sender === 'coach' && i < coachMessages.length && msg.mode !== 'crisis' && (
                  <span className="inline-flex flex-wrap items-center gap-x-2">
                    <CoachMessageActions text={msg.text} onSave={() => actions.addNote(msg.text, 'coach', nextStepTask.title)} />
                    {msg.mode === 'live' && <ReportButton msg={msg} onReport={(reason) => actions.reportCoachMessage(i, reason)} />}
                  </span>
                )}
                <span className="ml-auto">{msg.time}</span>
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-line p-3 rounded-2xl text-[13px] text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
              <span className="ml-1">Coach digitando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Sugestões rápidas + campo de mensagem */}
      <div className="space-y-2 pt-2 border-t border-line">
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[13px]">
          {['Como abordar sem parecer chato?', 'Não sei quem chamar para testar', 'Qual preço devo colocar?'].map((sug) => (
            <button
              key={sug}
              onClick={() => handleSendMessage(sug)}
              className="px-2.5 py-1 bg-surface border border-line hover:border-primary text-muted rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escreva sua dúvida..."
            className="flex-1 px-3 py-2 bg-surface border border-line rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => handleSendMessage()}
            className="min-w-11 min-h-11 inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-on-primary rounded-xl cursor-pointer"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
