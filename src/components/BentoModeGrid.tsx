import React from 'react';
import { motion } from 'framer-motion';
import type { Mode } from '../data/modes';

interface BentoModeGridProps {
  modes: Mode[];
  selectedModeId: string;
  onSelectMode: (mode: Mode) => void;
  isPlaying: boolean;
}

export const BentoModeGrid: React.FC<BentoModeGridProps> = ({
  modes,
  selectedModeId,
  onSelectMode,
  isPlaying,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {modes.map((mode) => {
        const isSelected = mode.id === selectedModeId;
        const isCurrentlyStreaming = isSelected && isPlaying;

        return (
          <motion.div
            key={mode.id}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode(mode)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectMode(mode);
              }
            }}
            className={`relative rounded-2xl p-4 text-left select-none cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              isSelected
                ? 'bg-gradient-to-br from-cyan-950/60 via-slate-900/80 to-slate-900/90 border-2 border-cyan-400/70 shadow-[0_0_25px_rgba(34,211,238,0.22)]'
                : 'liquid-glass-card hover:bg-white/[0.08] hover:border-white/25'
            }`}
          >
            {/* Specular top sheen line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div>
              {/* Top Row: Minimal Icon/Emoji + Badges */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{mode.emoji}</span>
                  {isCurrentlyStreaming && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Sunnah / Quran Badge */}
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      mode.verification.islamicTag === 'Authentic Sunnah'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {mode.verification.islamicTag === 'Authentic Sunnah' ? 'Sunnah' : 'Quran'}
                  </span>

                  {/* Brainwave Band Badge */}
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md font-mono font-semibold bg-white/10 text-white/70">
                    {mode.band}
                  </span>
                </div>
              </div>

              {/* Middle Row: Title + Authentic Arabic Label */}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide group-hover:text-cyan-200 transition-colors">
                  {mode.name}
                </h3>
                {mode.arabicName && (
                  <span className="font-arabic text-amber-300 text-sm font-bold shrink-0">
                    {mode.arabicName}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Row: Metadata Line */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-medium">
              <span className="truncate max-w-[120px] sm:max-w-[140px] text-white/70 font-normal">
                📖 {mode.surahDisplay}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/25">
                  ⏱ {mode.sessionDefaults.durationBadge}
                </span>
                <span className="font-mono text-cyan-300 font-semibold text-[11px]">
                  {mode.beatHz} Hz
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
