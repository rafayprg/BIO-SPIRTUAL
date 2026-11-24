import React from 'react';
import { Play, Square, Headphones, Sparkles, BookOpen, Wind } from 'lucide-react';
import type { Mode } from '../data/modes';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioControlsProps {
  currentMode: Mode;
  isPlaying: boolean;
  isOpening: boolean;
  isBuffering?: boolean;
  activeSurahNumber: number;
  binauralVolume: number;
  quranVolume: number;
  onTogglePlay: () => void;
  onBinauralVolumeChange: (vol: number) => void;
  onQuranVolumeChange: (vol: number) => void;
  analyser: AnalyserNode | null;
  onOpenReader: () => void;
  onOpenGuidedBreathing: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  currentMode,
  isPlaying,
  isOpening,
  isBuffering = false,
  activeSurahNumber,
  binauralVolume,
  quranVolume,
  onTogglePlay,
  onBinauralVolumeChange,
  onQuranVolumeChange,
  analyser,
  onOpenReader,
  onOpenGuidedBreathing,
}) => {
  const isBreathingSuggested =
    currentMode.id === 'anger-impulse-reset' || currentMode.id === 'anxiety-calm';

  return (
    <div className="sticky bottom-0 z-40 w-full bg-[#0a1624]/95 backdrop-blur-md border-t border-slate-700/60 shadow-2xl py-3.5 px-4">
      {/* Top micro amber glow line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-cyan-glow" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Play/Pause button + Breathing Pill + Session info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2 shrink-0">
            {/* Play / Stop Button */}
            <button
              onClick={onTogglePlay}
              className={`relative flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg active:scale-95 shrink-0 ${
                isPlaying
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-extrabold hover:from-cyan-400 hover:to-teal-400 shadow-cyan-glow'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>

            {/* Guided Breathing Pill Button */}
            <button
              onClick={onOpenGuidedBreathing}
              title="Open Interactive Guided Breathing Ring"
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold font-orbitron tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0 ${
                isBreathingSuggested
                  ? 'bg-gradient-to-r from-teal-500/25 to-cyan-500/25 text-teal-300 border border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.35)] animate-pulse'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:border-cyan-500/50 hover:text-cyan-300'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Guided Breathing</span>
              <span className="sm:hidden">Breathing</span>
            </button>
          </div>

          {/* Status text */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <span className="truncate max-w-[130px] sm:max-w-[200px]">
                {currentMode.emoji} {currentMode.name}
              </span>
              <span className="text-cyan-400">·</span>
              <span className="text-cyan-300 font-mono text-[11px] font-bold">
                {currentMode.carrierHz}Hz / {currentMode.beatHz}Hz
              </span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              {isBuffering ? (
                <span className="text-amber-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                  Buffering recitation...
                </span>
              ) : isOpening ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
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

          {/* Headphones badge (hidden on small mobile) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-teal-500/40 text-[11px] text-teal-300 shadow-sm shrink-0">
            <Headphones className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="font-medium tracking-wide">Headphones Recommended</span>
          </div>
        </div>

        {/* Center: Audio Waveform Visualizer */}
        <div className="w-full md:w-52 lg:w-60">
          <AudioVisualizer
            analyser={analyser}
            isPlaying={isPlaying}
            isOpening={isOpening}
          />
        </div>

        {/* Right: Volume sliders & Read Quran button */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Dual Volume Sliders */}
          <div className="flex items-center gap-3">
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
                className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
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
                className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Quick Reader Button */}
          <button
            onClick={onOpenReader}
            title="Read Arabic Quran & Translation"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
