import React from 'react';
import type { Mode } from '../data/modes';
import { Target, Activity, Zap, BookOpen, HelpCircle, BookText } from 'lucide-react';

interface ModeDetailsPanelProps {
  mode: Mode;
  onStartSession: () => void;
  onOpenReader: () => void;
}

export const ModeDetailsPanel: React.FC<ModeDetailsPanelProps> = ({
  mode,
  onStartSession,
  onOpenReader,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-[#0c1827]/95 border border-slate-700/60 p-5 sm:p-6 shadow-2xl overflow-hidden mt-6 text-left">
      {/* Golden-amber top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 opacity-90 shadow-amber-glow" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{mode.emoji}</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 font-orbitron tracking-wide flex items-center gap-2">
            <span>{mode.name}</span>
            {mode.arabicName && (
              <span className="font-arabic text-amber-400 text-sm font-bold">
                ({mode.arabicName})
              </span>
            )}
          </h3>
        </div>

        <button
          onClick={onOpenReader}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer self-start sm:self-auto"
        >
          <BookText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Read Quran &amp; Translation</span>
        </button>
      </div>

      {/* 5-Row Structured Table matching Reel */}
      <div className="space-y-3 text-xs sm:text-sm">
        {/* ROW 1: FOR */}
        <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 py-1.5">
          <div className="flex items-center gap-2 md:w-32 shrink-0">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-orbitron font-bold text-slate-300 text-[11px] tracking-wider uppercase">
              FOR:
            </span>
          </div>
          <div className="text-slate-200 leading-relaxed font-normal flex-1">
            {mode.forText}
          </div>
        </div>

        {/* ROW 2: FREQUENCY */}
        <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 py-1.5 border-t border-slate-800/60">
          <div className="flex items-center gap-2 md:w-32 shrink-0">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-orbitron font-bold text-slate-300 text-[11px] tracking-wider uppercase">
              FREQUENCY:
            </span>
          </div>
          <div className="text-amber-300 font-semibold leading-relaxed flex-1 font-mono">
            {mode.frequencyText}
          </div>
        </div>

        {/* ROW 3: OPENING */}
        <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 py-1.5 border-t border-slate-800/60">
          <div className="flex items-center gap-2 md:w-32 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-orbitron font-bold text-slate-300 text-[11px] tracking-wider uppercase">
              OPENING:
            </span>
          </div>
          <div className="text-slate-300 leading-relaxed font-normal flex-1">
            {mode.openingText}
          </div>
        </div>

        {/* ROW 4: SURAH */}
        <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 py-1.5 border-t border-slate-800/60">
          <div className="flex items-center gap-2 md:w-32 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-orbitron font-bold text-slate-300 text-[11px] tracking-wider uppercase">
              SURAH:
            </span>
          </div>
          <div className="text-slate-200 leading-relaxed flex-1 flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-100">{mode.surahDisplay}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
              {mode.revelationType}
            </span>
            <span className="text-slate-400">
              #{mode.surahNumbers.join(' + #')} · fades in · loops · Mishary Rashid Alafasy
            </span>
          </div>
        </div>

        {/* ROW 5: WHY THIS */}
        <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 py-1.5 border-t border-slate-800/60">
          <div className="flex items-center gap-2 md:w-32 shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-orbitron font-bold text-slate-300 text-[11px] tracking-wider uppercase">
              WHY THIS:
            </span>
          </div>
          <div className="text-slate-300 leading-relaxed font-normal flex-1">
            {mode.whyThisText}
          </div>
        </div>
      </div>

      {/* Prominent START: FREQUENCY -> QURAN Button & Subtext matching sec_224.jpg */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col items-center text-center">
        <button
          onClick={onStartSession}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase text-cyan-300 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-400 shadow-cyan-glow transition-all duration-300 cursor-pointer active:scale-98 flex items-center justify-center gap-2 group"
        >
          <span className="text-amber-400 text-base group-hover:scale-125 transition-transform">⚡</span>
          <span>START: FREQUENCY → QURAN</span>
        </button>

        <p className="mt-2.5 text-[11px] text-slate-400 max-w-2xl leading-relaxed">
          Use headphones. Every session opens with A'udhu billah and Bismillah over a golden-ratio 432 Hz tone, then the frequency plays softly underneath and the surah fades in on top.
        </p>
      </div>
    </div>
  );
};
