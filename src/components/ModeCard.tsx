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
      className={`relative rounded-xl cursor-pointer transition-all duration-300 p-3.5 sm:p-4 text-left select-none overflow-hidden
        ${
          isSelected
            ? 'bg-[#102436]/90 border-2 border-[#5eead4] shadow-[0_0_18px_rgba(94,234,212,0.35)]'
            : 'bg-[#101e2e]/90 hover:bg-[#15273f] border border-slate-700/60 hover:border-slate-500/80'
        }
      `}
    >
      {/* Title with Emoji */}
      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg">{mode.emoji}</span>
        <h4 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
          {mode.name}
        </h4>
      </div>

      {/* Arabic Script Subtitle (if available) */}
      {mode.arabicName && (
        <div className="mt-0.5">
          <span className="font-arabic text-amber-300 text-sm sm:text-base font-bold">
            {mode.arabicName}
          </span>
        </div>
      )}

      {/* Metadata Line: Band · Beat Hz · Surah */}
      <div className="mt-2 text-xs text-slate-300 font-medium">
        {mode.carrierHz === 528 ? (
          <span>528 Hz · </span>
        ) : null}
        <span>{mode.band} · </span>
        <span className="font-mono text-cyan-300 font-semibold">{mode.beatHz} Hz</span>
        <span> · 📖 {mode.surahDisplay}</span>
      </div>
    </div>
  );
};
