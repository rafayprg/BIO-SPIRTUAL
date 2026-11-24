import React from 'react';
import type { Mode } from '../data/modes';

interface FeaturedCardProps {
  mode: Mode;
  isSelected: boolean;
  onSelect: (mode: Mode) => void;
  isPlaying: boolean;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
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
      className={`relative w-full rounded-xl cursor-pointer transition-all duration-300 p-3.5 sm:p-4 text-left select-none overflow-hidden
        ${
          isSelected
            ? 'bg-[#102436]/95 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            : 'bg-[#101e2e]/90 hover:bg-[#14283d] border-amber-500/50 hover:border-amber-400/80'
        }
        border
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h3 className="text-base sm:text-lg font-bold font-orbitron text-amber-300">
              {mode.name}
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-300 font-medium">
            {mode.band} · <span className="font-mono text-cyan-300">{mode.beatHz} Hz</span> · 📖 {mode.surahDisplay}
          </p>
        </div>

        {isSelected && (
          <div className="self-start sm:self-auto text-[10px] font-orbitron font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
            SELECTED
          </div>
        )}
      </div>
    </div>
  );
};
