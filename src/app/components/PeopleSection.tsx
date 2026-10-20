import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTypewriter } from './useTypewriter';
import { SentPrompt } from './SentPrompt';
import { Mail, MessageCircle, Pencil, Phone, Sparkles, Trash2, UserPlus, Users } from 'lucide-react';
import { copyText } from '../../utils/share';
import { AddPhotoButton, LinkedText, PhotoStrip } from './Photos';
import { deleteImages, saveImage } from '../state/images';
import { useApp } from '../state/AppStore';
import { track } from '../../utils/telemetry';
import { soundEffects } from '../../utils/soundEffects';
import { dayKey } from '../../domain/journey';
import type { KitContext } from '../../domain/kit';
import {
  countByStage,
  dueFollowUps,
  emailLink,
  messageFor,
  PERSON_LIMITS,
  phoneLink,
  SOURCES,
  STAGES,
  funnel,
  testVerdict,
  COMMITMENTS,
  TEST_ROUND,
  whatsappLink,
  type Person,
  type Stage,
} from '../../domain/people';

const inputClass =
  'w-full px-3 py-2 text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-primary';
const actionClass = (on: boolean) =>
  `min-h-11 px-1.5 rounded-xl border text-[13px] font-semibold leading-tight inline-flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition-colors ${
    on ? 'border-primary bg-primary-soft text-primary' : 'border-line text-ink hover:border-primary'
  }`;
const chip = (on: boolean) =>
  `px-2.5 min-h-9 rounded-full border text-[13px] whitespace-nowrap cursor-pointer ${on ? 'border-primary bg-primary-soft text-primary font-semibold' : 'border-line text-muted'}`;

type Draft = { name: string; phone: string; email: string; source: string; note: string };
const EMPTY: Draft = { name: '', phone: '', email: '', source: '', note: '' };

/** Contact Picker API: só no Chrome do Android; a pessoa escolhe quem trazer (nunca a agenda inteira) */
type PickedContact = { name?: string[]; tel?: string[]; email?: string[] };
const contactsApi = (): { select: (props: string[], opts: { multiple: boolean }) => Promise<PickedContact[]> } | null =>
  typeof navigator !== 'undefined' && 'contacts' in navigator && typeof window !== 'undefined' && 'ContactsManager' in window
    ? (navigator as unknown as { contacts: { select: (p: string[], o: { multiple: boolean }) => Promise<PickedContact[]> } }).contacts
    : null;

const PersonForm: React.FC<{ initial?: Draft; onSave: (d: Draft) => void; onCancel: () => void; saveLabel: string }> = ({
  initial = EMPTY,
  onSave,
  onCancel,
  saveLabel,
}) => {
  const [d, setD] = useState<Draft>(initial);
  return (
    <div className="space-y-2">
      <input value={d.name} maxLength={PERSON_LIMITS.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Nome" aria-label="Nome" className={inputClass} />
      <div className="grid grid-cols-2 gap-2">
        <input value={d.phone} maxLength={PERSON_LIMITS.phone} inputMode="tel" onChange={(e) => setD({ ...d, phone: e.target.value })} placeholder="WhatsApp" aria-label="WhatsApp" className={inputClass} />
        <input value={d.email} maxLength={PERSON_LIMITS.email} inputMode="email" onChange={(e) => setD({ ...d, email: e.target.value })} placeholder="E-mail" aria-label="E-mail" className={inputClass} />
      </div>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="De onde veio">
        {SOURCES.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={d.source === s} onClick={() => setD({ ...d, source: d.source === s ? '' : s })} className={chip(d.source === s)}>
            {s}
          </button>
        ))}
      </div>
      <textarea rows={2} value={d.note} maxLength={PERSON_LIMITS.note} onChange={(e) => setD({ ...d, note: e.target.value })} placeholder="Nota (o que ela precisa, o que disse...)" aria-label="Nota" className={`${inputClass} resize-none`} />
      <div className="flex gap-2">
        <button disabled={!d.name.trim()} onClick={() => onSave(d)} className="flex-1 min-h-10 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-on-primary text-sm font-semibold cursor-pointer">
          {saveLabel}
        </button>
        <button onClick={onCancel} className="px-4 min-h-10 rounded-xl border border-line text-sm text-muted cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  );
};

/**
 * Botões de envio (etapa 36): abrem o WhatsApp ou o e-mail com a mensagem já escrita. Sem contato
 * cadastrado, mostram o caminho para adicionar.
 */
const SendButtons: React.FC<{ person: Person; text: string; subject: string; onSent: () => void; onAddContact: () => void }> = ({
  person,
  text,
  subject,
  onSent,
  onAddContact,
}) => {
  const wa = whatsappLink(person.phone, text);
  const mail = emailLink(person.email, subject, text);
  if (!wa && !mail) {
    return (
      <button onClick={onAddContact} className="w-full min-h-11 rounded-xl border border-dashed border-primary/50 text-primary text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
        <Pencil className="w-4 h-4" /> Adicionar WhatsApp ou e-mail para enviar
      </button>
    );
  }
  return (
    <div className="grid gap-2">
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track('mensagem_enviada', { canal: 'whatsapp' });
            onSent();
          }}
          className="min-h-11 rounded-xl text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm"
          style={{ background: '#1DA851' }}
        >
          <MessageCircle className="w-4 h-4" /> Enviar no WhatsApp
        </a>
      )}
      {mail && (
        <a
          href={mail}
          onClick={() => {
            track('mensagem_enviada', { canal: 'email' });
            onSent();
          }}
          className="min-h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm">
          <Mail className="w-4 h-4" /> Enviar por e-mail
        </a>
      )}
    </div>
  );
};

/**
 * "Pedir ajuda ao coach" para escrever a mensagem (etapa 29). O nome da pessoa é trocado aqui, no
 * aparelho: a IA só vê "[nome]".
 */
const CoachMessageModal: React.FC<{
  person: Person;
  subject: string;
  onUse: (text: string) => void;
  onSent: () => void;
  onAddContact: () => void;
  onClose: () => void;
}> = ({ person, subject, onUse, onSent, onAddContact, onClose }) => {
  const { coachConsentAt, actions } = useApp();
  const [context, setContext] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const first = person.name.trim().split(/\s+/)[0] || person.name;
  // A sugestão aparece sendo "digitada" (etapa 46)
  const writer = useTypewriter(setText);

  const ask = async (another: boolean) => {
    setLoading(true);
    setNotice('');
    const r = await actions.suggestMessage(person.stage, context, another);
    setLoading(false);
    if (r.mode === 'live' && r.text) writer.start(r.text.split('[nome]').join(first));
    else if (r.mode === 'limited') setNotice('O coach já ajudou bastante por hoje. Use a mensagem pronta, ela funciona igual.');
    else if (r.mode === 'crisis') setNotice('Parece que você não está bem. O CVV atende de graça, 24 h: ligue 188 ou acesse cvv.org.br.');
    else setNotice('O coach não respondeu agora. Tente de novo daqui a pouco ou use a mensagem pronta.');
  };

  // Vai para a tela do app (e não para a área que rola), para abrir sempre no lugar visível
  const root = document.getElementById('app-screen') ?? document.body;
  return createPortal(
    <div className="absolute inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-3 animate-fadeIn" role="dialog" aria-modal="true" aria-label={`Ajuda do coach para a mensagem de ${person.name}`}>
      <div className="w-full max-h-[90%] overflow-y-auto rounded-2xl bg-surface border border-line p-4 space-y-3 animate-slide-up">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Mensagem para {first}
          </h3>
          <button onClick={onClose} className="min-h-9 px-2 text-sm text-muted cursor-pointer">
            Fechar
          </button>
        </div>

        {!coachConsentAt ? (
          <div className="space-y-2 text-sm text-ink leading-relaxed">
            <p>O coach usa inteligência artificial de um provedor externo. Para escrever a sugestão, vão a etapa da conversa, o que você oferece e o contexto que você digitar.</p>
            <p><strong>Não vão</strong> o nome, o telefone nem o e-mail de {first}.</p>
            <button onClick={actions.giveCoachConsent} className="w-full min-h-10 rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer">
              Entendi e quero usar
            </button>
          </div>
        ) : (
          <>
            <label className="block">
              <span className="text-[13px] text-muted block mb-1">Quer contar algo pra mensagem ficar melhor? (opcional)</span>
              <textarea
                rows={2}
                maxLength={500}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ex: ela disse que está sem tempo até o fim do mês"
                className={`${inputClass} resize-none`}
                aria-label="Contexto para o coach"
              />
            </label>
            <p className="text-xs text-muted">O coach não recebe o nome nem o contato de {first}.</p>

            {!text && (
              <button disabled={loading} onClick={() => ask(false)} className="w-full min-h-10 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary text-sm font-semibold cursor-pointer">
                {loading ? 'Escrevendo…' : 'Pedir sugestão'}
              </button>
            )}

            {text && (
              <div className="space-y-2">
                <textarea
                  rows={7}
                  value={text + (writer.typing ? '▍' : '')}
                  readOnly={writer.typing}
                  onChange={(e) => setText(e.target.value)}
                  onClick={() => writer.typing && writer.skip()}
                  aria-label="Sugestão do coach"
                  aria-busy={writer.typing}
                  className={`${inputClass} resize-none text-[13px]`}
                />
                {writer.typing ? (
                  <p className="text-xs text-muted" role="status">
                    ✨ O coach está escrevendo… <button onClick={writer.skip} className="underline cursor-pointer">mostrar tudo</button>
                  </p>
                ) : (
                  <SendButtons person={person} text={text} subject={subject} onSent={onSent} onAddContact={onAddContact} />
                )}
                <div className={`grid grid-cols-3 gap-2 ${writer.typing ? 'hidden' : ''}`}>
                  <button onClick={() => onUse(text)} className="min-h-10 rounded-xl border border-line text-[13px] text-ink cursor-pointer">
                    Editar antes
                  </button>
                  <button disabled={loading} onClick={() => ask(true)} className="min-h-10 rounded-xl border border-line text-[13px] text-ink cursor-pointer disabled:opacity-50">
                    {loading ? '…' : 'Outra'}
                  </button>
                  <button
                    onClick={async () => setNotice((await copyText(text)) ? 'Copiado ✓' : 'Não deu para copiar')}
                    className="min-h-10 rounded-xl border border-line text-[13px] text-ink cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
            {notice && <p className="text-[13px] text-ink font-medium" role="status">{notice}</p>}
          </>
        )}
      </div>
    </div>,
    root,
  );
};

/** Inicial sem acento, para agrupar "Ágata" junto com "Ana" */
const initialOf = (name: string) => (name.trim()[0] ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

/** Selinho da etapa, com a cor de cada uma */
const STAGE_BADGE: Record<Stage, string> = {
  contato: 'bg-surface-2 text-muted border-line',
  conversou: 'bg-primary-soft text-primary border-primary/25',
  proposta: 'bg-primary-soft text-primary border-primary/25',
  compromisso: 'bg-gold-soft text-gold-ink border-gold-line',
  cliente: 'bg-primary text-on-primary border-primary',
  agora_nao: 'bg-surface-2 text-muted border-line',
};

/**
 * Uma pessoa na lista (etapa 35): fechada é só a inicial, o nome e a etapa, como na agenda do celular.
 * Tocando no nome, abre logo abaixo com contato, nota, fotos, próximo passo e as ações.
 */
const PersonCard: React.FC<{ person: Person; ctx: KitContext; today: string; open: boolean; onToggle: () => void }> = ({
  person,
  ctx,
  today,
  open,
  onToggle,
}) => {
  const { pendingSentPerson, actions } = useApp();
  const [editing, setEditing] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [msg, setMsg] = useState('');
  const [askCoach, setAskCoach] = useState(false);
  const stage = STAGES.find((s) => s.id === person.stage)!;
  const first = person.name.trim().split(/\s+/)[0] || person.name;
  const late = person.nextDate && person.nextDate < today && person.stage !== 'agora_nao';
  const dueToday = person.nextDate === today && person.stage !== 'agora_nao';

  if (editing) {
    return (
      <div className="p-3 rounded-xl bg-surface border border-primary/40">
        <PersonForm
          initial={{ name: person.name, phone: person.phone ?? '', email: person.email ?? '', source: person.source ?? '', note: person.note ?? '' }}
          saveLabel="Salvar"
          onCancel={() => setEditing(false)}
          onSave={(d) => {
            actions.updatePerson(person.id, d);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  const openMessage = () => {
    setMsg(messageFor(person, ctx).text);
    setShowMessage(!showMessage);
  };
  const subject = messageFor(person, ctx).subject;
  const tel = phoneLink(person.phone);
  const markSent = () => actions.messageOpened(person.id);
  const addContact = () => {
    setAskCoach(false);
    setEditing(true);
  };

  const header = (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={`${person.name}, ${stage.label}`}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer"
    >
      <span className="w-9 h-9 shrink-0 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-sm" aria-hidden="true">
        {initialOf(person.name)}
      </span>
      <span className="flex-1 min-w-0 text-sm font-semibold text-ink truncate">{person.name}</span>
      {(late || dueToday) && (
        <span className="shrink-0 text-[11px] font-semibold text-gold-ink" aria-hidden="true">
          {late ? '⏰ atrasado' : '🔔 hoje'}
        </span>
      )}
      {/* Aberta, a etapa aparece na caixa de escolha logo abaixo */}
      {!open && (
        <span className={`shrink-0 text-[11px] font-semibold rounded-full border px-2 py-0.5 ${STAGE_BADGE[person.stage]}`} aria-hidden="true">
          {stage.emoji} {stage.label}
        </span>
      )}
    </button>
  );

  if (!open) return <div className="rounded-xl bg-surface border border-line">{header}</div>;

  return (
    <div className="rounded-xl bg-surface border border-primary/40 shadow-xs">
      {header}
      <div className="px-3 pb-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted min-w-0 break-words">
          {[person.source, person.phone, person.email].filter(Boolean).join(' · ') || 'Sem contato ainda'}
        </span>
        <select
          value={person.stage}
          onChange={(e) => {
            soundEffects.playSelectOption();
            actions.updatePerson(person.id, { stage: e.target.value as Stage });
          }}
          aria-label={`Etapa de ${person.name}`}
          className="shrink-0 text-xs rounded-full border border-line bg-surface-2 text-ink px-2 py-1.5 cursor-pointer"
        >
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.emoji} {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Compromisso (etapa 52): o tipo vira etiqueta; tempo < indicação < dinheiro */}
      {person.stage !== 'contato' && (
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={`Compromissos de ${person.name}`}>
          <span className="text-xs text-muted">Compromisso:</span>
          {COMMITMENTS.map((c) => {
            const on = person.commitments?.includes(c.id) ?? false;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                title={c.hint}
                onClick={() => {
                  soundEffects.playSelectOption();
                  actions.toggleCommitment(person.id, c.id);
                }}
                className={`min-h-8 px-2 rounded-full border text-xs cursor-pointer ${on ? 'bg-gold-soft text-gold-ink border-gold-line font-semibold' : 'border-line text-muted'}`}
              >
                {c.emoji} {c.label}
              </button>
            );
          })}
        </div>
      )}

      {person.note && (
        <p className="text-[13px] text-ink leading-snug whitespace-pre-line break-words">
          <LinkedText text={person.note} />
        </p>
      )}
      <PhotoStrip
        ids={person.images}
        onRemove={(id) => {
          if (!window.confirm('Tirar esta foto?')) return;
          void deleteImages([id]);
          actions.updatePerson(person.id, { images: (person.images ?? []).filter((x) => x !== id) });
        }}
      />

      {/* Próximo passo com data */}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          value={person.nextStep ?? ''}
          maxLength={PERSON_LIMITS.nextStep}
          onChange={(e) => actions.updatePerson(person.id, { nextStep: e.target.value })}
          placeholder="Próximo passo (ex.: mandar proposta)"
          aria-label={`Próximo passo com ${person.name}`}
          className={`${inputClass} py-1.5 text-[13px]`}
        />
        <input
          type="date"
          value={person.nextDate ?? ''}
          onChange={(e) => actions.updatePerson(person.id, { nextDate: e.target.value || undefined })}
          aria-label={`Data do próximo passo com ${person.name}`}
          className={`${inputClass} py-1.5 text-[13px] w-[9.5rem] ${late ? 'border-gold text-gold-ink' : ''}`}
        />
      </div>

      {/* Conversar: os três jeitos de falar com a pessoa, com o mesmo peso */}
      <div className={`grid gap-2 ${tel ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <button onClick={openMessage} aria-expanded={showMessage} className={actionClass(showMessage)}>
          <MessageCircle className="w-4 h-4" /> {showMessage ? 'Fechar mensagem' : 'Mensagem pronta'}
        </button>
        <button onClick={() => setAskCoach(true)} className={actionClass(false)}>
          <Sparkles className="w-4 h-4" /> Pedir ajuda ao coach
        </button>
        {tel && (
          <a href={tel} className={actionClass(false)}>
            <Phone className="w-4 h-4" /> Ligar
          </a>
        )}
      </div>

      {/* Mensagem pronta para a etapa, editável antes de enviar */}
      {showMessage && (
        <div className="space-y-2 p-2.5 rounded-xl bg-surface-2/60 border border-line">
          <span className="text-xs text-muted block">Mensagem pronta pra etapa "{stage.label}". Troque o que estiver entre [colchetes] e ajuste do seu jeito.</span>
          <textarea rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} aria-label={`Mensagem para ${person.name}`} className={`${inputClass} resize-none text-[13px]`} />
          <SendButtons person={person} text={msg} subject={subject} onSent={markSent} onAddContact={addContact} />
        </div>
      )}

      {/* Depois de enviar: a etapa anda com um toque (fica salvo, mesmo se a página recarregar) */}
      {pendingSentPerson?.id === person.id && <SentPrompt person={person} />}

      {/* Gerenciar: discreto, no fim da ficha */}
      <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-line -mx-0.5">
        <AddPhotoButton
          count={person.images?.length ?? 0}
          onPick={async (blobs) => {
            const ids: string[] = [];
            for (const b of blobs) ids.push(await saveImage(b));
            actions.updatePerson(person.id, { images: [...(person.images ?? []), ...ids] });
          }}
        />
        <button onClick={() => setEditing(true)} className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer">
          <Pencil className="w-3.5 h-3.5" /> Editar
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Apagar ${person.name} do caderno?`)) actions.deletePerson(person.id);
          }}
          className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Apagar
        </button>
      </div>
      {askCoach && (
        <CoachMessageModal
          person={person}
          subject={subject}
          onSent={() => {
            setAskCoach(false);
            markSent();
          }}
          onAddContact={addContact}
          onClose={() => setAskCoach(false)}
          onUse={(t) => {
            setMsg(t);
            setShowMessage(true);
            setAskCoach(false);
            soundEffects.playSelectOption();
          }}
        />
      )}
      </div>
    </div>
  );
};

/** Pessoas (etapa 28): quem você contatou, em que etapa está, próximo passo e mensagem pronta */
export const PeopleSection: React.FC = () => {
  const { people, userName, diagnosis, profileOverrides, actions } = useApp();
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<Stage | 'todas'>('todas');
  // Só uma pessoa aberta por vez; quem está aberto continua na lista mesmo se mudar de etapa
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const today = dayKey(new Date());
  const f = funnel(people);
  const verdict = testVerdict(f);
  const counts = countByStage(people);
  const due = dueFollowUps(people, today);
  const visible = useMemo(
    () =>
      people
        .filter((p) => filter === 'todas' || p.stage === filter || p.id === openId)
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })),
    [people, filter, openId],
  );
  const picker = contactsApi();

  const ctx: KitContext = {
    name: userName,
    audience: profileOverrides.audience ?? diagnosis?.audience ?? '',
    pain: profileOverrides.pain ?? diagnosis?.pain ?? '[o problema que você resolve]',
    product: profileOverrides.offer ?? diagnosis?.product ?? '[o que você oferece]',
    productId: diagnosis?.productId ?? 'servico',
    promise: profileOverrides.promise,
  };

  const importContacts = async () => {
    if (!picker) return;
    try {
      const picked = await picker.select(['name', 'tel', 'email'], { multiple: true });
      let n = 0;
      for (const c of picked) {
        const name = c.name?.[0]?.trim();
        if (!name) continue;
        actions.addPerson({ name, phone: c.tel?.[0], email: c.email?.[0] });
        n++;
      }
      if (n) setNotice(`${n} ${n === 1 ? 'pessoa adicionada' : 'pessoas adicionadas'} ✓`);
    } catch {
      // A pessoa fechou a agenda sem escolher: nada a fazer
    }
  };

  return (
    <div className="space-y-3">
      {/* O funil único do roteiro (etapa 52), contado sozinho pelas etapas e compromissos */}
      <section aria-label="Seu funil" className="p-4 rounded-2xl bg-primary-soft/60 border border-primary/25 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary block">Seu funil</span>
        <ol className="grid grid-cols-4 gap-1.5 text-center">
          {[
            [f.names, f.names === 1 ? 'nome' : 'nomes'],
            [f.talked, f.talked === 1 ? 'conversa' : 'conversas'],
            [f.presented, f.presented === 1 ? 'viu a proposta' : 'viram a proposta'],
            // Hífen suave: no celular estreito, "compromisso" quebra em vez de vazar da caixa
            [f.committed, f.committed === 1 ? 'compro\u00admisso' : 'compro\u00admissos'],
          ].map(([n, label]) => (
            <li key={label as string} className="rounded-xl bg-surface border border-line py-1.5 px-1">
              <span className="block text-lg font-bold text-ink leading-none">{n}</span>
              <span className="block text-[11px] text-muted leading-tight mt-1">{label}</span>
            </li>
          ))}
        </ol>
        <p className="text-[13px] text-muted leading-snug">
          {f.committed > 0 && (
            <strong className="text-ink">
              {f.committed} {f.committed === 1 ? 'compromisso' : 'compromissos'}
              {f.money > 0 ? `, ${f.money} em dinheiro. ` : ', nenhum em dinheiro ainda. '}
            </strong>
          )}
          {verdict === 'seguir'
            ? 'Sinal de seguir: 2 compromissos, 1 deles em dinheiro. Hora das vendas.'
            : verdict === 'ajustar'
              ? 'Tem gente se comprometendo, mas ainda não deu o sinal de seguir: mude uma coisa só (a oferta ou o preço) e faça mais uma rodada.'
              : verdict === 'trocar'
                ? `Nenhum compromisso em ${TEST_ROUND} apresentações. Antes de trocar a ideia, confira se eram o público certo: muitas vezes são as pessoas erradas, e não a ideia. Se eram, tudo bem trocar de caminho.`
                : `Elogio não conta: conta quem marcou uma data, indicou alguém ou pagou. O sinal de seguir é 2 compromissos, 1 deles em dinheiro, em até ${TEST_ROUND} apresentações.`}
          {f.clients > 0 && ` Clientes: ${f.clients}.`}
        </p>
      </section>

      {due.length > 0 && (
        <div className="p-3 rounded-xl bg-gold-soft border border-gold-line">
          <strong className="text-sm text-gold-ink block mb-1">Pra hoje</strong>
          <ul className="text-[13px] text-ink space-y-0.5">
            {due.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => setOpenId(p.id)} className="text-left cursor-pointer hover:underline">
                  {p.nextDate! < today ? '⏰' : '📌'} <strong>{p.name}</strong>: {p.nextStep || 'retomar contato'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Adicionar */}
      {adding ? (
        <div className="p-3.5 rounded-2xl bg-surface border border-primary/40">
          <PersonForm
            saveLabel="Adicionar"
            onCancel={() => setAdding(false)}
            onSave={(d) => {
              const id = actions.addPerson(d);
              if (id) setOpenId(id);
              setAdding(false);
              soundEffects.playSelectOption();
            }}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => setAdding(true)} className="flex-1 min-h-10 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
            <UserPlus className="w-4 h-4" /> Adicionar pessoa
          </button>
          {picker && (
            <button onClick={importContacts} className="min-h-10 px-3 rounded-xl border border-line text-[13px] text-ink inline-flex items-center gap-1.5 cursor-pointer hover:border-primary">
              <Users className="w-4 h-4" /> Da agenda
            </button>
          )}
        </div>
      )}
      {notice && <p className="text-[13px] text-primary font-semibold" role="status">{notice}</p>}

      {/* Lista por etapa */}
      {people.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button onClick={() => setFilter('todas')} className={chip(filter === 'todas')}>
            Todos {people.length}
          </button>
          {STAGES.map((s) => (
            <button key={s.id} onClick={() => setFilter(s.id)} className={chip(filter === s.id)} title={s.hint}>
              {s.emoji} {s.label} {counts[s.id]}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-1.5">
        {visible.map((p, i) => {
          const letter = initialOf(p.name);
          const prev = visible[i - 1] && initialOf(visible[i - 1].name);
          const showLetter = filter === 'todas' && visible.length > 6 && letter !== prev;
          return (
            <React.Fragment key={p.id}>
              {showLetter && <span className="block px-1 pt-1 text-xs font-bold text-primary">{letter}</span>}
              <PersonCard person={p} ctx={ctx} today={today} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} />
            </React.Fragment>
          );
        })}
      </div>
      {people.length === 0 && (
        <p className="text-sm text-muted leading-relaxed">
          Anote aqui com quem você vai conversar. Comece por quem já te conhece ou já te pediu ajuda. Para cada pessoa, o Prumo
          prepara uma mensagem pronta para o WhatsApp ou e-mail.
        </p>
      )}
      <p className="text-xs text-muted leading-snug">
        Os contatos ficam só neste celular e nunca vão para a IA. São dados de outras pessoas: guarde só o necessário.
      </p>
    </div>
  );
};
