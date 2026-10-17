import React, { useState } from 'react';
import { 
  TestTube2, 
  CheckCircle2, 
  XCircle,
  Play, 
  Sparkles, 
  Download, 
  FolderTree, 
  Check, 
  Code2, 
  Layers, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  RefreshCw,
  Cpu,
  Smartphone,
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

interface TestCase {
  id: string;
  name: string;
  type: 'unit' | 'viewmodel' | 'dao' | 'compose';
  suite: string;
  durationMs: number;
  status: 'passed' | 'failed' | 'running' | 'idle';
  assertion: string;
}

export const Step7TestingGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'usecase' | 'viewmodel' | 'dao' | 'compose' | 'fake'>('usecase');
  const [testFilter, setTestFilter] = useState<'all' | 'unit' | 'viewmodel' | 'dao' | 'compose'>('all');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(100);

  // Simulated Test Suite
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'tc1',
      name: 'deve diagnosticar perfil CLAREZA_VALIDACAO quando usuario tem duvidas no nicho',
      type: 'unit',
      suite: 'CalculateDiagnosisUseCaseTest',
      durationMs: 14,
      status: 'passed',
      assertion: 'assertEquals(ProfileType.CLAREZA_VALIDACAO, result.type)'
    },
    {
      id: 'tc2',
      name: 'deve priorizar fase FUNDACAO nas primeiras 3 tarefas recomendadas',
      type: 'unit',
      suite: 'CalculateDiagnosisUseCaseTest',
      durationMs: 8,
      status: 'passed',
      assertion: 'assertTrue(result.recommendedTasks.all { it.phase == TaskPhase.FUNDACAO })'
    },
    {
      id: 'tc3',
      name: 'deve emitir Loading inicialmente e depois Success ao carregar tarefas',
      type: 'viewmodel',
      suite: 'RoadmapViewModelTest',
      durationMs: 42,
      status: 'passed',
      assertion: 'viewModel.uiState.test { awaitItem().isLoading; awaitItem().tasks.isNotEmpty() }'
    },
    {
      id: 'tc4',
      name: 'deve filtrar tarefas por fase FUNDACAO quando filtro for selecionado',
      type: 'viewmodel',
      suite: 'RoadmapViewModelTest',
      durationMs: 31,
      status: 'passed',
      assertion: 'viewModel.handleIntent(FilterByPhase(FUNDACAO)) -> filteredTasks.size == 3'
    },
    {
      id: 'tc5',
      name: 'deve inserir e recuperar tarefas mantendo ordenacao por fase e id no SQLite',
      type: 'dao',
      suite: 'TaskDaoTest (Room In-Memory)',
      durationMs: 88,
      status: 'passed',
      assertion: 'taskDao.observeAllTasks().first() -> size == 4 && first().id == "t1"'
    },
    {
      id: 'tc6',
      name: 'deve atualizar status da tarefa para COMPLETED sem alterar outros campos',
      type: 'dao',
      suite: 'TaskDaoTest (Room In-Memory)',
      durationMs: 65,
      status: 'passed',
      assertion: 'taskDao.updateTaskStatus("t1", COMPLETED) -> getTaskById("t1")?.status == COMPLETED'
    },
    {
      id: 'tc7',
      name: 'deve exibir titulo da tarefa e botao de conclusao na RoadmapScreen',
      type: 'compose',
      suite: 'RoadmapScreenComposeTest',
      durationMs: 240,
      status: 'passed',
      assertion: 'composeTestRule.onNodeWithText("Definir sua promessa").assertIsDisplayed()'
    },
    {
      id: 'tc8',
      name: 'ao clicar no botao Concluir deve disparar callback onTaskToggle',
      type: 'compose',
      suite: 'RoadmapScreenComposeTest',
      durationMs: 310,
      status: 'passed',
      assertion: 'composeTestRule.onNodeWithTag("toggle_btn_t1").performClick() -> clicked == true'
    }
  ]);

  const [testOutputLog, setTestOutputLog] = useState<string>(
    'BUILD SUCCESSFUL: 8/8 testes executados em 798ms. Todos os testes unitários e de UI do Compose passaram com 100% de sucesso.'
  );

  // Checklist da Etapa 7
  const [checklist, setChecklist] = useState({
    unitTestingDependencies: true,
    tddWorkflowEstablished: true,
    viewmodelCoroutinesTest: true,
    roomInMemoryDaoTest: true,
    composeTestRuleSemantics: true,
    fakeRepositoriesTestDoubles: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-7.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const runAllTests = () => {
    setIsRunningTests(true);
    setTestProgress(0);
    setTestOutputLog('Iniciando execução do Gradle: ./gradlew testDebugUnitTest connectedAndroidTest...');

    // Simulate progress
    const interval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 30;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setTestProgress(100);
      setIsRunningTests(false);
      const timestamp = new Date().toLocaleTimeString();
      setTestOutputLog(
        `[${timestamp}] Test execution finished! 8 tests completed across JUnit 5, Coroutines Test, Room In-Memory and Compose Test Rule. 0 failures, 0 skipped.`
      );
    }, 900);
  };

  const filteredTests = testFilter === 'all' 
    ? testCases 
    : testCases.filter(tc => tc.type === testFilter);

  const passedCount = testCases.filter(t => t.status === 'passed').length;
  const totalDuration = testCases.reduce((acc, curr) => acc + curr.durationMs, 0);

  return (
    <div className="space-y-6">
      {/* Banner Principal da Etapa 7 */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#0F352C] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 7: Testes Automatizados &amp; Estratégia TDD
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            Testes Unitários &amp; de UI no Android Studio com Kotlin
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Garanta a qualidade e a estabilidade contínua do <strong className="text-white">Prumo</strong>: 
            aplique <strong className="text-white">TDD (Red &rarr; Green &rarr; Refactor)</strong> em Casos de Uso de domínio, 
            teste ViewModels com <strong className="text-white">Coroutines Test &amp; Turbine</strong>, valide DAOs no 
            <strong className="text-white"> SQLite em memória</strong> e escreva testes de UI declarativos no 
            <strong className="text-white"> Jetpack Compose com Semantics e Espresso</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Projeto com Suíte de Testes (.zip)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Ver Código dos Testes no Android Studio
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-Etapas1-7.zip</strong> baixado com sucesso!
            </div>
          )}
        </div>
      </div>

      {/* Grid: Pirâmide + Ciclo TDD + Simulador de Testes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">

          {/* SEÇÃO 1: PIRÂMIDE DE TESTES E METODOLOGIA TDD NO PRUMO */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <Layers className="w-5 h-5 text-[#1F6F5C]" />
              <h3 className="text-base font-bold text-[#1A1D1B]">
                A Pirâmide de Testes &amp; Estratégia TDD na Clean Architecture
              </h3>
            </div>

            <p className="text-xs text-[#5B615D] mb-4 leading-relaxed">
              Para manter o ciclo de desenvolvimento rápido e evitar regressões, o Prumo adota a proporção 
              recomendada pelo Google para apps Android modernos:
            </p>

            {/* Visual da Pirâmide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-6">
              <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded">
                      70% Unitários
                    </span>
                    <Cpu className="w-4 h-4 text-[#1F6F5C]" />
                  </div>
                  <h4 className="font-bold text-[#1A1D1B] text-xs">Casos de Uso &amp; ViewModels</h4>
                  <p className="text-[11px] text-[#5B615D] mt-1 leading-relaxed">
                    Rodam na JVM local em milissegundos sem precisar de emulador. Testam o cálculo do diagnóstico e reducers de estado.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-700 font-mono mt-3 font-semibold">&lt; 50ms por suite</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      20% Integração
                    </span>
                    <TestTube2 className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="font-bold text-[#1A1D1B] text-xs">Room DAOs &amp; DataStore</h4>
                  <p className="text-[11px] text-[#5B615D] mt-1 leading-relaxed">
                    Testam o SQLite real usando <code>Room.inMemoryDatabaseBuilder</code> para garantir transações e queries SQL sem persistir lixo em disco.
                  </p>
                </div>
                <span className="text-[10px] text-amber-800 font-mono mt-3 font-semibold">~100ms por suite</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      10% UI &amp; Compose
                    </span>
                    <Smartphone className="w-4 h-4 text-indigo-700" />
                  </div>
                  <h4 className="font-bold text-[#1A1D1B] text-xs">Compose Semantics</h4>
                  <p className="text-[11px] text-[#5B615D] mt-1 leading-relaxed">
                    Utilizam <code>createComposeRule()</code> para interagir com botões, cards e validar se textos e tags estão visíveis e clicáveis.
                  </p>
                </div>
                <span className="text-[10px] text-indigo-800 font-mono mt-3 font-semibold">~300ms por tela</span>
              </div>
            </div>

            {/* Ciclo TDD Explicado */}
            <div className="p-4 rounded-xl bg-[#E3F2ED]/40 border border-[#1F6F5C]/20">
              <h4 className="text-xs font-bold text-[#1F6F5C] mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#F2A93B]" />
                O Ciclo TDD Aplicado ao Prumo (Red &rarr; Green &rarr; Refactor)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-[#E6E8E6]">
                  <strong className="text-red-700 font-bold block mb-1">1. RED (Falha Inicial)</strong>
                  <p className="text-[11px] text-[#5B615D]">
                    Escreve-se o teste que define o comportamento esperado do Caso de Uso antes de implementar a lógica.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E6E8E6]">
                  <strong className="text-emerald-700 font-bold block mb-1">2. GREEN (Sucesso Rápido)</strong>
                  <p className="text-[11px] text-[#5B615D]">
                    Implementa-se o código mínimo suficiente na camada de Domínio para fazer o teste passar.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E6E8E6]">
                  <strong className="text-blue-700 font-bold block mb-1">3. REFACTOR (Elegância)</strong>
                  <p className="text-[11px] text-[#5B615D]">
                    Limpa-se a arquitetura com a segurança de que qualquer quebra será acusada pelos testes unitários.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: SIMULADOR INTERATIVO DO TEST RUNNER */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <TestTube2 className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Simulador de Test Runner (JUnit + Compose Test Rule)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
                Interactive Test Suite
              </span>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              Execute a suíte de testes completa do Prumo e filtre por camada para inspecionar asserções, tempo de execução e status:
            </p>

            {/* Painel de Controles do Runner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  className="px-4 py-2 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-xs disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                  <span>{isRunningTests ? 'Executando testes...' : 'Executar Suíte de Testes'}</span>
                </button>

                <div className="text-xs text-[#5B615D] flex items-center gap-2 pl-2">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {passedCount}/{testCases.length} Passaram
                  </span>
                  <span>&bull;</span>
                  <span className="font-mono text-[11px] text-[#5B615D]">{totalDuration}ms total</span>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex items-center gap-1 text-xs">
                <Filter className="w-3 h-3 text-[#5B615D] mr-1" />
                {(['all', 'unit', 'viewmodel', 'dao', 'compose'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTestFilter(filter)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      testFilter === filter
                        ? 'bg-[#1F6F5C] text-white font-semibold'
                        : 'bg-white hover:bg-neutral-200 text-[#5B615D] border border-[#E6E8E6]'
                    }`}
                  >
                    {filter === 'all' ? 'Todos' : filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Barra de Progresso do Test Runner */}
            {isRunningTests && (
              <div className="mb-4">
                <div className="w-full bg-[#E6E8E6] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#1F6F5C] h-full transition-all duration-300"
                    style={{ width: `${testProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Lista de Casos de Teste */}
            <div className="space-y-2 mb-4">
              {filteredTests.map((test) => (
                <div 
                  key={test.id}
                  className="p-3 rounded-xl border border-[#E6E8E6] bg-white hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3BAA6B] mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1A1D1B]">{test.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          test.type === 'unit' ? 'bg-[#E3F2ED] text-[#1F6F5C]' :
                          test.type === 'viewmodel' ? 'bg-blue-100 text-blue-700' :
                          test.type === 'dao' ? 'bg-amber-100 text-amber-800' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {test.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5B615D] font-mono mt-0.5">
                        {test.suite} &rarr; <code className="text-emerald-800">{test.assertion}</code>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] text-[#5B615D] bg-neutral-100 px-2 py-0.5 rounded">
                      {test.durationMs}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal Output */}
            <div className="bg-[#1A1D1B] text-neutral-200 p-3.5 rounded-xl font-mono text-xs border border-neutral-800">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1.5">
                <span>JUnit &amp; Compose Test Console</span>
                <span className="text-neutral-400 font-normal">Gradle Test Daemon</span>
              </div>
              <p className="text-[11px] text-emerald-300 leading-relaxed">
                &gt; {testOutputLog}
              </p>
            </div>
          </div>

          {/* SEÇÃO 3: CÓDIGOS REAIS DE TESTE COM TABS */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-base font-bold text-[#1A1D1B] mb-2 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#1F6F5C]" />
              Implementação dos Testes em Kotlin
            </h3>

            <p className="text-xs text-[#5B615D] mb-4">
              Explore a estrutura dos testes reais implementados no app:
            </p>

            {/* Tabs de Código */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-[#E6E8E6] pb-2 mb-4 text-xs">
              {[
                { id: 'usecase' as const, label: '1. CalculateDiagnosisUseCaseTest.kt' },
                { id: 'viewmodel' as const, label: '2. RoadmapViewModelTest.kt' },
                { id: 'dao' as const, label: '3. TaskDaoTest.kt (Room)' },
                { id: 'compose' as const, label: '4. RoadmapScreenComposeTest.kt' },
                { id: 'fake' as const, label: '5. FakeTaskRepository.kt' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                    activeCodeTab === tab.id
                      ? 'bg-[#1F6F5C] text-white shadow-xs font-semibold'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-[#5B615D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Código da Tab Selecionada */}
            <div className="bg-[#1A1D1B] text-neutral-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
              {activeCodeTab === 'usecase' && (
                <pre>{`package com.prumo.app.domain.usecase

import com.prumo.app.domain.model.*
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

/**
 * Teste unitário puro de Domínio (executa na JVM em ~10ms).
 * Valida o cálculo algorítmico do perfil de diagnóstico a partir das 6 respostas da anamnese.
 */
class CalculateDiagnosisUseCaseTest {

    private lateinit var useCase: CalculateDiagnosisUseCase

    @Before
    fun setUp() {
        useCase = CalculateDiagnosisUseCase()
    }

    @Test
    fun \`quando usuario nao tem ideia de produto, deve classificar como CLAREZA_VALIDACAO\`() {
        val answers = listOf(
            UserAnswer(questionId = "experience", answerId = "iniciante"),
            UserAnswer(questionId = "product_stage", answerId = "sem_ideia"),
            UserAnswer(questionId = "audience", answerId = "nao_sei")
        )

        val result = useCase(answers)

        assertEquals(ProfileType.CLAREZA_VALIDACAO, result.profileType)
        assertTrue(result.recommendedTasks.isNotEmpty())
        assertEquals(TaskPhase.FUNDACAO, result.recommendedTasks.first().phase)
    }

    @Test
    fun \`quando usuario ja tem produto pronto, deve recomendar tarefas da fase MARKETING\`() {
        val answers = listOf(
            UserAnswer(questionId = "experience", answerId = "intermediario"),
            UserAnswer(questionId = "product_stage", answerId = "produto_pronto"),
            UserAnswer(questionId = "audience", answerId = "tenho_seguidores")
        )

        val result = useCase(answers)

        assertEquals(ProfileType.TRAÇÃO_CONVERSAO, result.profileType)
        assertEquals("MARKETING", result.recommendedTasks.first().phase.name)
    }
}`}</pre>
              )}

              {activeCodeTab === 'viewmodel' && (
                <pre>{`package com.prumo.app.presentation.roadmap

import app.cash.turbine.test
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.testutil.FakeTaskRepository
import com.prumo.app.testutil.MainDispatcherRule
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

/**
 * Teste unitário de ViewModel com Coroutines e Turbine para testar StateFlow.
 * Utiliza MainDispatcherRule para substituir o Dispatchers.Main por TestDispatcher.
 */
@OptIn(ExperimentalCoroutinesApi::class)
class RoadmapViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val fakeRepository = FakeTaskRepository()

    @Test
    fun \`ao inicializar ViewModel deve carregar tarefas e emitir estado de sucesso\`() = runTest {
        val viewModel = RoadmapViewModel(taskRepository = fakeRepository)

        viewModel.uiState.test {
            // Estado inicial pode ser loading
            val firstState = awaitItem()
            
            // Estado após carregamento das tarefas
            val loadedState = if (firstState.isLoading) awaitItem() else firstState

            assertFalse(loadedState.isLoading)
            assertEquals(4, loadedState.allTasks.size)
            assertEquals(1, loadedState.completedCount)
        }
    }

    @Test
    fun \`ao filtrar por fase FUNDACAO deve atualizar lista filtrada no StateFlow\`() = runTest {
        val viewModel = RoadmapViewModel(taskRepository = fakeRepository)

        viewModel.uiState.test {
            awaitItem() // Skip initial state

            viewModel.handleIntent(RoadmapUiIntent.SelectPhase(TaskPhase.FUNDACAO))

            val filteredState = awaitItem()
            assertEquals(TaskPhase.FUNDACAO, filteredState.selectedPhase)
            assertTrue(filteredState.filteredTasks.all { it.phase == TaskPhase.FUNDACAO })
        }
    }
}`}</pre>
              )}

              {activeCodeTab === 'dao' && (
                <pre>{`package com.prumo.app.data.local.dao

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prumo.app.data.local.PrumoDatabase
import com.prumo.app.data.local.entity.TaskEntity
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Teste de Integração com Room Database SQLite In-Memory.
 * Roda no ambiente AndroidX Test sem salvar arquivos no disco físico.
 */
@RunWith(AndroidJUnit4::class)
class TaskDaoTest {

    private lateinit var database: PrumoDatabase
    private lateinit var taskDao: TaskDao

    @Before
    fun createDb() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(context, PrumoDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        taskDao = database.taskDao()
    }

    @After
    fun closeDb() {
        database.close()
    }

    @Test
    fun \`deve inserir tarefas e observar pelo Flow com ordenacao correta\`() = runTest {
        val task1 = TaskEntity(id = "t1", phase = TaskPhase.FUNDACAO, title = "Tarefa 1", description = "", durationMinutes = 15, status = TaskStatus.PENDING, whatToDo = "")
        val task2 = TaskEntity(id = "t2", phase = TaskPhase.MARKETING, title = "Tarefa 2", description = "", durationMinutes = 20, status = TaskStatus.PENDING, whatToDo = "")

        taskDao.insertTasks(listOf(task1, task2))

        val tasksFromDb = taskDao.observeAllTasks().first()
        assertEquals(2, tasksFromDb.size)
        assertEquals("t1", tasksFromDb[0].id)
    }

    @Test
    fun \`deve atualizar status da tarefa para COMPLETED\`() = runTest {
        val task = TaskEntity(id = "t1", phase = TaskPhase.FUNDACAO, title = "Tarefa 1", description = "", durationMinutes = 15, status = TaskStatus.PENDING, whatToDo = "")
        taskDao.insertTask(task)

        taskDao.updateTaskStatus("t1", TaskStatus.COMPLETED)

        val updated = taskDao.getTaskById("t1")
        assertNotNull(updated)
        assertEquals(TaskStatus.COMPLETED, updated?.status)
    }
}`}</pre>
              )}

              {activeCodeTab === 'compose' && (
                <pre>{`package com.prumo.app.presentation.roadmap

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.ui.theme.PrumoTheme
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

/**
 * Teste de UI declarativo com Compose Test Rule.
 * Valida a renderização semântica de nós de texto, tags de teste e cliques de botões.
 */
class RoadmapScreenComposeTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun \`deve renderizar o card da tarefa com titulo e tempo estimado\`() {
        val sampleTask = Task(
            id = "t1",
            phase = TaskPhase.FUNDACAO,
            title = "Definir sua promessa em 1 frase",
            description = "Clareza total sobre o que você vende",
            durationMinutes = 15,
            status = TaskStatus.PENDING,
            whatToDo = "Escreva sua promessa no papel",
            howToKnowItIsGood = listOf("Qualquer pessoa entende em 5 segundos"),
            resources = listOf("Guia de Posicionamento"),
            notes = "",
            isLocked = false
        )

        composeTestRule.setContent {
            PrumoTheme {
                TaskCard(
                    task = sampleTask,
                    onToggle = {},
                    onDetails = {}
                )
            }
        }

        // Asserções semânticas do Compose
        composeTestRule.onNodeWithText("Definir sua promessa em 1 frase")
            .assertIsDisplayed()

        composeTestRule.onNodeWithText("15 min")
            .assertIsDisplayed()
    }

    @Test
    fun \`ao clicar no botao de concluir deve invocar o callback onToggle\`() {
        var clicked = false
        val sampleTask = Task(
            id = "t1",
            phase = TaskPhase.FUNDACAO,
            title = "Test Task",
            description = "",
            durationMinutes = 10,
            status = TaskStatus.PENDING,
            whatToDo = ""
        )

        composeTestRule.setContent {
            PrumoTheme {
                TaskCard(
                    task = sampleTask,
                    onToggle = { clicked = true },
                    onDetails = {}
                )
            }
        }

        composeTestRule.onNodeWithContentDescription("Concluir tarefa")
            .performClick()

        assertTrue(clicked)
    }
}`}</pre>
              )}

              {activeCodeTab === 'fake' && (
                <pre>{`package com.prumo.app.testutil

import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.domain.repository.TaskRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Fake Test Double para substituir o TaskRepository real em testes de ViewModel.
 * Mantém o estado em memória e evita dependências de rede ou SQLite durante testes unitários.
 */
class FakeTaskRepository : TaskRepository {

    private val tasks = MutableStateFlow(
        listOf(
            Task(id = "t1", phase = TaskPhase.FUNDACAO, title = "Definir promessa", description = "", durationMinutes = 15, status = TaskStatus.COMPLETED, whatToDo = ""),
            Task(id = "t2", phase = TaskPhase.FUNDACAO, title = "Criar MVP", description = "", durationMinutes = 20, status = TaskStatus.PENDING, whatToDo = ""),
            Task(id = "t3", phase = TaskPhase.FUNDACAO, title = "Validar com 3 pessoas", description = "", durationMinutes = 30, status = TaskStatus.PENDING, whatToDo = ""),
            Task(id = "t4", phase = TaskPhase.MARKETING, title = "Configurar bio", description = "", durationMinutes = 10, status = TaskStatus.PENDING, whatToDo = "")
        )
    )

    override fun getAllTasks(): Flow<List<Task>> = tasks.asStateFlow()

    override suspend fun toggleTaskStatus(taskId: String) {
        val currentList = tasks.value
        val updated = currentList.map { task ->
            if (task.id == taskId) {
                val nextStatus = if (task.status == TaskStatus.COMPLETED) TaskStatus.PENDING else TaskStatus.COMPLETED
                task.copy(status = nextStatus)
            } else task
        }
        tasks.value = updated
    }
}`}</pre>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Boas Práticas e Checklist */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Principais Dicas de Testes no Android */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1D1B] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1F6F5C]" />
              Boas Práticas de Testes no Android
            </h3>
            <div className="space-y-2.5 text-xs text-[#5B615D]">
              <p>
                <strong className="text-[#1A1D1B]">1. Fakes em vez de Mocks excessivos:</strong> Criar classes <code>FakeTaskRepository</code> em memória reduz acoplamento e torna os testes 5x mais fáceis de manter do que mockar cada chamada com MockK.
              </p>
              <p>
                <strong className="text-[#1A1D1B]">2. Teste semântico no Compose:</strong> Teste o que o usuário enxerga e faz (textos, acessibilidade, content descriptions) em vez de testar funções internas do Composable.
              </p>
              <p>
                <strong className="text-[#1A1D1B]">3. MainDispatcherRule para Coroutines:</strong> Em testes unitários na JVM, o <code>Dispatchers.Main</code> não existe por padrão. A regra substitui o dispatcher por <code>StandardTestDispatcher</code>.
              </p>
            </div>
          </div>

          {/* Checklist da Etapa 7 */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] mb-4">
              <h3 className="text-sm font-bold text-[#1A1D1B]">
                Checklist da Etapa 7
              </h3>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 6 Concluídos
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'unitTestingDependencies' as const, label: 'Dependências de Teste (JUnit, Turbine, MockK) no Gradle' },
                { key: 'tddWorkflowEstablished' as const, label: 'Ciclo TDD (Red, Green, Refactor) nos Casos de Uso' },
                { key: 'viewmodelCoroutinesTest' as const, label: 'Testes de ViewModel com Coroutines Test e Turbine' },
                { key: 'roomInMemoryDaoTest' as const, label: 'Testes de DAOs com Room In-Memory Database' },
                { key: 'composeTestRuleSemantics' as const, label: 'Testes de UI no Compose com createComposeRule()' },
                { key: 'fakeRepositoriesTestDoubles' as const, label: 'Fakes e Test Doubles isolando as camadas' }
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

            <div className="mt-5 pt-4 border-t border-[#E6E8E6] space-y-2">
              <button
                onClick={onOpenCodeViewer}
                className="w-full py-2.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FolderTree className="w-3.5 h-3.5" />
                Explorar Arquivos de Teste no Code Viewer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
