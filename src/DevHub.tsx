/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoadmapView } from './components/devhub/RoadmapView';
import { Step1SetupGuide } from './components/devhub/Step1SetupGuide';
import { Step2ArchitectureGuide } from './components/devhub/Step2ArchitectureGuide';
import { Step3DesignSystemGuide } from './components/devhub/Step3DesignSystemGuide';
import { Step4StateManagementGuide } from './components/devhub/Step4StateManagementGuide';
import { Step5NetworkApiGuide } from './components/devhub/Step5NetworkApiGuide';
import { Step6LocalStorageGuide } from './components/devhub/Step6LocalStorageGuide';
import { Step7TestingGuide } from './components/devhub/Step7TestingGuide';
import { Step8CICDGuide } from './components/devhub/Step8CICDGuide';
import { Step9NarrativeGuide } from './components/devhub/Step9NarrativeGuide';
import { Step10AudioGuide } from './components/devhub/Step10AudioGuide';
import { KotlinCodeViewer } from './components/devhub/KotlinCodeViewer';
import { PrumoAppSimulator } from './components/prototype/PrumoAppSimulator';
import { 
  Compass, 
  Download, 
  Layers, 
  Wrench, 
  FileCode, 
  Smartphone, 
  Sparkles, 
  Network,
  Palette,
  Workflow,
  Globe,
  Database,
  TestTube2,
  GitBranch,
  Heart,
  Headphones
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from './utils/zipGenerator';

export default function DevHub() {
  const [activeTab, setActiveTab] = useState<'setup1' | 'setup2' | 'setup3' | 'setup4' | 'setup5' | 'setup6' | 'setup7' | 'setup8' | 'setup9' | 'setup10' | 'roadmap' | 'code' | 'simulator'>('simulator');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-10.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSelectStepFromRoadmap = (stepId: number) => {
    if (stepId === 1) setActiveTab('setup1');
    if (stepId === 2) setActiveTab('setup2');
    if (stepId === 3) setActiveTab('setup3');
    if (stepId === 4) setActiveTab('setup4');
    if (stepId === 5) setActiveTab('setup5');
    if (stepId === 6) setActiveTab('setup6');
    if (stepId === 7) setActiveTab('setup7');
    if (stepId === 8) setActiveTab('setup8');
    if (stepId === 9) setActiveTab('setup9');
    if (stepId === 10) setActiveTab('setup10');
  };

  return (
    <div className="min-h-screen bg-[#F3F5F4] text-[#1A1D1B] flex flex-col font-sans antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E8E6] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Nome */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F6F5C] text-white flex items-center justify-center shadow-xs">
                <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '30s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold font-display tracking-tight text-[#1A1D1B]">
                    Prumo
                  </h1>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E3F2ED] text-[#1F6F5C]">
                    Android Studio Hub
                  </span>
                </div>
                <p className="text-[11px] text-[#5B615D] hidden sm:block">
                  Desenvolvimento Kotlin Nativo &bull; Jetpack Compose &bull; Clean Architecture
                </p>
              </div>
            </div>

            {/* Ações no Header */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-3.5 py-2 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isDownloading ? 'Gerando .zip...' : 'Baixar Projeto Android Studio (.zip)'}
                </span>
                <span className="sm:hidden">Baixar .zip</span>
              </button>
            </div>
          </div>

          {/* Abas de Navegação Principal */}
          <nav className="flex items-center gap-2 overflow-x-auto py-2 border-t border-[#F0F2EF] text-xs">
            <button
              onClick={() => setActiveTab('setup10')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup10'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Etapa 10: Presença em Áudio &amp; Media3</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#7A5AF8] text-white font-bold ml-1">
                Nova
              </span>
            </button>

            <button
              onClick={() => setActiveTab('setup9')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup9'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Etapa 9: Onboarding &amp; Compromisso</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D97746] text-white font-bold ml-1">
                Nova
              </span>
            </button>

            <button
              onClick={() => setActiveTab('setup8')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup8'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Etapa 8: CI/CD &amp; Google Play</span>
            </button>

            <button
              onClick={() => setActiveTab('setup7')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup7'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <TestTube2 className="w-3.5 h-3.5" />
              <span>Etapa 7: Testes &amp; TDD</span>
            </button>

            <button
              onClick={() => setActiveTab('setup6')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup6'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Etapa 6: Persistência Room</span>
            </button>

            <button
              onClick={() => setActiveTab('setup5')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup5'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Etapa 5: Consumo de APIs &amp; Retrofit</span>
            </button>

            <button
              onClick={() => setActiveTab('setup4')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup4'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Etapa 4: Estado &amp; ViewModel</span>
            </button>

            <button
              onClick={() => setActiveTab('setup3')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup3'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Etapa 3: Design System Compose</span>
            </button>

            <button
              onClick={() => setActiveTab('setup2')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup2'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Etapa 2: Arquitetura &amp; Navegação</span>
            </button>

            <button
              onClick={() => setActiveTab('setup1')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'setup1'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Etapa 1: Setup Android Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Roteiro de 10 Etapas</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Arquivos Kotlin &amp; Gradle</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#1F6F5C] text-white shadow-xs'
                  : 'text-[#5B615D] hover:text-[#1A1D1B] hover:bg-neutral-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador Interativo Prumo</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E3F2ED] text-[#1F6F5C] font-bold ml-1">
                Live
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div key={activeTab} className="animate-tab-fade">
          {activeTab === 'setup10' && (
            <Step10AudioGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup9' && (
            <Step9NarrativeGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup8' && (
            <Step8CICDGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup7' && (
            <Step7TestingGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup6' && (
            <Step6LocalStorageGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup5' && (
            <Step5NetworkApiGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup4' && (
            <Step4StateManagementGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup3' && (
            <Step3DesignSystemGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup2' && (
            <Step2ArchitectureGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'setup1' && (
            <Step1SetupGuide onOpenCodeViewer={() => setActiveTab('code')} />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView onSelectStep={handleSelectStepFromRoadmap} />
          )}

          {activeTab === 'code' && (
            <KotlinCodeViewer />
          )}

          {activeTab === 'simulator' && (
            <div className="flex flex-col items-center">
              <div className="text-center max-w-lg mb-4">
                <h2 className="text-xl font-bold font-display text-[#1A1D1B]">
                  Protótipo Funcional da Experiência Android do Prumo
                </h2>
                <p className="text-xs text-[#5B615D] mt-1">
                  Teste o fluxo completo: Onboarding Narrativo com micro-telas de valor, Anamnese adaptativa em 7 blocos com reflexão livre, Ritual de Compromisso Consciente (Hold-to-Sign), Carta do Eu Futuro (90 dias), Roteiro em Capítulos, Micro-Áudios Serenos com Ondas Sonoras e Coach de IA!
                </p>
              </div>
              <PrumoAppSimulator />
            </div>
          )}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-white border-t border-[#E6E8E6] py-6 text-xs text-[#5B615D] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#1F6F5C]" />
            <span className="font-semibold text-[#1A1D1B]">Prumo</span>
            <span>&bull; Roteiro de Desenvolvimento Android com Kotlin &amp; Jetpack Compose</span>
          </div>
          <div>
            <span>Documento de Produto v1.2 &bull; Etapas 1 a 10 Concluídas (100% - Onboarding Narrativo &amp; Presença Sonora)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
