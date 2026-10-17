import React, { useState } from 'react';

/** Gatilhos do dia a dia: ancorar a tarefa num momento que já existe na rotina (docs/pesquisa/02) */
const SUGGESTED_WHEN = ['depois do café', 'no almoço', 'depois do trabalho', 'antes de dormir'];

interface WhenPickerProps {
  value?: string;
  onChange: (when: string) => void;
  /** Texto que a pessoa escreveu sobre o que rouba seu tempo, para lembrar na hora de escolher */
  timeThieves?: string;
}

/** "Quando ___, eu faço isso": a intenção de implementação, o recurso com mais evidência do app. */
export const WhenPicker: React.FC<WhenPickerProps> = ({ value, onChange, timeThieves }) => {
  const isCustom = !!value && !SUGGESTED_WHEN.includes(value);
  const [custom, setCustom] = useState(isCustom ? value : '');

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_WHEN.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => onChange(value === w ? '' : w)}
            className={`px-2.5 py-1 rounded-full text-[11px] border cursor-pointer transition-colors ${
              value === w ? 'bg-[#1F6F5C] border-[#1F6F5C] text-white font-semibold' : 'bg-white border-[#E6E8E6] text-[#5B615D]'
            }`}
          >
            {w}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        onBlur={() => custom.trim() && onChange(custom)}
        onKeyDown={(e) => e.key === 'Enter' && custom.trim() && onChange(custom)}
        placeholder="Ou escreva: quando eu..."
        className="w-full px-3 py-1.5 bg-white border border-[#E6E8E6] rounded-lg text-xs focus:outline-none focus:border-[#1F6F5C]"
      />
      {value && (
        <p className="text-[11px] text-[#1F6F5C] font-medium">
          ⏰ Combinado: <strong>{value}</strong>, eu faço isso.
        </p>
      )}
      {timeThieves && !value && (
        <p className="text-[10px] text-[#5B615D] leading-snug">
          Você contou que o que rouba seu tempo é: "{timeThieves.slice(0, 90)}{timeThieves.length > 90 ? '…' : ''}". Escolha um momento fora disso.
        </p>
      )}
    </div>
  );
};
