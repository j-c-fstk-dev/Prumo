import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Send,
} from 'lucide-react';
import { useApp } from '../state/AppStore';

export const CoachTab: React.FC = () => {
  const { userName, nextStepTask, isTyping, coachMessages, actions } = useApp();
  // Saudação gerada na hora (não é salva): sempre fala da tarefa atual
  const greeting = {
    sender: 'coach' as const,
    text: `Oi, ${userName}! Sou o Coach Prumo. Na tarefa "${nextStepTask.title}", o que está travando hoje?`,
    time: '',
  };
  const messages = coachMessages.length ? coachMessages : [greeting];
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
      <div className="pb-2 border-b border-line flex items-center justify-between">
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
            <span className="text-xs text-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online · Contexto de {userName}
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
          IA em Tempo Real
        </span>

      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary text-on-primary rounded-br-xs'
                  : 'bg-surface border border-line text-ink rounded-bl-xs shadow-xs'
              }`}
            >
              {msg.text}
              <span className={`block text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-on-primary/70' : 'text-muted'}`}>
                {msg.time}
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

      {/* Sugestões Rápidas (Chips de pergunta) */}
      <div className="space-y-2 pt-2 border-t border-line">
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[13px]">
          {[
            'Como abordar sem parecer chato?',
            'Não sei quem chamar para testar',
            'Qual preço devo colocar?'
          ].map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="px-2.5 py-1 bg-surface border border-line hover:border-primary text-muted rounded-full whitespace-nowrap transition-colors cursor-pointer"
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
            className="flex-1 px-3 py-2 bg-surface border border-line rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2 bg-primary hover:bg-primary-hover text-on-primary rounded-xl cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
