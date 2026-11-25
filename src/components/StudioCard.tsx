import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Sparkles,
  Target,
  HelpCircle,
  Play,
  Pause,
  Square,
  CheckCircle2,
  Wind,
  ShieldCheck,
  BookOpen,
  Activity,
  Radio,
  Clock
} from 'lucide-react';
import type { Mode } from '../data/modes';

interface StudioCardProps {
  mode: Mode;
  isPlaying: boolean;
  isPaused?: boolean;
  isOpening: boolean;
  isBuffering: boolean;
  onTogglePlay: () => void;
  onEndSession?: () => void;
  onLaunchFullScreen: () => void;
  onOpenSources: () => void;
  onOpenReader: () => void;
  onOpenBreathing?: () => void;
  onChimeCue?: () => void;
  analyser: AnalyserNode | null;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  mode,
  isPlaying,
  isPaused,
  isOpening,
  isBuffering,
  onTogglePlay,
  onEndSession,
  onLaunchFullScreen,
  onOpenSources,
  onOpenReader,
  onOpenBreathing,
  analyser,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'cooldown'>('details');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync initial tab when mode changes
  useEffect(() => {
    if (mode.id === 'anger-impulse-reset') {
      setActiveTab('cooldown');
    } else {
      setActiveTab('details');
    }
  }, [mode.id]);

  // Live Audio Spectrum / Harmonic Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!isPlaying || !analyser) {
        // Subtle ambient idle wave
        const time = Date.now() * 0.002;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.04 + time) * 4;
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

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, isOpening, analyser]);

  return (
    <div className="relative w-full rounded-3xl p-5 sm:p-6 liquid-glass-card shadow-2xl flex flex-col justify-between text-left select-none border border-white/15">
      {/* Top Card Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/10 border border-cyan-400/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
            {mode.emoji}
          </div>

          <div className="text-left min-w-0">
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-orbitron truncate">
              {mode.name}
            </h3>

            <div className="text-[11px] text-white/50 flex items-center gap-1.5 font-medium truncate">
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
                  <span className="text-amber-300 font-mono font-bold">{mode.carrierHz} Hz Carrier</span>
                  <span>·</span>
                  <span className="text-cyan-300 font-mono font-semibold">{mode.band} {mode.beatHz} Hz</span>
                  <span>·</span>
                  <span className="text-white/70">Mishary Alafasy</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Studio Gold Badge & Fullscreen Button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden xs:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
            ⏱ {mode.sessionDefaults.durationBadge}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-400/30">
            Studio
          </span>
          <button
            onClick={onLaunchFullScreen}
            title="Expand to Fullscreen Mandala Session"
            className="p-2 rounded-xl liquid-glass-pill text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verification Chips & Action Shortcuts Row */}
      <div className="flex items-center justify-between gap-2 mt-3.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              mode.verification.islamicTag === 'Authentic Sunnah'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {mode.verification.islamicTag === 'Authentic Sunnah' ? '✓ Sunnah' : '📖 Quranic Theme'}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              mode.verification.scienceTag === 'Peer-Reviewed'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/10 text-white/60 border border-white/15'
            }`}
          >
            {mode.verification.scienceTag === 'Peer-Reviewed' ? '🔬 Peer-Reviewed' : '🧪 Supportive'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenBreathing && (
            <button
              onClick={onOpenBreathing}
              title="Open Guided Breathing Modal"
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-cyan-300 liquid-glass-pill hover:bg-cyan-500/20 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Breathing</span>
            </button>
          )}

          <button
            onClick={onOpenSources}
            title="View Peer-Reviewed Citations"
            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-emerald-300 liquid-glass-pill hover:bg-emerald-500/20 transition-colors cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sources</span>
          </button>

          <button
            onClick={onOpenReader}
            title="Read Quran & Translation"
            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-amber-300 liquid-glass-pill hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Quran</span>
          </button>
        </div>
      </div>

      {/* Mode Spec Architecture Grid (Clean, Calm, No Ticking) */}
      <div className="my-4 grid grid-cols-3 gap-2.5 text-center">
        <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-[10px] font-orbitron uppercase tracking-wider text-amber-400 font-bold mb-0.5">
            <Radio className="w-3 h-3 text-amber-400" />
            <span>Carrier</span>
          </div>
          <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-300">
            {mode.carrierHz} Hz
          </span>
          <span className="text-[9px] text-white/40">
            {mode.carrierHz === 432 ? 'Golden φ 4:3' : mode.carrierHz === 528 ? 'Solfeggio 528' : 'Solfeggio 396'}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-[10px] font-orbitron uppercase tracking-wider text-cyan-400 font-bold mb-0.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Brainwave</span>
          </div>
          <span className="text-xs sm:text-sm font-mono font-extrabold text-cyan-300">
            {mode.beatHz} Hz
          </span>
          <span className="text-[9px] text-cyan-300/60 font-semibold">{mode.band} Band</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-[10px] font-orbitron uppercase tracking-wider text-emerald-400 font-bold mb-0.5">
            <BookOpen className="w-3 h-3 text-emerald-400" />
            <span>Surah</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[90px]">
            {mode.surahDisplay.split('+')[0].trim()}
          </span>
          <span className="text-[9px] text-white/40">{mode.revelationType}</span>
        </div>
      </div>

      {/* Live Audio Waveform Canvas */}
      <div className="w-full mb-3 p-3 rounded-2xl bg-black/40 border border-white/10">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1.5 px-0.5">
          <span className="flex items-center gap-1 text-cyan-300 font-bold">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            HARMONIC RESONANCE
          </span>
          <span className="text-amber-300 font-bold tracking-wider">432 · 576 · 699 HZ</span>
        </div>
        <div className="w-full h-10 bg-black/50 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
          <canvas ref={canvasRef} width={380} height={40} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Details vs Prophetic Cooldown Tabs */}
      <div className="text-xs">
        {mode.sunnahChecklist && (
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
                activeTab === 'details'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('cooldown')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer text-xs flex items-center gap-1.5 ${
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
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2 text-xs text-left mb-2">
            <div className="text-[10px] font-orbitron font-bold text-rose-300 uppercase tracking-wider">
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
          <div className="space-y-2 text-left text-xs bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
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

            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white/90">TIMING BASIS: </span>
                <span className="text-white/70 leading-relaxed">{mode.sessionDefaults.timingGuidance}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Start / Pause / Resume / End Button */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
        <button
          onClick={onTogglePlay}
          className={`flex-1 py-3 rounded-2xl font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2 ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : isPaused
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Session</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Continue / Resume</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Start Frequency → Quran</span>
            </>
          )}
        </button>

        {/* End Session Button when playing or paused */}
        {(isPlaying || isPaused) && onEndSession && (
          <button
            onClick={onEndSession}
            title="End session and reset to start"
            className="px-3.5 py-3 rounded-2xl font-orbitron font-bold text-xs uppercase bg-rose-500/15 text-rose-300 border border-rose-500/35 hover:bg-rose-500/25 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">End</span>
          </button>
        )}
      </div>
    </div>
  );
};
