import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Code2, 
  Layers, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  Clock,
  Terminal,
  ArrowRight,
  Compass,
  Copy,
  RotateCcw,
  ExternalLink,
  Smartphone,
  Heart,
  Bookmark,
  Vibrate,
  FileCode2,
  BookOpen
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';
import confetti from 'canvas-confetti';

export const Step9NarrativeGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Simulador de Gesto de Pressão Contínua
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [ritualCompleted, setRitualCompleted] = useState(false);
  const [hapticCount, setHapticCount] = useState(0);
  const holdIntervalRef = useRef<any>(null);

  // Tabs de Código Kotlin
  const [activeCodeTab, setActiveCodeTab] = useState<'commitment' | 'letter' | 'entity' | 'signal'>('commitment');

  // Checklist interativo
  const [checklist, setChecklist] = useState({
    pointerInputGestures: true,
    animatableRadialFill: true,
    localHapticFeedback: true,
    roomFutureLetterEntity: true,
    valueSignalPrelude: true,
    openReflectionFields: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-10.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const startHold = () => {
    setIsHolding(true);
    setRitualCompleted(false);
    setHapticCount(0);
    const start = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / 2600) * 100));
      setHoldProgress(pct);
      
      // Simulação de micro-pulsos hápticos no Android
      if (pct > 0 && pct % 25 === 0) {
        setHapticCount(c => c + 1);
      }

      if (pct >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        setRitualCompleted(true);
        confetti({ particleCount: 45, spread: 75, origin: { y: 0.6 } });
      }
    }, 25);
  };

  const cancelHold = () => {
    if (holdProgress < 100) {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setIsHolding(false);
      setHoldProgress(0);
    }
  };

  const resetRitual = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
    setRitualCompleted(false);
    setHapticCount(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de Cabeçalho */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAF6F0] via-[#F4EFE6] to-[#E3F2ED] border border-[#1F6F5C]/20 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6F5C]/10 text-[#1F6F5C] text-xs font-bold mb-3">
            <Heart className="w-3.5 h-3.5 text-[#D97746]" />
            <span>Etapa 9 &bull; Conexão Emocional &bull; Jetpack Compose Gestures</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A1D1B] tracking-tight">
            Onboarding Narrativo, Ritual de Compromisso &amp; Gestos Hápticos
          </h1>

          <p className="text-xs sm:text-sm text-[#5B615D] mt-2 leading-relaxed">
            Como transformar a entrada no Prumo de um formulário burocrático em um momento solene de decisão pessoal. 
            Baseado no estudo do <strong>Fabulous</strong>: extraímos os padrões de narrativa profunda e contrato de compromisso consciente, 
            descartando a sobrecarga sensorial para preservar a serenidade e a clareza do Prumo.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Gerando pacote...' : 'Baixar Projeto Atualizado (.zip)'}</span>
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-2.5 bg-white border border-[#1F6F5C]/30 text-[#1F6F5C] hover:bg-neutral-50 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Ver Códigos no Hub</span>
            </button>

            {downloadSuccess && (
              <span className="text-xs text-[#1F6F5C] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#3BAA6B]" /> Download iniciado!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Lições do Fabulous vs Diferencial Prumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
            <span>✨ O que aprendemos com o Fabulous</span>
          </div>
          <h3 className="text-sm font-bold text-[#1A1D1B] mb-2 font-serif">
            A Psicologia do "Commitment Contract"
          </h3>
          <p className="text-xs text-[#5B615D] leading-relaxed mb-3">
            O Fabulous pede que o usuário segure o dedo na tela para assinar um contrato e abre uma carta do 
            <em> "Future Self"</em>. Isso faz a pessoa sentir o peso real da decisão, mudando a mentalidade de 
            "vou tentar um app" para "estou embarcando na minha jornada".
          </p>
          <ul className="space-y-1.5 text-xs text-[#2D3748]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3BAA6B] shrink-0 mt-0.5" />
              <span><strong>Ritual Tátil:</strong> Pressionar por 3s cria pausa e intenção consciente.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3BAA6B] shrink-0 mt-0.5" />
              <span><strong>Carta do Eu Futuro:</strong> Ancoragem em identidade, não em checkboxes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3BAA6B] shrink-0 mt-0.5" />
              <span><strong>Prelúdio de Valor:</strong> Explicar o porquê de cada pergunta antes de fazer.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#1F6F5C]/20 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1F6F5C] mb-2">
            <span>🛡️ Como o Prumo faz diferente (Sem Sobrecarga)</span>
          </div>
          <h3 className="text-sm font-bold text-[#1A1D1B] mb-2 font-serif">
            Profundidade com Disciplina de Calma
          </h3>
          <p className="text-xs text-[#5B615D] leading-relaxed mb-3">
            O Fabulous é amado pelo coração, mas criticado pelo excesso de ruído visual, dezenas de pop-ups e paywalls agressivos. 
            No Prumo, mantemos a serenidade do design nórdico/editorial: uma decisão por tela, tipografia nobre e zero dark patterns.
          </p>
          <ul className="space-y-1.5 text-xs text-[#2D3748]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6F5C] shrink-0 mt-0.5" />
              <span><strong>Visual Silencioso:</strong> Cores terrosas e areia, sem bombardeio de confetes estridentes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6F5C] shrink-0 mt-0.5" />
              <span><strong>Anamnese Direta:</strong> 7 seções com propósito claro e respostas abertas opcionais.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6F5C] shrink-0 mt-0.5" />
              <span><strong>Controle Real:</strong> O roteiro é 100% editável e adaptado à rotina do usuário.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Simulador Interativo do Gesto de Pressão Contínua (Hold to Sign) */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E8E6] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E6E8E6]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] block">
              Simulador do Composable
            </span>
            <h3 className="text-base font-bold text-[#1A1D1B] font-serif">
              Gesto de Pressão Contínua com Animação Radial e Háptica
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5B615D] flex items-center gap-1 bg-[#F7F9F8] px-2.5 py-1 rounded-lg border border-[#E6E8E6]">
              <Vibrate className="w-3.5 h-3.5 text-[#1F6F5C]" /> Pulsos hápticos: <strong>{hapticCount}</strong>
            </span>
            <button
              onClick={resetRitual}
              className="text-xs text-[#5B615D] hover:text-[#1A1D1B] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Lado Esquerdo: Área de Interação */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#FDFCF9] to-[#FAF6F0] border border-amber-200/60 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full mb-3">
              Pressione e segure o botão por 3 segundos
            </span>

            <div className="relative flex items-center justify-center my-4">
              <svg className="w-36 h-36 -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="#E6E8E6"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="#1F6F5C"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="389.55"
                  strokeDashoffset={389.55 - (389.55 * holdProgress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />
              </svg>

              <button
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                className={`absolute w-28 h-28 rounded-full flex flex-col items-center justify-center select-none cursor-pointer transition-all ${
                  isHolding 
                    ? 'bg-[#1F6F5C] text-white scale-95 shadow-inner' 
                    : ritualCompleted 
                      ? 'bg-[#3BAA6B] text-white shadow-md' 
                      : 'bg-[#1F6F5C] hover:bg-[#2E8B73] text-white shadow-lg active:scale-95'
                }`}
              >
                <Compass className={`w-7 h-7 mb-1 ${isHolding ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                <span className="text-[11px] font-bold uppercase tracking-tight">
                  {ritualCompleted ? 'Selado!' : holdProgress > 0 ? `${holdProgress}%` : 'Segurar'}
                </span>
              </button>
            </div>

            <p className="text-xs text-[#5B615D] mt-2 font-medium">
              {isHolding ? (
                <span className="text-[#1F6F5C] font-semibold animate-pulse">
                  Firmando seu compromisso consciente... ({holdProgress}%)
                </span>
              ) : ritualCompleted ? (
                <span className="text-[#3BAA6B] font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Pacto de compromisso firmado com sucesso!
                </span>
              ) : (
                <span>Mantenha o botão pressionado para testar</span>
              )}
            </p>
          </div>

          {/* Lado Direito: A Carta do Eu Futuro Revelada */}
          <div className="p-5 rounded-2xl bg-white border border-amber-300/80 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
              <span className="text-xs font-serif italic text-amber-900 font-bold">
                Carta Revelada do Eu Futuro (90 dias)
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ritualCompleted ? 'bg-emerald-100 text-[#1F6F5C]' : 'bg-neutral-100 text-neutral-500'}`}>
                {ritualCompleted ? 'Status: Assinado' : 'Status: Aguardando Gesto'}
              </span>
            </div>

            <div className={`space-y-2 text-xs font-serif leading-relaxed text-[#2D3748] transition-opacity duration-500 ${ritualCompleted ? 'opacity-100' : 'opacity-40 blur-[0.5px]'}`}>
              <h4 className="text-sm font-bold text-[#1A1D1B]">
                "Querida Ana, sou você daqui a 90 dias..."
              </h4>
              <p>
                Escrevo para te lembrar do momento em que você segurou a tela e assumiu o seu prumo. 
                Você estava hesitante, mas prometeu a si mesma:
              </p>
              <p className="italic bg-amber-50/80 p-2.5 rounded-lg border-l-2 border-[#1F6F5C] text-[#1F6F5C]">
                "Construir meu próprio método digital sem burnout e fazer minhas primeiras vendas com a consciência tranquila."
              </p>
              <p>
                Hoje nosso produto para <strong>Freelancers</strong> está no ar, validamos com 3 pessoas reais e aquela sensação de paralisia ficou para trás. 
                Dê o passo de hoje com calma. Seu prumo é real.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Código Kotlin & Arquitetura Android */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1A1D1B] font-serif">
            Implementação Nativa em Kotlin &amp; Jetpack Compose
          </h3>
          <span className="text-xs text-[#5B615D]">
            Pronto para compilar no Android Studio
          </span>
        </div>

        <div className="flex gap-2 border-b border-[#E6E8E6] pb-2 overflow-x-auto text-xs">
          {[
            { id: 'commitment', label: 'CommitmentContractScreen.kt', desc: 'Hold Gesture & Háptica' },
            { id: 'letter', label: 'FutureLetterScreen.kt', desc: 'UI Editorial & Selo' },
            { id: 'entity', label: 'FutureLetterEntity.kt', desc: 'Persistência Room' },
            { id: 'signal', label: 'ValueSignalComposable.kt', desc: 'Prelúdio de Valor' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCodeTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer text-left whitespace-nowrap ${
                activeCodeTab === tab.id
                  ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                  : 'bg-white border border-[#E6E8E6] text-[#5B615D] hover:bg-neutral-50'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab CommitmentContractScreen */}
        {activeCodeTab === 'commitment' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>app/src/main/java/com/prumo/app/presentation/onboarding/CommitmentContractScreen.kt</span>
              <button
                onClick={() => handleCopy(`// Gesto de Pressão Contínua com Animatable no Compose\n@Composable\nfun CommitmentHoldButton(...)`, 'commit')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'commit' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`package com.prumo.app.presentation.onboarding

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

/**
 * Tela do Ritual de Compromisso Consciente (Inspirado no Fabulous).
 * Exige 3 segundos de pressão contínua com feedback háptico e progresso radial.
 */
@Composable
fun CommitmentContractScreen(
    userName: String,
    personalAnchor: String,
    onContractSigned: () -> Unit
) {
    val haptic = LocalHapticFeedback.current
    val scope = rememberCoroutineScope()
    val progress = remember { Animatable(0f) }
    var isHolding by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Assumir seu Prumo",
                style = MaterialTheme.typography.headlineMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Mudar de direção é um pacto consciente com quem você escolhe ser daqui a 90 dias.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Botão Tátil com Indicador Radial SVG/Canvas
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(160.dp)
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                // Trilho de fundo
                drawCircle(
                    color = androidx.compose.ui.graphics.Color(0xFFE6E8E6),
                    radius = size.minDimension / 2 - 12.dp.toPx(),
                    style = Stroke(width = 8.dp.toPx())
                )
                // Arco de progresso contínuo
                drawArc(
                    color = androidx.compose.ui.graphics.Color(0xFF1F6F5C),
                    startAngle = -90f,
                    sweepAngle = 360f * progress.value,
                    useCenter = false,
                    style = Stroke(width = 8.dp.toPx(), cap = StrokeCap.Round)
                )
            }

            // Área sensível ao toque contínuo
            Surface(
                shape = MaterialTheme.shapes.extraLarge,
                color = if (isHolding) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.primary,
                modifier = Modifier
                    .size(110.dp)
                    .pointerInput(Unit) {
                        detectTapGestures(
                            onPress = {
                                isHolding = true
                                scope.launch {
                                    // Disparo inicial de vibração leve
                                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                    progress.animateTo(
                                        targetValue = 1f,
                                        animationSpec = tween(durationMillis = 2800, easing = LinearEasing)
                                    )
                                    if (progress.value >= 1f) {
                                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                        onContractSigned()
                                    }
                                }
                                tryAwaitRelease()
                                // Se soltar antes dos 3s, reseta imediatamente
                                isHolding = false
                                scope.launch { progress.snapTo(0f) }
                            }
                        )
                    }
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = if (isHolding) "\${(progress.value * 100).toInt()}%" else "Segurar",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                }
            }
        }

        Text(
            text = "Mantenha o dedo na tela por 3 segundos para assinar",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.outline
        )
    }
}`}
            </pre>
          </div>
        )}

        {/* Tab FutureLetterScreen */}
        {activeCodeTab === 'letter' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>app/src/main/java/com/prumo/app/presentation/onboarding/FutureLetterScreen.kt</span>
              <button
                onClick={() => handleCopy(`// Carta do Eu Futuro em Compose\n@Composable\nfun FutureLetterScreen(...)`, 'letter')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'letter' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`package com.prumo.app.presentation.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun FutureLetterScreen(
    userName: String,
    niche: String,
    personalAnchor: String,
    onEnterJourney: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFFF2D6B3), MaterialTheme.shapes.large)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "De: Seu Eu Futuro (daqui a 90 dias)",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF8C532B)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Querida \$userName,",
                    style = MaterialTheme.typography.titleMedium
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Escrevo para te lembrar do dia em que você segurou a tela e assumiu seu prumo. Naquele momento você estava insegura, mas prometeu a si mesma:",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFFFF9F0), MaterialTheme.shapes.small)
                        .padding(12.dp)
                ) {
                    Text(
                        text = "\\"\\$personalAnchor\\"",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF1F6F5C)
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Hoje nosso produto de \$niche está no ar, validamos com pessoas reais e aquela sensação de paralisia ficou para trás.",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }

        Button(
            onClick = onEnterJourney,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp)
        ) {
            Text("Entrar na minha Jornada (Capítulo 1)")
        }
    }
}`}
            </pre>
          </div>
        )}

        {/* Tab FutureLetterEntity */}
        {activeCodeTab === 'entity' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>app/src/main/java/com/prumo/app/data/local/entity/FutureLetterEntity.kt</span>
              <button
                onClick={() => handleCopy(`// Entidade Room para Persistência da Carta\n@Entity\ndata class FutureLetterEntity(...)`, 'entity')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'entity' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`package com.prumo.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "future_letters")
data class FutureLetterEntity(
    @PrimaryKey
    val id: String = "primary_letter",
    val userName: String,
    val personalAnchor: String,
    val proudStatement: String,
    val niche: String,
    val letterBody: String,
    val signedAtEpochMillis: Long = System.currentTimeMillis(),
    val targetDeliveryEpochMillis: Long = System.currentTimeMillis() + (90L * 24 * 60 * 60 * 1000)
)`}
            </pre>
          </div>
        )}

        {/* Tab ValueSignalComposable */}
        {activeCodeTab === 'signal' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>app/src/main/java/com/prumo/app/presentation/onboarding/ValueSignalComposable.kt</span>
              <button
                onClick={() => handleCopy(`// Prelúdio de Valor antes de seções da anamnese\n@Composable\nfun ValueSignalComposable(...)`, 'signal')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'signal' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`package com.prumo.app.presentation.onboarding

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ValueSignalScreen(
    stepNumber: Int,
    totalSteps: Int,
    title: String,
    description: String,
    onContinue: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(top = 40.dp)
        ) {
            SuggestionChip(
                onClick = {},
                label = { Text("Etapa \$stepNumber de \$totalSteps") }
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.headlineMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Button(
            onClick = onContinue,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Entendido, vamos lá")
        }
    }
}`}
            </pre>
          </div>
        )}
      </div>

      {/* Checklist Interativo */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E8E6] shadow-xs">
        <h3 className="text-sm font-bold text-[#1A1D1B] font-serif mb-3">
          Checklist de Conexão Emocional &amp; Onboarding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { id: 'pointerInputGestures', label: 'Gesto de pressão de 3s no Jetpack Compose com detectTapGestures' },
            { id: 'animatableRadialFill', label: 'Progresso contínuo de preenchimento radial com Animatable' },
            { id: 'localHapticFeedback', label: 'Feedback háptico (vibração suave) acionado em marcos do gesto' },
            { id: 'roomFutureLetterEntity', label: 'Persistência no Room da Carta do Eu Futuro e data de abertura' },
            { id: 'valueSignalPrelude', label: 'Prelúdios de valor (Value Signals) antes de blocos da anamnese' },
            { id: 'openReflectionFields', label: 'Campos de reflexão em texto livre capturando as palavras do usuário' }
          ].map(item => {
            const checked = checklist[item.id as keyof typeof checklist];
            return (
              <div 
                key={item.id} 
                onClick={() => toggleCheck(item.id as keyof typeof checklist)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${checked ? 'bg-[#E3F2ED]/50 border-[#1F6F5C]/30 text-[#1F6F5C]' : 'bg-white border-[#E6E8E6] text-[#5B615D]'}`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-[#1F6F5C] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
