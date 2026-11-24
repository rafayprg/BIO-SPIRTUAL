import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  Shield,
  Zap,
  Moon,
  Compass,
  Play,
  Square,
  Wind,
  ShieldCheck,
  BookOpen,
  X
} from 'lucide-react';
import type { ModeCategory } from '../data/modes';

interface GlassySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: 'all' | ModeCategory;
  onSelectCategory: (cat: 'all' | ModeCategory) => void;
  selectedBandFilter: string | null;
  onSelectBandFilter: (band: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenBreathing: () => void;
  onOpenSources: () => void;
  onOpenReader: () => void;
  categoryCounts: {
    all: number;
    'calm-reset': number;
    protection: number;
    'focus-rizq': number;
    'sleep-healing': number;
  };
}

export const GlassySidebar: React.FC<GlassySidebarProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedBandFilter,
  onSelectBandFilter,
  searchQuery,
  onSearchChange,
  isPlaying,
  onTogglePlay,
  onOpenBreathing,
  onOpenSources,
  onOpenReader,
  categoryCounts,
}) => {
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: Array<{ id: 'all' | ModeCategory; label: string; icon: React.ReactNode; count: number }> = [
    { id: 'all', label: 'All Modes', icon: <Compass className="w-4 h-4" />, count: categoryCounts.all },
    { id: 'calm-reset', label: 'Calm & Reset', icon: <Sparkles className="w-4 h-4" />, count: categoryCounts['calm-reset'] },
    { id: 'protection', label: 'Protection', icon: <Shield className="w-4 h-4" />, count: categoryCounts.protection },
    { id: 'focus-rizq', label: 'Focus & Rizq', icon: <Zap className="w-4 h-4" />, count: categoryCounts['focus-rizq'] },
    { id: 'sleep-healing', label: 'Sleep & Healing', icon: <Moon className="w-4 h-4" />, count: categoryCounts['sleep-healing'] },
  ];

  const bandFilters = [
    { id: 'Alpha', label: 'Alpha (8–10 Hz)', dotColor: '#34d399', count: 5 },
    { id: 'Theta', label: 'Theta (4–6 Hz)', dotColor: '#38bdf8', count: 4 },
    { id: 'Beta-SMR', label: 'SMR / Beta (14–18 Hz)', dotColor: '#fbbf24', count: 2 },
    { id: 'Delta-Gamma', label: 'Delta / Gamma / 7.83', dotColor: '#c084fc', count: 4 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen lg:h-auto w-[290px] lg:w-[290px] shrink-0 transition-transform duration-300 ease-out flex select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="relative w-full h-full flex rounded-r-3xl lg:rounded-3xl overflow-hidden liquid-glass-elevated border-r lg:border border-white/15 shadow-2xl">
          {/* LAYER 1: Main Dark Frosted Navigation Column */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 pr-1 overflow-y-auto">
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_15px_rgba(52,211,153,0.4)] flex items-center justify-center">
                    <div className="w-full h-full bg-[#0a1826] rounded-[10px] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-300 fill-current">
                        <path d="M12 2a9 9 0 0 0 7.8 13.5A9.5 9.5 0 1 1 8.5 2.2c1.1-.1 2.3 0 3.5.2z" />
                        <polygon points="17.5,7 18.2,8.8 20,8.8 18.5,9.9 19.1,11.7 17.5,10.6 15.9,11.7 16.5,9.9 15,8.8 16.8,8.8" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <h1 className="text-sm font-extrabold tracking-wider text-white uppercase font-orbitron leading-none">
                      BIO SPIRITUAL
                    </h1>
                    <span className="text-[10px] text-white/50 tracking-wide font-medium">
                      Neuro Reset Console
                    </span>
                  </div>
                </div>

                {/* Close Button on Mobile */}
                <button
                  onClick={onClose}
                  className="lg:hidden p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Command Search Pill */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search modes..."
                  className="w-full pl-8 pr-12 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/35 focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all font-medium"
                />
                <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white/50 bg-white/10 rounded border border-white/15">
                  ⌘K
                </kbd>
              </div>

              {/* Category Filter Navigation */}
              <div className="mt-5 space-y-1">
                <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 font-orbitron">
                  Navigation
                </div>

                {navItems.map((item) => {
                  const isActive = selectedCategory === item.id && !selectedBandFilter;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectCategory(item.id);
                        onSelectBandFilter(null);
                      }}
                      className={`relative w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-l-full transition-all cursor-pointer group ${
                        isActive
                          ? 'active-sidebar-pill pr-2 font-bold'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 z-10">
                        <span className={isActive ? 'text-slate-900' : 'text-white/60 group-hover:text-cyan-300'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold z-10 ${
                          isActive
                            ? 'bg-slate-900/10 text-slate-900'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {item.count}
                      </span>

                      {/* Smooth Framer Motion Active Pill transition */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarPill"
                          className="absolute inset-0 rounded-l-full bg-white z-0 shadow-md"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Verified Science Modal Trigger */}
                <button
                  onClick={onOpenSources}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-emerald-300/90 hover:text-emerald-200 hover:bg-emerald-500/10 transition-colors cursor-pointer mt-1"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Science</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                    15
                  </span>
                </button>
              </div>

              {/* Frequency Bands Quick Filter */}
              <div className="mt-6 space-y-1">
                <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 font-orbitron">
                  Frequency Bands
                </div>

                {bandFilters.map((band) => {
                  const isActive = selectedBandFilter === band.id;
                  return (
                    <button
                      key={band.id}
                      onClick={() => onSelectBandFilter(isActive ? null : band.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: band.dotColor,
                            boxShadow: `0 0 8px ${band.dotColor}`,
                          }}
                        />
                        <span>{band.label}</span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">{band.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Active Status Glass Card */}
            <div className="mt-6 p-3 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-slate-900/60 border border-emerald-500/30 shadow-lg text-left">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPlaying
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    {isPlaying ? 'Active Session' : 'Ready'}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-300">
                  432 Hz φ
                </span>
              </div>
              <p className="text-[10px] text-white/60 leading-tight">
                {isPlaying ? 'Dual-layer resonance streaming' : 'Use headphones for binaural effect'}
              </p>
              <button
                onClick={onTogglePlay}
                className="mt-2.5 w-full py-1.5 rounded-xl text-xs font-bold font-orbitron tracking-wider uppercase bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlaying ? 'Stop' : 'Start'}</span>
              </button>
            </div>
          </div>

          {/* LAYER 2: Attached Right-Side Vertical White Action Rail */}
          <div className="w-[42px] bg-white/95 text-slate-800 flex flex-col items-center justify-between py-5 border-l border-white/40 shadow-xl shrink-0">
            {/* Top Quick Action Buttons */}
            <div className="flex flex-col items-center gap-3">
              {/* Quick Play/Stop Accent Button */}
              <button
                onClick={onTogglePlay}
                title={isPlaying ? 'Stop Session' : 'Start Session'}
                className="w-8 h-8 rounded-full bg-slate-950 text-cyan-400 hover:scale-105 transition-transform flex items-center justify-center shadow-md cursor-pointer"
              >
                {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>

              {/* Guided Breathing Button */}
              <button
                onClick={onOpenBreathing}
                title="Guided Breathing Ring"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-teal-600 border border-slate-300/80 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Wind className="w-4 h-4" />
              </button>

              {/* Verified Sources Button */}
              <button
                onClick={onOpenSources}
                title="Verified Sources"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-emerald-600 border border-slate-300/80 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>

              {/* Quran Reader Button */}
              <button
                onClick={onOpenReader}
                title="Read Quran & Translation"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-amber-600 border border-slate-300/80 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>

            {/* Vertical Rotated "CONSOLE" Label */}
            <div className="transform -rotate-90 text-[9px] font-extrabold tracking-widest text-slate-400 uppercase select-none font-orbitron pb-2">
              CONSOLE
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
