import React, { useState } from 'react';
import { 
  Cpu, 
  Workflow, 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  FolderTree, 
  ArrowRight, 
  ArrowDown, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  CheckSquare, 
  Square,
  Zap,
  Layers,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const Step4StateManagementGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'stateflow' | 'livedata'>('stateflow');

  // Interactive UDF Sandbox State
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Definir sua promessa em 1 frase', completed: true, phase: 'Fundação', duration: 15 },
    { id: 't2', title: 'Criar sua versão mínima entregável', completed: false, phase: 'Fundação', duration: 20 },
    { id: 't3', title: 'Validar com 3 pessoas reais', completed: false, phase: 'Fundação', duration: 30 }
  ]);
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string | null>(null);
  const [eventLogs, setEventLogs] = useState<Array<{ time: string; type: 'event' | 'vm' | 'state' | 'effect'; message: string }>>([
    { time: '10:00:01', type: 'state', message: 'UiState inicial emitido: 1 de 3 tarefas concluídas (33%)' }
  ]);

  // Checklist da Etapa 4
  const [checklist, setChecklist] = useState({
    udfPatternImplemented: true,
    stateHoistingApplied: true,
    immutableUiStateDefined: true,
    viewModelDecoupled: true,
    sideEffectsHandled: true,
    previewWithoutMockVm: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-4.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const logAction = (type: 'event' | 'vm' | 'state' | 'effect', message: string) => {
    const time = new Date().toLocaleTimeString();
    setEventLogs(prev => [{ time, type, message }, ...prev.slice(0, 5)]);
  };

  const handleToggleTask = (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    const willComplete = targetTask ? !targetTask.completed : false;

    // 1. Evento disparado pela UI
    logAction('event', `UI disparou: RoadmapUiEvent.OnToggleTask("${taskId}")`);

    // 2. ViewModel processa regra de negócio
    setTimeout(() => {
      logAction('vm', `ViewModel processou: taskRepository.toggleTaskStatus("${taskId}")`);

      setTasks(prev => prev.map(t => {
        if (t.id === taskId) return { ...t, completed: willComplete };
        return t;
      }));

      // Se concluiu, dispara efeito de celebração
      if (willComplete) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        logAction('effect', `UiEffect emitido via Channel: ShowCelebrationConfetti! 🎉`);
      }

      // 3. Novo estado imutável
      const newCompleted = tasks.filter(t => t.id === taskId ? willComplete : t.completed).length;
      const percent = Math.round((newCompleted / tasks.length) * 100);
      logAction('state', `Novo UiState emitido: ${newCompleted} de ${tasks.length} concluídas (${percent}%)`);
    }, 150);
  };

  const handleFilterPhase = (phase: string | null) => {
    logAction('event', `UI disparou: RoadmapUiEvent.OnFilterPhase(${phase ? `"${phase}"` : 'null'})`);
    setSelectedPhaseFilter(phase);
    logAction('state', `UiState atualizado: selectedPhase = ${phase || 'Todas'}`);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  const filteredTasks = selectedPhaseFilter 
    ? tasks.filter(t => t.phase === selectedPhaseFilter)
    : tasks;

  return (
    <div className="space-y-6">
      {/* Banner Principal da Etapa 4 */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#123e33] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 4: Gerenciamento de Estado &amp; Separação de Lógica
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            ViewModel, LiveData e StateFlow no Jetpack Compose
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Aprenda a arquitetura oficial do Android para separar com perfeição a <strong className="text-white">lógica de negócio</strong> da 
            <strong className="text-white"> camada de interface</strong> utilizando <strong>Unidirectional Data Flow (UDF)</strong> e <strong>State Hoisting</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Projeto Atualizado (Etapas 1 a 4)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Ver Código do ViewModel &amp; UiState
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-Etapas1-4.zip</strong> baixado!
            </div>
          )}
        </div>
      </div>

      {/* Grid: Conceito UDF + Simulador de Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">

          {/* SEÇÃO 1: O QUE É UNIDIRECTIONAL DATA FLOW (UDF) & STATE HOISTING */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <Workflow className="w-5 h-5 text-[#1F6F5C]" />
              <h3 className="text-base font-bold text-[#1A1D1B]">
                O Ciclo Unidirectional Data Flow (UDF) no Compose
              </h3>
            </div>

            <p className="text-xs text-[#5B615D] mb-4 leading-relaxed">
              No Jetpack Compose, o estado <strong>flui para baixo</strong> (do ViewModel para a View) e os eventos <strong>fluem para cima</strong> (da View para o ViewModel). 
              A UI nunca sabe como uma tarefa é salva no banco ou na rede; ela apenas comunica a intenção do usuário:
            </p>

            {/* Diagrama Visual UDF */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E6E8E6] text-center shadow-2xs">
                <span className="text-[10px] font-bold text-[#5B615D] uppercase tracking-wider block mb-1">1. Interface (Compose)</span>
                <strong className="text-xs text-[#1A1D1B] block">Stateless Composable</strong>
                <p className="text-[11px] text-[#5B615D] mt-1">Dispara <code>UiEvent.OnToggleTask</code> ao toque do usuário.</p>
              </div>

              <div className="p-3 bg-[#E3F2ED] rounded-lg border border-[#1F6F5C]/30 text-center shadow-2xs flex flex-col justify-center">
                <span className="text-[10px] font-bold text-[#1F6F5C] uppercase tracking-wider block mb-1">2. Lógica (AndroidX)</span>
                <strong className="text-xs text-[#1F6F5C] block">RoadmapViewModel</strong>
                <p className="text-[11px] text-[#1F6F5C] mt-1">Executa o repositório e emite novo estado imutável via <code>StateFlow</code> ou <code>LiveData</code>.</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#E6E8E6] text-center shadow-2xs">
                <span className="text-[10px] font-bold text-[#3BAA6B] uppercase tracking-wider block mb-1">3. Renderização</span>
                <strong className="text-xs text-[#1A1D1B] block">Recomposição Cirúrgica</strong>
                <p className="text-[11px] text-[#5B615D] mt-1">O Compose detecta apenas as propriedades alteradas e redesenha a tela.</p>
              </div>
            </div>

            {/* Regras Práticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <strong className="text-[#1F6F5C] block mb-1">✅ Na Camada de UI (Composables):</strong>
                <ul className="space-y-1 text-[#1A1D1B] text-[11px]">
                  <li>• Apenas exibe o <code>UiState</code> recebido por parâmetro.</li>
                  <li>• Repassa cliques através de lambdas (ex: <code>onEvent: (UiEvent) -&gt; Unit</code>).</li>
                  <li>• 100% Stateless: pode ser testado no <code>@Preview</code> sem emulador.</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <strong className="text-rose-800 block mb-1">❌ O que NUNCA fazer na UI:</strong>
                <ul className="space-y-1 text-rose-950 text-[11px]">
                  <li>• Nunca fazer chamadas a bancos ou APIs dentro de um Composable.</li>
                  <li>• Nunca instanciar repositórios dentro da árvore de UI.</li>
                  <li>• Nunca mutar estados de outros componentes diretamente.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: SIMULADOR INTERATIVO DE UDF COM LOGS EM TEMPO REAL */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Simulador de UDF em Tempo Real
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
                Interactive State Sandbox
              </span>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              Clique nas tarefas ou altere os filtros abaixo para ver exatamente como a UI dispara eventos e como o ViewModel responde gerando novos estados imutáveis:
            </p>

            {/* Card de Progresso da UI */}
            <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1A1D1B]">UiState: Progresso Total</span>
                <span className="text-xs font-bold text-[#1F6F5C]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#E6E8E6] h-2.5 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-[#1F6F5C] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#5B615D]">
                <span>{completedCount} de {tasks.length} tarefas concluídas</span>
                <span>Filtro ativo: {selectedPhaseFilter || 'Todas'}</span>
              </div>
            </div>

            {/* Filtros da UI */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleFilterPhase(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedPhaseFilter === null
                    ? 'bg-[#1F6F5C] text-white'
                    : 'bg-white border border-[#E6E8E6] text-[#5B615D]'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => handleFilterPhase('Fundação')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedPhaseFilter === 'Fundação'
                    ? 'bg-[#1F6F5C] text-white'
                    : 'bg-white border border-[#E6E8E6] text-[#5B615D]'
                }`}
              >
                Fundação
              </button>
            </div>

            {/* Lista de Tarefas Interativas */}
            <div className="space-y-2 mb-4">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed 
                      ? 'bg-emerald-50/60 border-emerald-200' 
                      : 'bg-white border-[#E6E8E6] hover:border-[#1F6F5C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-[#1F6F5C]">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#3BAA6B]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#5B615D]" />
                      )}
                    </button>
                    <div>
                      <strong className={`text-xs block ${task.completed ? 'line-through text-[#5B615D]' : 'text-[#1A1D1B]'}`}>
                        {task.title}
                      </strong>
                      <span className="text-[10px] text-[#5B615D]">{task.duration} min • {task.phase}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#1F6F5C] font-semibold bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                    {task.completed ? 'Concluída' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>

            {/* Console de Eventos UDF */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B615D] block mb-1">
                Log do Fluxo UDF (Últimos Eventos Processados):
              </span>
              <div className="bg-[#1A1D1B] text-neutral-300 p-3 rounded-xl font-mono text-[11px] max-h-36 overflow-y-auto space-y-1">
                {eventLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-neutral-500 shrink-0">{log.time}</span>
                    <span className={`shrink-0 font-bold ${
                      log.type === 'event' ? 'text-amber-400' :
                      log.type === 'vm' ? 'text-blue-400' :
                      log.type === 'effect' ? 'text-purple-400' :
                      'text-emerald-400'
                    }`}>
                      [{log.type.toUpperCase()}]
                    </span>
                    <span className="text-neutral-200">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: STATEFLOW VS LIVEDATA NO COMPOSE */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  StateFlow vs LiveData no Jetpack Compose
                </h3>
              </div>

              {/* Seletor StateFlow / LiveData */}
              <div className="flex items-center gap-1 bg-[#F7F9F8] p-1 rounded-lg border border-[#E6E8E6]">
                <button
                  onClick={() => setActiveCodeTab('stateflow')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                    activeCodeTab === 'stateflow' ? 'bg-[#1F6F5C] text-white shadow-xs' : 'text-[#5B615D]'
                  }`}
                >
                  StateFlow (Moderno)
                </button>
                <button
                  onClick={() => setActiveCodeTab('livedata')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                    activeCodeTab === 'livedata' ? 'bg-[#1F6F5C] text-white shadow-xs' : 'text-[#5B615D]'
                  }`}
                >
                  LiveData (Clássico)
                </button>
              </div>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              {activeCodeTab === 'stateflow' ? (
                <span>
                  <strong>StateFlow (Recomendado pela Google):</strong> Baseado em Kotlin Coroutines pura. 
                  No Compose, consome-se com <code className="bg-neutral-100 px-1 py-0.5 rounded text-[#1F6F5C]">collectAsStateWithLifecycle()</code>, 
                  pausando a coleta quando o app vai para segundo plano para economizar bateria e CPU.
                </span>
              ) : (
                <span>
                  <strong>LiveData:</strong> Componente histórico do Android Architecture Components. 
                  Para ser consumido no Jetpack Compose, necessita do artefato <code className="bg-neutral-100 px-1 py-0.5 rounded text-[#1F6F5C]">runtime-livedata</code> e 
                  do operador <code className="bg-neutral-100 px-1 py-0.5 rounded text-[#1F6F5C]">liveData.observeAsState()</code>.
                </span>
              )}
            </p>

            {/* Código Demonstrativo */}
            <div className="bg-[#1A1D1B] text-neutral-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              {activeCodeTab === 'stateflow' ? (
                <pre>{`// 1. No ViewModel (Kotlin Coroutines pura)
class RoadmapViewModel(private val repository: TaskRepository) : ViewModel() {
    private val _uiState = MutableStateFlow(RoadmapUiState(isLoading = true))
    val uiState: StateFlow<RoadmapUiState> = _uiState.asStateFlow()

    fun onEvent(event: RoadmapUiEvent) {
        when (event) {
            is RoadmapUiEvent.OnToggleTask -> {
                viewModelScope.launch { repository.toggleTaskStatus(event.taskId) }
            }
        }
    }
}

// 2. No Composable (Lifecycle-aware)
@Composable
fun RoadmapRoute(viewModel: RoadmapViewModel) {
    // Coleta o estado respeitando o ciclo de vida da Activity
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    RoadmapStatelessScreen(
        uiState = uiState,
        onEvent = viewModel::onEvent
    )
}`}</pre>
              ) : (
                <pre>{`// 1. No ViewModel (LiveData clássico)
class RoadmapViewModelLiveData(private val repository: TaskRepository) : ViewModel() {
    private val _uiState = MutableLiveData<RoadmapUiState>(RoadmapUiState(isLoading = true))
    val uiState: LiveData<RoadmapUiState> = _uiState

    fun onToggleTask(taskId: String) {
        viewModelScope.launch { repository.toggleTaskStatus(taskId) }
    }
}

// 2. No Composable (Usando observeAsState)
@Composable
fun RoadmapRouteLiveData(viewModel: RoadmapViewModelLiveData) {
    // Converte o LiveData em Compose State reativo
    val uiState by viewModel.uiState.observeAsState(initial = RoadmapUiState(isLoading = true))

    RoadmapStatelessScreen(
        uiState = uiState,
        onEvent = { event ->
            if (event is RoadmapUiEvent.OnToggleTask) viewModel.onToggleTask(event.taskId)
        }
    )
}`}</pre>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Regras de Arquitetura & Checklist */}
        <div className="lg:col-span-4 space-y-5">
          {/* O que é State Hoisting? */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1D1B] mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#1F6F5C]" />
              O que é State Hoisting?
            </h3>
            <p className="text-xs text-[#5B615D] mb-3 leading-relaxed">
              <strong>State Hoisting (Elevação de Estado)</strong> é o padrão de transferir o controle de estado para o chamador do Composable:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#F7F9F8] border border-[#E6E8E6] rounded-lg">
                <strong className="text-[#1F6F5C] block text-[11px]">1. Stateful Route:</strong>
                <p className="text-[#5B615D] text-[11px]">Injeta o ViewModel, escuta canais de efeitos e repassa o estado.</p>
              </div>
              <div className="p-2.5 bg-[#F7F9F8] border border-[#E6E8E6] rounded-lg">
                <strong className="text-[#1F6F5C] block text-[11px]">2. Stateless Screen:</strong>
                <p className="text-[#5B615D] text-[11px]">Não sabe quem é o ViewModel. Recebe dados e lambdas. Renderiza sem efeitos colaterais.</p>
              </div>
            </div>
          </div>

          {/* Checklist da Etapa 4 */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] mb-4">
              <h3 className="text-sm font-bold text-[#1A1D1B]">
                Checklist da Etapa 4
              </h3>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 6 Concluídos
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'udfPatternImplemented' as const, label: 'Unidirectional Data Flow (UDF) implementado' },
                { key: 'stateHoistingApplied' as const, label: 'State Hoisting separando Route de Screen' },
                { key: 'immutableUiStateDefined' as const, label: 'UiState imutável criado em data class' },
                { key: 'viewModelDecoupled' as const, label: 'ViewModel sem dependência do Android View/UI' },
                { key: 'sideEffectsHandled' as const, label: 'Efeitos únicos gerenciados via Channel' },
                { key: 'previewWithoutMockVm' as const, label: 'Composable testável no @Preview sem mock de VM' }
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
                Explorar Código das ViewModels
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
