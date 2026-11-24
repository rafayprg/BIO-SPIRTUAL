import React from 'react';
import type { Mode } from '../data/modes';
import { Target, Activity, Zap, BookOpen, HelpCircle, BookText, ShieldCheck, Wind, CheckCircle2 } from 'lucide-react';

interface ModeDetailsPanelProps {
  mode: Mode;
  onStartSession: () => void;
  onOpenReader: () => void;
  onOpenVerifiedSources: () => void;
  onOpenGuidedBreathing: (pattern?: 'cyclic-sighing' | 'box-breathing') => void;
}

export const ModeDetailsPanel: React.FC<ModeDetailsPanelProps> = ({
  mode,
  onStartSession,
  onOpenReader,
  onOpenVerifiedSources,
  onOpenGuidedBreathing,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-[#0c1827]/95 border border-slate-700/60 p-5 sm:p-6 shadow-2xl overflow-hidden mt-6 text-left">
      {/* Golden-amber top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 opacity-90 shadow-amber-glow" />

      {/* Header bar with Badges & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 mb-3 border-b border-slate-800/80 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
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

          {/* Color-coded Verification Micro-Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                mode.verification.islamicTag === 'Authentic Sunnah'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {mode.verification.islamicTag === 'Authentic Sunnah' ? '✓ Authentic Sunnah' : '📖 Quranic Theme'}
            </span>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                mode.verification.scienceTag === 'Peer-Reviewed'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-700/40 text-slate-300 border border-slate-600/60'
              }`}
            >
              {mode.verification.scienceTag === 'Peer-Reviewed' ? '🔬 Peer-Reviewed' : '🧪 Emerging / Supportive'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Verified Sources + Read Quran */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenVerifiedSources}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Sources</span>
          </button>

          <button
            onClick={onOpenReader}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
          >
            <BookText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Read Quran</span>
          </button>
        </div>
      </div>

      {/* Special UI Widget: Emergency Sunnah Cooldown Checklist (for Anger / Waswasah / Focus) */}
      {mode.sunnahChecklist && mode.sunnahChecklist.length > 0 && (
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-slate-900/80 border border-rose-500/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">⏱️</span>
              <h4 className="text-xs font-bold text-rose-300 font-orbitron tracking-wider uppercase">
                Emergency 60s Sunnah Cooldown Protocol
              </h4>
            </div>

            <button
              onClick={() => onOpenGuidedBreathing(mode.recommendedBreathing || 'cyclic-sighing')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Wind className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Start 60s Cyclic Breathing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {mode.sunnahChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Prominent START Button & Guided Breathing Button */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onStartSession}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase text-cyan-300 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-400 shadow-cyan-glow transition-all duration-300 cursor-pointer active:scale-98 flex items-center justify-center gap-2 group"
        >
          <span className="text-amber-400 text-base group-hover:scale-125 transition-transform">⚡</span>
          <span>START: FREQUENCY → QURAN</span>
        </button>

        <button
          onClick={() => onOpenGuidedBreathing(mode.recommendedBreathing)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-orbitron font-bold text-xs tracking-wider uppercase text-teal-300 bg-slate-900/70 hover:bg-teal-950/60 border border-teal-500/40 hover:border-teal-400 transition-all duration-300 cursor-pointer active:scale-98 flex items-center justify-center gap-2"
        >
          <Wind className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Interactive Breathing Ring</span>
        </button>
      </div>

      <p className="mt-2.5 text-[11px] text-slate-400 text-center max-w-2xl mx-auto leading-relaxed">
        Use headphones. Every session opens with A'udhu billah and Bismillah over a golden-ratio 432 Hz tone, then the frequency plays softly underneath and the surah fades in on top.
      </p>
    </div>
  );
};
