import React from 'react';
import type { Mode } from '../data/modes';

interface ModeCardProps {
  mode: Mode;
  isSelected: boolean;
  onSelect: (mode: Mode) => void;
  isPlaying: boolean;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(mode)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(mode);
        }
      }}
      className={`relative rounded-xl cursor-pointer transition-all duration-300 p-3.5 sm:p-4 text-left select-none overflow-hidden flex flex-col justify-between
        ${
          isSelected
            ? 'bg-[#102436]/90 border-2 border-[#5eead4] shadow-[0_0_18px_rgba(94,234,212,0.35)]'
            : 'bg-[#101e2e]/90 hover:bg-[#15273f] border border-slate-700/60 hover:border-slate-500/80'
        }
      `}
    >
      <div>
        {/* Title with Emoji */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">{mode.emoji}</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
              {mode.name}
            </h4>
          </div>

          {/* Micro Islamic Tag */}
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
              mode.verification.islamicTag === 'Authentic Sunnah'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {mode.verification.islamicTag === 'Authentic Sunnah' ? 'Sunnah' : 'Quran'}
          </span>
        </div>

        {/* Arabic Script Subtitle (if available) */}
        {mode.arabicName && (
          <div className="mt-0.5">
            <span className="font-arabic text-amber-300 text-sm sm:text-base font-bold">
              {mode.arabicName}
            </span>
          </div>
        )}
      </div>

      {/* Metadata Line: Band · Beat Hz · Surah */}
      <div className="mt-2.5 text-xs text-slate-300 font-medium">
        {mode.carrierHz === 528 ? <span>528 Hz · </span> : null}
        <span>{mode.band} · </span>
        <span className="font-mono text-cyan-300 font-semibold">{mode.beatHz} Hz</span>
        <span className="text-slate-300"> · 📖 {mode.surahDisplay}</span>
      </div>
    </div>
  );
};
