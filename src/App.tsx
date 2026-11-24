import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GlassySidebar } from './components/GlassySidebar';
import { LiquidNavbar } from './components/LiquidNavbar';
import { StudioCard } from './components/StudioCard';
import { BentoModeGrid } from './components/BentoModeGrid';
import { LiquidAudioDock } from './components/LiquidAudioDock';
import { ActiveSessionView } from './components/ActiveSessionView';
import { QuranReaderModal } from './components/QuranReaderModal';
import { GuidedBreathingModal } from './components/GuidedBreathingModal';
import { VerifiedSourcesDrawer } from './components/VerifiedSourcesDrawer';
import { MODES } from './data/modes';
import type { Mode, ModeCategory } from './data/modes';
import { AudioEngine } from './audio/audioEngine';

export const App: React.FC = () => {
  // Navigation & Filtering State
  const [selectedCategory, setSelectedCategory] = useState<'all' | ModeCategory>('all');
  const [selectedBandFilter, setSelectedBandFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Audio & Active Session State
  const [selectedMode, setSelectedMode] = useState<Mode>(
    MODES.find((m) => m.id === 'mind-reset') || MODES[1]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [activeSurahIndex, setActiveSurahIndex] = useState<number>(0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [isQuranPlaying, setIsQuranPlaying] = useState<boolean>(true);
  const [isFrequencyPlaying, setIsFrequencyPlaying] = useState<boolean>(true);
  const [binauralVolume, setBinauralVolume] = useState<number>(0.5);
  const [quranVolume, setQuranVolume] = useState<number>(0.85);

  // Modals & Drawers
  const [isFullScreenSession, setIsFullScreenSession] = useState<boolean>(false);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);
  const [isVerifiedSourcesOpen, setIsVerifiedSourcesOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioEngineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine({
      onPlayStateChange: (playing) => setIsPlaying(playing),
      onOpeningPhaseChange: (opening) => setIsOpening(opening),
      onBufferingChange: (buffering) => setIsBuffering(buffering),
      onSurahChange: (sIdx) => {
        setActiveSurahIndex(sIdx);
        setCurrentAyahIndex(1);
      },
      onAyahProgress: (ayah) => {
        setCurrentAyahIndex(ayah);
      },
      onError: (err) => {
        setToastMessage(err);
        setTimeout(() => setToastMessage(null), 6000);
      },
    });

    return () => {
      audioEngineRef.current?.stopSession();
    };
  }, []);

  // Sync volumes to Web Audio engine
  useEffect(() => {
    audioEngineRef.current?.setVolumes(binauralVolume, quranVolume);
  }, [binauralVolume, quranVolume]);

  // Select a mode (Preview only - does NOT auto-start audio unless already playing)
  const handleSelectMode = (mode: Mode) => {
    setSelectedMode(mode);
    setActiveSurahIndex(0);
    setCurrentAyahIndex(0);

    // If an active session is currently running, hot-update frequencies & surah tracks
    if (isPlaying && audioEngineRef.current) {
      audioEngineRef.current.updateParameters(
        mode.carrierHz,
        mode.beatHz,
        mode.surahNumbers,
        mode.totalAyahs,
        mode.customAudioUrls
      );
    }
  };

  // Explicitly Start Session -> Launches Audio & Fullscreen Sacred Geometry View
  const handleStartSession = (modeToStart?: Mode) => {
    const targetMode = modeToStart || selectedMode;
    if (audioEngineRef.current) {
      setIsQuranPlaying(true);
      setIsFrequencyPlaying(true);
      setIsPlaying(true);
      audioEngineRef.current.startSession(
        targetMode.carrierHz,
        targetMode.beatHz,
        targetMode.surahNumbers,
        targetMode.totalAyahs,
        targetMode.customAudioUrls
      );
    }
    setIsFullScreenSession(true);
  };

  const handleLaunchFullScreen = () => {
    if (!isPlaying) {
      handleStartSession(selectedMode);
    } else {
      setIsFullScreenSession(true);
    }
  };

  const handleEndSession = () => {
    audioEngineRef.current?.stopSession();
    setIsPlaying(false);
    setIsFullScreenSession(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handleEndSession();
    } else {
      handleStartSession(selectedMode);
    }
  };

  const handleToggleQuran = () => {
    if (!audioEngineRef.current) return;
    const active = audioEngineRef.current.toggleQuran();
    setIsQuranPlaying(active);
  };

  const handleToggleFrequency = () => {
    if (!audioEngineRef.current) return;
    const active = audioEngineRef.current.toggleFrequency();
    setIsFrequencyPlaying(active);
  };

  // Filter modes dynamically
  const filteredModes = useMemo(() => {
    return MODES.filter((mode) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = mode.name.toLowerCase().includes(q);
        const matchSurah = mode.surahDisplay.toLowerCase().includes(q);
        const matchArabic = mode.arabicName?.toLowerCase().includes(q);
        const matchBand = mode.band.toLowerCase().includes(q);
        const matchFor = mode.forText.toLowerCase().includes(q);
        if (!matchName && !matchSurah && !matchArabic && !matchBand && !matchFor) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && mode.category !== selectedCategory) {
        return false;
      }

      // Band filter
      if (selectedBandFilter) {
        if (selectedBandFilter === 'Alpha' && mode.band !== 'Alpha') return false;
        if (selectedBandFilter === 'Theta' && mode.band !== 'Theta') return false;
        if (selectedBandFilter === 'Beta-SMR' && mode.band !== 'Beta' && mode.band !== 'SMR') return false;
        if (
          selectedBandFilter === 'Delta-Gamma' &&
          mode.band !== 'Delta' &&
          mode.band !== 'Gamma' &&
          mode.band !== 'Schumann'
        ) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedBandFilter]);

  const categoryCounts = useMemo(() => {
    return {
      all: MODES.length,
      'calm-reset': MODES.filter((m) => m.category === 'calm-reset').length,
      protection: MODES.filter((m) => m.category === 'protection').length,
      'focus-rizq': MODES.filter((m) => m.category === 'focus-rizq').length,
      'sleep-healing': MODES.filter((m) => m.category === 'sleep-healing').length,
    };
  }, []);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full flex flex-col lg:flex-row p-2.5 sm:p-4 lg:p-5 gap-3.5 sm:gap-4 lg:gap-5 relative text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden max-w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-rose-950/90 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-2xl shadow-xl text-xs backdrop-blur-md animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* 1. Glassy Sidebar V10 (Clean Dark Frosted Glass) */}
      <GlassySidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedBandFilter={selectedBandFilter}
        onSelectBandFilter={setSelectedBandFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenBreathing={() => setIsBreathingModalOpen(true)}
        onOpenSources={() => setIsVerifiedSourcesOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
        categoryCounts={categoryCounts}
      />

      {/* 2. Main Workspace (Smooth Scrollable on Desktop, Fluid on Mobile) */}
      <div className="flex-1 flex flex-col gap-3.5 sm:gap-4 min-w-0 lg:overflow-y-auto lg:overflow-x-hidden pr-0 lg:pr-1 pb-32 lg:pb-0">
        {/* Floating Liquid Glass Pill NavBar */}
        <LiquidNavbar
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenBreathing={() => setIsBreathingModalOpen(true)}
          onOpenSources={() => setIsVerifiedSourcesOpen(true)}
          onOpenReader={() => setIsReaderOpen(true)}
          isBreathingActive={isBreathingModalOpen}
        />

        {/* Mobile Horizontally Scrollable Category Chips Strip */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-0.5 shrink-0 text-xs font-semibold">
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedBandFilter(null); }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all' && !selectedBandFilter
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.3)] font-bold'
                : 'liquid-glass text-white/70 hover:text-white'
            }`}
          >
            All Modes ({categoryCounts.all})
          </button>
          <button
            onClick={() => { setSelectedCategory('calm-reset'); setSelectedBandFilter(null); }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'calm-reset'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                : 'liquid-glass text-white/70 hover:text-white'
            }`}
          >
            🧘 Calm & Reset ({categoryCounts['calm-reset']})
          </button>
          <button
            onClick={() => { setSelectedCategory('protection'); setSelectedBandFilter(null); }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'protection'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                : 'liquid-glass text-white/70 hover:text-white'
            }`}
          >
            🛡️ Protection ({categoryCounts.protection})
          </button>
          <button
            onClick={() => { setSelectedCategory('focus-rizq'); setSelectedBandFilter(null); }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'focus-rizq'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                : 'liquid-glass text-white/70 hover:text-white'
            }`}
          >
            ⚡ Focus & Rizq ({categoryCounts['focus-rizq']})
          </button>
          <button
            onClick={() => { setSelectedCategory('sleep-healing'); setSelectedBandFilter(null); }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'sleep-healing'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold'
                : 'liquid-glass text-white/70 hover:text-white'
            }`}
          >
            🌙 Sleep & Healing ({categoryCounts['sleep-healing']})
          </button>
          <button
            onClick={() => setIsVerifiedSourcesOpen(true)}
            className="px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer liquid-glass text-emerald-300 border border-emerald-500/30 font-semibold"
          >
            🧬 Science (15)
          </button>
        </div>

        {/* Main Dashboard Workspace Container */}
        <div className="w-full liquid-glass rounded-3xl p-3.5 sm:p-5 lg:p-6 shadow-2xl flex flex-col gap-5 sm:gap-6">
          {/* Header Row inside Dashboard */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                BIO SPIRITUAL HACKING · SYSTEM ARCHITECTURE
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-orbitron mt-0.5">
                NEURO RESET CONSOLE
              </h2>
            </div>
            <div className="text-xs text-white/50 font-medium">
              Showing {filteredModes.length} of {MODES.length} Validated Modes
            </div>
          </div>

          {/* 2-Column Asymmetric Studio + Bento Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left Studio Column (col-span-5) */}
            <div className="xl:col-span-5 w-full">
              <StudioCard
                mode={selectedMode}
                isPlaying={isPlaying}
                isOpening={isOpening}
                isBuffering={isBuffering}
                onTogglePlay={handleTogglePlay}
                onLaunchFullScreen={handleLaunchFullScreen}
                onOpenSources={() => setIsVerifiedSourcesOpen(true)}
                onOpenReader={() => setIsReaderOpen(true)}
                onChimeCue={() => audioEngineRef.current?.playChimeCue(432)}
                analyser={audioEngineRef.current?.getAnalyser() || null}
              />
            </div>

            {/* Right Bento Column (col-span-7) */}
            <div className="xl:col-span-7 w-full flex flex-col gap-3.5 sm:gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider font-orbitron">
                  {selectedCategory === 'all'
                    ? 'Explore All Modes'
                    : selectedCategory === 'calm-reset'
                    ? 'Calm & Reset Modes'
                    : selectedCategory === 'protection'
                    ? 'Spiritual Protection Modes'
                    : selectedCategory === 'focus-rizq'
                    ? 'Focus & Executive Clarity Modes'
                    : 'Restorative Sleep & Healing Modes'}
                </span>
                <span className="text-xs text-white/40">Select card to preview</span>
              </div>

              <BentoModeGrid
                modes={filteredModes}
                selectedModeId={selectedMode.id}
                onSelectMode={handleSelectMode}
                isPlaying={isPlaying}
              />
            </div>
          </div>

          {/* Liquid Audio Dock on Desktop */}
          <div className="hidden lg:block mt-2 pt-2">
            <LiquidAudioDock
              currentMode={selectedMode}
              isPlaying={isPlaying}
              isOpening={isOpening}
              isBuffering={isBuffering}
              activeSurahNumber={selectedMode.surahNumbers[activeSurahIndex] || selectedMode.surahNumbers[0]}
              binauralVolume={binauralVolume}
              quranVolume={quranVolume}
              onTogglePlay={handleTogglePlay}
              onBinauralVolumeChange={setBinauralVolume}
              onQuranVolumeChange={setQuranVolume}
              onOpenReader={() => setIsReaderOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Floating Liquid Audio Dock on Mobile / Tablet (Fixed to bottom with safe-area support) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 pointer-events-none">
        <div className="pointer-events-auto max-w-lg mx-auto pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <LiquidAudioDock
            currentMode={selectedMode}
            isPlaying={isPlaying}
            isOpening={isOpening}
            isBuffering={isBuffering}
            activeSurahNumber={selectedMode.surahNumbers[activeSurahIndex] || selectedMode.surahNumbers[0]}
            binauralVolume={binauralVolume}
            quranVolume={quranVolume}
            onTogglePlay={handleTogglePlay}
            onBinauralVolumeChange={setBinauralVolume}
            onQuranVolumeChange={setQuranVolume}
            onOpenReader={() => setIsReaderOpen(true)}
          />
        </div>
      </div>

      {/* Full-Screen Sacred Mandala View (when started/expanded) */}
      {isFullScreenSession && (
        <ActiveSessionView
          mode={selectedMode}
          isOpening={isOpening}
          activeSurahIndex={activeSurahIndex}
          currentAyahIndex={currentAyahIndex}
          isQuranPlaying={isQuranPlaying}
          isFrequencyPlaying={isFrequencyPlaying}
          onToggleQuran={handleToggleQuran}
          onToggleFrequency={handleToggleFrequency}
          onEndSession={handleEndSession}
          onMinimize={() => setIsFullScreenSession(false)}
        />
      )}

      {/* Quran & Translation Modal Drawer */}
      <QuranReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        mode={selectedMode}
      />

      {/* Guided Breathing Modal */}
      <GuidedBreathingModal
        isOpen={isBreathingModalOpen}
        onClose={() => setIsBreathingModalOpen(false)}
        initialMode={selectedMode.recommendedBreathing || 'cyclic-sighing'}
        onPhaseChangeChime={() => audioEngineRef.current?.playChimeCue(432)}
      />

      {/* Verified Sources Drawer */}
      <VerifiedSourcesDrawer
        isOpen={isVerifiedSourcesOpen}
        onClose={() => setIsVerifiedSourcesOpen(false)}
        mode={selectedMode}
      />
    </div>
  );
};

export default App;
