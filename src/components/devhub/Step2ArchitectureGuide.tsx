import React, { useState } from 'react';
import { 
  Download, 
  CheckSquare, 
  Square, 
  FolderTree, 
  Network, 
  Database, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCode
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const Step2ArchitectureGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Checklist interativo da Etapa 2
  const [checklist, setChecklist] = useState({
    serializationAdded: true,
    routesCreated: true,
    navHostConfigured: true,
    bottomBarCreated: true,
    dataStoreImplemented: true,
    reposConfigured: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapa1-2.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal da Etapa 2 */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#15463a] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 2 Concluída: Arquitetura &amp; Navegação Type-Safe
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            Navegação Type-Safe, DataStore &amp; Clean Architecture
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Estruturamos as bases do fluxo do Prumo: <strong className="text-white">Navigation Compose 2.8+ com Kotlin Serialization</strong>, 
            persistência local via <strong className="text-white">DataStore Preferences</strong>, Scaffold com BottomBar Material 3 e camada de domínio desacoplada.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Projeto Atualizado (Etapas 1 e 2)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Explorar Arquivos Kotlin da Etapa 2
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-Etapa1-2.zip</strong> baixado! Já inclui toda a navegação e persistência.
            </div>
          )}
        </div>
      </div>

      {/* Grid: Pilares Técnicos da Etapa 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-5">
          {/* Pilar 1: Type-Safe Navigation */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-[#1A1D1B] flex items-center gap-2">
                <Network className="w-4 h-4 text-[#1F6F5C]" />
                Navegação Type-Safe com Kotlin Serialization
              </h3>
            </div>

            <p className="text-xs text-[#5B615D] mb-3 leading-relaxed">
              No Navigation Compose moderno (Android 2024+), eliminamos rotas em strings soltas (como <code className="bg-neutral-100 px-1 py-0.5 rounded">"task_detail/{'{id}'}"</code>). 
              Agora cada destino é uma classe ou objeto com a anotação <code className="text-[#1F6F5C] font-semibold">@Serializable</code>:
            </p>

            <div className="bg-[#1A1D1B] text-[#F7F9F8] p-3.5 rounded-xl font-mono text-xs overflow-x-auto mb-3">
              <pre>{`sealed interface PrumoRoute {
    @Serializable data object Splash : PrumoRoute
    @Serializable data object Anamnese : PrumoRoute
    @Serializable data object Home : PrumoRoute
    @Serializable data object Roadmap : PrumoRoute
    @Serializable data class Coach(val taskId: String? = null) : PrumoRoute
    @Serializable data class TaskDetail(val taskId: String) : PrumoRoute
}`}</pre>
            </div>

            <div className="p-3 rounded-lg bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 text-xs text-[#1F6F5C]">
              <strong>Benefício direto:</strong> Argumentos tipados em tempo de compilação. Para navegar: 
              <code className="block mt-1 font-mono text-[11px] bg-white/80 p-1.5 rounded text-[#1A1D1B]">
                navController.navigate(PrumoRoute.TaskDetail(taskId = "t2"))
              </code>
            </div>
          </div>

          {/* Pilar 2: Bottom Navigation Inteligente */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-[#1A1D1B] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1F6F5C]" />
                PrumoBottomBar com Visibilidade Condicional
              </h3>
            </div>

            <p className="text-xs text-[#5B615D] mb-3 leading-relaxed">
              Conforme definido no documento de produto do Prumo, o usuário nunca deve se distrair durante fluxos de entrada (Onboarding, Anamnese) ou foco (Detalhe da Tarefa).
              A barra inferior Material 3 possui animação de recolhimento automático:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <strong className="text-[#1F6F5C] block mb-1">Visível nas 4 Abas:</strong>
                <ul className="space-y-1 text-[#1A1D1B]">
                  <li>• <strong>Início</strong> (Dashboard &amp; Próximo Passo)</li>
                  <li>• <strong>Roteiro</strong> (Todo-List por fases)</li>
                  <li>• <strong>Coach</strong> (Chat com IA contextual)</li>
                  <li>• <strong>Você</strong> (Perfil e Diagnóstico)</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-neutral-100 border border-[#E6E8E6]">
                <strong className="text-[#5B615D] block mb-1">Oculta Automaticamente em:</strong>
                <ul className="space-y-1 text-[#5B615D]">
                  <li>• Splash &amp; Cadastro Leve</li>
                  <li>• Anamnese (6 seções)</li>
                  <li>• Storytelling "Calculando"</li>
                  <li>• Detalhes da Tarefa &amp; Paywall</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pilar 3: Persistência com DataStore Preferences */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-[#1A1D1B] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#1F6F5C]" />
                Persistência Reativa com DataStore Preferences
              </h3>
            </div>

            <p className="text-xs text-[#5B615D] mb-3 leading-relaxed">
              Substituindo o antigo SharedPreferences, o <code className="text-[#1F6F5C] font-semibold">PrumoPreferencesDataSource</code> emite 
              um <code className="text-[#1F6F5C]">Flow&lt;UserSession&gt;</code> contínuo:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#1A1D1B]">
              <div className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <span className="font-semibold block text-[#1F6F5C]">isOnboardingCompleted</span>
                <span className="text-[11px] text-[#5B615D]">Decide se abre direto a Home ou o Splash.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <span className="font-semibold block text-[#1F6F5C]">coachMessagesUsed</span>
                <span className="text-[11px] text-[#5B615D]">Controla a cota de 3 msgs do plano Free.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6]">
                <span className="font-semibold block text-[#1F6F5C]">currentTaskId</span>
                <span className="text-[11px] text-[#5B615D]">Injeta a tarefa atual no prompt do Coach.</span>
              </div>
            </div>
          </div>

          {/* Pilar 4: Clean Architecture */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-base font-bold text-[#1A1D1B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1F6F5C]" />
                Camadas Desacopladas (Clean Architecture)
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] shrink-0 mt-0.5">PRESENTATION</span>
                <div>
                  <strong className="text-[#1A1D1B]">Compose Screens + ViewModels</strong>
                  <p className="text-[#5B615D] text-[11px] mt-0.5">Observam StateFlows imutáveis (<code className="text-[#1F6F5C]">MainUiState</code>) e disparam eventos da UI.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0 mt-0.5">DOMAIN</span>
                <div>
                  <strong className="text-[#1A1D1B]">Modelos Puros e Contratos de Repositório</strong>
                  <p className="text-[#5B615D] text-[11px] mt-0.5"><code className="text-[#1F6F5C]">Task</code>, <code className="text-[#1F6F5C]">UserSession</code>, <code className="text-[#1F6F5C]">UserRepository</code> sem nenhuma dependência do Android SDK.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F9F8] border border-[#E6E8E6] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] shrink-0 mt-0.5">DATA</span>
                <div>
                  <strong className="text-[#1A1D1B]">DataSources e Repositórios Concretos</strong>
                  <p className="text-[#5B615D] text-[11px] mt-0.5"><code className="text-[#1F6F5C]">PrumoPreferencesDataSource</code> e <code className="text-[#1F6F5C]">TaskRepositoryImpl</code> com atualização otimista.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Checklist e Resumo */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] mb-4">
              <h3 className="text-sm font-bold text-[#1A1D1B]">
                Checklist da Etapa 2
              </h3>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 6 Concluídos
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'serializationAdded' as const, label: 'Plugin kotlinx.serialization adicionado' },
                { key: 'routesCreated' as const, label: 'PrumoDestinations.kt com rotas @Serializable' },
                { key: 'navHostConfigured' as const, label: 'PrumoNavHost com transições suaves animadas' },
                { key: 'bottomBarCreated' as const, label: 'PrumoBottomBar com visibilidade automática' },
                { key: 'dataStoreImplemented' as const, label: 'DataStore Preferences para UserSession' },
                { key: 'reposConfigured' as const, label: 'TaskRepository & UserRepository configurados' }
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
                <FileCode className="w-3.5 h-3.5" />
                Ver Código das Rotas e DataStore
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#E3F2ED]/60 border border-[#1F6F5C]/20 text-[11px] text-[#1F6F5C]">
              <strong>Pronto para a Etapa 3:</strong> Com a navegação e o repositório estabelecidos, a próxima etapa implementará as telas do 
              <strong> Onboarding e da Anamnese Adaptativa em 6 Blocos</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
