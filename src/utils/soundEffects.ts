/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sistema de Efeitos Sonoros Sutis e Elegantes (Web Audio API)
 * 
 * Inspirado na filosofia de design do Prumo e Fabulous:
 * Sons calmos, zen, táteis, sem ruído estridente ou distrações.
 * Usamos síntese pura via Web Audio API para garantir:
 * - Zero dependências externas e zero falhas de rede / 404
 * - Latência instantânea
 * - Envelopes suaves e harmônicos quentes (senoide pura com harmônicos suaves)
 * - Controle total de mudo/volume respeitando a preferência do usuário
 */

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Carregar preferência salva se existir
    try {
      const savedMute = localStorage.getItem('prumo_sound_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch {
      // Ignore localStorage security exceptions in restricted contexts
    }
  }

  /**
   * Inicializa o contexto de áudio sob demanda (respeitando políticas de autoplay)
   */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime); // Volume global sutil e agradável
        this.masterGain.connect(this.audioCtx.destination);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    return this.audioCtx;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('prumo_sound_muted', muted ? 'true' : 'false');
    } catch {
      // Ignore
    }
  }

  public toggleMute(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    if (!next) {
      // Pequeno clique de confirmação ao desmutar
      this.playSoftTap();
    }
    return next;
  }

  /**
   * 1. Clique / Toque Sutil (Soft Tap)
   * Toque leve e amadeirado / tátil, para botões, chips e abas.
   */
  public playSoftTap(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frequência suave de marimba / madeira
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);

    // Envelope suave
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * 2. Seleção de Opção na Anamnese (Warm Select)
   * Tom quente e acolhedor (nota de kalimba / gota d'água suave).
   */
  public playSelectOption(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    
    // Fundamental + suave harmônico
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(510, now + 0.12);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.5, now); // C6 sutil
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.13);
    osc2.stop(now + 0.13);
  }

  /**
   * 3. Avanço de Tela / Pergunta (Mindful Transition)
   * Duplo tom sereno ascendente (E5 -> G#5) com sensação de progresso leve.
   */
  public playTransition(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    
    // Nota 1: E5
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Nota 2: G#5 um pouco depois
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.08);
    gain2.gain.setValueAtTime(0.09, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.3);
  }

  /**
   * 4. Retorno / Voltar de Tela (Gentle Back)
   * Tom suave descendente.
   */
  public playBack(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.12); // A4

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * 5. Conclusão de Tarefa / Marco de Progresso (Zen Chime)
   * Arpeggio celestial pacífico em pentatônica maior (E5 - G#5 - B5 - E6)
   * Traz recompensa emocional sem agitação.
   */
  public playCompleteTask(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Harmônico sutil
      gain.gain.setValueAtTime(0.11 - idx * 0.015, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.48);
    });
  }

  /**
   * 6. Pulso durante o Ritual de Compromisso (Hold-to-Sign Pulse)
   * Pulsos orgânicos que aceleram e sobem suavemente de frequência conforme a barra enche.
   */
  public playHoldPulse(progressPercent: number): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Começa em 280Hz e sobe suavemente até 520Hz
    const baseFreq = 280 + (progressPercent / 100) * 240;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * 7. Selo de Compromisso / Carta do Eu Futuro (Deep Resonant Gong/Bell)
   * Acorde profundo e aconchegante inspirado em tigela tibetana / sino zen (220Hz + 330Hz + 440Hz).
   */
  public playCommitmentSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const freqs = [220, 329.63, 440, 659.25]; // A3, E4, A4, E5 (Acorde aberto sereno)

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const initialGain = idx === 0 ? 0.18 : 0.08;
      gain.gain.setValueAtTime(initialGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 1.25);
    });
  }

  /**
   * 8. Alternância do Player de Áudio Coach (Play/Pause)
   */
  public playAudioCoachToggle(isPlaying: boolean): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (isPlaying) {
      // Iniciar: tom ascendente gentil
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
    } else {
      // Pausar: tom descendente acolhedor
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(392, now + 0.12);
    }

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const soundEffects = new SoundEffectsService();
