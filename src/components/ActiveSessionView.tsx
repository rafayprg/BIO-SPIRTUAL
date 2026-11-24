import React, { useState, useEffect } from 'react';
import type { Mode } from '../data/modes';
import { Play, Pause, Square, Minimize2 } from 'lucide-react';

interface ActiveSessionViewProps {
  mode: Mode;
  isOpening: boolean;
  activeSurahIndex: number;
  currentAyahIndex: number;
  isQuranPlaying: boolean;
  isFrequencyPlaying: boolean;
  timerMode?: string;
  remainingSeconds?: number;
  currentSunnahIteration?: number;
  onToggleQuran: () => void;
  onToggleFrequency: () => void;
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
  timerMode,
  remainingSeconds,
  currentSunnahIteration,
  onToggleQuran,
  onToggleFrequency,
  onEndSession,
  onMinimize,
}) => {
  // Breathing Pacer state: Inhale (4s) -> Hold (4s) -> Exhale (6s) -> Hold (2s)
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold1' | 'out' | 'hold2'>('in');
  const [breathCount, setBreathCount] = useState<number>(4);

  useEffect(() => {
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
  }, []);

  const currentSurahTotalAyahs = mode.totalAyahs[activeSurahIndex] || mode.totalAyahs[0];
  const currentSurahName = activeSurahIndex === 1 && mode.id === 'crypto-trading' ? 'An-Nas' : mode.surahDisplay.split('+')[0].trim();
  const currentSurahArabic = activeSurahIndex === 1 && mode.id === 'crypto-trading' ? 'الناس' : (mode.surahArabicName || 'الفلق');

  const carrier = mode.carrierHz.toFixed(2);
  const rightEar = (mode.carrierHz + mode.beatHz).toFixed(2);
  const beat = mode.beatHz.toFixed(2);

  // Breathing pacer text
  const getBreathText = () => {
    if (breathPhase === 'in') return `Breathe in ... ${breathCount}`;
    if (breathPhase === 'hold1') return `Hold ... ${breathCount}`;
    if (breathPhase === 'out') return `Breathe out ... ${breathCount}`;
    return `Hold ... ${breathCount}`;
  };

  // Breathing circle scale & glow
  const isExpanding = breathPhase === 'in';
  const isFull = breathPhase === 'hold1';
  const isContracting = breathPhase === 'out';

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
      <div className="relative z-10 w-full pt-4 sm:pt-6 px-4 flex flex-col items-center text-center">
        {/* Minimize Button */}
        {onMinimize && (
          <button
            onClick={onMinimize}
            title="Minimize to Dashboard"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-orbitron font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span className="hidden sm:inline">Dashboard</span>
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        )}

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase font-orbitron tracking-super-wide text-slate-100 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          BIO SPIRITUAL HACKING
        </h1>

        {/* Status Pill */}
        <div className="mt-2.5 inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-orbitron font-semibold tracking-wider text-amber-300">
              {isOpening ? 'φ GOLDEN RATIO 432 · BISMILLAH' : 'STREAMING QURAN (TARTEEL)'}
            </span>
          </div>

          <span className="hidden sm:inline text-slate-600">·</span>

          <span className="text-[11px] text-slate-300 font-medium">
            Goal: <span className="text-cyan-300 font-semibold">{mode.name}</span> · {mode.band} · {mode.beatHz} Hz · 📖 {mode.surahDisplay}
          </span>

          {remainingSeconds !== undefined && (
            <>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                ⏱ {timerMode === 'loop' ? '∞ Loop' : timerMode === 'sunnah' && mode.sessionDefaults.sunnahRepeatCount ? `Sunnah ${currentSunnahIteration || 1}/${mode.sessionDefaults.sunnahRepeatCount}` : `${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60) < 10 ? '0' : ''}${remainingSeconds % 60} left`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center Sacred Geometry Mandala & Breathing Pacer */}
      <div className="relative z-10 my-auto flex items-center justify-center w-full max-w-xl aspect-square max-h-[50vh] sm:max-h-[54vh]">
        {/* Animated Rotating Sacred Geometry Mandala SVG */}
        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite] opacity-90 transition-transform duration-700 pointer-events-none"
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

            {/* Mode-Specific Sacred Stars / Petals */}
            {mode.mandalaTheme === 'emerald' ? (
              // Organic Floral / Leaf Sacred Geometry (for Jealousy & Anxiety)
              <g stroke="rgba(16, 185, 129, 0.75)" strokeWidth="1.4">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <path
                    key={deg}
                    d="M0,0 Q60,110 0,220 Q-60,110 0,0"
                    transform={`rotate(${deg})`}
                    fill="rgba(16, 185, 129, 0.04)"
                  />
                ))}
                {/* Secondary leaves */}
                {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
                  <path
                    key={deg}
                    d="M0,0 Q35,70 0,140 Q-35,70 0,0"
                    transform={`rotate(${deg})`}
                    stroke="rgba(245, 158, 11, 0.7)"
                    fill="rgba(245, 158, 11, 0.05)"
                  />
                ))}
              </g>
            ) : (
              // 8-Pointed & 16-Pointed Islamic Geometric Stars (for Crypto & Mind Reset)
              <g>
                {/* Golden 8-pointed star */}
                <path
                  d="M0,-240 L60,-170 L170,-170 L170,-60 L240,0 L170,60 L170,170 L60,170 L0,240 L-60,170 L-170,170 L-170,60 L-240,0 L-170,-60 L-170,-170 L-60,-170 Z"
                  stroke="rgba(245, 158, 11, 0.75)"
                  strokeWidth="1.5"
                  fill="rgba(245, 158, 11, 0.03)"
                />
                {/* Cyan 16-pointed inner stars */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <g key={deg} transform={`rotate(${deg})`}>
                    {/* Star at radius 180 */}
                    <g transform="translate(0, -180) scale(0.28)">
                      <polygon
                        points="0,-35 8,-12 35,-12 14,4 22,28 0,14 -22,28 -14,4 -35,-12 -8,-12"
                        fill="rgba(34, 211, 238, 0.75)"
                        stroke="#22d3ee"
                        strokeWidth="1"
                      />
                    </g>
                    {/* Star at radius 120 */}
                    <g transform="translate(0, -120) scale(0.22)">
                      <polygon
                        points="0,-35 8,-12 35,-12 14,4 22,28 0,14 -22,28 -14,4 -35,-12 -8,-12"
                        fill="rgba(251, 191, 36, 0.85)"
                        stroke="#f59e0b"
                        strokeWidth="1"
                      />
                    </g>
                    {/* Outer Star at radius 240 */}
                    <g transform="translate(0, -240) scale(0.35)">
                      <polygon
                        points="0,-35 8,-12 35,-12 14,4 22,28 0,14 -22,28 -14,4 -35,-12 -8,-12"
                        fill="rgba(254, 240, 138, 0.85)"
                        stroke="#eab308"
                        strokeWidth="1"
                      />
                    </g>
                  </g>
                ))}
              </g>
            )}
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
          style={{ width: '180px', height: '180px' }}
        >
          <div className="absolute inset-0 rounded-full bg-slate-950/75 border border-cyan-400/40 backdrop-blur-sm" />
          
          {/* Breathing Text */}
          <div className="relative z-10 text-center px-2">
            <span className="text-sm sm:text-base font-orbitron font-semibold tracking-wider text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              {getBreathText()}
            </span>
          </div>
        </div>
      </div>

      {/* Recitation Banner Pill */}
      <div className="relative z-10 mb-4 px-4 w-full flex justify-center">
        <div className="px-5 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center gap-2">
          {isOpening ? (
            <span className="font-arabic text-amber-300 text-lg sm:text-xl font-bold tracking-wide">
              أَعُوذُ بِٱللَّهِ مِنَ ٱلشَّيْطَانِ ٱلرَّجِيمِ
            </span>
          ) : currentAyahIndex === 0 ? (
            <span className="font-arabic text-amber-300 text-lg sm:text-xl font-bold tracking-wide">
              {currentSurahName} · بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </span>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <span className="text-slate-400">📖</span>
              <span className="text-slate-100 font-semibold">{currentSurahName}</span>
              <span className="font-arabic text-amber-300 text-base font-bold">{currentSurahArabic}</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-300 font-mono">
                ayah {currentAyahIndex}/{currentSurahTotalAyahs}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Frequency HUD Boxes & Control Buttons */}
      <div className="relative z-10 w-full max-w-2xl px-4 pb-6 flex flex-col items-center gap-4">
        {/* 4 HUD Frequency Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              LEFT EAR
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-cyan-300 mt-0.5">
              {carrier} Hz
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              RIGHT EAR
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-cyan-300 mt-0.5">
              {rightEar} Hz
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              BEAT
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400 mt-0.5 truncate">
              {beat} Hz · {mode.band}
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              φ OPENING
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-amber-400 mt-0.5">
              432 · 576 · 699
            </div>
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={onToggleQuran}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-orbitron font-bold tracking-wider uppercase transition-all cursor-pointer ${
              isQuranPlaying
                ? 'bg-slate-900/90 text-cyan-300 border border-cyan-500/50 hover:bg-slate-800'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            {isQuranPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>Quran</span>
          </button>

          <button
            onClick={onToggleFrequency}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-orbitron font-bold tracking-wider uppercase transition-all cursor-pointer ${
              isFrequencyPlaying
                ? 'bg-slate-900/90 text-emerald-300 border border-emerald-500/50 hover:bg-slate-800'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
          >
            {isFrequencyPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>Frequency</span>
          </button>

          <button
            onClick={onEndSession}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-orbitron font-bold tracking-wider uppercase bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer shadow-sm"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>End session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
