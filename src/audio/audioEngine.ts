// Web Audio API Engine for Bio Spiritual Hacking — Neuro Reset Console

export interface AudioEngineCallbacks {
  onPlayStateChange?: (isPlaying: boolean) => void;
  onOpeningPhaseChange?: (isOpening: boolean) => void;
  onSurahChange?: (surahIndex: number, surahNumber: number) => void;
  onAyahProgress?: (ayahIndex: number, totalAyahs: number) => void;
  onBufferingChange?: (isBuffering: boolean) => void;
  onError?: (errorMessage: string) => void;
}

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  
  // Binaural nodes
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private channelMerger: ChannelMergerNode | null = null;
  
  // Master & Analyser nodes
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  
  // Quran layer
  private quranAudioElement: HTMLAudioElement | null = null;
  private bismillahAudioElement: HTMLAudioElement | null = null;
  private quranGain: GainNode | null = null;
  
  // Opening chord oscillators
  private chordOscs: OscillatorNode[] = [];
  private chordGain: GainNode | null = null;
  
  // State
  private isPlaying = false;
  private isOpening = false;
  private isQuranMuted = false;
  private isFrequencyMuted = false;
  private binauralVolume = 0.5;
  private quranVolume = 0.85;
  public currentCarrierHz = 432;
  public currentBeatHz = 10;
  private surahQueue: number[] = [55];
  private totalAyahsQueue: number[] = [78];
  private customAudioUrls: string[] = [];
  private currentQueueIndex = 0;
  private openingTimer: number | null = null;
  
  // Fallback CDN list
  private currentCdnAttempt = 0;
  private candidateUrls: string[] = [];
  
  private callbacks: AudioEngineCallbacks = {};

  constructor(callbacks: AudioEngineCallbacks = {}) {
    this.callbacks = callbacks;
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.audioCtx.currentTime);

      // Analyser for visualizer
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      // Binaural Gain
      this.binauralGain = this.audioCtx.createGain();
      this.binauralGain.gain.setValueAtTime(this.binauralVolume, this.audioCtx.currentTime);
      this.binauralGain.connect(this.masterGain);

      // Channel Merger for stereo binaural
      this.channelMerger = this.audioCtx.createChannelMerger(2);
      this.channelMerger.connect(this.binauralGain);

      // Quran Gain
      this.quranGain = this.audioCtx.createGain();
      this.quranGain.gain.setValueAtTime(this.quranVolume, this.audioCtx.currentTime);
      this.quranGain.connect(this.masterGain);

      // Pre-create exact Taawwudh Audio element
      this.bismillahAudioElement = new Audio('/audio/taawwudh.mp3');
      this.bismillahAudioElement.preload = 'auto';

      // Pre-create Quran Audio element
      this.quranAudioElement = new Audio();
      this.quranAudioElement.preload = 'auto';

      this.quranAudioElement.addEventListener('ended', this.handleSurahEnded);
      this.quranAudioElement.addEventListener('error', this.handleAudioError);
      this.quranAudioElement.addEventListener('timeupdate', this.handleTimeUpdate);
      this.quranAudioElement.addEventListener('waiting', () => this.callbacks.onBufferingChange?.(true));
      this.quranAudioElement.addEventListener('playing', () => this.callbacks.onBufferingChange?.(false));
      this.quranAudioElement.addEventListener('canplay', () => this.callbacks.onBufferingChange?.(false));
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolumes(binauralVol: number, quranVol: number) {
    this.binauralVolume = Math.max(0, Math.min(1, binauralVol));
    this.quranVolume = Math.max(0, Math.min(1, quranVol));

    if (this.audioCtx && this.binauralGain && !this.isFrequencyMuted) {
      const now = this.audioCtx.currentTime;
      this.binauralGain.gain.cancelScheduledValues(now);
      this.binauralGain.gain.linearRampToValueAtTime(this.binauralVolume, now + 0.05);
    }

    if (this.audioCtx && this.quranGain && !this.isQuranMuted) {
      const now = this.audioCtx.currentTime;
      this.quranGain.gain.cancelScheduledValues(now);
      this.quranGain.gain.linearRampToValueAtTime(this.quranVolume, now + 0.05);
    }

    if (this.quranAudioElement) {
      this.quranAudioElement.volume = this.isQuranMuted ? 0 : this.quranVolume;
    }

    if (this.bismillahAudioElement) {
      this.bismillahAudioElement.volume = this.isQuranMuted ? 0 : this.quranVolume;
    }
  }

  public toggleQuran(): boolean {
    this.isQuranMuted = !this.isQuranMuted;
    const target = this.isQuranMuted ? 0 : this.quranVolume;

    if (this.quranAudioElement) {
      this.quranAudioElement.volume = target;
    }
    if (this.bismillahAudioElement) {
      this.bismillahAudioElement.volume = target;
    }
    return !this.isQuranMuted;
  }

  public toggleFrequency(): boolean {
    this.isFrequencyMuted = !this.isFrequencyMuted;
    if (this.binauralGain && this.audioCtx) {
      const target = this.isFrequencyMuted ? 0 : this.binauralVolume;
      const now = this.audioCtx.currentTime;
      this.binauralGain.gain.cancelScheduledValues(now);
      this.binauralGain.gain.linearRampToValueAtTime(target, now + 0.1);
    }
    return !this.isFrequencyMuted;
  }

  public async startSession(
    carrierHz: number,
    beatHz: number,
    surahNumbers: number[],
    totalAyahs: number[] = [10],
    customAudioUrls?: string[]
  ) {
    this.initContext();
    if (!this.audioCtx) return;

    await this.audioCtx.resume();

    this.currentCarrierHz = carrierHz;
    this.currentBeatHz = beatHz;
    this.surahQueue = surahNumbers;
    this.totalAyahsQueue = totalAyahs;
    this.customAudioUrls = customAudioUrls || [];
    this.currentQueueIndex = 0;
    this.isQuranMuted = false;
    this.isFrequencyMuted = false;

    this.isPlaying = true;
    this.callbacks.onPlayStateChange?.(true);

    // 1. Start Stereo Binaural Reset Beat
    this.startBinauralBeat(carrierHz, beatHz);

    // 2. Play Golden-Ratio Opening Chord + exact Taawwudh/Bismillah
    this.playGoldenRatioOpening();
  }

  public updateParameters(
    carrierHz: number,
    beatHz: number,
    surahNumbers: number[],
    totalAyahs: number[] = [10],
    customAudioUrls?: string[]
  ) {
    this.currentCarrierHz = carrierHz;
    this.currentBeatHz = beatHz;
    this.surahQueue = surahNumbers;
    this.totalAyahsQueue = totalAyahs;
    this.customAudioUrls = customAudioUrls || [];
    this.currentQueueIndex = 0;

    if (this.isPlaying && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      if (this.leftOsc) {
        this.leftOsc.frequency.cancelScheduledValues(now);
        this.leftOsc.frequency.exponentialRampToValueAtTime(carrierHz, now + 0.15);
      }
      if (this.rightOsc) {
        this.rightOsc.frequency.cancelScheduledValues(now);
        this.rightOsc.frequency.exponentialRampToValueAtTime(carrierHz + beatHz, now + 0.15);
      }

      if (!this.isOpening) {
        this.playCurrentSurah();
      }
    }
  }

  /**
   * Gentle 432 Hz Sine Ping Chime Cue for Guided Breathing phase transitions
   */
  public playChimeCue(freq = 432) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // ignore
    }
  }

  public stopSession() {
    this.isPlaying = false;
    this.isOpening = false;
    this.callbacks.onPlayStateChange?.(false);
    this.callbacks.onOpeningPhaseChange?.(false);

    if (this.openingTimer) {
      clearTimeout(this.openingTimer);
      this.openingTimer = null;
    }

    this.stopBinauralBeat();
    this.stopOpeningChord();

    if (this.bismillahAudioElement) {
      this.bismillahAudioElement.pause();
      this.bismillahAudioElement.currentTime = 0;
    }

    if (this.quranAudioElement) {
      this.quranAudioElement.pause();
      this.quranAudioElement.currentTime = 0;
    }
  }

  private startBinauralBeat(carrierHz: number, beatHz: number) {
    if (!this.audioCtx || !this.channelMerger || !this.binauralGain) return;

    this.stopBinauralBeat();

    const now = this.audioCtx.currentTime;

    // Left channel = carrierHz
    this.leftOsc = this.audioCtx.createOscillator();
    this.leftOsc.type = 'sine';
    this.leftOsc.frequency.setValueAtTime(carrierHz, now);

    // Right channel = carrierHz + beatHz
    this.rightOsc = this.audioCtx.createOscillator();
    this.rightOsc.type = 'sine';
    this.rightOsc.frequency.setValueAtTime(carrierHz + beatHz, now);

    // Connect to channel merger (Left to 0, Right to 1)
    this.leftOsc.connect(this.channelMerger, 0, 0);
    this.rightOsc.connect(this.channelMerger, 0, 1);

    // Smooth fade-in
    this.binauralGain.gain.setValueAtTime(0, now);
    this.binauralGain.gain.linearRampToValueAtTime(
      this.isFrequencyMuted ? 0 : this.binauralVolume,
      now + 1.0
    );

    this.leftOsc.start(now);
    this.rightOsc.start(now);
  }

  private stopBinauralBeat() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    if (this.binauralGain) {
      this.binauralGain.gain.cancelScheduledValues(now);
      this.binauralGain.gain.linearRampToValueAtTime(0, now + 0.2);
    }

    const oscLeft = this.leftOsc;
    const oscRight = this.rightOsc;
    this.leftOsc = null;
    this.rightOsc = null;

    setTimeout(() => {
      try {
        oscLeft?.stop();
        oscLeft?.disconnect();
        oscRight?.stop();
        oscRight?.disconnect();
      } catch {
        // ignore
      }
    }, 250);
  }

  private playGoldenRatioOpening() {
    if (!this.audioCtx || !this.masterGain) return;

    this.isOpening = true;
    this.callbacks.onOpeningPhaseChange?.(true);

    const now = this.audioCtx.currentTime;
    this.stopOpeningChord();

    // Golden-ratio harmonic chord: 432 Hz, 576 Hz (4:3), 699 Hz (φ ≈ 1.618)
    const chordFrequencies = [432, 576, 699];

    this.chordGain = this.audioCtx.createGain();
    this.chordGain.gain.setValueAtTime(0, now);
    this.chordGain.gain.linearRampToValueAtTime(0.2, now + 1.0);
    this.chordGain.gain.setValueAtTime(0.2, now + 4.5);
    this.chordGain.gain.linearRampToValueAtTime(0.001, now + 6.2);
    this.chordGain.connect(this.masterGain);

    this.chordOscs = chordFrequencies.map((freq) => {
      const osc = this.audioCtx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(this.chordGain!);
      osc.start(now);
      osc.stop(now + 6.5);
      return osc;
    });

    if (this.bismillahAudioElement) {
      this.bismillahAudioElement.currentTime = 0;
      this.bismillahAudioElement.volume = this.quranVolume;
      this.bismillahAudioElement.play().catch(() => {});
    }

    if (this.openingTimer) clearTimeout(this.openingTimer);
    // Transition smoothly after Taawwudh finishes (~6.2s) into the Surah recitation
    this.openingTimer = window.setTimeout(() => {
      if (!this.isPlaying) return;
      this.isOpening = false;
      this.callbacks.onOpeningPhaseChange?.(false);
      this.playCurrentSurah();
    }, 6200);
  }

  private stopOpeningChord() {
    this.chordOscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.chordOscs = [];
    if (this.chordGain) {
      this.chordGain.disconnect();
      this.chordGain = null;
    }
  }

  /**
   * Multi-CDN Fallback URLs (Cloudflare Global Edge, QuranicAudio, IslamicNetwork)
   */
  private getSurahCandidateUrls(surahNumber: number): string[] {
    const padded = surahNumber.toString().padStart(3, '0');
    return [
      `https://cdn.mp3quran.net/audio/mishary-alafasy/r1/${padded}.mp3`,
      `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${padded}.mp3`,
      `https://server8.mp3quran.net/afs/${padded}.mp3`,
    ];
  }

  private playCurrentSurah() {
    if (!this.isPlaying || !this.quranAudioElement) return;

    const surahNumber = this.surahQueue[this.currentQueueIndex] || this.surahQueue[0];
    const totalAyahs = this.totalAyahsQueue[this.currentQueueIndex] || 7;

    this.callbacks.onSurahChange?.(this.currentQueueIndex, surahNumber);
    this.callbacks.onAyahProgress?.(1, totalAyahs);

    if (this.customAudioUrls && this.customAudioUrls.length > 0) {
      const customUrl = this.customAudioUrls[this.currentQueueIndex % this.customAudioUrls.length];
      this.candidateUrls = [customUrl, ...this.getSurahCandidateUrls(surahNumber)];
    } else {
      this.candidateUrls = this.getSurahCandidateUrls(surahNumber);
    }

    this.currentCdnAttempt = 0;
    this.loadAndPlayCurrentCdn();
  }

  private loadAndPlayCurrentCdn() {
    if (!this.quranAudioElement || !this.candidateUrls.length) return;

    const url = this.candidateUrls[this.currentCdnAttempt];
    if (!url) return;

    try {
      this.quranAudioElement.pause();
    } catch {
      // ignore
    }

    this.quranAudioElement.src = url;
    this.quranAudioElement.volume = this.isQuranMuted ? 0 : this.quranVolume;
    this.quranAudioElement.load();

    const playPromise = this.quranAudioElement.play();
    if (playPromise) {
      playPromise.catch((err: Error) => {
        // AbortError is expected when user switches tracks quickly; ignore it
        if (err.name === 'AbortError') return;
        console.warn(`CDN [${url}] playback failed:`, err);
        this.tryNextCdnFallback();
      });
    }
  }

  private tryNextCdnFallback() {
    this.currentCdnAttempt += 1;
    if (this.currentCdnAttempt < this.candidateUrls.length) {
      console.log(`Switching to backup Quran CDN #${this.currentCdnAttempt + 1}...`);
      this.loadAndPlayCurrentCdn();
    } else {
      this.callbacks.onError?.('Network error: Unable to stream recitation audio from CDN. Please check your internet connection.');
    }
  }

  private handleTimeUpdate = () => {
    if (!this.quranAudioElement || !this.isPlaying || this.isOpening) return;
    const dur = this.quranAudioElement.duration;
    const cur = this.quranAudioElement.currentTime;
    if (!dur || isNaN(dur)) return;

    const totalAyahs = this.totalAyahsQueue[this.currentQueueIndex] || 7;
    
    // First 5.5 seconds of the Surah track is Bismillah
    if (cur < 5.5) {
      this.callbacks.onAyahProgress?.(0, totalAyahs);
      return;
    }

    // Remaining duration is divided across the surah ayahs
    const progress = Math.min(1, Math.max(0, (cur - 5.5) / (dur - 5.5)));
    const ayah = Math.min(totalAyahs, Math.max(1, Math.floor(progress * totalAyahs) + 1));
    this.callbacks.onAyahProgress?.(ayah, totalAyahs);
  };

  private handleSurahEnded = () => {
    if (!this.isPlaying) return;
    const maxLen = this.customAudioUrls && this.customAudioUrls.length > 0
      ? this.customAudioUrls.length
      : this.surahQueue.length;
    this.currentQueueIndex = (this.currentQueueIndex + 1) % maxLen;
    this.playCurrentSurah();
  };

  private handleAudioError = () => {
    // Attempt fallback immediately on audio element error
    this.tryNextCdnFallback();
  };
}
