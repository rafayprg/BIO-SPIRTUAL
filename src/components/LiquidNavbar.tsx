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
    <nav className="w-full liquid-glass rounded-2xl sm:rounded-full p-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-3 shadow-lg select-none">
      {/* Left: Mobile hamburger + Search input */}
      <div className="flex items-center gap-2.5 flex-1 max-w-md">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-full bg-white/10 hover:bg-white/15 text-white/80 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Live Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search surahs, frequencies, modes..."
            className="w-full pl-8 pr-4 py-1.5 sm:py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-medium"
          />
        </div>
      </div>

      {/* Right: Badges & Frosted Glass Action Pills */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Headphones indicator badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill text-[11px] text-teal-300 font-medium">
          <Headphones className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Headphones Recommended</span>
        </div>

        {/* Circular Action Buttons */}
        <button
          onClick={onOpenBreathing}
          title="Interactive Guided Breathing Ring"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass-pill hover:bg-white/15 transition-all flex items-center justify-center cursor-pointer shadow-sm ${
            isBreathingActive ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] text-cyan-300' : 'text-white/80'
          }`}
        >
          <Wind className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSources}
          title="Verified Islamic & Scientific Sources"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass-pill hover:bg-white/15 transition-all flex items-center justify-center text-emerald-400 cursor-pointer shadow-sm"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenReader}
          title="Read Quran & Translation"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass-pill hover:bg-white/15 transition-all flex items-center justify-center text-amber-400 cursor-pointer shadow-sm"
        >
          <BookOpen className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
