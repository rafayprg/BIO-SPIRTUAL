import React from 'react';
import { Play, Square, Headphones, Volume2, Sparkles, BookOpen } from 'lucide-react';
import type { Mode } from '../data/modes';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioControlsProps {
  currentMode: Mode;
  isPlaying: boolean;
  isOpening: boolean;
  activeSurahNumber: number;
  binauralVolume: number;
  quranVolume: number;
  onTogglePlay: () => void;
  onBinauralVolumeChange: (vol: number) => void;
  onQuranVolumeChange: (vol: number) => void;
  analyser: AnalyserNode | null;
  onOpenReader: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  currentMode,
  isPlaying,
  isOpening,
  activeSurahNumber,
  binauralVolume,
  quranVolume,
  onTogglePlay,
  onBinauralVolumeChange,
  onQuranVolumeChange,
  analyser,
  onOpenReader,
}) => {
  return (
    <div className="sticky bottom-0 z-40 w-full bg-[#0a1624]/95 backdrop-blur-md border-t border-slate-700/60 shadow-2xl py-3.5 px-4">
      {/* Top micro amber glow line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-cyan-glow" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Play/Pause button + Session info */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={onTogglePlay}
            className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg active:scale-95 shrink-0 ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-extrabold hover:from-cyan-400 hover:to-teal-400 shadow-cyan-glow'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Session</span>
              </>
            )}
          </button>

          {/* Status text */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <span className="truncate max-w-[150px] sm:max-w-[200px]">
                {currentMode.emoji} {currentMode.name}
              </span>
              <span className="text-cyan-400">·</span>
              <span className="text-cyan-300 font-mono text-[11px] font-bold">
                {currentMode.carrierHz}Hz / {currentMode.beatHz}Hz
              </span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              {isOpening ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Golden Tone &amp; Bismillah...
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

          {/* Headphones badge (compact on mobile) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-teal-500/40 text-[11px] text-teal-300 shadow-sm shrink-0">
            <Headphones className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="font-medium tracking-wide">Headphones Recommended</span>
          </div>
        </div>

        {/* Center: Audio Waveform Visualizer */}
        <div className="w-full md:w-56 lg:w-64">
          <AudioVisualizer
            analyser={analyser}
            isPlaying={isPlaying}
            isOpening={isOpening}
          />
        </div>

        {/* Right: Dual Volume Controls & Quran Reader Drawer Button */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Headphones badge on mobile */}
          <div className="sm:hidden flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 border border-teal-500/30 text-[10px] text-teal-300">
            <Headphones className="w-3 h-3 text-teal-400" />
            <span>Stereo</span>
          </div>

          {/* Binaural Vol Slider */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold shrink-0">
              Hz:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={binauralVolume}
              onChange={(e) => onBinauralVolumeChange(parseFloat(e.target.value))}
              title="Reset Frequency (Hz) Volume"
              className="w-18 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] font-mono text-slate-400 w-6">
              {Math.round(binauralVolume * 100)}%
            </span>
          </div>

          {/* Quran Vol Slider */}
          <div className="flex items-center gap-2 text-xs">
            <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={quranVolume}
              onChange={(e) => onQuranVolumeChange(parseFloat(e.target.value))}
              title="Quran Recitation Volume"
              className="w-18 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-[10px] font-mono text-slate-400 w-6">
              {Math.round(quranVolume * 100)}%
            </span>
          </div>

          {/* Quick Reader toggle button */}
          <button
            onClick={onOpenReader}
            title="Open Quran & Translation Reader"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
