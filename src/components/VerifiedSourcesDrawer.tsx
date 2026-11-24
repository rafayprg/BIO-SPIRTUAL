import React from 'react';
import { X, ExternalLink, ShieldCheck, Microscope, BookOpen, AlertTriangle } from 'lucide-react';
import type { Mode } from '../data/modes';

interface VerifiedSourcesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
}

export const VerifiedSourcesDrawer: React.FC<VerifiedSourcesDrawerProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  if (!isOpen) return null;

  const { verification } = mode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c1929]/95 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(34,211,238,0.2)] text-left overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top cyan-amber gradient glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 font-orbitron tracking-wide flex items-center gap-2">
                <span>{mode.emoji} {mode.name}</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">Verified Islamic &amp; Scientific Sources</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 my-4 overflow-y-auto pr-1 text-xs sm:text-sm">
          {/* 1. Islamic Basis Section */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-emerald-300 font-orbitron text-xs tracking-wider uppercase">
                  Islamic Reference
                </h4>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                  verification.islamicTag === 'Authentic Sunnah'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {verification.islamicTag === 'Authentic Sunnah' ? '✓ Authentic Sunnah' : '📖 Quranic Theme'}
              </span>
            </div>

            <p className="text-slate-200 leading-relaxed font-normal">
              {verification.islamicCitation}
            </p>

            <div className="mt-3">
              <a
                href={verification.islamicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors"
              >
                <span>Read Full Citation on Quran.com / Sunnah.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 2. Scientific Basis Section */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Microscope className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-cyan-300 font-orbitron text-xs tracking-wider uppercase">
                  Scientific Neuroscience Basis
                </h4>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                  verification.scienceTag === 'Peer-Reviewed'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-700/40 text-slate-300 border border-slate-600/60'
                }`}
              >
                {verification.scienceTag === 'Peer-Reviewed' ? '🔬 Peer-Reviewed' : '🧪 Supportive / Mixed'}
              </span>
            </div>

            <p className="text-slate-200 leading-relaxed font-normal">
              {verification.scienceSummary}
            </p>

            <div className="mt-3">
              <a
                href={verification.scienceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors"
              >
                <span>View Clinical Study on PubMed / PMC</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 3. Transparency & Scientific Integrity Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-amber-500/30 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-amber-200/90 leading-relaxed">
              <strong>Transparency Note:</strong> Quranic recitations do not carry intrinsic numerical Hertz (Hz) frequencies. This console pairs authentic spiritual reflection and Ruqyah with supportive acoustic binaural beats and breathing rhythms for mental clarity and relaxation (not a medical treatment).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold font-orbitron tracking-wider uppercase bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
          >
            Close Source Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
