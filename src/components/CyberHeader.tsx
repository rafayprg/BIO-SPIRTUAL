import React from 'react';

export const CyberHeader: React.FC = () => {
  return (
    <header className="relative w-full max-w-5xl mx-auto pt-6 pb-4 px-4 flex flex-col items-center text-center select-none">
      {/* Background Cyber Geometric Wireframe Graphic (matching frame_000s.jpg) */}
      <div 
        className="absolute inset-0 -top-4 pointer-events-none flex items-center justify-center overflow-hidden opacity-15" 
        aria-hidden="true"
      >
        <svg 
          viewBox="0 0 800 500" 
          className="w-[750px] h-[450px] text-cyan-400 stroke-current fill-none"
        >
          {/* Concentric radar circles */}
          <circle cx="400" cy="220" r="160" strokeWidth="0.8" strokeDasharray="4 4" />
          <circle cx="400" cy="220" r="110" strokeWidth="1" stroke="rgba(34, 211, 238, 0.4)" />
          <circle cx="400" cy="220" r="60" strokeWidth="0.8" strokeDasharray="2 2" />

          {/* Angled Reticle Lines */}
          <line x1="180" y1="100" x2="620" y2="340" strokeWidth="0.7" stroke="rgba(34, 211, 238, 0.3)" />
          <line x1="180" y1="340" x2="620" y2="100" strokeWidth="0.7" stroke="rgba(34, 211, 238, 0.3)" />
          <line x1="400" y1="20" x2="400" y2="420" strokeWidth="0.8" stroke="rgba(34, 211, 238, 0.25)" strokeDasharray="6 4" />
          <line x1="150" y1="220" x2="650" y2="220" strokeWidth="0.8" stroke="rgba(34, 211, 238, 0.25)" strokeDasharray="6 4" />

          {/* Minimalist Cyber / Neuro Head Silhouette */}
          <g transform="translate(290, 80) scale(0.55)" strokeWidth="1.4">
            <path 
              d="M200 420 C180 380 160 330 160 250 C160 140 240 70 350 70 C460 70 540 150 540 260 C540 330 520 370 510 400 L510 470 C480 500 450 520 400 530 L360 530 C310 520 280 500 250 470 Z" 
              stroke="rgba(34, 211, 238, 0.6)"
            />
            {/* Neural Brain Wave Lines */}
            <path d="M200 270 Q 290 200 380 270 T 500 270" stroke="#22d3ee" strokeOpacity="0.8" />
            <circle cx="350" cy="70" r="6" fill="#f59e0b" />
            <circle cx="350" cy="220" r="4" fill="#22d3ee" />
            <circle cx="350" cy="300" r="5" fill="#10b981" />
          </g>
        </svg>
      </div>

      {/* Top Circular Crescent & Star Badge matching frame_000s.jpg */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#0a1826]/90 border border-teal-500/50 flex items-center justify-center shadow-emerald-glow">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-300 fill-current">
            {/* Crescent moon and star */}
            <path d="M12 2a9 9 0 0 0 7.8 13.5A9.5 9.5 0 1 1 8.5 2.2c1.1-.1 2.3 0 3.5.2z" />
            <polygon points="17.5,7 18.2,8.8 20,8.8 18.5,9.9 19.1,11.7 17.5,10.6 15.9,11.7 16.5,9.9 15,8.8 16.8,8.8" />
          </svg>
        </div>
      </div>

      {/* Title: BIO SPIRITUAL HACKING (2 lines, Orbitron font) */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-orbitron uppercase tracking-super-wide text-slate-100 leading-tight drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
        <div>BIO SPIRITUAL</div>
        <div className="text-cyan-200 mt-1">HACKING</div>
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl font-normal tracking-wide">
        Set a reset frequency <span className="text-cyan-400">→</span> play the Quran on top <span className="text-cyan-400">→</span> explore the Quran and Sunnah.
      </p>
    </header>
  );
};
