import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Headphones, Sparkles, BookOpen, Clock, ChevronUp, Check, RotateCcw } from 'lucide-react';
import type { Mode } from '../data/modes';

interface LiquidAudioDockProps {
  currentMode: Mode;
  isPlaying: boolean;
  isOpening: boolean;
  isBuffering: boolean;
  activeSurahNumber: number;
  binauralVolume: number;
  quranVolume: number;
  timerMode: string;
  remainingSeconds: number;
  currentSunnahIteration: number;
  onSetTimerPreset: (preset: string) => void;
  onTogglePlay: () => void;
  onBinauralVolumeChange: (vol: number) => void;
  onQuranVolumeChange: (vol: number) => void;
  onOpenReader: () => void;
}

export const LiquidAudioDock: React.FC<LiquidAudioDockProps> = ({
  currentMode,
  isPlaying,
  isOpening,
  isBuffering,
  activeSurahNumber,
  binauralVolume,
  quranVolume,
  timerMode,
  remainingSeconds,
  currentSunnahIteration,
  onSetTimerPreset,
  onTogglePlay,
  onBinauralVolumeChange,
  onQuranVolumeChange,
  onOpenReader,
}) => {
  const [isTimerPopoverOpen, setIsTimerPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Click outside listener for timer popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsTimerPopoverOpen(false);
      }
    };
    if (isTimerPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTimerPopoverOpen]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getTimerDisplayLabel = () => {
    if (timerMode === 'loop') return '∞ Continuous';
    if (timerMode === 'sunnah' && currentMode.sessionDefaults.sunnahRepeatCount) {
      return `Recitation ${currentSunnahIteration} of ${currentMode.sessionDefaults.sunnahRepeatCount}`;
    }
    return `${formatTime(remainingSeconds)} left`;
  };

  return (
    <div className="relative w-full liquid-glass rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 select-none border border-white/15">
      {/* Row 1 on Mobile / Left on Desktop: Play/Pause circular button + Track info */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Main Play/Pause Button (44px min target) */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Stop session' : 'Start session'}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg active:scale-95 shrink-0 ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                : 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 font-bold hover:scale-105 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
            }`}
          >
            {isPlaying ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Mode & Streaming Status */}
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
              <span className="truncate">{currentMode.emoji} {currentMode.name}</span>
              <span className="text-white/40 shrink-0">·</span>
              <span className="text-cyan-300 font-mono text-[11px] font-semibold shrink-0">
                {currentMode.carrierHz}Hz / {currentMode.beatHz}Hz
              </span>
            </div>

            <div className="text-[10.5px] text-white/50 truncate">
              {isBuffering ? (
                <span className="text-amber-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400 shrink-0" />
                  Buffering recitation...
                </span>
              ) : isOpening ? (
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin shrink-0" />
                  Golden Tone 432 · Bismillah...
                </span>
              ) : isPlaying ? (
                <span className="text-emerald-400 font-medium">
                  Streaming Surah #{activeSurahNumber} (Mishary Alafasy)
                </span>
              ) : (
                <span>Click Start Frequency to initialize</span>
              )}
            </div>
          </div>
        </div>

        {/* Headphones badge (Desktop only) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-[11px] text-teal-300 shrink-0">
          <Headphones className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="font-medium">Headphones Recommended</span>
        </div>

        {/* Mobile Quick Reader Button in top row */}
        <button
          onClick={onOpenReader}
          title="Read Arabic Quran & Translation"
          className="md:hidden p-2 rounded-xl liquid-glass-pill text-amber-400 hover:bg-white/10 shrink-0 active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Row 2 on Mobile / Right on Desktop: Timer Control + Dual Volume Sliders */}
      <div className="flex items-center gap-2.5 sm:gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
        {/* Interactive Session Timer Button & Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setIsTimerPopoverOpen(!isTimerPopoverOpen)}
            title="Configure Session Duration & Sunnah Repetitions"
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl liquid-glass-pill hover:bg-white/15 text-xs font-mono font-bold text-amber-300 border border-amber-400/30 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{getTimerDisplayLabel()}</span>
            <ChevronUp className={`w-3 h-3 text-amber-300/70 transition-transform ${isTimerPopoverOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Liquid Glass Timer Popover Menu */}
          {isTimerPopoverOpen && (
            <div className="absolute bottom-full mb-2 left-0 sm:left-auto sm:right-0 w-60 rounded-2xl liquid-glass-elevated border border-white/20 p-2.5 shadow-2xl text-left z-50 text-xs backdrop-blur-2xl">
              <div className="px-2 py-1 text-[10px] font-orbitron font-bold uppercase tracking-wider text-white/50 border-b border-white/10 mb-1.5">
                Session Timer &amp; Repeats
              </div>

              {/* Default Recommended Option */}
              <button
                onClick={() => {
                  onSetTimerPreset('default');
                  setIsTimerPopoverOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer mb-1 ${
                  timerMode === 'default'
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div>
                  <span className="block font-bold">Default (Recommended)</span>
                  <span className="text-[10px] text-white/50">{currentMode.sessionDefaults.durationBadge}</span>
                </div>
                {timerMode === 'default' && <Check className="w-3.5 h-3.5 text-amber-300" />}
              </button>

              {/* Sunnah Count Mode (if authentic count exists) */}
              {currentMode.sessionDefaults.sunnahRepeatCount && (
                <button
                  onClick={() => {
                    onSetTimerPreset('sunnah');
                    setIsTimerPopoverOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer mb-1 ${
                    timerMode === 'sunnah'
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 font-bold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="block font-bold">✓ {currentMode.sessionDefaults.sunnahLabel} Mode</span>
                    <span className="text-[10px] text-white/50">Stop after {currentMode.sessionDefaults.sunnahRepeatCount}× full recitation</span>
                  </div>
                  {timerMode === 'sunnah' && <Check className="w-3.5 h-3.5 text-emerald-300" />}
                </button>
              )}

              {/* Quick Minutes Presets */}
              <div className="grid grid-cols-2 gap-1 my-1 pt-1 border-t border-white/10">
                {[
                  { id: '5m', label: '5 min (Acute)', mins: 5 },
                  { id: '15m', label: '15 min (Std)', mins: 15 },
                  { id: '20m', label: '20 min (Optimal)', mins: 20 },
                  { id: '30m', label: '30 min (Deep)', mins: 30 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSetTimerPreset(item.id);
                      setIsTimerPopoverOpen(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors text-center cursor-pointer ${
                      timerMode === item.id
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 font-bold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Continuous Loop */}
              <button
                onClick={() => {
                  onSetTimerPreset('loop');
                  setIsTimerPopoverOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer mt-1 ${
                  timerMode === 'loop'
                    ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40 font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3 h-3 text-purple-400" />
                  <span>∞ Continuous Loop</span>
                </div>
                {timerMode === 'loop' && <Check className="w-3.5 h-3.5 text-purple-300" />}
              </button>
            </div>
          )}
        </div>

        {/* Sliders Container (Full width on mobile with wide touch handles) */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 md:flex-initial justify-around md:justify-end">
          {/* Frequency Volume */}
          <div className="flex flex-col items-center flex-1 md:flex-initial">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-cyan-300 font-bold mb-0.5 px-0.5">
              <span>Freq</span>
              <span>{Math.round(binauralVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={binauralVolume}
              onChange={(e) => onBinauralVolumeChange(parseFloat(e.target.value))}
              aria-label="Frequency Volume"
              className="w-full md:w-20 lg:w-24 h-2 md:h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Quran Volume */}
          <div className="flex flex-col items-center flex-1 md:flex-initial">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-amber-300 font-bold mb-0.5 px-0.5">
              <span>Quran</span>
              <span>{Math.round(quranVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={quranVolume}
              onChange={(e) => onQuranVolumeChange(parseFloat(e.target.value))}
              aria-label="Quran Volume"
              className="w-full md:w-20 lg:w-24 h-2 md:h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Desktop Read Quran Button */}
        <button
          onClick={onOpenReader}
          title="Read Arabic Quran & Translation"
          className="hidden md:flex p-2 rounded-xl liquid-glass-pill hover:bg-white/15 text-white/80 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
