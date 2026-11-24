import React, { useState, useEffect } from 'react';
import type { Mode } from '../data/modes';
import { Play, Pause, Square, Minimize2, BookOpen } from 'lucide-react';
import { useSurahAyahs } from '../hooks/useSurahAyahs';

interface ActiveSessionViewProps {
  mode: Mode;
  isOpening: boolean;
  activeSurahIndex: number;
  currentAyahIndex: number;
  isQuranPlaying: boolean;
  isFrequencyPlaying: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  timerMode?: string;
  remainingSeconds?: number;
  currentSunnahIteration?: number;
  onToggleQuran: () => void;
  onToggleFrequency: () => void;
  onTogglePauseResume: () => void;
  onEndSession: () => void;
  onMinimize?: () => void;
}

export const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({
  mode,
  isOpening,
  activeSurahIndex,
  currentAyahIndex,
  isQuranPlaying,
  isFrequencyPlaying,
  isPlaying,
  isPaused,
  timerMode,
  remainingSeconds,
  currentSunnahIteration,
  onToggleQuran,
  onToggleFrequency,
  onTogglePauseResume,
  onEndSession,
  onMinimize,
}) => {
  // Breathing Pacer state: Inhale (4s) -> Hold (4s) -> Exhale (6s) -> Hold (2s)
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold1' | 'out' | 'hold2'>('in');
  const [breathCount, setBreathCount] = useState<number>(4);

  useEffect(() => {
    if (isPaused) return;

    let count = 4;
    let phase: 'in' | 'hold1' | 'out' | 'hold2' = 'in';

    const timer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (phase === 'in') {
          phase = 'hold1';
          count = 4;
        } else if (phase === 'hold1') {
          phase = 'out';
          count = 6;
        } else if (phase === 'out') {
          phase = 'hold2';
          count = 2;
        } else {
          phase = 'in';
          count = 4;
        }
        setBreathPhase(phase);
      }
      setBreathCount(count);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSurahNumber = mode.surahNumbers[activeSurahIndex] || mode.surahNumbers[0];
  const { ayahs } = useSurahAyahs(activeSurahNumber);

  const currentSurahTotalAyahs = mode.totalAyahs[activeSurahIndex] || mode.totalAyahs[0];
  const currentSurahName = activeSurahIndex === 1 && mode.id === 'crypto-trading' ? 'An-Nas' : mode.surahDisplay.split('+')[0].trim();
  const currentSurahArabic = activeSurahIndex === 1 && mode.id === 'crypto-trading' ? 'الناس' : (mode.surahArabicName || 'الفلق');

  const carrier = mode.carrierHz.toFixed(2);
  const rightEar = (mode.carrierHz + mode.beatHz).toFixed(2);
  const beat = mode.beatHz.toFixed(2);

  // Current live Ayah data from cache or network
  const currentAyah = currentAyahIndex > 0 && ayahs.length >= currentAyahIndex
    ? ayahs[currentAyahIndex - 1]
    : null;

  // Breathing pacer text
  const getBreathText = () => {
    if (isPaused) return 'Session Paused';
    if (breathPhase === 'in') return `Breathe in ... ${breathCount}`;
    if (breathPhase === 'hold1') return `Hold ... ${breathCount}`;
    if (breathPhase === 'out') return `Breathe out ... ${breathCount}`;
    return `Hold ... ${breathCount}`;
  };

  const isExpanding = breathPhase === 'in' && !isPaused;
  const isFull = breathPhase === 'hold1' && !isPaused;
  const isContracting = breathPhase === 'out' && !isPaused;

  return (
    <div className="fixed inset-0 z-50 bg-[#07111c] text-slate-100 flex flex-col justify-between items-center select-none overflow-hidden animate-in fade-in duration-500">
      {/* Background radial gradient */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          mode.mandalaTheme === 'emerald'
            ? 'bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.18)_0%,_rgba(7,17,28,0.95)_70%)]'
            : mode.mandalaTheme === 'purple'
            ? 'bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.15)_0%,_rgba(7,17,28,0.95)_70%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.16)_0%,_rgba(7,17,28,0.95)_70%)]'
        }`}
      />

      {/* Top Header & Status */}
      <div className="relative z-10 w-full pt-3 sm:pt-5 px-4 flex flex-col items-center text-center">
        {/* Minimize Button */}
        {onMinimize && (
          <button
            onClick={onMinimize}
            title="Minimize to Dashboard"
            className="absolute top-3 right-3 sm:top-5 sm:right-6 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-orbitron font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span className="hidden sm:inline">Dashboard</span>
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        )}

        <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold uppercase font-orbitron tracking-super-wide text-slate-100 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          BIO SPIRITUAL HACKING
        </h1>

        {/* Status Pill */}
        <div className="mt-2 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[10.5px] font-orbitron font-semibold tracking-wider text-amber-300">
              {isPaused ? 'SESSION PAUSED' : isOpening ? 'φ GOLDEN RATIO 432 · BISMILLAH' : 'STREAMING QURAN (TARTEEL)'}
            </span>
          </div>

          <span className="text-slate-600">·</span>

          <span className="text-[10.5px] text-slate-300 font-medium">
            Goal: <span className="text-cyan-300 font-semibold">{mode.name}</span>
          </span>

          {remainingSeconds !== undefined && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-[10.5px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                ⏱ {timerMode === 'loop' ? '∞ Loop' : timerMode === 'sunnah' && mode.sessionDefaults.sunnahRepeatCount ? `Sunnah ${currentSunnahIteration || 1}/${mode.sessionDefaults.sunnahRepeatCount}` : `${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60) < 10 ? '0' : ''}${remainingSeconds % 60} left`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center Sacred Geometry Mandala & Breathing Pacer */}
      <div className="relative z-10 my-auto flex items-center justify-center w-full max-w-lg aspect-square max-h-[42vh] sm:max-h-[46vh]">
        {/* Animated Rotating Sacred Geometry Mandala SVG */}
        <svg
          viewBox="0 0 600 600"
          className={`absolute inset-0 w-full h-full transition-all duration-700 pointer-events-none ${
            isPaused ? 'opacity-50' : 'animate-[spin_60s_linear_infinite] opacity-90'
          }`}
        >
          <g transform="translate(300, 300)" stroke="currentColor" fill="none">
            {/* Concentric Circles */}
            <circle r="70" strokeWidth="1" stroke="rgba(34, 211, 238, 0.4)" strokeDasharray="3 3" />
            <circle r="120" strokeWidth="1.2" stroke="rgba(245, 158, 11, 0.35)" />
            <circle r="180" strokeWidth="1.2" stroke="rgba(34, 211, 238, 0.3)" strokeDasharray="6 4" />
            <circle r="240" strokeWidth="1.5" stroke="rgba(245, 158, 11, 0.4)" />
            <circle r="275" strokeWidth="0.8" stroke="rgba(34, 211, 238, 0.2)" />

            {/* Geometric Radial Lines (16 axes) */}
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, idx) => (
              <line
                key={idx}
                x1="0"
                y1="0"
                x2={275 * Math.cos((angle * Math.PI) / 180)}
                y2={275 * Math.sin((angle * Math.PI) / 180)}
                stroke="rgba(34, 211, 238, 0.15)"
                strokeWidth="0.8"
              />
            ))}

            {/* 8-Pointed & 16-Pointed Islamic Geometric Stars */}
            <path
              d="M0,-240 L60,-170 L170,-170 L170,-60 L240,0 L170,60 L170,170 L60,170 L0,240 L-60,170 L-170,170 L-170,60 L-240,0 L-170,-60 L-170,-170 L-60,-170 Z"
              stroke="rgba(245, 158, 11, 0.75)"
              strokeWidth="1.5"
              fill="rgba(245, 158, 11, 0.03)"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <g transform="translate(0, -180) scale(0.28)">
                  <polygon
                    points="0,-35 8,-12 35,-12 14,4 22,28 0,14 -22,28 -14,4 -35,-12 -8,-12"
                    fill="rgba(34, 211, 238, 0.75)"
                    stroke="#22d3ee"
                    strokeWidth="1"
                  />
                </g>
              </g>
            ))}
          </g>
        </svg>

        {/* Breathing Ring & Glowing Core */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center rounded-full transition-all duration-1000 ${
            isExpanding
              ? 'scale-110 shadow-[0_0_50px_rgba(34,211,238,0.5)]'
              : isFull
              ? 'scale-115 shadow-[0_0_60px_rgba(34,211,238,0.6)]'
              : isContracting
              ? 'scale-90 shadow-[0_0_25px_rgba(34,211,238,0.25)]'
              : 'scale-90 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
          }`}
          style={{ width: '160px', height: '160px' }}
        >
          <div className="absolute inset-0 rounded-full bg-slate-950/80 border border-cyan-400/40 backdrop-blur-sm" />
          
          <div className="relative z-10 text-center px-2">
            <span className="text-xs sm:text-sm font-orbitron font-semibold tracking-wider text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              {getBreathText()}
            </span>
          </div>
        </div>
      </div>

      {/* LIVE AYAT DISPLAY CARD */}
      <div className="relative z-20 w-full max-w-2xl px-3 my-1">
        <div className="w-full liquid-glass-card rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 border border-amber-400/35 shadow-2xl backdrop-blur-xl text-center">
          {isOpening ? (
            <div>
              <div className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-amber-400 mb-1">
                TA'AWWUDH (REPUTATION OF REFUGE)
              </div>
              <div className="font-arabic text-xl sm:text-2xl font-bold text-amber-300 tracking-wide" dir="rtl">
                أَعُوذُ بِٱللَّهِ مِنَ ٱلشَّيْطَانِ ٱلرَّجِيمِ
              </div>
              <div className="text-[11px] sm:text-xs text-white/60 italic mt-1">
                "I seek refuge in Allah from Satan, the accursed."
              </div>
            </div>
          ) : currentAyahIndex === 0 ? (
            <div>
              <div className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-amber-400 mb-1">
                BISMILLAH · SURAH {currentSurahName.toUpperCase()}
              </div>
              <div className="font-arabic text-xl sm:text-2xl font-bold text-amber-300 tracking-wide" dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </div>
              <div className="text-[11px] sm:text-xs text-white/60 italic mt-1">
                "In the name of Allah, the Entirely Merciful, the Especially Merciful."
              </div>
            </div>
          ) : (
            <div>
              {/* Surah Header Pill */}
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-xs">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentSurahName}</span>
                  <span className="font-arabic text-sm text-amber-200">{currentSurahArabic}</span>
                </span>
                <span className="text-cyan-300 font-mono font-bold text-[11px] bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  Ayah {currentAyahIndex} of {currentSurahTotalAyahs}
                </span>
              </div>

              {/* Live Arabic Verse Text */}
              <div
                className="font-arabic text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-200 leading-relaxed py-1 select-text"
                dir="rtl"
              >
                {currentAyah ? currentAyah.arabicText : `${currentSurahArabic} — Ayah ${currentAyahIndex}`}
              </div>

              {/* Translation Meaning */}
              {currentAyah && currentAyah.translation && (
                <div className="text-[11px] sm:text-xs text-slate-300 italic pt-1.5 border-t border-white/5 line-clamp-2">
                  "{currentAyah.translation}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons & Real-time HUD */}
      <div className="relative z-10 w-full max-w-2xl px-4 pb-4 sm:pb-6 flex flex-col items-center gap-3">
        {/* 4 HUD Frequency Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          <div className="p-1.5 sm:p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[9px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              LEFT EAR
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-cyan-300 mt-0.5">
              {carrier} Hz
            </div>
          </div>

          <div className="p-1.5 sm:p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[9px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              RIGHT EAR
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-cyan-300 mt-0.5">
              {rightEar} Hz
            </div>
          </div>

          <div className="p-1.5 sm:p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[9px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              BEAT
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400 mt-0.5 truncate">
              {beat} Hz · {mode.band}
            </div>
          </div>

          <div className="p-1.5 sm:p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[9px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              φ OPENING
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-amber-400 mt-0.5">
              432 · 576 · 699
            </div>
          </div>
        </div>

        {/* Action Controls: Pause/Continue + Quran + Frequency + End Session */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full flex-wrap">
          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePauseResume}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-orbitron font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md ${
              isPaused
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{isPaused ? 'Continue' : 'Pause'}</span>
          </button>

          {/* Toggle Quran */}
          <button
            onClick={onToggleQuran}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-orbitron font-bold tracking-wider uppercase transition-all cursor-pointer ${
              isQuranPlaying
                ? 'bg-slate-900/90 text-cyan-300 border border-cyan-500/50 hover:bg-slate-800'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Quran</span>
          </button>

          {/* Toggle Frequency */}
          <button
            onClick={onToggleFrequency}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-orbitron font-bold tracking-wider uppercase transition-all cursor-pointer ${
              isFrequencyPlaying
                ? 'bg-slate-900/90 text-emerald-300 border border-emerald-500/50 hover:bg-slate-800'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            <span className="font-mono text-xs">Hz</span>
            <span>Freq</span>
          </button>

          {/* End Session Button */}
          <button
            onClick={onEndSession}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-orbitron font-bold tracking-wider uppercase bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer shadow-sm"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
