import React, { useState, useEffect, useRef } from 'react';
import { X, Wind, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

interface GuidedBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'cyclic-sighing' | 'box-breathing';
  onPhaseChangeChime?: () => void;
}

type BreathingPattern = 'cyclic-sighing' | 'box-breathing';

interface Phase {
  name: string;
  subtext: string;
  duration: number; // in seconds
  scale: number;    // SVG circle scale target: 0.6 = contracted, 1.0 = fully expanded
  color: string;
}

const CYCLIC_PHASES: Phase[] = [
  { name: 'Inhale (Nose)', subtext: 'Deep slow breath in through your nose', duration: 3.0, scale: 0.9, color: '#22d3ee' },
  { name: 'Top-Up Inhale', subtext: 'Quick second sip of air into chest', duration: 1.5, scale: 1.05, color: '#38bdf8' },
  { name: 'Long Exhale (Mouth)', subtext: 'Slow, relaxed release through mouth', duration: 6.0, scale: 0.6, color: '#14b8a6' },
];

const BOX_PHASES: Phase[] = [
  { name: 'Inhale', subtext: 'Smooth inhale through your nose', duration: 4.0, scale: 1.0, color: '#22d3ee' },
  { name: 'Hold', subtext: 'Keep lungs gently full without strain', duration: 4.0, scale: 1.0, color: '#f59e0b' },
  { name: 'Exhale', subtext: 'Even, steady exhale emptying lungs', duration: 4.0, scale: 0.65, color: '#14b8a6' },
  { name: 'Hold Empty', subtext: 'Stay calm and empty before next breath', duration: 4.0, scale: 0.65, color: '#a855f7' },
];

export const GuidedBreathingModal: React.FC<GuidedBreathingModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'cyclic-sighing',
  onPhaseChangeChime,
}) => {
  const [pattern, setPattern] = useState<BreathingPattern>(initialMode);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(CYCLIC_PHASES[0].duration);
  const [isChimeEnabled, setIsChimeEnabled] = useState<boolean>(true);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // Sync with initial mode if changed
  useEffect(() => {
    if (initialMode) {
      setPattern(initialMode);
      setPhaseIndex(0);
      const phases = initialMode === 'cyclic-sighing' ? CYCLIC_PHASES : BOX_PHASES;
      setRemainingTime(phases[0].duration);
    }
  }, [initialMode]);

  const phases = pattern === 'cyclic-sighing' ? CYCLIC_PHASES : BOX_PHASES;
  const currentPhase = phases[phaseIndex] || phases[0];

  // Timer loop for smooth countdown
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isOpen) return;

    lastTickRef.current = Date.now();
    const interval = window.setInterval(() => {
      const now = Date.now();
      const deltaSec = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setRemainingTime((prev) => {
        const next = prev - deltaSec;
        if (next <= 0) {
          // Advance to next phase
          setPhaseIndex((curIdx) => {
            const nextIdx = (curIdx + 1) % phases.length;
            if (nextIdx === 0) {
              setCyclesCompleted((c) => c + 1);
            }
            if (isChimeEnabled && onPhaseChangeChime) {
              onPhaseChangeChime();
            }
            return nextIdx;
          });
          return phases[(phaseIndex + 1) % phases.length]?.duration || 3;
        }
        return next;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, phaseIndex, phases, isChimeEnabled, onPhaseChangeChime]);

  if (!isOpen) return null;

  // Calculate circle progress percentage
  const totalPhaseDuration = currentPhase.duration;
  const progressRatio = Math.max(0, Math.min(1, (totalPhaseDuration - remainingTime) / totalPhaseDuration));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0a1523]/95 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] text-center overflow-hidden">
        {/* Glow ambient background element */}
        <div
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentPhase.color }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentPhase.color }}
        />

        {/* Top header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-orbitron tracking-wider">
              Guided Breathing Ring
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Chime toggle button */}
            <button
              onClick={() => setIsChimeEnabled(!isChimeEnabled)}
              title={isChimeEnabled ? 'Mute 432 Hz transition chime' : 'Enable 432 Hz transition chime'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
            >
              {isChimeEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => {
              setPattern('cyclic-sighing');
              setPhaseIndex(0);
              setRemainingTime(CYCLIC_PHASES[0].duration);
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              pattern === 'cyclic-sighing'
                ? 'bg-gradient-to-r from-cyan-500/30 to-teal-500/30 text-cyan-300 border border-cyan-400/50 shadow-cyan-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cyclic Sighing (Stanford)
          </button>
          <button
            onClick={() => {
              setPattern('box-breathing');
              setPhaseIndex(0);
              setRemainingTime(BOX_PHASES[0].duration);
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              pattern === 'box-breathing'
                ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 border border-amber-400/50 shadow-amber-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Box Breathing (4-4-4-4)
          </button>
        </div>

        {/* Animated Guided Breathing Concentric SVG Ring */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Background SVG circles */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="90"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="90"
                stroke={currentPhase.color}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - progressRatio)}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: 'stroke-dashoffset 0.08s linear, stroke 0.5s ease',
                  filter: `drop-shadow(0 0 10px ${currentPhase.color}88)`,
                }}
              />
            </svg>

            {/* Pulsing concentric center aura that expands / contracts */}
            <div
              className="absolute rounded-full pointer-events-none transition-transform duration-700 ease-out"
              style={{
                width: '140px',
                height: '140px',
                transform: `scale(${currentPhase.scale})`,
                backgroundColor: `${currentPhase.color}15`,
                border: `2px solid ${currentPhase.color}50`,
                boxShadow: `0 0 30px ${currentPhase.color}40`,
              }}
            />

            {/* Central countdown & phase title */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span
                className="text-3xl font-extrabold font-mono tracking-tight"
                style={{ color: currentPhase.color }}
              >
                {Math.ceil(remainingTime)}s
              </span>
              <span className="mt-1 text-sm font-bold text-slate-100 font-orbitron tracking-wider">
                {currentPhase.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 max-w-[130px] leading-tight">
                {currentPhase.subtext}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom stats / cue status */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Cycles: {cyclesCompleted}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>432 Hz Acoustic Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};
