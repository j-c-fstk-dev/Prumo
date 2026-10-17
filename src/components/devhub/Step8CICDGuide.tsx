import React, { useState } from 'react';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Download, 
  FolderTree, 
  Check, 
  Code2, 
  Layers, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  Clock,
  Terminal,
  ArrowRight,
  UploadCloud,
  Key,
  Shield,
  Smartphone,
  Copy,
  RotateCcw,
  ExternalLink,
  Cpu,
  FileCode2,
  Box,
  Sliders
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

interface PipelineStep {
  id: string;
  name: string;
  command: string;
  durationSec: number;
  status: 'idle' | 'running' | 'success' | 'failed';
  summary: string;
}

export const Step8CICDGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Modo de Pipeline: Pull Request (CI) vs Release Tag (CD)
  const [pipelineMode, setPipelineMode] = useState<'ci' | 'release'>('release');
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(-1);
  const [pipelineFinished, setPipelineFinished] = useState(false);

  // Tabs de Código
  const [activeCodeTab, setActiveCodeTab] = useState<'ciWorkflow' | 'releaseWorkflow' | 'signingConfig' | 'secretsGuide' | 'stagedRollout'>('releaseWorkflow');

  // Checklist interativo
  const [checklist, setChecklist] = useState({
    keystoreGenerated: true,
    githubSecretsSet: true,
    ciPullRequestWorkflow: true,
    signedAabBuild: true,
    playStoreServiceAccount: true,
    mappingTxtUpload: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const ciSteps: PipelineStep[] = [
    {
      id: 'step_checkout',
      name: '1. Checkout & Git Submodules',
      command: 'actions/checkout@v4',
      durationSec: 3,
      status: 'idle',
      summary: 'Clona o código fonte do repositório Prumo com fetch-depth: 0.'
    },
    {
      id: 'step_jdk',
      name: '2. Setup Java 21 (Eclipse Temurin)',
      command: 'actions/setup-java@v4 (distribution: temurin, java-version: 21)',
      durationSec: 5,
      status: 'idle',
      summary: 'Configura o JDK 21 requerido pelo Gradle 8.7+ e Kotlin 2.0.'
    },
    {
      id: 'step_cache',
      name: '3. Gradle Dependency Cache',
      command: 'gradle/actions/setup-gradle@v3 (cache-read-only: false)',
      durationSec: 8,
      status: 'idle',
      summary: 'Restaura caches de dependências ~/.gradle/caches para builds rápidos.'
    },
    {
      id: 'step_lint',
      name: '4. Android Lint & Detekt',
      command: './gradlew lintDebug detekt',
      durationSec: 18,
      status: 'idle',
      summary: 'Verifica boas práticas, semântica Compose, acessibilidade e memory leaks.'
    },
    {
      id: 'step_tests',
      name: '5. Unit Tests & Jacoco Coverage',
      command: './gradlew testDebugUnitTest',
      durationSec: 24,
      status: 'idle',
      summary: 'Executa toda a suíte de testes (CalculateDiagnosis, ViewModel e DAOs).'
    }
  ];

  const releaseSteps: PipelineStep[] = [
    ...ciSteps,
    {
      id: 'step_keystore',
      name: '6. Decodificar Keystore de Assinatura',
      command: 'echo "$KEYSTORE_BASE64" | base64 -d > app/release.keystore',
      durationSec: 2,
      status: 'idle',
      summary: 'Injeta certificado de produção a partir do segredo protegido do GitHub.'
    },
    {
      id: 'step_bundle',
      name: '7. Build AAB Assinado & Otimização R8',
      command: './gradlew bundleRelease -PversionCode=$GITHUB_RUN_NUMBER',
      durationSec: 42,
      status: 'idle',
      summary: 'Gera o Android App Bundle (.aab) com ProGuard/R8 e ofuscação máxima.'
    },
    {
      id: 'step_play_store',
      name: '8. Publicar no Google Play (Faixa Interna)',
      command: 'r0adkll/upload-google-play@v1 (track: internal, rollout: 100%)',
      durationSec: 15,
      status: 'idle',
      summary: 'Envia o bundle e o mapping.txt para os testadores internos na Play Store.'
    }
  ];

  const currentSteps = pipelineMode === 'ci' ? ciSteps : releaseSteps;
  const [pipelineState, setPipelineState] = useState<PipelineStep[]>(currentSteps);

  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'Runner ready: GitHub-hosted Linux (ubuntu-latest)',
    'Branch: refs/tags/v1.0.0 | Commit: 8c34f9e',
    'Aguardando disparo do workflow...'
  ]);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-8.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const runPipelineSimulation = () => {
    setIsRunningPipeline(true);
    setPipelineFinished(false);
    setActiveStageIndex(0);
    const stepsToRun = (pipelineMode === 'ci' ? ciSteps : releaseSteps).map(s => ({ ...s, status: 'idle' as const }));
    setPipelineState(stepsToRun);
    setConsoleLogs([
      `Iniciando execução da Pipeline [${pipelineMode.toUpperCase()}] no runner ubuntu-latest...`,
      `Workflow: ${pipelineMode === 'ci' ? 'android-ci.yml' : 'android-release.yml'}`
    ]);

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < stepsToRun.length) {
        const step = stepsToRun[currentIndex];
        setActiveStageIndex(currentIndex);

        // Marca atual como running
        setPipelineState(prev => prev.map((s, idx) => idx === currentIndex ? { ...s, status: 'running' } : s));

        setConsoleLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] > Executando ${step.name}: ${step.command}...`
        ]);

        setTimeout(() => {
          // Marca atual como sucesso
          setPipelineState(prev => prev.map((s, idx) => idx === currentIndex ? { ...s, status: 'success' } : s));
          setConsoleLogs(prev => [
            ...prev,
            `✓ Sucesso em ${step.durationSec}s: ${step.summary}`
          ]);
          currentIndex++;

          if (currentIndex >= stepsToRun.length) {
            clearInterval(interval);
            setIsRunningPipeline(false);
            setPipelineFinished(true);
            setActiveStageIndex(-1);
            setConsoleLogs(prev => [
              ...prev,
              `✨ PIPELINE CONCLUÍDA COM 100% DE SUCESSO! Artefato app-release.aab disponível e enviado ao Google Play Console.`
            ]);
          }
        }, 800);
      }
    }, 1100);
  };

  const resetPipeline = () => {
    const steps = (pipelineMode === 'ci' ? ciSteps : releaseSteps).map(s => ({ ...s, status: 'idle' as const }));
    setPipelineState(steps);
    setIsRunningPipeline(false);
    setPipelineFinished(false);
    setActiveStageIndex(-1);
    setConsoleLogs([
      'Pipeline reiniciada. Pronto para nova execução.',
      `Modo selecionado: ${pipelineMode.toUpperCase()}`
    ]);
  };

  // Códigos das Tabs
  const codeSnippets = {
    ciWorkflow: `# .github/workflows/android-ci.yml
# Executado em Pull Requests e Pushes para branches principais
name: Prumo Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate-and-test:
    name: Lint & Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 25

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Java 21 (Eclipse Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Setup Gradle Cache
        uses: gradle/actions/setup-gradle@v3
        with:
          cache-read-only: \${{ github.ref != 'refs/heads/main' }}

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew

      - name: Run Android Lint & Detekt
        run: ./gradlew lintDebug

      - name: Run Unit Tests & Turbines
        run: ./gradlew testDebugUnitTest

      - name: Upload Test Reports (on failure)
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-reports
          path: app/build/reports/tests/`,

    releaseWorkflow: `# .github/workflows/android-release.yml
# Disparado ao criar uma tag de versão (ex: v1.0.0) ou manualmente via workflow_dispatch
name: Prumo Android Release & Google Play

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:
    inputs:
      track:
        description: 'Faixa do Google Play (internal, alpha, beta, production)'
        required: true
        default: 'internal'
        type: choice
        options:
          - internal
          - alpha
          - beta
          - production

jobs:
  build-and-deploy:
    name: Build Signed AAB & Deploy to Play Store
    runs-on: ubuntu-latest
    timeout-minutes: 40

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Java 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Decodificar Keystore de Assinatura
        env:
          KEYSTORE_BASE64: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: |
          mkdir -p app/keystores
          echo "$KEYSTORE_BASE64" | base64 --decode > app/keystores/release.jks

      - name: Build Android App Bundle (AAB) Assinado
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
        run: |
          chmod +x gradlew
          ./gradlew bundleRelease \\
            -Pandroid.injected.signing.store.file=keystores/release.jks \\
            -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \\
            -Pandroid.injected.signing.key.alias="$KEY_ALIAS" \\
            -Pandroid.injected.signing.key.password="$KEY_PASSWORD"

      - name: Upload AAB como Artefato do GitHub
        uses: actions/upload-artifact@v4
        with:
          name: prumo-release-\${{ github.ref_name }}
          path: app/build/outputs/bundle/release/app-release.aab
          retention-days: 30

      - name: Publicar no Google Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_STORE_JSON_KEY }}
          packageName: com.prumo.app
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: \${{ github.event.inputs.track || 'internal' }}
          status: completed
          mappingFile: app/build/outputs/mapping/release/mapping.txt`,

    signingConfig: `// app/build.gradle.kts
// Configuração segura de assinatura para Release e CI/CD

android {
    ...
    signingConfigs {
        create("release") {
            // No CI/CD, as variáveis são passadas via flags Gradle ou System.getenv()
            storeFile = file(
                System.getenv("KEYSTORE_FILE_PATH") ?: "keystores/release.jks"
            )
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = System.getenv("KEY_ALIAS")
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Associa a assinatura de release configurada acima
            signingConfig = signingConfigs.getByName("release")
        }
    }
}`,

    secretsGuide: `# Guia de Geração da Chave e Configuração dos GitHub Secrets

# 1. Gerar Keystore de Produção (guarde a senha e faça backup seguro!)
keytool -genkey -v \\
  -keystore prumo-release.jks \\
  -alias prumo-release-key \\
  -keyalg RSA \\
  -keysize 2048 \\
  -validity 10000

# 2. Converter o arquivo .jks em Base64 para salvar no GitHub Secrets
base64 -w 0 prumo-release.jks > keystore_base64.txt

# 3. Adicionar os Segredos no repositório GitHub:
# Settings > Secrets and variables > Actions > New repository secret
# - ANDROID_KEYSTORE_BASE64: Conteúdo do arquivo keystore_base64.txt
# - KEYSTORE_PASSWORD: Senha do arquivo keystore
# - KEY_ALIAS: prumo-release-key
# - KEY_PASSWORD: Senha da chave privada
# - PLAY_STORE_JSON_KEY: Chave JSON da Conta de Serviço do Google Cloud`,

    stagedRollout: `# Estratégia de Lançamento Seguro (Staged Rollout) no Google Play

1. Teste Interno (Internal Testing):
   - Acesso imediato para equipe e QA (até 100 testadores).
   - Valida inicialização, migração do Room e Firebase Auth.

2. Beta Fechado (Closed Testing):
   - Grupo piloto de 50 a 200 empreendedores iniciantes.
   - Validação da precisão da Anamnese e conversão de metas.

3. Lançamento Gradual em Produção (Staged Rollout):
   - Dia 1: 10% dos usuários (Monitorar taxa de crashes no Android Vitals < 0.2%).
   - Dia 2: 25% dos usuários.
   - Dia 3: 50% dos usuários.
   - Dia 5: 100% dos usuários (Rollout completo concluído com estabilidade garantida).`
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal da Etapa 8 */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#0F352C] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 8: Integração Contínua &amp; Publicação Automatizada (CI/CD)
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            Automação de Build, Testes e Deploy com GitHub Actions
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Fechamento do ciclo completo de engenharia do <strong className="text-white">Prumo</strong>: 
            pipelines automatizadas de validação em cada Pull Request, compilação do 
            <strong className="text-white"> Android App Bundle (.aab)</strong> assinado com proteção de 
            <strong className="text-white"> Keystore em Base64</strong> e publicação direta na 
            <strong className="text-white"> Google Play Store</strong> via Service Account do Google Cloud.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Projeto Completo (Etapas 1 a 8) (.zip)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Ver Workflows e Código no Android Studio
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-Etapas1-8.zip</strong> baixado com sucesso!
            </div>
          )}
        </div>
      </div>

      {/* Grid: Simulador de Pipeline + Checklist & Arquitetura */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Simulador Interativo de Pipeline */}
        <div className="lg:col-span-8 space-y-6">

          {/* SIMULADOR INTERATIVO GITHUB ACTIONS */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-[#1F6F5C]" />
                  <h3 className="text-base font-bold text-[#1A1D1B]">
                    Simulador de Pipeline do GitHub Actions
                  </h3>
                </div>
                <p className="text-xs text-[#5B615D] mt-0.5">
                  Execute o workflow em tempo real e visualize o ciclo de validação e publicação:
                </p>
              </div>

              {/* Seletor de Modo: CI vs Release */}
              <div className="flex items-center gap-1 bg-[#F0F2EF] p-1 rounded-xl text-xs">
                <button
                  onClick={() => { setPipelineMode('ci'); resetPipeline(); }}
                  disabled={isRunningPipeline}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    pipelineMode === 'ci'
                      ? 'bg-white text-[#1F6F5C] shadow-xs font-semibold'
                      : 'text-[#5B615D] hover:text-[#1A1D1B]'
                  }`}
                >
                  Pull Request (CI)
                </button>
                <button
                  onClick={() => { setPipelineMode('release'); resetPipeline(); }}
                  disabled={isRunningPipeline}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    pipelineMode === 'release'
                      ? 'bg-white text-[#1F6F5C] shadow-xs font-semibold'
                      : 'text-[#5B615D] hover:text-[#1A1D1B]'
                  }`}
                >
                  Release Play Store (CD)
                </button>
              </div>
            </div>

            {/* Painel de Ações do Runner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={runPipelineSimulation}
                  disabled={isRunningPipeline}
                  className="px-4 py-2 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-xs disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunningPipeline ? 'animate-spin' : ''}`} />
                  <span>{isRunningPipeline ? 'Executando Workflow...' : 'Disparar Workflow no Runner'}</span>
                </button>

                <button
                  onClick={resetPipeline}
                  disabled={isRunningPipeline}
                  className="px-3 py-2 bg-white hover:bg-neutral-100 text-[#5B615D] border border-[#E6E8E6] rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#5B615D]">Runner:</span>
                <span className="font-mono text-[11px] bg-neutral-200/80 text-neutral-800 px-2 py-0.5 rounded font-semibold">
                  ubuntu-latest (4 vCPU, 16GB RAM)
                </span>
              </div>
            </div>

            {/* Etapas Visuais da Pipeline */}
            <div className="space-y-2 mb-5">
              {pipelineState.map((step, idx) => {
                const isRunning = step.status === 'running';
                const isSuccess = step.status === 'success';
                const isCurrent = activeStageIndex === idx;

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isRunning
                        ? 'border-[#1F6F5C] bg-[#E3F2ED]/40 shadow-xs ring-1 ring-[#1F6F5C]'
                        : isSuccess
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-[#E6E8E6] bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {isSuccess ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isRunning ? (
                          <div className="w-4 h-4 border-2 border-[#1F6F5C] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-300 bg-neutral-100" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isSuccess ? 'text-emerald-950' : 'text-[#1A1D1B]'}`}>
                            {step.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            isSuccess ? 'bg-emerald-100 text-emerald-800' :
                            isRunning ? 'bg-[#1F6F5C] text-white font-bold' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>
                            {step.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5B615D] font-mono mt-0.5">
                          {step.command}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] text-[#5B615D] bg-neutral-100 px-2 py-0.5 rounded">
                        {isSuccess ? `${step.durationSec}s` : isRunning ? 'em execução...' : `~${step.durationSec}s`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Terminal Output */}
            <div className="bg-[#1A1D1B] text-neutral-200 p-4 rounded-xl font-mono text-xs border border-neutral-800">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>GitHub Actions Runner Console</span>
                </div>
                <span className="text-neutral-400 font-normal">
                  {pipelineFinished ? 'STATUS: SUCCESS (0 errors)' : isRunningPipeline ? 'STATUS: RUNNING' : 'STATUS: IDLE'}
                </span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {consoleLogs.map((log, i) => (
                  <p key={i} className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* CÓDIGOS DE CONFIGURAÇÃO DE CI/CD COM TABS */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <FileCode2 className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Arquivos Oficiais de CI/CD para o Projeto Prumo
                </h3>
              </div>
              <span className="text-[11px] text-[#5B615D] font-mono bg-neutral-100 px-2 py-0.5 rounded">
                .github/workflows
              </span>
            </div>

            {/* Abas de Arquivos */}
            <div className="flex flex-wrap gap-1.5 border-b border-[#E6E8E6] pb-3 mb-4 text-xs">
              <button
                onClick={() => setActiveCodeTab('releaseWorkflow')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCodeTab === 'releaseWorkflow'
                    ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                    : 'text-[#5B615D] hover:bg-neutral-100'
                }`}
              >
                android-release.yml (Google Play)
              </button>

              <button
                onClick={() => setActiveCodeTab('ciWorkflow')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCodeTab === 'ciWorkflow'
                    ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                    : 'text-[#5B615D] hover:bg-neutral-100'
                }`}
              >
                android-ci.yml (Pull Requests)
              </button>

              <button
                onClick={() => setActiveCodeTab('signingConfig')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCodeTab === 'signingConfig'
                    ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                    : 'text-[#5B615D] hover:bg-neutral-100'
                }`}
              >
                build.gradle.kts (Signing)
              </button>

              <button
                onClick={() => setActiveCodeTab('secretsGuide')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCodeTab === 'secretsGuide'
                    ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                    : 'text-[#5B615D] hover:bg-neutral-100'
                }`}
              >
                Keystore &amp; Secrets
              </button>

              <button
                onClick={() => setActiveCodeTab('stagedRollout')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCodeTab === 'stagedRollout'
                    ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                    : 'text-[#5B615D] hover:bg-neutral-100'
                }`}
              >
                Staged Rollout (10% &rarr; 100%)
              </button>
            </div>

            {/* Bloco de Código com Botão de Copiar */}
            <div className="relative">
              <button
                onClick={() => copyToClipboard(codeSnippets[activeCodeTab], activeCodeTab)}
                className="absolute top-3 right-3 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-md transition-colors flex items-center gap-1.5 z-10 cursor-pointer"
              >
                {copiedSnippet === activeCodeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <pre className="p-4 bg-[#1A1D1B] text-neutral-200 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[460px] border border-neutral-800">
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Guia de Segurança, Checklist & Google Play */}
        <div className="lg:col-span-4 space-y-6">

          {/* CHECKLIST DE DEPLOY */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#1F6F5C]" />
              <h4 className="text-sm font-bold text-[#1A1D1B]">
                Checklist de Prontidão para Google Play
              </h4>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              Itens obrigatórios para deploy contínuo sem rejeições na Play Store:
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { key: 'keystoreGenerated', label: 'Keystore gerada com chave RSA 2048 bits e backup seguro' },
                { key: 'githubSecretsSet', label: 'Segredos configurados no GitHub (KEYSTORE_BASE64, etc.)' },
                { key: 'ciPullRequestWorkflow', label: 'CI bloqueando merges com Lint ou testes falhando' },
                { key: 'signedAabBuild', label: 'Build gerando .aab assinado com ProGuard/R8 ativado' },
                { key: 'playStoreServiceAccount', label: 'Conta de serviço GCP autorizada no Play Console' },
                { key: 'mappingTxtUpload', label: 'Arquivo mapping.txt enviado para desofuscar crashes' }
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => toggleCheck(item.key as keyof typeof checklist)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <button className="mt-0.5 text-[#1F6F5C]">
                    {checklist[item.key as keyof typeof checklist] ? (
                      <CheckSquare className="w-4 h-4 text-[#1F6F5C]" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                  <span className={`text-xs ${
                    checklist[item.key as keyof typeof checklist] ? 'text-[#1A1D1B]' : 'text-neutral-400 line-through'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TABELA DE GITHUB SECRETS */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-[#1F6F5C]" />
              <h4 className="text-sm font-bold text-[#1A1D1B]">
                Segredos do Repositório (GitHub Secrets)
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <strong className="text-[#1F6F5C] font-mono text-[11px] block">ANDROID_KEYSTORE_BASE64</strong>
                <span className="text-[11px] text-[#5B615D]">String base64 do arquivo .jks de produção.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <strong className="text-[#1F6F5C] font-mono text-[11px] block">KEYSTORE_PASSWORD</strong>
                <span className="text-[11px] text-[#5B615D]">Senha mestre do keystore.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <strong className="text-[#1F6F5C] font-mono text-[11px] block">KEY_ALIAS &amp; KEY_PASSWORD</strong>
                <span className="text-[11px] text-[#5B615D]">Alias da chave (ex: prumo-key) e senha específica.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <strong className="text-[#1F6F5C] font-mono text-[11px] block">PLAY_STORE_JSON_KEY</strong>
                <span className="text-[11px] text-[#5B615D]">JSON da Service Account com permissão de publicação.</span>
              </div>
            </div>
          </div>

          {/* FAIXAS DE DISTRIBUIÇÃO NA PLAY STORE */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <UploadCloud className="w-4 h-4 text-[#1F6F5C]" />
              <h4 className="text-sm font-bold text-[#1A1D1B]">
                Trilhas de Lançamento (Play Console)
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
                <span className="font-bold text-emerald-900 block text-xs">1. Faixa Interna (Internal Track)</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Deploy automático a cada commit na tag. Disponível em segundos para os desenvolvedores.
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50">
                <span className="font-bold text-blue-900 block text-xs">2. Teste Fechado (Closed Beta)</span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Acesso para convidados selecionados validarem onboarding e anamnese.
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50">
                <span className="font-bold text-amber-900 block text-xs">3. Produção com Rollout Gradual</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  10% &rarr; 25% &rarr; 50% &rarr; 100% monitorando crash rate no Android Vitals.
                </p>
              </div>
            </div>
          </div>

          {/* STATUS DO PROJETO PRUMO: 100% CONCLUÍDO */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1F6F5C]/15 to-[#1F6F5C]/5 border border-[#1F6F5C]/30 text-xs">
            <div className="flex items-center gap-2 text-[#1F6F5C] font-bold mb-1">
              <Sparkles className="w-4 h-4 text-[#F2A93B]" />
              <span>Projeto Prumo 100% Concluído!</span>
            </div>
            <p className="text-[11px] text-[#5B615D] leading-relaxed">
              Com as 8 etapas implementadas (Setup, Arquitetura, Design System, ViewModel, Retrofit, Room SQLite, Testes TDD e CI/CD), o aplicativo possui arquitetura profissional pronta para publicação.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
