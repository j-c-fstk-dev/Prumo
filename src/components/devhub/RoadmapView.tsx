import React, { useState } from 'react';
import { PRUMO_ROADMAP, RoadmapStep } from '../../data/roadmap';
import { CheckCircle2, Circle, Clock, ChevronRight, Layers, Smartphone, Wrench, Sparkles, ShieldCheck, Palette, Workflow, Globe, Database, TestTube2, GitBranch, Heart, Headphones } from 'lucide-react';

interface RoadmapViewProps {
  onSelectStep: (stepId: number) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onSelectStep }) => {
  const [selectedStep, setSelectedStep] = useState<RoadmapStep>(PRUMO_ROADMAP[8]); // Default to step 9

  return (
    <div className="space-y-6">
      {/* Header com Resumo Geral */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E8E6] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F2ED] text-[#1F6F5C] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Roteiro Oficial de Desenvolvimento Android Kotlin
            </div>
            <h2 className="text-2xl font-bold text-[#1A1D1B] font-display">
              Plano de Execução por Etapas: App Prumo
            </h2>
            <p className="text-sm text-[#5B615D] mt-1 max-w-2xl">
              Do ambiente no Android Studio até a publicação na Google Play e a camada de 
              <span className="font-semibold text-[#1F6F5C]"> Conexão Emocional, Ritual do Eu Futuro &amp; Presença Sonora com Media3</span>.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onSelectStep(1)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 1
            </button>
            <button
              onClick={() => onSelectStep(2)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 2
            </button>
            <button
              onClick={() => onSelectStep(3)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 3
            </button>
            <button
              onClick={() => onSelectStep(4)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 4
            </button>
            <button
              onClick={() => onSelectStep(5)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 5
            </button>
            <button
              onClick={() => onSelectStep(6)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 6
            </button>
            <button
              onClick={() => onSelectStep(7)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 7
            </button>
            <button
              onClick={() => onSelectStep(8)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#1A1D1B] text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Etapa 8
            </button>
            <button
              onClick={() => onSelectStep(9)}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-[#D97746]" />
              Etapa 9 (Ritual)
            </button>
            <button
              onClick={() => onSelectStep(10)}
              className="px-3 py-1.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" />
              Etapa 10 (Áudio)
            </button>
          </div>
        </div>

        {/* Barra de Progresso do Roteiro */}
        <div className="mt-6 pt-5 border-t border-[#E6E8E6] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-[#5B615D] mb-1.5 font-medium">
              <span>Progresso Geral do Desenvolvimento</span>
              <span className="text-[#1F6F5C] font-semibold">Etapas 1 a 10 Concluídas &amp; Prontas (100% - Projeto Completo)</span>
            </div>
            <div className="w-full bg-[#E6E8E6] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#1F6F5C] h-full w-[100%] rounded-full transition-all duration-500" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#5B615D]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3BAA6B]" /> 10 Concluídas (100%)
            </span>
            <span className="inline-flex items-center gap-1.5 text-neutral-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E6E8E6]" /> 0 Futuras
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Total Estimado: ~76h
            </span>
          </div>
        </div>
      </div>

      {/* Grid Principal: Lista das Etapas + Detalhe da Etapa Selecionada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Lista das 8 Etapas */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#5B615D] px-1">
            Etapas do Projeto (1 a 8)
          </h3>

          <div className="space-y-2">
            {PRUMO_ROADMAP.map((step) => {
              const isSelected = selectedStep.id === step.id;
              const isDone = step.status === 'completed';

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1F6F5C] shadow-sm ring-1 ring-[#1F6F5C]'
                      : 'bg-white/80 hover:bg-white border-[#E6E8E6]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#3BAA6B] shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#E6E8E6] flex items-center justify-center text-[10px] font-bold text-[#5B615D]">
                          {step.id}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F7F9F8] text-[#5B615D] border border-[#E6E8E6]">
                          {step.phase}
                        </span>
                        {isDone && (
                          <span className="text-[11px] font-medium text-[#3BAA6B] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                            Entregue
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-semibold line-clamp-1 ${isSelected ? 'text-[#1F6F5C]' : 'text-[#1A1D1B]'}`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#5B615D] line-clamp-1 mt-0.5">
                        {step.tagline}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-[#1F6F5C] translate-x-1' : 'text-[#5B615D]/40'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Detalhamento Técnico da Etapa Selecionada */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6E8E6]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E3F2ED] text-[#1F6F5C]">
                    {selectedStep.phase}
                  </span>
                  {selectedStep.status === 'completed' ? (
                    <span className="text-xs font-medium text-[#3BAA6B] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Etapa Pronta & Configurada
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#5B615D] bg-neutral-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Próxima Fase
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#1A1D1B]">
                  {selectedStep.title}
                </h3>
                <p className="text-xs text-[#5B615D] mt-1">
                  {selectedStep.tagline}
                </p>
              </div>

              {(selectedStep.id >= 1 && selectedStep.id <= 5) && (
                <button
                  onClick={() => onSelectStep(selectedStep.id)}
                  className="px-3.5 py-2 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Abrir Etapa {selectedStep.id}
                </button>
              )}
            </div>

            {/* Objetivos */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B615D] flex items-center gap-1.5">
                <TargetIcon className="w-3.5 h-3.5 text-[#1F6F5C]" />
                Objetivos da Etapa
              </h4>
              <ul className="space-y-2">
                {selectedStep.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#1A1D1B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F6F5C] mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entregáveis Concretos */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B615D] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1F6F5C]" />
                Entregáveis Concretos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStep.deliverables.map((item, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6] text-xs text-[#1A1D1B] flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3BAA6B] mt-0.5 shrink-0" />
                    <span className="font-mono text-[11px] leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Tecnológica Android */}
            <div className="mt-5 pt-4 border-t border-[#E6E8E6]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B615D] mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#1F6F5C]" />
                Tecnologias Android Específicas
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStep.androidTech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-[#E3F2ED] text-[#1F6F5C] text-[11px] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedStep.id === 1 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 1: Ambiente e Setup</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    Configuração do Android Studio, JDK 17, Gradle e Design System.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(1)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73]"
                >
                  Abrir Etapa 1
                </button>
              </div>
            )}

            {selectedStep.id === 2 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 2: Arquitetura &amp; Navegação</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    Navigation Compose Type-Safe, DataStore Preferences e Repositórios.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(2)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73]"
                >
                  Abrir Etapa 2
                </button>
              </div>
            )}

            {selectedStep.id === 3 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 3: Design System com Compose</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    Tema, Cores oficiais, Tipografia Inter/Fraunces e Componentes atômicos.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(3)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73]"
                >
                  Abrir Etapa 3
                </button>
              </div>
            )}

            {selectedStep.id === 4 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 4: Gerenciamento de Estado &amp; ViewModel</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    Unidirectional Data Flow (UDF), State Hoisting, StateFlow e LiveData.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(4)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73]"
                >
                  Abrir Etapa 4
                </button>
              </div>
            )}

            {selectedStep.id === 5 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 5: Consumo de APIs &amp; Retrofit</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    OkHttpClient, Kotlin Serialization Converter, DTOs e NetworkResult.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(5)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73]"
                >
                  Abrir Etapa 5
                </button>
              </div>
            )}

            {selectedStep.id === 6 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 6: Persistência Offline com Room</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    Room Database SQLite, DAOs com Flow reativo e padrão Offline-First.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(6)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73]"
                >
                  Abrir Etapa 6
                </button>
              </div>
            )}

            {selectedStep.id === 7 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 7: Testes Automatizados &amp; TDD</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    JUnit, Coroutines Test, Room in-memory, Compose Test Rule e ciclo TDD.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(7)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73]"
                >
                  Abrir Etapa 7
                </button>
              </div>
            )}

            {selectedStep.id === 8 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 8: CI/CD &amp; Deploy Google Play</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    GitHub Actions, Android App Bundle assinado, Keystore Base64 e Staged Rollout.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(8)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73] cursor-pointer"
                >
                  Abrir Etapa 8
                </button>
              </div>
            )}

            {selectedStep.id === 9 && (
              <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-amber-900">Etapa 9: Onboarding Narrativo &amp; Ritual do Eu Futuro</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    Gesto de pressão contínua (Hold to Sign), feedback háptico e persistência da carta em Room.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(9)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73] cursor-pointer"
                >
                  Abrir Etapa 9
                </button>
              </div>
            )}

            {selectedStep.id === 10 && (
              <div className="mt-6 p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1F6F5C]">Etapa 10: Presença em Áudio com Media3 &amp; Capítulos</h5>
                  <p className="text-[11px] text-[#5B615D]">
                    Micro-áudios com ExoPlayer, visualizador de ondas sonoras em Canvas e reframe do roteiro.
                  </p>
                </div>
                <button
                  onClick={() => onSelectStep(10)}
                  className="px-3 py-1.5 bg-[#1F6F5C] text-white text-xs font-medium rounded-lg hover:bg-[#2E8B73] cursor-pointer"
                >
                  Abrir Etapa 10
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
