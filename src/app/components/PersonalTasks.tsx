import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Circle, CheckCircle2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useApp, type PersonalTask } from '../state/AppStore';
import { WhenPicker } from './WhenPicker';

const PersonalTaskRow: React.FC<{ task: PersonalTask; isFirst: boolean; isLast: boolean }> = ({ task, isFirst, isLast }) => {
  const { reflections, actions } = useApp();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  return (
    <div className={`p-2.5 rounded-xl border ${task.done ? 'bg-success-soft/50 border-success/30' : 'bg-surface border-line'}`}>
      <div className="flex items-start gap-2">
        <button onClick={() => actions.togglePersonalTask(task.id)} className="-m-2 min-w-10 min-h-10 inline-flex items-center justify-center cursor-pointer" aria-label={task.done ? 'Marcar como pendente' : 'Concluir'}>
          {task.done ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted" />}
        </button>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 border border-primary rounded-md text-sm focus:outline-none"
            />
          ) : (
            <span className={`text-sm font-semibold block ${task.done ? 'line-through text-muted' : 'text-ink'}`}>{task.title}</span>
          )}
          {!editing && task.when && <span className="text-xs text-primary block mt-0.5">⏰ {task.when}</span>}
        </div>
        <div className="flex items-center gap-0.5 text-muted shrink-0">
          <button disabled={isFirst} onClick={() => actions.movePersonalTask(task.id, -1)} className="min-w-10 min-h-10 inline-flex items-center justify-center disabled:opacity-25 cursor-pointer" aria-label="Subir">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button disabled={isLast} onClick={() => actions.movePersonalTask(task.id, 1)} className="min-w-10 min-h-10 inline-flex items-center justify-center disabled:opacity-25 cursor-pointer" aria-label="Descer">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditing(!editing)} className="min-w-10 min-h-10 inline-flex items-center justify-center cursor-pointer" aria-label="Editar">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => actions.deletePersonalTask(task.id)} className="min-w-10 min-h-10 inline-flex items-center justify-center cursor-pointer hover:text-[#D64545]" aria-label="Apagar">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-2 pl-7 space-y-2">
          <WhenPicker value={task.when} onChange={(when) => actions.updatePersonalTask(task.id, { when })} timeThieves={reflections.q3_hours} />
          <button
            onClick={() => {
              actions.updatePersonalTask(task.id, { title });
              setEditing(false);
            }}
            className="px-3 py-1 bg-primary text-on-primary text-[13px] font-semibold rounded-lg cursor-pointer"
          >
            Salvar
          </button>
        </div>
      )}
    </div>
  );
};

/** Tarefas pessoais: o Prumo também serve para o dia a dia fora do plano. */
export const PersonalTasks: React.FC<{ title?: string }> = ({ title = 'Suas tarefas' }) => {
  const { personalTasks, reflections, actions } = useApp();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newWhen, setNewWhen] = useState('');

  const save = () => {
    actions.addPersonalTask(newTitle, newWhen);
    setNewTitle('');
    setNewWhen('');
    setAdding(false);
  };

  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink">{title}</span>
        {!adding && (
          <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-[13px] font-semibold text-primary cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        )}
      </div>

      {personalTasks.length === 0 && !adding && (
        <p className="text-[13px] text-muted">
          Coisas do seu dia que também importam: pagar uma conta, estudar, ligar para alguém.
        </p>
      )}

      {personalTasks.map((t, i) => (
        <PersonalTaskRow key={t.id} task={t} isFirst={i === 0} isLast={i === personalTasks.length - 1} />
      ))}

      {adding && (
        <div className="p-2.5 rounded-xl bg-surface-2 border border-line space-y-2 animate-fadeIn">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && newTitle.trim() && save()}
            placeholder="O que você quer fazer?"
            className="w-full px-3 py-2 bg-surface border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
          />
          <span className="text-[13px] font-semibold text-ink block">Quando vou fazer:</span>
          <WhenPicker value={newWhen} onChange={setNewWhen} timeThieves={reflections.q3_hours} />
          <div className="flex gap-2">
            <button
              disabled={!newTitle.trim()}
              onClick={save}
              className="px-3 py-1.5 bg-primary disabled:opacity-40 text-on-primary text-[13px] font-semibold rounded-lg cursor-pointer"
            >
              Salvar tarefa
            </button>
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-[13px] text-muted cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
