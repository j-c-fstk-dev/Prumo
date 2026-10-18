import React, { useMemo, useState } from 'react';
import { Copy, Download, Pencil, Search, Trash2, X } from 'lucide-react';
import { useApp } from '../state/AppStore';
import { Reveal } from '../components/Reveal';
import { PeopleSection } from '../components/PeopleSection';
import { useNotebookExport } from '../components/useNotebookExport';
import { STAGES } from '../../domain/people';
import { soundEffects } from '../../utils/soundEffects';
import { copyText } from '../../utils/share';
import {
  filterNotes,
  highlightParts,
  NOTE_MAX,
  NOTE_TAGS,
  PROFILE_FIELDS,
  profileValues,
  searchNotebook,
  type Note,
  type NoteTag,
} from '../../domain/notebook';

const inputClass =
  'w-full px-3 py-2 text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-primary';

const tagOf = (id: NoteTag) => NOTE_TAGS.find((t) => t.id === id)!;

/** Avisinho que some sozinho ("Copiado ✓") */
function useFlash(): [string, (msg: string) => void] {
  const [msg, setMsg] = useState('');
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 1800);
  };
  return [msg, flash];
}

/** Texto com as palavras da busca destacadas */
const Marked: React.FC<{ text: string; query: string }> = ({ text, query }) => (
  <>
    {highlightParts(text, query).map((p, i) =>
      p.hit ? (
        <mark key={i} className="bg-gold/40 text-ink rounded-sm px-0.5">
          {p.text}
        </mark>
      ) : (
        <React.Fragment key={i}>{p.text}</React.Fragment>
      ),
    )}
  </>
);

const NoteCard: React.FC<{ note: Note; onFlash: (m: string) => void }> = ({ note, onFlash }) => {
  const { actions } = useApp();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.text);
  const tag = tagOf(note.tag);
  return (
    <div className="p-3 rounded-xl bg-surface border border-line space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span>
          {tag.emoji} {tag.label} · {new Date(note.createdAt).toLocaleDateString('pt-BR')}
          {note.taskTitle && <> · {note.taskTitle}</>}
        </span>
      </div>
      {editing ? (
        <>
          <textarea rows={4} value={text} maxLength={NOTE_MAX} onChange={(e) => setText(e.target.value)} className={`${inputClass} resize-none`} aria-label="Editar anotação" />
          <div className="flex gap-2">
            <button
              onClick={() => {
                actions.updateNote(note.id, { text });
                setEditing(false);
                onFlash('Salvo ✓');
              }}
              className="px-3 min-h-9 rounded-lg bg-primary text-on-primary text-[13px] font-semibold cursor-pointer"
            >
              Salvar
            </button>
            <button onClick={() => setEditing(false)} className="px-3 min-h-9 rounded-lg border border-line text-[13px] text-muted cursor-pointer">
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-ink leading-relaxed whitespace-pre-line break-words">{note.text}</p>
      )}
      {!editing && (
        <div className="flex gap-1 -ml-1.5">
          <button
            onClick={async () => onFlash((await copyText(note.text)) ? 'Copiado ✓' : 'Não deu para copiar')}
            className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Copiar
          </button>
          <button onClick={() => setEditing(true)} className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer">
            <Pencil className="w-3.5 h-3.5" /> Editar
          </button>
          <button
            onClick={() => {
              if (window.confirm('Apagar esta anotação?')) actions.deleteNote(note.id);
            }}
            className="min-h-9 px-1.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Apagar
          </button>
        </div>
      )}
    </div>
  );
};

/** Caderno do projeto (etapa 27): tudo o que a pessoa precisa anotar, sem sair do app */
export const NotebookTab: React.FC = () => {
  const { diagnosis, notes, profileOverrides, taskNotes, tasks, nextStepTask, people, lastExportAt, actions } = useApp();
  const [section, setSection] = useState<'notas' | 'pessoas'>('notas');
  const [editingProfile, setEditingProfile] = useState(false);
  const [draft, setDraft] = useState('');
  const [draftTag, setDraftTag] = useState<NoteTag>('ideia');
  const [filter, setFilter] = useState<NoteTag | 'todas'>('todas');
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [flashMsg, flash] = useFlash();

  const profile = profileValues(diagnosis, profileOverrides);
  const visible = useMemo(() => filterNotes(notes, { tag: filter }), [notes, filter]);
  const taskNoteList = tasks.filter((t) => taskNotes[t.id]?.trim()).map((t) => ({ taskId: t.id, title: t.title, text: taskNotes[t.id] }));
  // Busca barata (tudo em memória): roda a cada digitação, sem cache
  const results = searchNotebook(search, { profile, notes, taskNotes: taskNoteList, people });
  const searching = searchOpen && search.trim().length > 0;

  const runExport = useNotebookExport();
  const exportAll = async () => {
    if ((await runExport()) === 'downloaded') flash('Arquivo baixado ✓');
  };
  // Lembrete de backup: tem conteúdo e nunca exportou, ou faz mais de 14 dias
  const hasContent = notes.length + people.length + taskNoteList.length > 0;
  const backupDue = hasContent && (!lastExportAt || Date.now() - lastExportAt > 14 * 86_400_000);

  return (
    <div key="tab-notebook" className="flex-1 p-5 select-none overflow-y-auto animate-tab-fade space-y-4">
      <Reveal i={0}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold font-display text-ink">Caderno</h2>
            <p className="text-[13px] text-muted">Tudo do seu projeto num lugar só. Fica só no seu celular.</p>
          </div>
          <div className="shrink-0 flex gap-1.5">
            <button
              onClick={() => {
                soundEffects.playSoftTap();
                if (searchOpen) setSearch('');
                setSearchOpen(!searchOpen);
              }}
              aria-label={searchOpen ? 'Fechar busca' : 'Buscar no caderno'}
              aria-expanded={searchOpen}
              className={`min-w-10 min-h-10 rounded-xl border inline-flex items-center justify-center cursor-pointer ${searchOpen ? 'border-primary text-primary bg-primary-soft' : 'border-line text-ink hover:border-primary'}`}
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
            <button
              onClick={exportAll}
              className="min-h-10 px-3 rounded-xl border border-line text-[13px] text-ink inline-flex items-center gap-1.5 cursor-pointer hover:border-primary"
            >
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>
        </div>
        {searchOpen && (
          <label className="relative block mt-3">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              autoFocus
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar em todo o caderno"
              className={`${inputClass} pl-9`}
              aria-label="Buscar em todo o caderno"
            />
          </label>
        )}
        {flashMsg && <p className="mt-1 text-[13px] text-primary font-semibold" role="status">{flashMsg}</p>}
        {backupDue && !searchOpen && (
          <button onClick={exportAll} className="mt-2 w-full text-left p-2.5 rounded-xl bg-gold-soft border border-gold-line text-[13px] text-gold-ink cursor-pointer">
            💾 {lastExportAt ? 'Faz mais de 2 semanas que você não guarda uma cópia.' : 'Você ainda não guardou uma cópia do caderno.'} <strong>Toque para exportar.</strong>
          </button>
        )}
      </Reveal>

      {searching && (
        <div className="space-y-2" aria-live="polite">
          <p className="text-[13px] text-muted">
            {results.length === 0 ? 'Nada encontrado no caderno.' : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`}
          </p>
          {results.map((r, i) => {
            if (r.kind === 'ficha')
              return (
                <div key={`f${i}`} className="p-3 rounded-xl bg-primary-soft/60 border border-primary/25">
                  <span className="text-xs text-muted block">Ficha · <Marked text={r.label} query={search} /></span>
                  <p className="text-sm text-ink leading-snug"><Marked text={r.text} query={search} /></p>
                </div>
              );
            if (r.kind === 'tarefa')
              return (
                <button
                  key={`t${r.taskId}`}
                  onClick={() => actions.openTask(r.taskId)}
                  className="w-full text-left p-3 rounded-xl bg-surface border border-line cursor-pointer hover:border-primary"
                >
                  <span className="text-xs text-muted block">✍️ Tarefa · <Marked text={r.title} query={search} /></span>
                  <span className="text-sm text-ink leading-snug whitespace-pre-line"><Marked text={r.text} query={search} /></span>
                </button>
              );
            if (r.kind === 'pessoa') {
              const st = STAGES.find((x) => x.id === r.person.stage)!;
              return (
                <button
                  key={r.person.id}
                  onClick={() => {
                    setSection('pessoas');
                    setSearch('');
                    setSearchOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-surface border border-line cursor-pointer hover:border-primary"
                >
                  <span className="text-xs text-muted block">👥 Pessoa · {st.emoji} {st.label}</span>
                  <strong className="text-sm text-ink block"><Marked text={r.person.name} query={search} /></strong>
                  {[r.person.note, r.person.nextStep].filter(Boolean).map((t, k) => (
                    <span key={k} className="text-[13px] text-muted block leading-snug"><Marked text={t!} query={search} /></span>
                  ))}
                </button>
              );
            }
            const tag = tagOf(r.note.tag);
            return (
              <div key={r.note.id} className="p-3 rounded-xl bg-surface border border-line">
                <span className="text-xs text-muted block">
                  {tag.emoji} {tag.label} · {new Date(r.note.createdAt).toLocaleDateString('pt-BR')}
                  {r.note.taskTitle && <> · <Marked text={r.note.taskTitle} query={search} /></>}
                </span>
                <p className="text-sm text-ink leading-relaxed whitespace-pre-line break-words"><Marked text={r.note.text} query={search} /></p>
              </div>
            );
          })}
        </div>
      )}

      {!searching && (
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-surface-2 border border-line" role="tablist" aria-label="Parte do caderno">
          {([
            ['notas', '📒 Anotações'],
            ['pessoas', `👥 Pessoas${people.length ? ` (${people.length})` : ''}`],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={section === id}
              onClick={() => {
                soundEffects.playSoftTap();
                setSection(id);
              }}
              className={`min-h-10 rounded-lg text-sm cursor-pointer transition-colors ${section === id ? 'bg-surface text-primary font-bold shadow-xs' : 'text-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {!searching && section === 'pessoas' && <PeopleSection />}

      {!searching && section === 'notas' && (<>
      {/* Ficha do produto */}
      <Reveal i={1}>
        <div className="p-4 rounded-2xl bg-primary-soft/60 border border-primary/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink">Ficha do meu produto</h3>
            <button
              onClick={() => {
                soundEffects.playSoftTap();
                setEditingProfile(!editingProfile);
              }}
              className="min-h-9 px-2 text-[13px] font-semibold text-primary cursor-pointer"
            >
              {editingProfile ? 'Pronto' : 'Editar'}
            </button>
          </div>
          {PROFILE_FIELDS.map((f) => (
            <div key={f.id}>
              <span className="text-xs font-semibold text-muted block">{f.label}</span>
              {editingProfile ? (
                <input
                  value={profile[f.id]}
                  maxLength={300}
                  onChange={(e) => actions.setProfileField(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  className={`${inputClass} mt-0.5`}
                  aria-label={f.label}
                />
              ) : (
                <p className={`text-sm leading-snug ${profile[f.id] ? 'text-ink' : 'text-muted italic'}`}>{profile[f.id] || 'Toque em Editar para preencher'}</p>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Nova anotação */}
      <Reveal i={2}>
        <div className="p-3.5 rounded-2xl bg-surface border border-line space-y-2">
          <h3 className="text-base font-bold text-ink">Anotar</h3>
          <textarea
            rows={3}
            value={draft}
            maxLength={NOTE_MAX}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Uma ideia, o que alguém te disse, algo que você aprendeu..."
            className={`${inputClass} resize-none`}
            aria-label="Nova anotação"
          />
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Etiqueta">
            {NOTE_TAGS.filter((t) => t.id !== 'coach').map((t) => (
              <button
                key={t.id}
                role="radio"
                aria-checked={draftTag === t.id}
                onClick={() => setDraftTag(t.id)}
                className={`px-2.5 min-h-9 rounded-full border text-[13px] cursor-pointer ${draftTag === t.id ? 'border-primary bg-primary-soft text-primary font-semibold' : 'border-line text-muted'}`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <button
            disabled={!draft.trim()}
            onClick={() => {
              actions.addNote(draft, draftTag, nextStepTask?.title);
              setDraft('');
              flash('Anotado ✓');
            }}
            className="w-full min-h-10 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-on-primary text-sm font-semibold cursor-pointer"
          >
            Salvar anotação
          </button>
        </div>
      </Reveal>

      {/* Lista */}
      <Reveal i={3}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink">Minhas anotações</h3>
            <span className="text-xs text-muted">{notes.length}</span>
          </div>
          {notes.length > 0 && (
            <>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[{ id: 'todas' as const, label: 'Todas', emoji: '' }, ...NOTE_TAGS].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilter(t.id)}
                    className={`px-2.5 min-h-9 rounded-full border text-[13px] whitespace-nowrap cursor-pointer ${filter === t.id ? 'border-primary bg-primary-soft text-primary font-semibold' : 'border-line text-muted'}`}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {visible.map((n) => (
            <NoteCard key={n.id} note={n} onFlash={flash} />
          ))}
          {notes.length === 0 && (
            <p className="text-sm text-muted leading-relaxed">
              Ainda nada por aqui. Anote ideias, o que as pessoas te disserem e o que você aprender. No Coach, toque em
              "Salvar no caderno" para guardar uma resposta boa.
            </p>
          )}
          {notes.length > 0 && visible.length === 0 && <p className="text-sm text-muted">Nenhuma anotação com essa etiqueta.</p>}
        </div>
      </Reveal>

      {/* Notas das tarefas */}
      {taskNoteList.length > 0 && (
        <Reveal i={4}>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-ink">Anotações das tarefas</h3>
            {tasks
              .filter((t) => taskNotes[t.id]?.trim())
              .map((t) => (
                <button
                  key={t.id}
                  onClick={() => actions.openTask(t.id)}
                  className="w-full text-left p-3 rounded-xl bg-surface border border-line cursor-pointer hover:border-primary"
                >
                  <strong className="text-[13px] text-ink block">{t.title}</strong>
                  <span className="text-sm text-muted leading-snug line-clamp-3 whitespace-pre-line">{taskNotes[t.id]}</span>
                </button>
              ))}
          </div>
        </Reveal>
      )}

      </>)}

      <p className="text-xs text-muted leading-snug pb-2">
        Suas anotações ficam só neste celular. Se você limpar os dados do navegador, elas somem: use "Exportar" de vez em
        quando para guardar uma cópia.
      </p>
    </div>
  );
};
