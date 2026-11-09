/**
 * Web Audio Engine for DJ Wulf Website
 * Real-time sound synthesis for electronic beats and DJ party sound effects
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mixBus: GainNode | null = null;
  private trackGainNode: GainNode | null = null;
  private autoGainNode: GainNode | null = null;
  private limiterCompressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;

  private isPlaying = false;
  private timerId: number | null = null;
  private step = 0;
  private currentBpm = 126;
  private activePreset: 'midnight' | 'anthem' | 'subterranean' | 'sunset' = 'midnight';
  private trackDuration = 180; // 3 minutes simulated
  private playbackOffset = 0;
  private listeners: Array<() => void> = [];

  // Auto-Gain & Normalization State (EBU R128 standard)
  private normalizationEnabled = true;
  private targetLoudnessLUFS = -14.0; // Standard broadcast / streaming target
  private currentTrackRawLoudnessLUFS = -14.0;
  private appliedGainCompensationDb = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // 1. Synthesizer & DJ FX Summing Bus
      this.mixBus = this.ctx.createGain();

      // 2. Raw Upload Loudness Simulation Node (different unnormalized mixes)
      this.trackGainNode = this.ctx.createGain();

      // 3. Auto-Gain / Normalization Makeup Node
      this.autoGainNode = this.ctx.createGain();

      // 4. Studio Peak Limiter & Dynamics Compressor (protects headroom and prevents clipping)
      this.limiterCompressor = this.ctx.createDynamicsCompressor();

      // 5. User Master Gain Slider
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // 6. Fast Real-Time FFT Analyser for Visuals and Loudness
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.82;

      // Audio Graph Routing:
      // mixBus -> trackGainNode -> autoGainNode -> limiterCompressor -> masterGain -> analyser -> destination
      this.mixBus.connect(this.trackGainNode);
      this.trackGainNode.connect(this.autoGainNode);
      this.autoGainNode.connect(this.limiterCompressor);
      this.limiterCompressor.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.updateAutoGain();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private updateAutoGain() {
    if (!this.ctx || !this.trackGainNode || !this.autoGainNode || !this.limiterCompressor) return;
    const now = this.ctx.currentTime;

    // Inherent upload variation relative to baseline -14.0 LUFS
    const rawDiffDb = this.currentTrackRawLoudnessLUFS - (-14.0);
    const rawLinear = Math.pow(10, rawDiffDb / 20);
    this.trackGainNode.gain.setTargetAtTime(rawLinear, now, 0.05);

    if (this.normalizationEnabled) {
      // Compensate so perceived output reaches targetLoudnessLUFS
      this.appliedGainCompensationDb = this.targetLoudnessLUFS - this.currentTrackRawLoudnessLUFS;
      const compLinear = Math.pow(10, this.appliedGainCompensationDb / 20);
      this.autoGainNode.gain.setTargetAtTime(compLinear, now, 0.05);

      // Engage studio limiter compressor to transparently tame peaks and ensure zero clipping
      this.limiterCompressor.threshold.setTargetAtTime(-18, now, 0.05);
      this.limiterCompressor.knee.setTargetAtTime(10, now, 0.05);
      this.limiterCompressor.ratio.setTargetAtTime(12, now, 0.05);
      this.limiterCompressor.attack.setTargetAtTime(0.003, now, 0.05);
      this.limiterCompressor.release.setTargetAtTime(0.18, now, 0.05);
    } else {
      // Normalization OFF: track plays at raw uploaded loudness, compressor transparent
      this.appliedGainCompensationDb = 0;
      this.autoGainNode.gain.setTargetAtTime(1.0, now, 0.05);
      this.limiterCompressor.threshold.setTargetAtTime(0, now, 0.05);
      this.limiterCompressor.ratio.setTargetAtTime(1.0, now, 0.05);
    }

    this.notify();
  }

  public setNormalizationEnabled(enabled: boolean) {
    this.normalizationEnabled = enabled;
    this.updateAutoGain();
  }

  public getNormalizationEnabled(): boolean {
    return this.normalizationEnabled;
  }

  public setTargetLoudnessLUFS(target: number) {
    this.targetLoudnessLUFS = target;
    this.updateAutoGain();
  }

  public getTargetLoudnessLUFS(): number {
    return this.targetLoudnessLUFS;
  }

  public setTrackRawLoudnessLUFS(rawLufs: number) {
    this.currentTrackRawLoudnessLUFS = rawLufs;
    this.updateAutoGain();
  }

  public getTrackRawLoudnessLUFS(): number {
    return this.currentTrackRawLoudnessLUFS;
  }

  public getAppliedGainCompensationDb(): number {
    return this.appliedGainCompensationDb;
  }

  public getLimiterReductionDb(): number {
    if (!this.limiterCompressor) return 0;
    return Math.abs(this.limiterCompressor.reduction);
  }

  public getRmsDb(): number {
    if (!this.analyser || !this.isPlaying) return -60;
    const buffer = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buffer);
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    if (rms <= 0.0001) return -60;
    const db = 20 * Math.log10(rms);
    return Math.max(-60, Math.min(0, Math.round(db * 10) / 10));
  }

  public setVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      const safe = Math.max(0, Math.min(1, val));
      this.masterGain.gain.setValueAtTime(safe, this.ctx.currentTime);
      this.notify();
    }
  }

  public getVolume(): number {
    return this.masterGain ? this.masterGain.gain.value : 0.7;
  }

  public setBpm(bpm: number) {
    this.currentBpm = bpm;
  }

  public setPreset(preset: 'midnight' | 'anthem' | 'subterranean' | 'sunset', bpm = 126, rawLufs = -14.0) {
    this.activePreset = preset;
    this.currentBpm = bpm;
    this.currentTrackRawLoudnessLUFS = rawLufs;
    this.updateAutoGain();
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;

    const intervalMs = (60 / this.currentBpm / 4) * 1000; // 16th notes
    this.timerId = window.setInterval(() => {
      this.tick();
    }, intervalMs);

    this.notify();
  }

  public pause() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public seek(seconds: number) {
    this.playbackOffset = Math.max(0, Math.min(this.trackDuration, seconds));
    this.notify();
  }

  public getCurrentTime(): number {
    return this.playbackOffset;
  }

  public getDuration(): number {
    return this.trackDuration;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(64).fill(0);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(64).fill(128);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  private tick() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const stepInBar = this.step % 16;

    // Advance playback clock
    this.playbackOffset += (60 / this.currentBpm / 4);
    if (this.playbackOffset >= this.trackDuration) {
      this.playbackOffset = 0;
    }

    // 1. Kick Drum (Steps 0, 4, 8, 12 - 4 to the floor)
    if (stepInBar % 4 === 0) {
      this.synthesizeKick(now);
    }

    // 2. Offbeat Hi-hat (Steps 2, 6, 10, 14)
    if (stepInBar % 4 === 2) {
      this.synthesizeHiHat(now);
    }

    // 3. Preset-specific melody / bassline
    this.synthesizeMelodyStep(stepInBar, now);

    this.step++;
    if (this.step % 4 === 0) {
      this.notify();
    }
  }

  private synthesizeKick(time: number) {
    if (!this.ctx || !this.mixBus) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.12);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.mixBus);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  private synthesizeHiHat(time: number) {
    if (!this.ctx || !this.mixBus) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.mixBus);

    noise.start(time);
    noise.stop(time + 0.06);
  }

  private synthesizeMelodyStep(step: number, time: number) {
    if (!this.ctx || !this.mixBus) return;

    let freq = 0;
    // Preset scale notes
    if (this.activePreset === 'midnight') {
      // F Minor Techno notes (F2, Ab2, C3, Bb2)
      const fNotes = [87.31, 103.83, 130.81, 116.54, 87.31, 103.83, 174.61, 130.81];
      if (step % 2 === 1) {
        freq = fNotes[Math.floor(step / 2) % fNotes.length];
      }
    } else if (this.activePreset === 'anthem') {
      // A Minor Big Room / Festival lead (A2, C3, E3, G3)
      const aNotes = [110, 130.81, 164.81, 196.0, 220, 196, 164.81, 130.81];
      if (step % 2 === 0) {
        freq = aNotes[Math.floor(step / 2) % aNotes.length];
      }
    } else if (this.activePreset === 'subterranean') {
      // Acid 303 Rolling Bass
      const dNotes = [73.42, 73.42, 82.41, 73.42, 98.0, 73.42, 110, 73.42];
      freq = dNotes[step % 8];
    } else {
      // Sunset Melodic Pluck
      const cNotes = [130.81, 146.83, 164.81, 196.0, 220, 261.63, 196.0, 164.81];
      if (step % 4 === 1 || step % 4 === 3) {
        freq = cNotes[step % cNotes.length];
      }
    }

    if (freq > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = this.activePreset === 'subterranean' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      const cutoff = this.activePreset === 'subterranean' ? 1400 : 800;
      filter.frequency.setValueAtTime(cutoff, time);
      filter.Q.setValueAtTime(4, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.mixBus);

      osc.start(time);
      osc.stop(time + 0.2);
    }
  }

  // ==========================================
  // DJ PARTY SOUND EFFECTS
  // ==========================================

  public playAirhorn() {
    this.initContext();
    if (!this.ctx || !this.mixBus) return;
    const now = this.ctx.currentTime;

    const blasts = [0, 0.12, 0.28];
    blasts.forEach(offset => {
      const t = now + offset;
      const osc1 = this.ctx!.createOscillator();
      const osc2 = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      // Traditional airhorn dual tones (~466Hz Bb4 & 587Hz D5)
      osc1.frequency.setValueAtTime(466, t);
      osc2.frequency.setValueAtTime(587, t);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.mixBus!);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.15);
      osc2.stop(t + 0.15);
    });
  }

  public playBassDrop() {
    this.initContext();
    if (!this.ctx || !this.mixBus) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(gain);
    gain.connect(this.mixBus);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  public playRiser() {
    this.initContext();
    if (!this.ctx || !this.mixBus) return;
    const now = this.ctx.currentTime;
    const duration = 1.6;

    // White noise sweep with rising bandpass filter
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(4500, now + duration);
    filter.Q.setValueAtTime(5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.6, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.mixBus);

    noise.start(now);
    noise.stop(now + duration + 0.05);
  }

  public playLaserZap() {
    this.initContext();
    if (!this.ctx || !this.mixBus) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.mixBus);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playCrowdCheer() {
    this.initContext();
    if (!this.ctx || !this.mixBus) return;
    const now = this.ctx.currentTime;
    const duration = 2.0;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(2200, now + 0.8);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.mixBus);

    noise.start(now);
    noise.stop(now + duration + 0.05);
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }
}

export const soundEngine = new AudioEngine();
