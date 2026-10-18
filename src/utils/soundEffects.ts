/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Sons do Prumo (Web Audio API, gerados no aparelho: sem arquivos, sem rede, sem direitos autorais).
 *
 * Etapa 25, a partir do teste com usuários ("sons mais delicados, menos rápidos e artificiais") e do
 * clima do Fabulous (sininhos suaves e gotas d'água):
 * - Timbre de sino/kalimba: senoide com poucos parciais suaves, nada de onda quadrada ou triangular
 * - Ataque lento (15 a 40 ms) e queda longa e natural, em vez de "bip" curto
 * - Eco de sala suave (reverb gerado no aparelho), que tira o som "de computador"
 * - Notas da escala pentatônica, que soam bem em qualquer combinação
 */

/** Pentatônica maior de Dó em várias oitavas (Hz) */
const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
  C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98,
};

interface BellOptions {
  /** Volume de pico (0 a 1, antes do volume geral) */
  peak?: number;
  /** Duração da queda em segundos */
  decay?: number;
  /** Ataque em segundos */
  attack?: number;
  /** Quanto vai para o eco (0 a 1) */
  wet?: number;
  /** Brilho: quanto dos parciais agudos entra (0 a 1) */
  shimmer?: number;
}

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private reverbIn: GainNode | null = null;
  /** Sons de toque comum (botões, opções, trocas de tela): desligados por padrão para não cansar */
  private tapSounds: boolean = false;

  constructor() {
    try {
      const savedMute = localStorage.getItem('prumo_sound_muted');
      if (savedMute !== null) this.isMuted = savedMute === 'true';
      this.tapSounds = localStorage.getItem('prumo_tap_sounds') === 'true';
    } catch {
      // localStorage pode estar bloqueado
    }
  }

  /** Cria o contexto de áudio na primeira vez (o navegador só libera som depois de um toque) */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      const ctx = new AudioContextClass();
      this.audioCtx = ctx;
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.32, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
      this.reverbIn = this.buildReverb(ctx, this.masterGain);
    }
    if (this.audioCtx.state === 'suspended') void this.audioCtx.resume();
    return this.audioCtx;
  }

  /** Eco de sala: ruído que se apaga devagar, usado como resposta de impulso */
  private buildReverb(ctx: AudioContext, out: AudioNode): GainNode | null {
    try {
      const seconds = 2.4;
      const length = Math.floor(ctx.sampleRate * seconds);
      const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch);
        for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
      }
      const convolver = ctx.createConvolver();
      convolver.buffer = impulse;
      // Tira os graves do eco para não embolar
      const lowCut = ctx.createBiquadFilter();
      lowCut.type = 'highpass';
      lowCut.frequency.value = 300;
      const input = ctx.createGain();
      input.gain.value = 0.5;
      input.connect(lowCut);
      lowCut.connect(convolver);
      convolver.connect(out);
      return input;
    } catch {
      return null;
    }
  }

  /** Uma nota de sino/kalimba: fundamental + parciais suaves, queda exponencial longa */
  private bell(freq: number, at: number, opts: BellOptions = {}): void {
    const ctx = this.audioCtx;
    if (!ctx || !this.masterGain) return;
    const { peak = 0.12, decay = 1.4, attack = 0.02, wet = 0.35, shimmer = 0.4 } = opts;
    const partials: Array<[number, number]> = [
      [1, 1],
      [2.01, 0.28 * shimmer],
      [3.02, 0.12 * shimmer],
      [4.17, 0.05 * shimmer],
    ];
    const voice = ctx.createGain();
    voice.gain.setValueAtTime(0.0001, at);
    voice.gain.linearRampToValueAtTime(peak, at + attack);
    voice.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
    voice.connect(this.masterGain);
    if (this.reverbIn && wet > 0) {
      const send = ctx.createGain();
      send.gain.value = wet;
      voice.connect(send);
      send.connect(this.reverbIn);
    }
    for (const [ratio, amp] of partials) {
      if (amp <= 0) continue;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, at);
      // Parciais agudos somem antes, como num sino de verdade
      g.gain.setValueAtTime(amp, at);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, amp * 0.02), at + attack + decay / ratio);
      osc.connect(g);
      g.connect(voice);
      osc.start(at);
      osc.stop(at + attack + decay + 0.05);
    }
  }

  /** Gota d'água: senoide que sobe rápido de tom e some */
  private drop(freq: number, at: number, peak = 0.07): void {
    const ctx = this.audioCtx;
    if (!ctx || !this.masterGain) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, at);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.9, at + 0.09);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    osc.connect(g);
    g.connect(this.masterGain);
    if (this.reverbIn) {
      const send = ctx.createGain();
      send.gain.value = 0.4;
      g.connect(send);
      send.connect(this.reverbIn);
    }
    osc.start(at);
    osc.stop(at + 0.25);
  }

  /** Acorde que entra devagar e se apaga devagar (fundo da música do splash) */
  private pad(freqs: number[], at: number, duration: number, peak = 0.035): void {
    const ctx = this.audioCtx;
    if (!ctx || !this.masterGain) return;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + duration * 0.35);
    g.gain.linearRampToValueAtTime(0.0001, at + duration);
    const lowPass = ctx.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 1400;
    g.connect(lowPass);
    lowPass.connect(this.masterGain);
    if (this.reverbIn) {
      const send = ctx.createGain();
      send.gain.value = 0.6;
      lowPass.connect(send);
      send.connect(this.reverbIn);
    }
    for (const f of freqs) {
      // Duas senoides levemente desafinadas por nota dão o "coro" macio
      for (const detune of [-4, 4]) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, at);
        osc.detune.setValueAtTime(detune, at);
        osc.connect(g);
        osc.start(at);
        osc.stop(at + duration + 0.1);
      }
    }
  }

  private ready(requireTap: boolean): AudioContext | null {
    if (this.isMuted || (requireTap && !this.tapSounds)) return null;
    const ctx = this.getContext();
    return ctx && this.masterGain ? ctx : null;
  }

  public getTapSounds(): boolean {
    return this.tapSounds;
  }

  public toggleTapSounds(): boolean {
    this.tapSounds = !this.tapSounds;
    try {
      localStorage.setItem('prumo_tap_sounds', this.tapSounds ? 'true' : 'false');
    } catch {
      // ignora
    }
    if (this.tapSounds) this.playSoftTap();
    return this.tapSounds;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('prumo_sound_muted', muted ? 'true' : 'false');
    } catch {
      // ignora
    }
  }

  public toggleMute(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    if (!next) this.playCompleteTask();
    return next;
  }

  /** Toque leve: uma gotinha bem baixa (botões, chips, abas) */
  public playSoftTap(): void {
    const ctx = this.ready(true);
    if (!ctx) return;
    this.drop(NOTE.E5, ctx.currentTime, 0.04);
  }

  /** Escolher uma opção: nota de kalimba curta */
  public playSelectOption(): void {
    const ctx = this.ready(true);
    if (!ctx) return;
    this.bell(NOTE.G5, ctx.currentTime, { peak: 0.08, decay: 0.7, attack: 0.015, wet: 0.25, shimmer: 0.3 });
  }

  /** Avançar de tela: duas notas subindo, sem pressa */
  public playTransition(): void {
    const ctx = this.ready(true);
    if (!ctx) return;
    const t = ctx.currentTime;
    this.bell(NOTE.C5, t, { peak: 0.06, decay: 0.8, attack: 0.025, wet: 0.3, shimmer: 0.2 });
    this.bell(NOTE.G5, t + 0.14, { peak: 0.05, decay: 0.9, attack: 0.025, wet: 0.35, shimmer: 0.2 });
  }

  /** Voltar: duas notas descendo, mais baixas */
  public playBack(): void {
    const ctx = this.ready(true);
    if (!ctx) return;
    const t = ctx.currentTime;
    this.bell(NOTE.G4, t, { peak: 0.05, decay: 0.6, attack: 0.025, wet: 0.25, shimmer: 0.15 });
    this.bell(NOTE.D4, t + 0.12, { peak: 0.045, decay: 0.7, attack: 0.025, wet: 0.25, shimmer: 0.15 });
  }

  /** Tarefa concluída: três sininhos subindo, com eco */
  public playCompleteTask(): void {
    const ctx = this.ready(false);
    if (!ctx) return;
    const t = ctx.currentTime;
    [NOTE.C5, NOTE.E5, NOTE.G5].forEach((f, i) => this.bell(f, t + i * 0.16, { peak: 0.09, decay: 1.4, wet: 0.45 }));
  }

  /** Pulso enquanto a pessoa segura o botão do compromisso: gota que sobe de tom com o progresso */
  public playHoldPulse(progressPercent: number): void {
    const ctx = this.ready(false);
    if (!ctx) return;
    const steps = [NOTE.C4, NOTE.D4, NOTE.E4, NOTE.G4, NOTE.A4, NOTE.C5];
    const f = steps[Math.min(steps.length - 1, Math.floor((progressPercent / 100) * steps.length))];
    this.bell(f, ctx.currentTime, { peak: 0.05, decay: 0.5, attack: 0.03, wet: 0.3, shimmer: 0.1 });
  }

  /** Compromisso selado: acorde de sino grave e aberto, que soa por uns segundos */
  public playCommitmentSuccess(): void {
    const ctx = this.ready(false);
    if (!ctx) return;
    const t = ctx.currentTime;
    this.bell(NOTE.C4, t, { peak: 0.12, decay: 3.2, attack: 0.03, wet: 0.5, shimmer: 0.5 });
    this.bell(NOTE.G4, t + 0.05, { peak: 0.07, decay: 3.0, attack: 0.03, wet: 0.5, shimmer: 0.4 });
    this.bell(NOTE.E5, t + 0.1, { peak: 0.05, decay: 2.8, attack: 0.03, wet: 0.55, shimmer: 0.4 });
  }

  /**
   * Capítulo concluído: "chuva de estrelas", sininhos agudos caindo devagar sobre um acorde,
   * para o momento ser mais mágico do que um bip de conquista.
   */
  public playChapterCelebration(): void {
    const ctx = this.ready(false);
    if (!ctx) return;
    const t = ctx.currentTime;
    this.pad([NOTE.C4, NOTE.G4, NOTE.E5], t, 4.5, 0.03);
    const sparkle = [NOTE.G6, NOTE.E6, NOTE.D6, NOTE.C6, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.C5];
    sparkle.forEach((f, i) =>
      this.bell(f, t + 0.2 + i * 0.22 + Math.random() * 0.05, { peak: 0.05 + i * 0.004, decay: 1.8, attack: 0.02, wet: 0.6, shimmer: 0.6 }),
    );
    this.bell(NOTE.C4, t + 2.1, { peak: 0.1, decay: 3, attack: 0.04, wet: 0.5, shimmer: 0.4 });
  }

  /**
   * Música curta da abertura (só depois de um toque: o navegador bloqueia som antes disso).
   * ~7 s: um acorde que entra devagar e uma melodia de kalimba na pentatônica, com eco.
   */
  public playSplashMusic(): void {
    const ctx = this.ready(false);
    if (!ctx) return;
    const t = ctx.currentTime + 0.05;
    this.pad([NOTE.C4, NOTE.G4, NOTE.D5], t, 3.6, 0.03);
    this.pad([NOTE.A4, NOTE.E4, NOTE.C5], t + 3.2, 3.8, 0.028);
    const melody: Array<[number, number]> = [
      [NOTE.E5, 0.3], [NOTE.G5, 0.75], [NOTE.A5, 1.2], [NOTE.G5, 1.65],
      [NOTE.E5, 2.4], [NOTE.D5, 2.85], [NOTE.C5, 3.3], [NOTE.D5, 4.1], [NOTE.E5, 4.55], [NOTE.C5, 5.3],
    ];
    for (const [f, when] of melody) this.bell(f, t + when, { peak: 0.06, decay: 1.6, attack: 0.02, wet: 0.5, shimmer: 0.35 });
    this.drop(NOTE.G5, t + 2.0, 0.03);
    this.drop(NOTE.C6, t + 3.9, 0.025);
  }

  /** Player do áudio do coach (voz desligada por enquanto, mas mantido) */
  public playAudioCoachToggle(isPlaying: boolean): void {
    const ctx = this.ready(false);
    if (!ctx) return;
    this.bell(isPlaying ? NOTE.E5 : NOTE.C5, ctx.currentTime, { peak: 0.05, decay: 0.5, wet: 0.2, shimmer: 0.2 });
  }
}

export const soundEffects = new SoundEffectsService();
