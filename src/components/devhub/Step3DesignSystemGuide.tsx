import React, { useState } from 'react';
import { 
  Palette, 
  Type as TypeIcon, 
  Layers, 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  FolderTree, 
  Sun, 
  Moon, 
  CheckCircle2, 
  CheckSquare, 
  Square,
  Sliders,
  Maximize2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const Step3DesignSystemGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Interactive component sandbox state
  const [isCardSelected, setIsCardSelected] = useState(true);
  const [sandboxProgress, setSandboxProgress] = useState(0.60);

  // Checklist
  const [checklist, setChecklist] = useState({
    colorTokensCreated: true,
    typographyConfigured: true,
    themeLightDarkCreated: true,
    shapesAndDimensSet: true,
    atomicComponentsBuilt: true,
    wcagContrastVerified: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-DesignSystem-Etapa3.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const colorTokens = [
    { name: 'PrumoPrimary600', hex: '#1F6F5C', role: 'Ações primárias, marca (verde-prumo)', bg: 'bg-[#1F6F5C]', text: 'text-white' },
    { name: 'PrumoPrimary500', hex: '#2E8B73', role: 'Hover, interações e links', bg: 'bg-[#2E8B73]', text: 'text-white' },
    { name: 'PrumoPrimary100', hex: '#E3F2ED', role: 'Fundos de destaque suave e card Próximo Passo', bg: 'bg-[#E3F2ED]', text: 'text-[#1F6F5C]' },
    { name: 'PrumoAccent500', hex: '#F2A93B', role: 'Celebração, conquistas e Fase Marketing (âmbar)', bg: 'bg-[#F2A93B]', text: 'text-[#1A1D1B]' },
    { name: 'PrumoPhaseLaunch', hex: '#7A5AF8', role: 'Fase Lançamento (violeta)', bg: 'bg-[#7A5AF8]', text: 'text-white' },
    { name: 'PrumoNeutral900', hex: '#1A1D1B', role: 'Texto principal de alto contraste', bg: 'bg-[#1A1D1B]', text: 'text-white' },
    { name: 'PrumoNeutral600', hex: '#5B615D', role: 'Texto secundário e legendas', bg: 'bg-[#5B615D]', text: 'text-white' },
    { name: 'PrumoNeutral200', hex: '#E6E8E6', role: 'Bordas e divisores', bg: 'bg-[#E6E8E6]', text: 'text-[#1A1D1B]' },
    { name: 'PrumoNeutral50', hex: '#F7F9F8', role: 'Fundo da tela claro (padrão)', bg: 'bg-[#F7F9F8]', text: 'text-[#1A1D1B]' },
    { name: 'PrumoSuccess', hex: '#3BAA6B', role: 'Tarefa concluída (verde)', bg: 'bg-[#3BAA6B]', text: 'text-white' },
    { name: 'PrumoWarning', hex: '#E0A800', role: 'Avisos e prazos vencendo (dourado)', bg: 'bg-[#E0A800]', text: 'text-white' },
    { name: 'PrumoDanger', hex: '#D64545', role: 'Erros e alertas críticos (vermelho)', bg: 'bg-[#D64545]', text: 'text-white' }
  ];

  const typographyTokens = [
    { name: 'displayLarge', size: '32sp', line: '40sp', weight: 'SemiBold (Serif)', sample: 'Você concluiu a Fundação!', desc: 'Celebrações de conquistas e títulos de resultado C1' },
    { name: 'headlineMedium', size: '24sp', line: '32sp', weight: 'SemiBold (Inter)', sample: 'O que as pessoas costumam pedir sua ajuda?', desc: 'Títulos de tela e perguntas da Anamnese (H1)' },
    { name: 'titleLarge', size: '20sp', line: '28sp', weight: 'Medium (Inter)', sample: 'Definir sua promessa em 1 frase', desc: 'Títulos de cartões de destaque e seções (H2)' },
    { name: 'titleMedium', size: '16sp', line: '24sp', weight: 'SemiBold (Inter)', sample: 'Fazer agora • 15 min', desc: 'Textos de botões e badges' },
    { name: 'bodyLarge', size: '16sp', line: '24sp', weight: 'Regular (Inter)', sample: 'Pegue o tema que você mais domina e crie o menor entregável possível.', desc: 'Corpo principal (regra do PRD: nunca menos de 16sp no mobile)' },
    { name: 'bodyMedium', size: '14sp', line: '20sp', weight: 'Regular (Inter)', sample: 'Produtividade para freelancers iniciantes', desc: 'Descrições secundárias e resumos' },
    { name: 'labelMedium', size: '13sp', line: '18sp', weight: 'Medium (Inter)', sample: 'Fundação • 60% concluído', desc: 'Legendas e metadados' },
    { name: 'labelSmall', size: '11sp', line: '16sp', weight: 'Medium (Inter)', sample: 'PRÓXIMO PASSO', desc: 'Micro labels e chips em caixa alta' }
  ];

  return (
    <div className="space-y-6">
      {/* Header do Guia da Etapa 3 */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#14473b] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 3: Design System com Jetpack Compose
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            Design System "Bússola Calma" no Jetpack Compose
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Implementação completa do sistema de design do Prumo em <strong className="text-white">Kotlin nativo</strong>: 
            paleta semântica com suporte a Dark Mode, tipografia hierárquica (Inter + Fraunces), grid de 8pt e componentes atômicos táteis.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Design System Completo (.zip)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Inspecionar Arquivos de Tema (Color, Type, Theme)
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-DesignSystem-Etapa3.zip</strong> baixado com sucesso!
            </div>
          )}
        </div>
      </div>

      {/* Grid: Cores + Tipografia + Sandbox de Componentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">

          {/* SEÇÃO 1: PALETA DE CORES E TOKENS */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Paleta de Cores e Tokens Oficiais (Color.kt)
                </h3>
              </div>
              <span className="text-[11px] text-[#5B615D] font-mono">
                WCAG AA (4.5:1)
              </span>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              O conceito visual do Prumo é a <strong>"Bússola Calma"</strong> — direção e serenidade, sem euforia exagerada de marketing. 
              Clique em qualquer cor para copiar a definição nativa em Compose:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colorTokens.map((token) => (
                <div
                  key={token.name}
                  onClick={() => copyCode(`val ${token.name} = Color(${token.hex.replace('#', '0xFF')})`, token.name)}
                  className="p-3 rounded-xl border border-[#E6E8E6] hover:border-[#1F6F5C] cursor-pointer transition-all hover:shadow-xs group"
                >
                  <div className={`h-10 w-full rounded-lg ${token.bg} mb-2 flex items-center justify-center text-xs font-mono font-medium shadow-2xs`}>
                    {copiedToken === token.name ? (
                      <span className="bg-black/60 text-white px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Copiado!
                      </span>
                    ) : (
                      <span className={`text-[11px] opacity-0 group-hover:opacity-100 transition-opacity ${token.text}`}>
                        {token.hex}
                      </span>
                    )}
                  </div>
                  <strong className="text-xs text-[#1A1D1B] block font-mono">{token.name}</strong>
                  <span className="text-[10px] text-[#5B615D] line-clamp-1 mt-0.5">{token.role}</span>
                </div>
              ))}
            </div>

            {/* Código Kotlin Color.kt */}
            <div className="mt-4 pt-3 border-t border-[#E6E8E6]">
              <span className="text-[11px] font-semibold text-[#5B615D] block mb-1">
                Trecho de implementação em <code>Color.kt</code>:
              </span>
              <div className="bg-[#1A1D1B] text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                <pre>{`// Cores da Marca e Fases
val PrumoPrimary600 = Color(0xFF1F6F5C) // Ações primárias
val PrumoPrimary100 = Color(0xFFE3F2ED) // Destaque suave
val PrumoAccent500  = Color(0xFFF2A93B) // Marketing / Celebração
val PrumoPhaseLaunch = Color(0xFF7A5AF8) // Lançamento`}</pre>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: TIPOGRAFIA EM KOTLIN */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <TypeIcon className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Escala Tipográfica (Type.kt)
                </h3>
              </div>
              <span className="text-[11px] text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full font-medium">
                Inter + Fraunces
              </span>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              <strong>Regra de ouro do PRD:</strong> o corpo de texto nunca possui menos de 16sp no mobile, prevenindo cansaço visual e zoom involuntário. 
              Para celebrações, usamos Fraunces (Serif).
            </p>

            <div className="divide-y divide-[#E6E8E6] border border-[#E6E8E6] rounded-xl overflow-hidden">
              {typographyTokens.map((type, idx) => (
                <div key={idx} className="p-3.5 bg-white hover:bg-[#F7F9F8] transition-colors">
                  <div className="flex items-center justify-between text-xs text-[#5B615D] mb-1">
                    <span className="font-mono font-semibold text-[#1F6F5C]">{type.name}</span>
                    <span className="text-[11px]">{type.size} / {type.line} &bull; {type.weight}</span>
                  </div>
                  <div className={`text-[#1A1D1B] my-1 ${type.name === 'displayLarge' ? 'font-display text-xl' : 'text-sm'}`}>
                    {type.sample}
                  </div>
                  <p className="text-[11px] text-[#5B615D]">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 3: SANDBOX INTERATIVO DE COMPONENTES */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Showcase &amp; Sandbox dos Componentes Nativo
                </h3>
              </div>

              {/* Seletor Claro / Escuro */}
              <div className="flex items-center gap-1 bg-[#F7F9F8] p-1 rounded-lg border border-[#E6E8E6]">
                <button
                  onClick={() => setPreviewTheme('light')}
                  className={`px-2.5 py-1 text-xs rounded-md flex items-center gap-1 font-medium transition-all ${
                    previewTheme === 'light' ? 'bg-white shadow-xs text-[#1F6F5C]' : 'text-[#5B615D]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Claro
                </button>
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2.5 py-1 text-xs rounded-md flex items-center gap-1 font-medium transition-all ${
                    previewTheme === 'dark' ? 'bg-[#1A1D1B] text-white shadow-xs' : 'text-[#5B615D]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Escuro
                </button>
              </div>
            </div>

            {/* Área de Visualização do Componente */}
            <div className={`p-6 rounded-2xl border transition-all ${
              previewTheme === 'light' ? 'bg-[#F7F9F8] border-[#E6E8E6]' : 'bg-[#12140F] border-neutral-800 text-white'
            }`}>
              {/* 1. Botões */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B615D] block mb-2">
                  1. Botões (PrumoPrimaryButton &amp; Secondary - 52dp / Raio 12dp)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="w-full h-[52px] bg-[#1F6F5C] hover:bg-[#2E8B73] text-white font-semibold text-sm rounded-[12px] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                    <span>PrumoPrimaryButton</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className={`w-full h-[52px] border font-semibold text-sm rounded-[12px] transition-all flex items-center justify-center gap-2 ${
                    previewTheme === 'light' ? 'bg-white border-[#E6E8E6] text-[#1A1D1B]' : 'bg-[#1C1F1A] border-neutral-700 text-white'
                  }`}>
                    <span>PrumoSecondaryButton</span>
                  </button>
                </div>
              </div>

              {/* 2. Cartão Selecionável da Anamnese */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B615D] block mb-2">
                  2. Cartão Selecionável da Anamnese (PrumoSelectableCard - Raio 16dp)
                </span>
                <div
                  onClick={() => setIsCardSelected(!isCardSelected)}
                  className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isCardSelected
                      ? previewTheme === 'light'
                        ? 'bg-[#E3F2ED] border-[#1F6F5C] text-[#1F6F5C]'
                        : 'bg-[#163C32] border-[#2E8B73] text-white'
                      : previewTheme === 'light'
                        ? 'bg-white border-[#E6E8E6] text-[#1A1D1B]'
                        : 'bg-[#1C1F1A] border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💬</span>
                    <div>
                      <strong className="text-xs block">Conselhos de vida &amp; carreira</strong>
                      <span className="text-[11px] opacity-80">Toque para selecionar / desmarcar</span>
                    </div>
                  </div>
                  {isCardSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-[#1F6F5C] dark:text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-neutral-300" />
                  )}
                </div>
              </div>

              {/* 3. Badges e Barras de Progresso por Fase */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B615D] block mb-2">
                  3. Badges de Fases e Indicador de Progresso (PrumoProgressBar)
                </span>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E3F2ED] text-[#1F6F5C] border border-[#1F6F5C]/20">
                    Fase Fundação
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3EB] text-[#F2A93B] border border-[#F2A93B]/20">
                    Fase Marketing
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F0FF] text-[#7A5AF8] border border-[#7A5AF8]/20">
                    Fase Lançamento
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progresso da Fundação</span>
                    <span className="text-[#1F6F5C] font-bold">{Math.round(sandboxProgress * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#E6E8E6] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1F6F5C] h-full rounded-full transition-all duration-300"
                      style={{ width: `${sandboxProgress * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={sandboxProgress}
                    onChange={(e) => setSandboxProgress(parseFloat(e.target.value))}
                    className="w-full accent-[#1F6F5C] cursor-pointer mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Guia de Arquitetura de Tema e Checklist */}
        <div className="lg:col-span-4 space-y-5">
          {/* Arquitetura de Pastas do Design System */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1D1B] mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1F6F5C]" />
              Estrutura do Módulo Design System
            </h3>
            <p className="text-xs text-[#5B615D] mb-3">
              Criado em <code>com.prumo.app.core.designsystem</code>:
            </p>

            <div className="bg-[#1A1D1B] text-[#F7F9F8] p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto">
              <pre>{`core/designsystem/
├── theme/
│   ├── Color.kt    # Tokens oficiais
│   ├── Type.kt     # Escala Inter/Fraunces
│   ├── Shape.kt    # Raios 16dp, 12dp, 999dp
│   ├── Dimens.kt   # Grid base 8pt
│   └── Theme.kt    # PrumoTheme (Light/Dark)
└── component/
    ├── PrumoButton.kt
    ├── PrumoCard.kt
    ├── PrumoBadge.kt
    └── PrumoProgressBar.kt`}</pre>
            </div>
          </div>

          {/* Checklist da Etapa 3 */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] mb-4">
              <h3 className="text-sm font-bold text-[#1A1D1B]">
                Checklist da Etapa 3
              </h3>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 6
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'colorTokensCreated' as const, label: 'Tokens de cor em Color.kt' },
                { key: 'typographyConfigured' as const, label: 'Tipografia com regra de 16sp no corpo' },
                { key: 'themeLightDarkCreated' as const, label: 'PrumoTheme com suporte a Dark Mode' },
                { key: 'shapesAndDimensSet' as const, label: 'Grid 8pt em Dimens.kt e Shape.kt' },
                { key: 'atomicComponentsBuilt' as const, label: 'Componentes atômicos (Button, Card, Badge)' },
                { key: 'wcagContrastVerified' as const, label: 'Contraste WCAG AA 4.5:1 verificado' }
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
                Ver Código do Design System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
