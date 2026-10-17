import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Sparkles, 
  Download, 
  Code2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Copy, 
  CheckSquare, 
  Square,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Flame,
  FileCode2,
  Compass
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const Step10AudioGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Audio Player Simulator State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(14);
  const totalDurationSec = 78; // 1:18 min
  const [showTranscript, setShowTranscript] = useState(true);
  const [activeTab, setActiveTab] = useState<'player' | 'waveform' | 'chapters' | 'media3'>('player');

  // Checklist
  const [checklist, setChecklist] = useState({
    media3ExoPlayer: true,
    canvasWaveform: true,
    chapterNarrativeGrouping: true,
    anchorTotemCards: true,
    offlineAudioCaching: true,
    workManagerEmotionalAnchor: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  const waveHeights = [25, 45, 60, 80, 50, 70, 95, 60, 40, 55, 75, 40, 30, 65, 85, 50, 35, 70, 90, 60, 40, 25];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de Cabeçalho */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EAF5F0] via-[#FAF6F0] to-[#E3F2ED] border border-[#1F6F5C]/20 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6F5C]/10 text-[#1F6F5C] text-xs font-bold mb-3">
            <Headphones className="w-3.5 h-3.5 text-[#1F6F5C]" />
            <span>Etapa 10 &bull; Presença Sonora &bull; AndroidX Media3 / ExoPlayer</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A1D1B] tracking-tight">
            Presença em Áudio, Ondas Sonoras &amp; Roteiro em Capítulos Narrativos
          </h1>

          <p className="text-xs sm:text-sm text-[#5B615D] mt-2 leading-relaxed">
            Como implementar a camada de voz serena inspirada no <strong>Fabulous</strong> — micro-áudios de 60 a 90 segundos 
            que funcionam como presença e encorajamento contextual, não como instrução mecânica. 
            Mais a reorganização do roteiro em <strong>Capítulos Narrativos</strong> com ilustrações-âncora.
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

      {/* Simulador Interativo do Waveform Audio Player */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E8E6] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E6E8E6]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] block">
              Player Interativo do Compose
            </span>
            <h3 className="text-base font-bold text-[#1A1D1B] font-serif">
              Visualizador de Micro-Áudio com Formas de Onda Animadas
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5B615D] bg-[#F7F9F8] px-2.5 py-1 rounded-lg border border-[#E6E8E6]">
              Tempo: <strong>{Math.floor(currentTimeSec / 60)}:{(currentTimeSec % 60).toString().padStart(2, '0')}</strong> / 1:18 min
            </span>
            <button
              onClick={() => {
                setCurrentTimeSec(0);
                setIsPlaying(false);
              }}
              className="text-xs text-[#5B615D] hover:text-[#1A1D1B] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
            </button>
          </div>
        </div>

        {/* Card do Player */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF6F0] via-white to-[#E3F2ED]/60 border border-[#1F6F5C]/20 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-2xl bg-[#1F6F5C] hover:bg-[#2E8B73] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F5C] block">
                  Presença em Áudio &bull; Helena, Coach Prumo
                </span>
                <h4 className="text-sm font-bold text-[#1A1D1B] font-serif">
                  "Por que perfeito é o inimigo do feito"
                </h4>
                <p className="text-[11px] text-[#5B615D]">
                  Capítulo 1 &bull; Tarefa: Criar sua versão mínima entregável
                </p>
              </div>
            </div>

            {/* Onda Sonora Animada (Waveform) */}
            <div className="flex items-center gap-1 h-10 px-3 bg-white/80 rounded-xl border border-neutral-200">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isPlaying 
                      ? 'bg-[#1F6F5C]' 
                      : (i / waveHeights.length) <= (currentTimeSec / totalDurationSec)
                        ? 'bg-[#2E8B73]'
                        : 'bg-neutral-300'
                  }`}
                  style={{
                    height: isPlaying
                      ? `${Math.max(20, h * (0.5 + Math.sin((currentTimeSec * 2 + i * 0.5)) * 0.5))}%`
                      : `${h * 0.4}%`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Transcrição Inspiradora */}
          <div className="mt-4 pt-3 border-t border-neutral-200/60">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center justify-between text-xs font-semibold text-[#1F6F5C] cursor-pointer"
            >
              <span>{showTranscript ? 'Ocultar transcrição' : 'Ler transcrição de apoio'}</span>
              {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTranscript && (
              <p className="text-xs font-serif italic text-[#2D3748] mt-2 bg-white/70 p-3 rounded-xl border border-[#1F6F5C]/15 leading-relaxed">
                "Você não precisa de estúdio, iluminação ou 40 aulas gravadas. Uma semente bem plantada gera mais vida do que um palácio imaginário. 
                Vinte minutos focados em resolver uma dor real. Você já sabe o que colocar aí."
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs de Código Kotlin & Media3 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1A1D1B] font-serif">
            Implementação no Android Studio (Kotlin &amp; Media3)
          </h3>
          <span className="text-xs text-[#5B615D]">
            ExoPlayer e Canvas Compose
          </span>
        </div>

        <div className="flex gap-2 border-b border-[#E6E8E6] pb-2 overflow-x-auto text-xs">
          {[
            { id: 'player', label: 'AudioCoachPlayer.kt', desc: 'Media3 ExoPlayer' },
            { id: 'waveform', label: 'WaveformCanvas.kt', desc: 'Canvas Compose' },
            { id: 'chapters', label: 'ChapterRoadmapScreen.kt', desc: 'Capítulos Narrativos' },
            { id: 'media3', label: 'libs.versions.toml', desc: 'Dependências Media3' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer text-left whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1F6F5C] text-white font-semibold shadow-xs'
                  : 'bg-white border border-[#E6E8E6] text-[#5B615D] hover:bg-neutral-50'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab AudioCoachPlayer.kt */}
        {activeTab === 'player' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>app/src/main/java/com/prumo/app/presentation/audio/AudioCoachPlayer.kt</span>
              <button
                onClick={() => handleCopy(`// Player de Áudio com Media3\nclass AudioCoachPlayer(...)`, 'player')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'player' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`package com.prumo.app.presentation.audio

import android.content.Context
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Gerenciador de micro-áudios com AndroidX Media3 (ExoPlayer).
 * Permite reprodução fluida, controle de pausa e monitoramento de progresso.
 */
class AudioCoachPlayer(private val context: Context) {
    private var exoPlayer: ExoPlayer? = null

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying = _isPlaying.asStateFlow()

    private val _currentPositionMs = MutableStateFlow(0L)
    val currentPositionMs = _currentPositionMs.asStateFlow()

    fun initPlayer() {
        if (exoPlayer == null) {
            exoPlayer = ExoPlayer.Builder(context).build().apply {
                addListener(object : Player.Listener {
                    override fun onIsPlayingChanged(playing: Boolean) {
                        _isPlaying.value = playing
                    }

                    override fun onPlaybackStateChanged(playbackState: Int) {
                        if (playbackState == Player.STATE_ENDED) {
                            _isPlaying.value = false
                            _currentPositionMs.value = 0L
                        }
                    }
                })
            }
        }
    }

    fun playAudio(assetUri: String) {
        initPlayer()
        exoPlayer?.apply {
            setMediaItem(MediaItem.fromUri(assetUri))
            prepare()
            play()
        }
    }

    fun togglePlayPause() {
        exoPlayer?.let {
            if (it.isPlaying) it.pause() else it.play()
        }
    }

    fun release() {
        exoPlayer?.release()
        exoPlayer = null
    }
}`}
            </pre>
          </div>
        )}

        {/* Tab WaveformCanvas.kt */}
        {activeTab === 'waveform' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>app/src/main/java/com/prumo/app/presentation/components/WaveformCanvas.kt</span>
              <button
                onClick={() => handleCopy(`// Canvas de Ondas Sonoras no Compose\n@Composable\nfun WaveformVisualizer(...)`, 'waveform')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'waveform' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`package com.prumo.app.presentation.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlin.math.sin

/**
 * Componente declarativo que renderiza formas de onda orgânicas com Canvas DrawScope.
 */
@Composable
fun WaveformVisualizer(
    isPlaying: Boolean,
    waveData: List<Int>,
    modifier: Modifier = Modifier,
    barColor: Color = Color(0xFF1F6F5C)
) {
    val infiniteTransition = rememberInfiniteTransition(label = "waveAnim")
    val phase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 6.28f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "phase"
    )

    Canvas(modifier = modifier.height(32.dp).width((waveData.size * 5).dp)) {
        val barWidth = 3.dp.toPx()
        val spacing = 2.dp.toPx()
        val maxHeight = size.height

        waveData.forEachIndexed { index, baseHeight ->
            val scaleFactor = if (isPlaying) {
                0.5f + (0.5f * sin(phase + index * 0.4f)).toFloat()
            } else {
                0.3f
            }
            val calculatedHeight = (baseHeight / 100f) * maxHeight * scaleFactor
            val topOffset = (maxHeight - calculatedHeight) / 2

            drawRoundRect(
                color = barColor,
                topLeft = Offset(x = index * (barWidth + spacing), y = topOffset),
                size = Size(width = barWidth, height = calculatedHeight),
                cornerRadius = CornerRadius(barWidth / 2, barWidth / 2)
            )
        }
    }
}`}
            </pre>
          </div>
        )}

        {/* Tab ChapterRoadmapScreen.kt */}
        {activeTab === 'chapters' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>app/src/main/java/com/prumo/app/presentation/roadmap/ChapterRoadmapScreen.kt</span>
              <button
                onClick={() => handleCopy(`// Roteiro Narrativo em Capítulos\n@Composable\nfun ChapterRoadmapScreen(...)`, 'chapters')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'chapters' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`package com.prumo.app.presentation.roadmap

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ChapterRoadmapScreen(
    personalAnchor: String,
    chapters: List<ChapterUiModel>,
    onTaskClick: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Banner da Âncora Pessoal Fixa no Topo
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "Sua Promessa para Si Mesmo",
                        style = MaterialTheme.typography.labelSmall
                    )
                    Text(
                        text = "\\"\\$personalAnchor\\"",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }

        // Capítulos Narrativos
        items(chapters) { chapter ->
            Text(
                text = chapter.title, // "Capítulo 1: Onde você encontra sua promessa"
                style = MaterialTheme.typography.titleMedium
            )
            // Itens de tarefas com Ilustrações-Âncora
        }
    }
}`}
            </pre>
          </div>
        )}

        {/* Tab libs.versions.toml */}
        {activeTab === 'media3' && (
          <div className="rounded-2xl bg-[#1E1E1E] text-neutral-200 p-5 font-mono text-xs overflow-x-auto border border-neutral-800 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>gradle/libs.versions.toml &bull; Dependências AndroidX Media3</span>
              <button
                onClick={() => handleCopy(`media3 = "1.4.1"\nmedia3-exoplayer = { module = "androidx.media3:media3-exoplayer", version.ref = "media3" }`, 'toml')}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSnippet === 'toml' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="leading-relaxed text-[11px]">
{`[versions]
media3 = "1.4.1"

[libraries]
media3-exoplayer = { module = "androidx.media3:media3-exoplayer", version.ref = "media3" }
media3-ui = { module = "androidx.media3:media3-ui", version.ref = "media3" }
media3-common = { module = "androidx.media3:media3-common", version.ref = "media3" }`}
            </pre>
          </div>
        )}
      </div>

      {/* Checklist */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E8E6] shadow-xs">
        <h3 className="text-sm font-bold text-[#1A1D1B] font-serif mb-3">
          Checklist de Presença Sonora &amp; Storytelling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { id: 'media3ExoPlayer', label: 'AndroidX Media3 ExoPlayer para reprodução de micro-áudios de presença' },
            { id: 'canvasWaveform', label: 'Visualizador de formas de onda dinâmicas em Canvas Jetpack Compose' },
            { id: 'chapterNarrativeGrouping', label: 'Reframe do roteiro em Capítulos Narrativos em vez de checkboxes' },
            { id: 'anchorTotemCards', label: 'Ilustrações-âncora tarot-style que comunicam a sensação da tarefa' },
            { id: 'offlineAudioCaching', label: 'Cache local de micro-áudios em assets/ ou armazenamento interno' },
            { id: 'workManagerEmotionalAnchor', label: 'Injeção da frase de orgulho nas notificações gentis diárias' }
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
