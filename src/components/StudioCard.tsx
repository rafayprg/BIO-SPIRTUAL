import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Sparkles,
  Volume2,
  VolumeX,
  Target,
  HelpCircle,
  Play,
  Square,
  CheckCircle2
} from 'lucide-react';
import type { Mode } from '../data/modes';

interface StudioCardProps {
  mode: Mode;
  isPlaying: boolean;
  isOpening: boolean;
  isBuffering: boolean;
  onTogglePlay: () => void;
  onLaunchFullScreen: () => void;
  onOpenSources: () => void;
  onOpenReader: () => void;
  onChimeCue?: () => void;
  analyser: AnalyserNode | null;
}

interface Phase {
  name: string;
  subtext: string;
  duration: number;
  scale: number;
  color: string;
}

const CYCLIC_PHASES: Phase[] = [
  { name: 'Inhale (Nose)', subtext: 'Deep breath in through nose', duration: 3.0, scale: 0.92, color: '#22d3ee' },
  { name: 'Top-Up Inhale', subtext: 'Quick second sip into chest', duration: 1.5, scale: 1.05, color: '#38bdf8' },
  { name: 'Long Exhale', subtext: 'Slow release through mouth', duration: 6.0, scale: 0.62, color: '#14b8a6' },
];

const BOX_PHASES: Phase[] = [
  { name: 'Inhale', subtext: 'Even inhale through nose', duration: 4.0, scale: 1.0, color: '#22d3ee' },
  { name: 'Hold', subtext: 'Hold gently full', duration: 4.0, scale: 1.0, color: '#f59e0b' },
  { name: 'Exhale', subtext: 'Smooth steady exhale', duration: 4.0, scale: 0.65, color: '#14b8a6' },
  { name: 'Hold Empty', subtext: 'Calm and steady', duration: 4.0, scale: 0.65, color: '#a855f7' },
];

export const StudioCard: React.FC<StudioCardProps> = ({
  mode,
  isPlaying,
  isOpening,
  isBuffering,
  onTogglePlay,
  onLaunchFullScreen,
  onOpenSources,
  onOpenReader,
  onChimeCue,
  analyser,
}) => {
  const [pattern, setPattern] = useState<'cyclic-sighing' | 'box-breathing'>(
    mode.recommendedBreathing || 'cyclic-sighing'
  );
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(3.0);
  const [isChimeMuted, setIsChimeMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'cooldown'>('details');

  // Sync initial pattern if mode changes
  useEffect(() => {
    const nextPattern = mode.recommendedBreathing || 'cyclic-sighing';
    setPattern(nextPattern);
    setPhaseIndex(0);
    const phases = nextPattern === 'cyclic-sighing' ? CYCLIC_PHASES : BOX_PHASES;
    setRemainingTime(phases[0].duration);
    if (mode.id === 'anger-impulse-reset') {
      setActiveTab('cooldown');
    } else {
      setActiveTab('details');
    }
  }, [mode.id, mode.recommendedBreathing]);

  const phases = pattern === 'cyclic-sighing' ? CYCLIC_PHASES : BOX_PHASES;
  const currentPhase = phases[phaseIndex] || phases[0];

  // Live Breathing Timer
  const lastTickRef = useRef<number>(Date.now());
  useEffect(() => {
    lastTickRef.current = Date.now();
    const interval = window.setInterval(() => {
      const now = Date.now();
      const deltaSec = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setRemainingTime((prev) => {
        const next = prev - deltaSec;
        if (next <= 0) {
          setPhaseIndex((curIdx) => {
            const nextIdx = (curIdx + 1) % phases.length;
            if (!isChimeMuted && onChimeCue) {
              onChimeCue();
            }
            return nextIdx;
          });
          return phases[(phaseIndex + 1) % phases.length]?.duration || 3.0;
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [phaseIndex, phases, isChimeMuted, onChimeCue]);

  // Canvas waveform visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (!isPlaying || !analyser) {
        // Resting ambient wave
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        const time = Date.now() * 0.002;
        for (let x = 0; x < width; x += 3) {
          const y = height / 2 + Math.sin(x * 0.04 + time) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      analyser.getByteTimeDomainData(dataArray);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isOpening ? '#fbbf24' : '#34d399';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [analyser, isPlaying, isOpening]);

  const totalPhaseDuration = currentPhase.duration;
  const progressRatio = Math.max(0, Math.min(1, (totalPhaseDuration - remainingTime) / totalPhaseDuration));

  return (
    <div className="relative w-full liquid-glass-elevated rounded-3xl p-5 sm:p-6 text-left shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Golden-amber top rim accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 opacity-80" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{mode.emoji}</span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>{mode.name}</span>
              {mode.arabicName && (
                <span className="font-arabic text-amber-300 text-sm font-bold">
                  ({mode.arabicName})
                </span>
              )}
            </h2>
            <div className="text-[11px] text-white/50 flex items-center gap-1.5 font-medium">
              {isBuffering ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400" /> Buffering recitation...
                </span>
              ) : isOpening ? (
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400" /> Opening Chord &amp; Ta'awwudh
                </span>
              ) : (
                <>
                  <span>432 Hz Carrier</span>
                  <span>·</span>
                  <span className="text-cyan-300 font-mono">{mode.band} {mode.beatHz} Hz</span>
                  <span>·</span>
                  <span className="text-white/70">Mishary Alafasy</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Studio Gold Badge & Fullscreen Button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-400/30">
            Studio
          </span>
          <button
            onClick={onLaunchFullScreen}
            title="Expand to Fullscreen Mandala Session"
            className="p-1.5 rounded-xl liquid-glass-pill text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verification Chips Row */}
      <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              mode.verification.islamicTag === 'Authentic Sunnah'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {mode.verification.islamicTag === 'Authentic Sunnah' ? '✓ Authentic Sunnah' : '📖 Quranic Theme'}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              mode.verification.scienceTag === 'Peer-Reviewed'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/10 text-white/60 border border-white/15'
            }`}
          >
            {mode.verification.scienceTag === 'Peer-Reviewed' ? '🔬 Peer-Reviewed' : '🧪 Emerging / Supportive'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSources}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 liquid-glass-pill hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            Sources
          </button>
          <button
            onClick={onOpenReader}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-300 liquid-glass-pill hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            Quran
          </button>
        </div>
      </div>

      {/* CENTERPIECE: Embedded Guided Breathing Concentric Ring */}
      <div className="relative my-4 p-4 rounded-2xl liquid-glass-card flex flex-col items-center justify-center text-center">
        {/* Breathing Protocol Selector Tabs */}
        <div className="flex items-center justify-between w-full mb-2 px-1">
          <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/10 text-[11px]">
            <button
              onClick={() => {
                setPattern('cyclic-sighing');
                setPhaseIndex(0);
                setRemainingTime(CYCLIC_PHASES[0].duration);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                pattern === 'cyclic-sighing'
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Cyclic Sighing
            </button>
            <button
              onClick={() => {
                setPattern('box-breathing');
                setPhaseIndex(0);
                setRemainingTime(BOX_PHASES[0].duration);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                pattern === 'box-breathing'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Box (4-4-4-4)
            </button>
          </div>

          <button
            onClick={() => setIsChimeMuted(!isChimeMuted)}
            title={isChimeMuted ? 'Unmute 432 Hz transition chime' : 'Mute 432 Hz chime'}
            className="p-1.5 rounded-lg liquid-glass-pill text-white/50 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {isChimeMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>

        {/* Concentric SVG Circle */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="76"
              className="stroke-white/10"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="76"
              stroke={currentPhase.color}
              strokeWidth="5"
              strokeDasharray={2 * Math.PI * 76}
              strokeDashoffset={2 * Math.PI * 76 * (1 - progressRatio)}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 0.08s linear, stroke 0.4s ease',
                filter: `drop-shadow(0 0 8px ${currentPhase.color}88)`,
              }}
            />
          </svg>

          {/* Concentric pulsing aura */}
          <div
            className="absolute rounded-full pointer-events-none transition-transform duration-700 ease-out"
            style={{
              width: '120px',
              height: '120px',
              transform: `scale(${currentPhase.scale})`,
              backgroundColor: `${currentPhase.color}15`,
              border: `1.5px solid ${currentPhase.color}50`,
              boxShadow: `0 0 25px ${currentPhase.color}35`,
            }}
          />

          {/* Central countdown & phase title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 select-none">
            <span
              className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight"
              style={{ color: currentPhase.color }}
            >
              {Math.ceil(remainingTime)}s
            </span>
            <span className="text-xs font-bold text-white font-orbitron tracking-wider mt-0.5">
              {currentPhase.name}
            </span>
            <span className="text-[10px] text-white/50 max-w-[120px] leading-tight mt-0.5">
              {currentPhase.subtext}
            </span>
          </div>
        </div>

        {/* Live Audio Waveform Canvas */}
        <div className="w-full mt-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1 px-1">
            <span>HARMONIC RESONANCE</span>
            <span className="text-amber-300 font-semibold">432 · 576 · 699 HZ</span>
          </div>
          <div className="w-full h-8 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
            <canvas ref={canvasRef} width={360} height={32} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Bottom Tabs: Mode Details vs Anger Cooldown Protocol */}
      <div className="mt-2 text-xs">
        {mode.sunnahChecklist && (
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer text-xs ${
                activeTab === 'details'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('cooldown')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer text-xs flex items-center gap-1.5 ${
                activeTab === 'cooldown'
                  ? 'bg-rose-500/25 text-rose-300 font-bold border border-rose-500/40'
                  : 'text-rose-400/70 hover:text-rose-300'
              }`}
            >
              <span>⏱️ 60s Sunnah Cooldown</span>
            </button>
          </div>
        )}

        {/* Cooldown Checklist Content */}
        {activeTab === 'cooldown' && mode.sunnahChecklist && (
          <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1.5 text-xs text-left mb-2">
            <div className="text-[10px] font-orbitron font-bold text-rose-300 uppercase tracking-wider mb-1">
              Prophetic Cooldown Steps:
            </div>
            {mode.sunnahChecklist.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Structured Details Content */}
        {activeTab === 'details' && (
          <div className="space-y-2 text-left text-xs bg-white/[0.02] p-3 rounded-2xl border border-white/5">
            <div className="flex items-start gap-2">
              <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white/90">FOR: </span>
                <span className="text-white/70 leading-relaxed">{mode.forText}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white/90">WHY THIS: </span>
                <span className="text-white/70 leading-relaxed">{mode.whyThisText}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Start / Stop Button */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <button
          onClick={onTogglePlay}
          className={`flex-1 py-3 rounded-2xl font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2 ${
            isPlaying
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Session</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Start Frequency → Quran</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
