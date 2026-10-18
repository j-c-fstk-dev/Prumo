import React, { useMemo, useState } from 'react';
import { Mail, MessageCircle, Pencil, Phone, Trash2, UserPlus, Users } from 'lucide-react';
import { useApp } from '../state/AppStore';
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
  testStats,
  whatsappLink,
  type Person,
  type Stage,
} from '../../domain/people';

const inputClass =
  'w-full px-3 py-2 text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-primary';
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

const PersonCard: React.FC<{ person: Person; ctx: KitContext; today: string }> = ({ person, ctx, today }) => {
  const { actions } = useApp();
  const [editing, setEditing] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [msg, setMsg] = useState('');
  const stage = STAGES.find((s) => s.id === person.stage)!;
  const late = person.nextDate && person.nextDate < today && person.stage !== 'agora_nao';

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
  const wa = whatsappLink(person.phone, msg);
  const mail = emailLink(person.email, subject, msg);
  const tel = phoneLink(person.phone);

  return (
    <div className="p-3 rounded-xl bg-surface border border-line space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <strong className="text-sm text-ink block break-words">{person.name}</strong>
          <span className="text-xs text-muted">
            {[person.source, person.phone, person.email].filter(Boolean).join(' · ') || 'Sem contato ainda'}
          </span>
        </div>
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

      {person.note && <p className="text-[13px] text-ink leading-snug whitespace-pre-line break-words">{person.note}</p>}

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

      {/* Mensagem pronta para a etapa, editável antes de abrir o WhatsApp ou o e-mail */}
      {showMessage && (
        <div className="space-y-1.5">
          <span className="text-xs text-muted">Mensagem pronta pra etapa "{stage.label}". Troque o que estiver entre [colchetes] e ajuste do seu jeito.</span>
          <textarea rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} aria-label={`Mensagem para ${person.name}`} className={`${inputClass} resize-none text-[13px]`} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1 -ml-1.5">
        <button onClick={openMessage} className="min-h-9 px-1.5 text-xs font-semibold text-primary cursor-pointer">
          {showMessage ? 'Fechar mensagem' : 'Mensagem pronta'}
        </button>
        {showMessage && wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-ink hover:text-primary">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
        )}
        {showMessage && mail && (
          <a href={mail} className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-ink hover:text-primary">
            <Mail className="w-3.5 h-3.5" /> E-mail
          </a>
        )}
        {tel && (
          <a href={tel} className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink">
            <Phone className="w-3.5 h-3.5" /> Ligar
          </a>
        )}
        <button onClick={() => setEditing(true)} className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer">
          <Pencil className="w-3.5 h-3.5" /> Editar
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Apagar ${person.name} do caderno?`)) actions.deletePerson(person.id);
          }}
          className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Apagar
        </button>
      </div>
      {showMessage && !wa && !mail && <p className="text-xs text-muted">Adicione o WhatsApp ou o e-mail (em Editar) para abrir a conversa.</p>}
    </div>
  );
};

/** Pessoas (etapa 28): quem você contatou, em que etapa está, próximo passo e mensagem pronta */
export const PeopleSection: React.FC = () => {
  const { people, userName, diagnosis, profileOverrides, actions } = useApp();
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<Stage | 'todas'>('todas');
  const [notice, setNotice] = useState('');
  const today = dayKey(new Date());
  const stats = testStats(people);
  const counts = countByStage(people);
  const due = dueFollowUps(people, today);
  const visible = useMemo(
    () => people.filter((p) => filter === 'todas' || p.stage === filter).sort((a, b) => b.updatedAt - a.updatedAt),
    [people, filter],
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
      {/* O teste do Capítulo 2, contado sozinho */}
      <div className="p-4 rounded-2xl bg-primary-soft/60 border border-primary/25">
        <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Seu teste</span>
        <p className="text-lg font-bold text-ink">
          {stats.yes} de {stats.talked} {stats.talked === 1 ? 'pessoa disse' : 'pessoas disseram'} sim
        </p>
        <p className="text-[13px] text-muted leading-snug">
          {stats.goalMet
            ? 'Bateu o sinal de que deu certo (2 sins)! Hora de seguir para as vendas.'
            : 'O sinal de que deu certo é 2 sins entre as pessoas com quem você conversar. Mude a etapa de cada uma conforme as conversas.'}
          {stats.clients > 0 && ` Clientes: ${stats.clients}.`}
        </p>
      </div>

      {due.length > 0 && (
        <div className="p-3 rounded-xl bg-gold-soft border border-gold-line">
          <strong className="text-sm text-gold-ink block mb-1">Pra hoje</strong>
          <ul className="text-[13px] text-ink space-y-0.5">
            {due.map((p) => (
              <li key={p.id}>
                {p.nextDate! < today ? '⏰' : '📌'} <strong>{p.name}</strong>: {p.nextStep || 'retomar contato'}
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
              actions.addPerson(d);
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
            Todas {people.length}
          </button>
          {STAGES.map((s) => (
            <button key={s.id} onClick={() => setFilter(s.id)} className={chip(filter === s.id)} title={s.hint}>
              {s.emoji} {s.label} {counts[s.id]}
            </button>
          ))}
        </div>
      )}
      {visible.map((p) => (
        <PersonCard key={p.id} person={p} ctx={ctx} today={today} />
      ))}
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
