import React, { useState, useEffect, useRef } from 'react';
import { CyberHeader } from './components/CyberHeader';
import { FeaturedCard } from './components/FeaturedCard';
import { ModeCard } from './components/ModeCard';
import { ModeDetailsPanel } from './components/ModeDetailsPanel';
import { ActiveSessionView } from './components/ActiveSessionView';
import { QuranReaderModal } from './components/QuranReaderModal';
import { AudioControls } from './components/AudioControls';
import { GuidedBreathingModal } from './components/GuidedBreathingModal';
import { VerifiedSourcesDrawer } from './components/VerifiedSourcesDrawer';
import { MODES } from './data/modes';
import type { Mode } from './data/modes';
import { AudioEngine } from './audio/audioEngine';
import { Cpu } from 'lucide-react';

export const App: React.FC = () => {
  // Default selected is Mind Reset
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
  const [isFullScreenSession, setIsFullScreenSession] = useState<boolean>(false);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [breathingPattern, setBreathingPattern] = useState<'cyclic-sighing' | 'box-breathing'>('cyclic-sighing');
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

  // Update volumes in engine
  useEffect(() => {
    audioEngineRef.current?.setVolumes(binauralVolume, quranVolume);
  }, [binauralVolume, quranVolume]);

  /**
   * Whenever ANY card is clicked / selected:
   * Immediately start the exact recitation + binaural reset frequency!
   */
  const handleSelectMode = (mode: Mode) => {
    setSelectedMode(mode);
    setActiveSurahIndex(0);
    setCurrentAyahIndex(0);

    if (mode.recommendedBreathing) {
      setBreathingPattern(mode.recommendedBreathing);
    }

    if (audioEngineRef.current) {
      setIsQuranPlaying(true);
      setIsFrequencyPlaying(true);
      // Immediately start the dual-layer audio in the exact voice
      audioEngineRef.current.startSession(
        mode.carrierHz,
        mode.beatHz,
        mode.surahNumbers,
        mode.totalAyahs,
        mode.customAudioUrls
      );
    }
  };

  /**
   * Launch Full-Screen Sacred Mandala & Breathing Pacer session view
   */
  const handleLaunchFullScreen = () => {
    if (!isPlaying && audioEngineRef.current) {
      audioEngineRef.current.startSession(
        selectedMode.carrierHz,
        selectedMode.beatHz,
        selectedMode.surahNumbers,
        selectedMode.totalAyahs,
        selectedMode.customAudioUrls
      );
    }
    setIsFullScreenSession(true);
  };

  const handleEndSession = () => {
    audioEngineRef.current?.stopSession();
    setIsPlaying(false);
    setIsFullScreenSession(false);
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

  const handleTogglePlay = () => {
    if (isPlaying) {
      handleEndSession();
    } else {
      handleSelectMode(selectedMode);
    }
  };

  const handleOpenGuidedBreathing = (pattern?: 'cyclic-sighing' | 'box-breathing') => {
    if (pattern) {
      setBreathingPattern(pattern);
    } else if (selectedMode.recommendedBreathing) {
      setBreathingPattern(selectedMode.recommendedBreathing);
    }
    setIsBreathingOpen(true);
  };

  const featuredMode = MODES.find((m) => m.isFeatured) || MODES[0];
  const gridModes = MODES.filter((m) => !m.isFeatured);

  return (
    <div className="min-h-screen flex flex-col bg-[#09131f] text-slate-100 cyber-grid relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-rose-950/90 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl shadow-xl text-xs backdrop-blur-md animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Main Console Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-28 flex flex-col">
        {/* Header Block matching Reel */}
        <CyberHeader />

        {/* Console Section Header */}
        <div className="mt-4 mb-3 flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-2.5 gap-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-orbitron flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEURO RESET CONSOLE · V2 UPGRADE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-slate-100 uppercase font-orbitron mt-0.5">
              WHAT DO YOU NEED?
            </h2>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            <span>15 Validated Neuro Reset Modes · Select any card to stream</span>
          </div>
        </div>

        {/* Top Orange Horizontal Divider */}
        <div className="mb-4 w-full h-[1.5px] bg-gradient-to-r from-amber-600/80 via-amber-400 to-amber-600/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />

        {/* 3. Top Full-Width Featured Card (Crypto Trading: Calm & Cool) */}
        <div className="mb-4">
          <FeaturedCard
            mode={featuredMode}
            isSelected={selectedMode.id === featuredMode.id}
            onSelect={handleSelectMode}
            isPlaying={isPlaying && selectedMode.id === featuredMode.id}
          />
        </div>

        {/* 4. Responsive Grid of 14 Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {gridModes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode.id === mode.id}
              onSelect={handleSelectMode}
              isPlaying={isPlaying && selectedMode.id === mode.id}
            />
          ))}
        </div>

        {/* 5. Bottom Selected-Mode Details Panel with START: FREQUENCY -> QURAN */}
        <ModeDetailsPanel
          mode={selectedMode}
          onStartSession={handleLaunchFullScreen}
          onOpenReader={() => setIsReaderOpen(true)}
          onOpenVerifiedSources={() => setIsVerifiedSourcesOpen(true)}
          onOpenGuidedBreathing={handleOpenGuidedBreathing}
        />
      </main>

      {/* Persistent Bottom Audio Control Bar */}
      <AudioControls
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
        analyser={audioEngineRef.current?.getAnalyser() || null}
        onOpenReader={() => setIsReaderOpen(true)}
        onOpenGuidedBreathing={() => handleOpenGuidedBreathing()}
      />

      {/* FULL SCREEN IMMERSIVE ACTIVE SESSION VIEW */}
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
        />
      )}

      {/* Quran & Translation Modal Drawer */}
      <QuranReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        mode={selectedMode}
      />

      {/* Feature 5A: Toggleable Guided Breathing Ring Modal */}
      <GuidedBreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
        initialMode={breathingPattern}
        onPhaseChangeChime={() => audioEngineRef.current?.playChimeCue(432)}
      />

      {/* Feature 5B: Verified Research & Islamic Basis Drawer */}
      <VerifiedSourcesDrawer
        isOpen={isVerifiedSourcesOpen}
        onClose={() => setIsVerifiedSourcesOpen(false)}
        mode={selectedMode}
      />
    </div>
  );
};

export default App;
