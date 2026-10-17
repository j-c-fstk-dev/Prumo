import React, { useState } from 'react';
import { Download, CheckSquare, Square, FolderTree, Terminal, AlertTriangle, ExternalLink, Sparkles, CheckCircle2, Copy, Check } from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const Step1SetupGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Checklist interativo
  const [checklist, setChecklist] = useState({
    asInstalled: true,
    jdkConfigured: true,
    sdk35Installed: true,
    projectCreated: false,
    gradleSynced: false,
    previewTested: false
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapa1.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal com Ação de Download */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#164e41] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 1: Ambiente de Desenvolvimento &amp; Foundation
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            Configuração do Ambiente no Android Studio
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Criamos e configuramos todos os arquivos reais para o projeto nativo do <strong className="text-white">Prumo</strong> em 
            <strong> Kotlin 2.0 + Jetpack Compose</strong>. Baixe o projeto completo pronto para abrir com 1 clique ou copie os arquivos individualmente.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Projeto Android Studio (.zip)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Explorar Arquivos &amp; Código Kotlin
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-Etapa1.zip</strong> baixado! Descompacte e abra no Android Studio via <em>File &gt; Open...</em>.
            </div>
          )}
        </div>
      </div>

      {/* Grid: Passo a Passo + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guia Passo a Passo */}
        <div className="lg:col-span-8 space-y-5">
          {/* Passo 1: Pré-requisitos */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-[#1A1D1B]">
                Pré-requisitos de Software Recomendados
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5B615D]">
              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="font-semibold text-[#1A1D1B] mb-1">Android Studio</div>
                <p>Versão <strong>Ladybug (2024.2+)</strong> ou <strong>Koala (2024.1+)</strong> com Kotlin 2.0 integrado.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="font-semibold text-[#1A1D1B] mb-1">Java Development Kit (JDK)</div>
                <p><strong>JDK 17 ou JDK 21</strong> (vem embutido no Android Studio: <em>jbr-17</em> ou <em>jbr-21</em>).</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="font-semibold text-[#1A1D1B] mb-1">Android SDK</div>
                <p><strong>API 35 (Android 15)</strong> instalada via <em>SDK Manager &gt; SDK Platforms</em>.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="font-semibold text-[#1A1D1B] mb-1">Emulador / Dispositivo</div>
                <p>Pixel 8 ou Pixel 7 com <strong>API 34/35</strong> (ou celular com Depuração USB ativada).</p>
              </div>
            </div>
          </div>

          {/* Passo 2: Duas opções de início */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-[#1A1D1B]">
                Como Iniciar o Projeto no Android Studio
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Opção A: Recomendada */}
              <div className="p-4 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#1F6F5C] text-sm">Opção A (Mais Rápida): Abrir o Projeto Pronto</span>
                  <span className="text-[10px] font-semibold bg-[#1F6F5C] text-white px-2 py-0.5 rounded-full">Recomendado</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[#1A1D1B] leading-relaxed">
                  <li>Baixe o pacote clicando no botão <strong>"Baixar Projeto Android Studio (.zip)"</strong> acima.</li>
                  <li>Extraia a pasta em seu diretório de projetos (ex: <code className="bg-white px-1 py-0.5 rounded">~/AndroidStudioProjects/Prumo</code>).</li>
                  <li>No Android Studio, clique em <strong>File &gt; Open...</strong> e selecione a pasta extraída.</li>
                  <li>O Android Studio iniciará o <strong>Gradle Sync</strong> automaticamente, baixando as dependências do <em>Version Catalog</em>.</li>
                </ol>
              </div>

              {/* Opção B: Criar do Zero */}
              <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <span className="font-bold text-[#1A1D1B] text-sm block mb-2">Opção B: Criar manualmente via Wizard</span>
                <ol className="list-decimal list-inside space-y-1.5 text-[#5B615D] leading-relaxed">
                  <li>No Android Studio: <strong>File &gt; New &gt; New Project...</strong></li>
                  <li>Selecione o template <strong>"Empty Activity"</strong> (ícone com o símbolo do Compose).</li>
                  <li>Preencha os campos:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-[#1A1D1B]">
                      <li><strong>Name:</strong> Prumo</li>
                      <li><strong>Package name:</strong> com.prumo.app</li>
                      <li><strong>Language:</strong> Kotlin</li>
                      <li><strong>Minimum SDK:</strong> API 24 ("Nougat"; cobre 97%+ dos celulares ativos)</li>
                      <li><strong>Build configuration language:</strong> Kotlin DSL (build.gradle.kts)</li>
                    </ul>
                  </li>
                  <li>Após a criação, substitua o conteúdo dos arquivos pelos códigos fornecidos na aba <strong>"Arquivos do Projeto"</strong>.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Passo 3: Arquitetura de Pastas */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-[#1A1D1B]">
                Estrutura de Pastas Adotada (Clean Architecture)
              </h3>
            </div>
            <p className="text-xs text-[#5B615D] mb-3">
              Para manter o app escalável, modular e preparado para as próximas etapas (Anamnese, Diagnóstico e Coach IA):
            </p>

            <div className="bg-[#1A1D1B] text-[#F7F9F8] p-4 rounded-xl font-mono text-xs overflow-x-auto relative">
              <pre>{`com.prumo.app
├── core/
│   ├── designsystem/
│   │   ├── component/   # PrumoPrimaryButton, PrumoCard, PrumoBadge
│   │   └── theme/       # Color.kt, Theme.kt, Type.kt (Tokens oficiais)
│   ├── network/         # Cliente HTTP / Gemini SDK
│   └── datastore/       # Preferences locais e estado de onboarding
├── data/
│   ├── local/           # Room Database, Entidades de Tarefa e Perfil
│   └── repository/      # TaskRepositoryImpl, ProfileRepositoryImpl
├── domain/
│   ├── model/           # Task, Profile, Phase (Regras de negócio puras)
│   └── usecase/         # CalculateDiagnosisUseCase, GetNextTaskUseCase
└── presentation/
    ├── onboarding/      # Splash A1, Cadastro A2, Carrossel A3
    ├── anamnese/        # 6 seções interativas B1-B6 e Loading B7
    ├── diagnosis/       # Resultado C1 com Radar Chart e Justificativa C2
    ├── home/            # Home D1 com "Cartão de Próximo Passo"
    ├── roadmap/         # Todo list D2 e Detalhe da Tarefa D3
    └── coach/           # Chat com IA Coach D4`}</pre>
            </div>
          </div>

          {/* Passo 4: Dicas e Soluções de Problemas Comuns */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#E0A800]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#1A1D1B]">
                Dicas de Resolução de Erros no Android Studio
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-[#5B615D]">
              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <strong className="text-[#1A1D1B] block mb-0.5">Erro de versão do JDK no Gradle Sync:</strong>
                Vá em <em>Settings (ou Preferences no Mac) &gt; Build, Execution, Deployment &gt; Build Tools &gt; Gradle</em> e certifique-se de que <strong>Gradle JDK</strong> está apontando para o <strong>jbr-17</strong> ou <strong>Embedded JDK</strong>.
              </div>
              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <strong className="text-[#1A1D1B] block mb-0.5">Kotlin 2.0 e Compose Compiler:</strong>
                No Kotlin 2.0+, o compilador Compose agora é um plugin oficial integrado (<code className="text-[#1F6F5C]">org.jetbrains.kotlin.plugin.compose</code>). Não é mais necessário configurar a antiga extensão <code className="text-[#1F6F5C]">{'composeOptions { kotlinCompilerExtensionVersion }'}</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Checklist & Validação */}
        <div className="lg:col-span-4 space-y-5">
          {/* Checklist Interativo */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] mb-4">
              <h3 className="text-sm font-bold text-[#1A1D1B]">
                Checklist da Etapa 1
              </h3>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 6
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'asInstalled' as const, label: 'Android Studio Ladybug/Koala instalado' },
                { key: 'jdkConfigured' as const, label: 'JDK 17 ou 21 configurado no Gradle' },
                { key: 'sdk35Installed' as const, label: 'Android SDK 35 instalado' },
                { key: 'projectCreated' as const, label: 'Projeto Prumo aberto / criado' },
                { key: 'gradleSynced' as const, label: 'Gradle Sync finalizado sem erros' },
                { key: 'previewTested' as const, label: 'HomeScreenPreview renderizado no Compose Preview' }
              ].map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => toggleCheck(key)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F7F9F8] cursor-pointer transition-colors"
                >
                  {checklist[key] ? (
                    <CheckSquare className="w-4 h-4 text-[#1F6F5C] mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#5B615D] mt-0.5 shrink-0" />
                  )}
                  <span className={`text-xs ${checklist[key] ? 'text-[#1A1D1B] font-medium' : 'text-[#5B615D]'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[#E6E8E6]">
              <button
                onClick={onOpenCodeViewer}
                className="w-full py-2.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <FolderTree className="w-3.5 h-3.5" />
                Inspecionar Arquivos de Código
              </button>
            </div>

            {/* Atalho de Terminal */}
            <div className="mt-5 p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
              <span className="text-[11px] font-semibold text-[#1A1D1B] block mb-1">
                Comando para compilar via terminal:
              </span>
              <div className="flex items-center justify-between bg-[#1A1D1B] text-emerald-400 p-2 rounded font-mono text-[11px]">
                <span>./gradlew assembleDebug</span>
                <button
                  onClick={() => copyToClipboard('./gradlew assembleDebug', 'cmd1')}
                  className="text-white hover:text-emerald-300 ml-2"
                >
                  {copiedCmd === 'cmd1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
