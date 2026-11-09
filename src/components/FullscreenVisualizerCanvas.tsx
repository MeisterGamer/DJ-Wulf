import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Activity, Radio, X, Disc3 } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

export type VisualizerMode = 'ring' | 'wave' | 'particles';

interface FullscreenVisualizerCanvasProps {
  isActive: boolean;
  mode: VisualizerMode;
  onChangeMode: (mode: VisualizerMode) => void;
  onClose: () => void;
  isPlaying: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  color: string;
}

export const FullscreenVisualizerCanvas: React.FC<FullscreenVisualizerCanvasProps> = ({
  isActive,
  mode,
  onChangeMode,
  onClose,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Array<{ r: number; maxR: number; alpha: number }>>([]);
  const lastBassRef = useRef<number>(0);

  // Initialize particle system
  useEffect(() => {
    const pCount = 120;
    const initialParticles: Particle[] = [];
    const colors = ['#00ff66', '#39ff14', '#10b981', '#ffffff', '#86efac'];

    for (let i = 0; i < pCount; i++) {
      initialParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2.5 + 1,
        baseSize: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = initialParticles;
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      // Retrieve live audio frequency and waveform data
      const freqData = soundEngine.getFrequencyData();
      const waveData = soundEngine.getWaveformData();

      // Calculate bass power (first 8 frequency bands)
      let bassSum = 0;
      for (let i = 0; i < 8; i++) {
        bassSum += freqData[i] || 0;
      }
      const bassAvg = bassSum / 8; // 0 to 255
      const bassRatio = isPlaying ? bassAvg / 255 : 0.05;

      // Trigger shockwave on hard bass transient
      if (bassAvg > 165 && bassAvg - lastBassRef.current > 25 && isPlaying) {
        shockwavesRef.current.push({
          r: 60,
          maxR: Math.max(width, height) * 0.65,
          alpha: 0.8,
        });
      }
      lastBassRef.current = bassAvg;

      // Motion trail clear
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // ==========================================
      // MODE 1: CYBER SHOCKWAVE RING
      // ==========================================
      if (mode === 'ring') {
        // Draw expanding shockwaves
        for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
          const sw = shockwavesRef.current[i];
          sw.r += 8 + bassRatio * 12;
          sw.alpha *= 0.94;

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, sw.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 255, 102, ${sw.alpha * 0.4})`;
          ctx.lineWidth = 3;
          ctx.shadowColor = '#00ff66';
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.restore();

          if (sw.alpha < 0.02 || sw.r >= sw.maxR) {
            shockwavesRef.current.splice(i, 1);
          }
        }

        // Central Pulsing Core
        const coreRadius = (Math.min(width, height) * 0.12) * (1 + bassRatio * 0.35);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(10, coreRadius), 0, Math.PI * 2);
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(10, coreRadius));
        coreGrad.addColorStop(0, `rgba(0, 255, 102, ${0.4 + bassRatio * 0.5})`);
        coreGrad.addColorStop(0.6, `rgba(0, 255, 102, ${0.15 + bassRatio * 0.2})`);
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.fill();

        ctx.strokeStyle = `rgba(0, 255, 102, ${0.7 + bassRatio * 0.3})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        // Radial Frequency Rays (48 rays)
        const numRays = 48;
        const angleStep = (Math.PI * 2) / numRays;

        for (let i = 0; i < numRays; i++) {
          const angle = i * angleStep;
          const dataIndex = Math.floor((i / numRays) * (freqData.length / 2));
          const val = isPlaying ? (freqData[dataIndex] || 0) : 15;
          const rayLen = coreRadius + (val / 255) * (Math.min(width, height) * 0.32);

          const x1 = cx + Math.cos(angle) * (coreRadius + 4);
          const y1 = cy + Math.sin(angle) * (coreRadius + 4);
          const x2 = cx + Math.cos(angle) * rayLen;
          const y2 = cy + Math.sin(angle) * rayLen;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 2 === 0 ? '#00ff66' : '#ffffff';
          ctx.lineWidth = 2 + (val / 255) * 3;
          ctx.shadowColor = '#00ff66';
          ctx.shadowBlur = (val / 255) * 16;
          ctx.stroke();

          // Particle cap on ray tip
          if (val > 100) {
            ctx.beginPath();
            ctx.arc(x2, y2, 2.5 + (val / 255) * 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // ==========================================
      // MODE 2: SUB-BASS HORIZON WAVEFORM
      // ==========================================
      else if (mode === 'wave') {
        const barCount = 48;
        const barWidth = width / barCount;
        const baseY = height * 0.85;

        // Mirrored bottom spectrum bars
        for (let i = 0; i < barCount; i++) {
          const dataIdx = Math.floor((i < barCount / 2 ? i : barCount - 1 - i) * (freqData.length / barCount));
          const val = isPlaying ? (freqData[dataIdx] || 0) : 10;
          const barHeight = (val / 255) * (height * 0.45);
          const x = i * barWidth;

          ctx.save();
          const grad = ctx.createLinearGradient(0, baseY - barHeight, 0, baseY);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.2, '#00ff66');
          grad.addColorStop(1, 'rgba(0, 255, 102, 0.05)');

          ctx.fillStyle = grad;
          ctx.fillRect(x + 2, baseY - barHeight, barWidth - 4, barHeight);

          // Reflection downwards
          ctx.fillStyle = `rgba(0, 255, 102, ${0.08 + (val / 255) * 0.15})`;
          ctx.fillRect(x + 2, baseY, barWidth - 4, barHeight * 0.35);

          // Peak laser shaft
          if (val > 180 && i % 3 === 0) {
            ctx.beginPath();
            ctx.moveTo(x + barWidth / 2, baseY - barHeight);
            ctx.lineTo(x + barWidth / 2, 0);
            ctx.strokeStyle = 'rgba(0, 255, 102, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
        }

        // Oscilloscope Waveform Ribbon
        ctx.save();
        ctx.beginPath();
        const sliceWidth = width / waveData.length;
        let wx = 0;

        for (let i = 0; i < waveData.length; i++) {
          const v = waveData[i] / 128.0; // 0 to 2
          const wy = (v * (height * 0.2)) + (height * 0.45);

          if (i === 0) {
            ctx.moveTo(wx, wy);
          } else {
            ctx.lineTo(wx, wy);
          }
          wx += sliceWidth;
        }

        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // MODE 3: ACID PARTICLE NEBULA
      // ==========================================
      else if (mode === 'particles') {
        const particles = particlesRef.current;

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const speedMultiplier = 1 + bassRatio * 3.5;

          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          // Wrap edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Pulse size on bass
          p.size = p.baseSize * (1 + bassRatio * 2.2);

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#00ff66';
          ctx.shadowBlur = 8 + bassRatio * 15;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.restore();

          // Connect nearby particles with luminous cyber lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = 90 + bassRatio * 50;
            if (dist < maxDist) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 255, 102, ${(1 - dist / maxDist) * 0.25})`;
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isActive, mode, isPlaying]);

  if (!isActive) return null;

  return (
    <>
      {/* Fullscreen Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-90 transition-opacity duration-500"
      />

      {/* Floating Visualizer HUD Controller */}
      <div className="fixed bottom-24 right-4 sm:right-6 z-40 bg-black/90 backdrop-blur-xl border border-[#00ff66]/40 p-2 rounded-2xl shadow-[0_0_30px_rgba(0,255,102,0.25)] flex items-center gap-2 animate-in fade-in">
        <div className="flex items-center gap-1.5 px-2 text-xs font-black text-[#00ff66]">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Visualizer:</span>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1 p-0.5 bg-zinc-950 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => onChangeMode('ring')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              mode === 'ring' ? 'bg-[#00ff66] text-black shadow-sm' : 'text-zinc-300 hover:text-white'
            }`}
            title="Cyber Shockwave Ring Modus"
          >
            Ring
          </button>
          <button
            onClick={() => onChangeMode('wave')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              mode === 'wave' ? 'bg-[#00ff66] text-black shadow-sm' : 'text-zinc-300 hover:text-white'
            }`}
            title="Sub-Bass Waveform Modus"
          >
            Wave
          </button>
          <button
            onClick={() => onChangeMode('particles')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              mode === 'particles' ? 'bg-[#00ff66] text-black shadow-sm' : 'text-zinc-300 hover:text-white'
            }`}
            title="Acid Particle Nebula Modus"
          >
            Partikel
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Visualizer ausschalten"
          aria-label="Fullscreen Visualizer ausschalten"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
