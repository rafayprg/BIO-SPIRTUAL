import React from 'react';
import { Play, Square, Headphones, Sparkles, BookOpen } from 'lucide-react';
import type { Mode } from '../data/modes';

interface LiquidAudioDockProps {
  currentMode: Mode;
  isPlaying: boolean;
  isOpening: boolean;
  isBuffering: boolean;
  activeSurahNumber: number;
  binauralVolume: number;
  quranVolume: number;
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
  onTogglePlay,
  onBinauralVolumeChange,
  onQuranVolumeChange,
  onOpenReader,
}) => {
  return (
    <div className="w-full liquid-glass rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 select-none">
      {/* Left: Play/Pause circular button + Track info */}
      <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          {/* Main Play/Pause Button */}
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
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span>{currentMode.emoji} {currentMode.name}</span>
              <span className="text-white/40">·</span>
              <span className="text-cyan-300 font-mono text-[11px] font-semibold">
                {currentMode.carrierHz}Hz / {currentMode.beatHz}Hz
              </span>
            </div>

            <div className="text-[11px] text-white/50 flex items-center gap-1">
              {isBuffering ? (
                <span className="text-amber-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                  Buffering recitation...
                </span>
              ) : isOpening ? (
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Golden Tone (432 · 576 · 699 Hz) &amp; Bismillah...
                </span>
              ) : isPlaying ? (
                <span className="text-emerald-400 font-medium">
                  Streaming Surah #{activeSurahNumber} (Mishary Alafasy)
                </span>
              ) : (
                <span>Ready to initialize dual-layer reset</span>
              )}
            </div>
          </div>
        </div>

        {/* Headphones badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-[11px] text-teal-300">
          <Headphones className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="font-medium">Headphones Recommended</span>
        </div>
      </div>

      {/* Right: Dual Custom Volume Sliders & Reader Button */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-2.5 md:pt-0">
        {/* Sliders Container */}
        <div className="flex items-center gap-4">
          {/* Frequency Volume */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-cyan-300 font-bold mb-0.5">
              <span>Hz</span>
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
              className="w-20 sm:w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Quran Volume */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-amber-300 font-bold mb-0.5">
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
              className="w-20 sm:w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Quick Read Quran Button */}
        <button
          onClick={onOpenReader}
          title="Read Arabic Quran & Translation"
          className="p-2 rounded-xl liquid-glass-pill hover:bg-white/15 text-white/80 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
