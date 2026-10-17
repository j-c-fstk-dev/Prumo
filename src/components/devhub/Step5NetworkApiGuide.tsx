import React, { useState } from 'react';
import { 
  Globe, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  FolderTree, 
  ArrowRight, 
  AlertTriangle, 
  WifiOff, 
  Check, 
  Code2, 
  Layers, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  Play
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const Step5NetworkApiGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Network Simulator State
  const [selectedEndpoint, setSelectedEndpoint] = useState<'tasks' | 'diagnosis' | 'coach'>('tasks');
  const [simulationMode, setSimulationMode] = useState<'success' | 'api_error' | 'timeout'>('success');
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>({
    status: 200,
    timeMs: 142,
    rawJson: `[
  {
    "id": "t1",
    "phase": "fundacao",
    "title": "Definir sua promessa em 1 frase",
    "description": "Escreva o que você ajuda a resolver de forma clara.",
    "duration_min": 15,
    "status": "completed",
    "what_to_do": "Complete a fórmula: Eu ajudo [Público] a alcançar [Resultado]..."
  },
  {
    "id": "t2",
    "phase": "fundacao",
    "title": "Criar sua versão mínima entregável",
    "description": "O menor entregável possível para testar.",
    "duration_min": 20,
    "status": "pending",
    "what_to_do": "Monte um PDF, checklist no Notion ou vídeo curto de 10 min..."
  }
]`,
    mappedDomain: `NetworkResult.Success(
  data = listOf(
    Task(id = "t1", phase = TaskPhase.FUNDACAO, title = "Definir sua promessa", status = TaskStatus.COMPLETED),
    Task(id = "t2", phase = TaskPhase.FUNDACAO, title = "Criar versão mínima", status = TaskStatus.PENDING)
  )
)`
  });

  // Checklist da Etapa 5
  const [checklist, setChecklist] = useState({
    retrofitOkHttpConfigured: true,
    serializationConverterAdded: true,
    suspendFunctionsDefined: true,
    dtosAndMappersCreated: true,
    networkResultSealedClass: true,
    dispatchersIoUsed: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-5.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const executeApiSimulation = (endpoint: 'tasks' | 'diagnosis' | 'coach', mode: 'success' | 'api_error' | 'timeout') => {
    setIsLoadingApi(true);
    setSelectedEndpoint(endpoint);
    setSimulationMode(mode);

    setTimeout(() => {
      setIsLoadingApi(false);
      if (mode === 'timeout') {
        setApiResponse({
          status: 0,
          timeMs: 15000,
          rawJson: `java.net.SocketTimeoutException: failed to connect to api.prumo.app after 15000ms`,
          mappedDomain: `NetworkResult.Exception(
  throwable = SocketTimeoutException("Tempo limite excedido. Verifique sua conexão.")
)`
        });
        return;
      }

      if (mode === 'api_error') {
        setApiResponse({
          status: 422,
          timeMs: 230,
          rawJson: `{\n  "error_code": "UNPROCESSABLE_ENTITY",\n  "message": "Faltam respostas obrigatórias na seção de Habilidades.",\n  "missing_fields": ["q1_help"]\n}`,
          mappedDomain: `NetworkResult.Error(
  code = 422,
  message = "Faltam respostas obrigatórias na seção de Habilidades."
)`
        });
        return;
      }

      // Success responses
      if (endpoint === 'tasks') {
        setApiResponse({
          status: 200,
          timeMs: 120,
          rawJson: `[\n  {\n    "id": "t1",\n    "phase": "fundacao",\n    "title": "Definir sua promessa em 1 frase",\n    "duration_min": 15,\n    "status": "completed"\n  },\n  {\n    "id": "t2",\n    "phase": "fundacao",\n    "title": "Criar sua versão mínima entregável",\n    "duration_min": 20,\n    "status": "pending"\n  }\n]`,
          mappedDomain: `NetworkResult.Success(
  data = listOf(
    Task(id = "t1", phase = TaskPhase.FUNDACAO, title = "Definir sua promessa", status = TaskStatus.COMPLETED),
    Task(id = "t2", phase = TaskPhase.FUNDACAO, title = "Criar versão mínima", status = TaskStatus.PENDING)
  )
)`
        });
      } else if (endpoint === 'diagnosis') {
        setApiResponse({
          status: 200,
          timeMs: 340,
          rawJson: `{\n  "niche": "Produtividade para Freelancers",\n  "product": "Mini-curso + Template Notion",\n  "audience": "Profissionais autônomos iniciantes",\n  "channel": "Instagram e WhatsApp 1 a 1",\n  "timeline": "60 dias",\n  "justification": "Você indicou que gosta de ensinar e tem 1h livre por noite."\n}`,
          mappedDomain: `NetworkResult.Success(
  data = ProfileDiagnosis(
    niche = "Produtividade para Freelancers",
    product = "Mini-curso + Template Notion",
    timeline = "60 dias"
  )
)`
        });
      } else {
        setApiResponse({
          status: 200,
          timeMs: 410,
          rawJson: `{\n  "reply": "Comece convidando 3 pessoas que já te pediram conselhos para avaliar seu roteiro sem compromisso.",\n  "suggested_actions": ["Ajustar abordagem", "Dividir em passos menores"],\n  "remaining_free_messages": 2\n}`,
          mappedDomain: `NetworkResult.Success(
  data = CoachMessage(
    reply = "Comece convidando 3 pessoas...",
    remainingMessages = 2
  )
)`
        });
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal da Etapa 5 */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#113a2f] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 5: Consumo de APIs &amp; Camada de Rede
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            Retrofit 2 &amp; Kotlin Serialization no Android
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Aprenda como estruturar a camada de rede do <strong className="text-white">Prumo</strong>: 
            configuração do <strong>OkHttpClient</strong> com timeouts e interceptors, serialização com o conversor oficial do 
            <strong> Kotlinx Serialization</strong>, DTOs desacoplados do domínio e chamadas assíncronas com <strong>Coroutines</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Projeto com Camada de Rede (.zip)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Ver Código do Retrofit &amp; DTOs
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-Etapas1-5.zip</strong> baixado!
            </div>
          )}
        </div>
      </div>

      {/* Grid: Arquitetura de Rede + Simulador Interativo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">

          {/* SEÇÃO 1: ARQUITETURA DA CAMADA DE REDE EM 4 NÍVEIS */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <Globe className="w-5 h-5 text-[#1F6F5C]" />
              <h3 className="text-base font-bold text-[#1A1D1B]">
                Arquitetura da Camada de Rede (Clean Architecture)
              </h3>
            </div>

            <p className="text-xs text-[#5B615D] mb-4 leading-relaxed">
              Para isolar a aplicação de instabilidades ou mudanças na estrutura do backend, a requisição passa por 4 camadas de proteção:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">1</span>
                  <strong className="text-xs text-[#1A1D1B]">OkHttpClient &amp; Interceptors</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Timeouts de 15s, headers padrão (<code>Accept: application/json</code>) e <code>HttpLoggingInterceptor</code> para debug de requisições.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">2</span>
                  <strong className="text-xs text-[#1A1D1B]">Retrofit 2 &amp; Serialization</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Conversor oficial do Kotlinx Serialization com <code>ignoreUnknownKeys = true</code> para não quebrar com novos campos no JSON.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">3</span>
                  <strong className="text-xs text-[#1A1D1B]">DTOs &amp; Mappers</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Data Transfer Objects com <code>@SerialName</code> mapeados para modelos de domínio puros (ex: <code>TaskDto.toDomain()</code>).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">4</span>
                  <strong className="text-xs text-[#1A1D1B]">NetworkResult &amp; Coroutines</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Execução com <code>Dispatchers.IO</code> encapsulada no sealed wrapper <code>Success</code>, <code>Error</code> e <code>Exception</code>.
                </p>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: SIMULADOR INTERATIVO DE API & RESPOSTA JSON */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Simulador de Chamadas Retrofit em Tempo Real
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
                Interactive Network Sandbox
              </span>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              Selecione o endpoint e o cenário de resposta para ver como o Retrofit deserializa o JSON no DTO e como o repositório mapeia para o Domínio:
            </p>

            {/* Controles do Simulador */}
            <div className="flex flex-col sm:flex-row gap-3 p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-[#5B615D] uppercase tracking-wider block mb-1.5">
                  Endpoint da API
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { id: 'tasks' as const, label: 'GET /roadmap/tasks' },
                    { id: 'diagnosis' as const, label: 'POST /diagnosis/calculate' },
                    { id: 'coach' as const, label: 'POST /coach/message' }
                  ].map(ep => (
                    <button
                      key={ep.id}
                      onClick={() => executeApiSimulation(ep.id, simulationMode)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                        selectedEndpoint === ep.id
                          ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                          : 'bg-white border border-[#E6E8E6] text-[#5B615D] hover:bg-neutral-100'
                      }`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5B615D] uppercase tracking-wider block mb-1.5">
                  Cenário de Resposta
                </label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => executeApiSimulation(selectedEndpoint, 'success')}
                    className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                      simulationMode === 'success'
                        ? 'bg-[#3BAA6B] text-white font-semibold'
                        : 'bg-white border border-[#E6E8E6] text-[#5B615D]'
                    }`}
                  >
                    200 Sucesso
                  </button>
                  <button
                    onClick={() => executeApiSimulation(selectedEndpoint, 'api_error')}
                    className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                      simulationMode === 'api_error'
                        ? 'bg-[#E0A800] text-white font-semibold'
                        : 'bg-white border border-[#E6E8E6] text-[#5B615D]'
                    }`}
                  >
                    422 Erro
                  </button>
                  <button
                    onClick={() => executeApiSimulation(selectedEndpoint, 'timeout')}
                    className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                      simulationMode === 'timeout'
                        ? 'bg-[#D64545] text-white font-semibold'
                        : 'bg-white border border-[#E6E8E6] text-[#5B615D]'
                    }`}
                  >
                    Timeout
                  </button>
                </div>
              </div>
            </div>

            {/* Status da Requisição */}
            <div className="flex items-center justify-between text-xs px-2 mb-2 font-mono">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  simulationMode === 'success' ? 'bg-[#3BAA6B]' :
                  simulationMode === 'api_error' ? 'bg-[#E0A800]' : 'bg-[#D64545]'
                }`} />
                <span className="font-bold text-[#1A1D1B]">
                  Status: {apiResponse.status === 0 ? 'Timeout (Falha de Rede)' : `${apiResponse.status}`}
                </span>
                <span className="text-[#5B615D]">({apiResponse.timeMs}ms)</span>
              </div>
              <span className="text-[11px] text-[#5B615D]">Dispatchers.IO</span>
            </div>

            {/* Visualizador de Resposta Dupla: JSON Bruto vs Domain Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Painel Esquerdo: JSON Recebido da Rede */}
              <div className="bg-[#1A1D1B] rounded-xl p-3.5 text-neutral-200 font-mono text-xs overflow-x-auto border border-neutral-800">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-2">
                  1. JSON Bruto da API (Wire Format)
                </span>
                <pre className="text-[11px] leading-relaxed max-h-56 overflow-y-auto">
                  <code>{apiResponse.rawJson}</code>
                </pre>
              </div>

              {/* Painel Direito: Mapeamento para Domain Model */}
              <div className="bg-[#162722] rounded-xl p-3.5 text-emerald-200 font-mono text-xs overflow-x-auto border border-emerald-900/50">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-2">
                  2. Mapeado para Domain Model (toDomain)
                </span>
                <pre className="text-[11px] leading-relaxed max-h-56 overflow-y-auto">
                  <code>{apiResponse.mappedDomain}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: CÓDIGO DA INTERFACE RETROFIT E DTO */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-base font-bold text-[#1A1D1B] mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1F6F5C]" />
              Implementação da Interface Retrofit (PrumoApiService.kt)
            </h3>

            <p className="text-xs text-[#5B615D] mb-4">
              Definida com funções <code>suspend</code> para integração com Kotlin Coroutines sem callbacks manuais:
            </p>

            <div className="bg-[#1A1D1B] text-neutral-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{`interface PrumoApiService {

    @GET("roadmap/tasks")
    suspend fun getRoadmapTasks(): Response<List<TaskDto>>

    @POST("diagnosis/calculate")
    suspend fun calculateDiagnosis(
        @Body request: DiagnosisRequestDto
    ): Response<DiagnosisResponseDto>

    @POST("coach/message")
    suspend fun sendCoachMessage(
        @Body request: CoachRequestDto
    ): Response<CoachResponseDto>
}`}</pre>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Boas Práticas e Checklist */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Por que DTO != Domain? */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1D1B] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1F6F5C]" />
              Por que separar DTO do Modelo de Domínio?
            </h3>
            <div className="space-y-2.5 text-xs text-[#5B615D]">
              <p>
                <strong className="text-[#1A1D1B]">1. Proteção contra quebra de contrato:</strong> Se o backend mudar o nome de um campo de <code className="text-[#1F6F5C]">"duration_min"</code> para <code className="text-[#1F6F5C]">"tempo_minutos"</code>, apenas o DTO muda, sem quebrar nenhuma tela do app.
              </p>
              <p>
                <strong className="text-[#1A1D1B]">2. Tipos Ricos em Kotlin:</strong> O JSON envia strings como <code className="text-[#1F6F5C]">"fundacao"</code>. O Domínio utiliza Enums tipados e seguros (<code className="text-[#1F6F5C]">TaskPhase.FUNDACAO</code>).
              </p>
            </div>
          </div>

          {/* Checklist da Etapa 5 */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] mb-4">
              <h3 className="text-sm font-bold text-[#1A1D1B]">
                Checklist da Etapa 5
              </h3>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 6 Concluídos
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'retrofitOkHttpConfigured' as const, label: 'Retrofit e OkHttpClient configurados' },
                { key: 'serializationConverterAdded' as const, label: 'Conversor oficial Kotlinx Serialization' },
                { key: 'suspendFunctionsDefined' as const, label: 'PrumoApiService com suspend functions' },
                { key: 'dtosAndMappersCreated' as const, label: 'DTOs com @SerialName e mappers toDomain()' },
                { key: 'networkResultSealedClass' as const, label: 'NetworkResult para tratamento de erros' },
                { key: 'dispatchersIoUsed' as const, label: 'Dispatchers.IO garantindo thread não bloqueante' }
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
                Explorar Arquivos da Camada de Rede
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
