import React from 'react';
import { Menu, Search, Wind, ShieldCheck, Headphones, BookOpen } from 'lucide-react';

interface LiquidNavbarProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenBreathing: () => void;
  onOpenSources: () => void;
  onOpenReader: () => void;
  isBreathingActive: boolean;
}

export const LiquidNavbar: React.FC<LiquidNavbarProps> = ({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  onOpenBreathing,
  onOpenSources,
  onOpenReader,
  isBreathingActive,
}) => {
  return (
    <nav className="w-full liquid-glass rounded-2xl sm:rounded-full px-3 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 shadow-lg select-none">
      {/* Left: Mobile hamburger + Compact Title / Search input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Mobile Hamburger Menu Button (44px touch target) */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="lg:hidden w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 text-white/90 transition-colors cursor-pointer shrink-0 flex items-center justify-center active:scale-95"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Mobile Compact Title on small screens */}
        <div className="sm:hidden flex flex-col text-left shrink-0">
          <span className="text-xs font-black tracking-wider uppercase font-orbitron text-white leading-none">
            BIO SPIRITUAL
          </span>
          <span className="text-[9px] text-cyan-300 font-mono">Console</span>
        </div>

        {/* Live Search Input */}
        <div className="relative flex-1 min-w-0 max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search surahs, frequencies, modes..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-medium"
          />
        </div>
      </div>

      {/* Right: Badges & Frosted Glass Action Pills (Comfortable thumb targets) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Mobile quick search input when on tiny screens */}
        <div className="relative sm:hidden w-28 xs:w-36">
          <Search className="absolute left-2.5 top-2 w-3 h-3 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full pl-7 pr-2 py-1.5 text-[11px] rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/35 focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        {/* Headphones indicator badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill text-[11px] text-teal-300 font-medium">
          <Headphones className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Headphones Recommended</span>
        </div>

        {/* Circular Action Buttons (40px-44px targets) */}
        <button
          onClick={onOpenBreathing}
          title="Guided Breathing Ring"
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl sm:rounded-full liquid-glass-pill hover:bg-white/15 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95 ${
            isBreathingActive ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] text-cyan-300' : 'text-white/80'
          }`}
        >
          <Wind className="w-4 h-4 text-cyan-300" />
        </button>

        <button
          onClick={onOpenSources}
          title="Verified Islamic & Scientific Sources"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl sm:rounded-full liquid-glass-pill hover:bg-white/15 transition-all flex items-center justify-center text-emerald-400 cursor-pointer shadow-sm active:scale-95"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenReader}
          title="Read Quran & Translation"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl sm:rounded-full liquid-glass-pill hover:bg-white/15 transition-all flex items-center justify-center text-amber-400 cursor-pointer shadow-sm active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
