import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  isOpening: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyser,
  isPlaying,
  isOpening,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!isPlaying || !analyser) {
        // Resting ambient wave
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
        ctx.lineWidth = 1.5;
        const midY = height / 2;
        const time = Date.now() * 0.002;

        for (let x = 0; x < width; x += 4) {
          const y = midY + Math.sin(x * 0.03 + time) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      // Read time-domain waveform data
      analyser.getByteTimeDomainData(dataArray);

      // Gradient stroke
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      if (isOpening) {
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(0.5, '#fbbf24');
        gradient.addColorStop(1, '#f59e0b');
      } else {
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.3, '#22d3ee');
        gradient.addColorStop(0.7, '#38bdf8');
        gradient.addColorStop(1, '#14b8a6');
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Subtle glow pass
      ctx.shadowBlur = 10;
      ctx.shadowColor = isOpening ? 'rgba(245, 158, 11, 0.6)' : 'rgba(34, 211, 238, 0.6)';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyser, isPlaying, isOpening]);

  return (
    <div className="relative w-full h-10 sm:h-12 bg-slate-950/60 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={380}
        height={48}
        className="w-full h-full object-cover"
      />
      {/* Overlay label */}
      <div className="absolute left-2.5 top-1.5 text-[9px] font-mono tracking-wider uppercase text-slate-400 select-none">
        {isOpening ? (
          <span className="text-amber-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Golden Ratio φ Tuning (432 · 576 · 699 Hz)
          </span>
        ) : isPlaying ? (
          <span className="text-cyan-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Neural Resonance Active
          </span>
        ) : (
          <span className="text-slate-400">Audio Wave Standby</span>
        )}
      </div>
    </div>
  );
};
