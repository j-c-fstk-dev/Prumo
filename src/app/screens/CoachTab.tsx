import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Send,
} from 'lucide-react';
import { useApp } from '../state/AppStore';

export const CoachTab: React.FC = () => {
  const { userName, isTyping, coachMessages, actions } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;
    setInputMessage('');
    actions.sendCoachMessage(text);
  };

  return (
    <div key="tab-coach" className="flex-1 flex flex-col justify-between p-4 select-none animate-tab-fade">
      {/* Header do Chat */}
      <div className="pb-2 border-b border-[#E6E8E6] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E3F2ED] flex items-center justify-center text-[#1F6F5C]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-[#1A1D1B]">Coach Prumo</h3>
              <span className="text-[9px] bg-emerald-100 text-[#1F6F5C] px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> IA
              </span>
            </div>
            <span className="text-[10px] text-[#3BAA6B] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3BAA6B] animate-pulse" /> Online · Contexto de {userName}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
          IA em Tempo Real
        </span>

      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
        {coachMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1F6F5C] text-white rounded-br-xs'
                  : 'bg-white border border-[#E6E8E6] text-[#1A1D1B] rounded-bl-xs shadow-xs'
              }`}
            >
              {msg.text}
              <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-[#5B615D]'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E6E8E6] p-3 rounded-2xl text-[11px] text-[#5B615D] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1F6F5C] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#1F6F5C] animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-[#1F6F5C] animate-bounce" style={{ animationDelay: '0.4s' }} />
              <span className="ml-1">Coach digitando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Sugestões Rápidas (Chips de pergunta) */}
      <div className="space-y-2 pt-2 border-t border-[#E6E8E6]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {[
            'Como abordar sem parecer chato?',
            'Não sei quem chamar para testar',
            'Qual preço devo colocar?'
          ].map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="px-2.5 py-1 bg-white border border-[#E6E8E6] hover:border-[#1F6F5C] text-[#5B615D] rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input de Mensagem */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escreva sua dúvida..."
            className="flex-1 px-3 py-2 bg-white border border-[#E6E8E6] rounded-xl text-xs focus:outline-none focus:border-[#1F6F5C]"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white rounded-xl cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
