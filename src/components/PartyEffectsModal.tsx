import React from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Zap,
  X,
  Flame,
  Radio,
  Activity,
  Disc3,
} from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';
import { VisualizerMode } from './FullscreenVisualizerCanvas';

interface PartyEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPartyActive: boolean;
  onTogglePartyMode: () => void;
  isLaserActive: boolean;
  onToggleLaser: () => void;
  isStrobeActive: boolean;
  onToggleStrobe: () => void;
  isVisualizerActive: boolean;
  onToggleVisualizer: () => void;
  visualizerMode: VisualizerMode;
  onChangeVisualizerMode: (mode: VisualizerMode) => void;
}

export const PartyEffectsModal: React.FC<PartyEffectsModalProps> = ({
  isOpen,
  onClose,
  isLaserActive,
  onToggleLaser,
  isStrobeActive,
  onToggleStrobe,
  isVisualizerActive,
  onToggleVisualizer,
  visualizerMode,
  onChangeVisualizerMode,
}) => {
  if (!isOpen) return null;

  // Neon Green & Crisp Light Confetti Cannon
  const triggerConfettiCannon = () => {
    confetti({
      particleCount: 85,
      angle: 60,
      spread: 75,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#00ff66', '#ffffff', '#39ff14', '#10b981', '#f4f4f5'],
    });

    confetti({
      particleCount: 85,
      angle: 120,
      spread: 75,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#00ff66', '#ffffff', '#39ff14', '#10b981', '#f4f4f5'],
    });
  };

  const triggerStarsExplosion = () => {
    confetti({
      particleCount: 130,
      spread: 110,
      origin: { y: 0.5 },
      shapes: ['star', 'circle'],
      colors: ['#00ff66', '#ffffff', '#39ff14', '#e4e4e7'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-xl w-full bg-zinc-950 border border-[#00ff66]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,255,102,0.25)]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff66]/15 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Party-Effekte & Club FX</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00ff66] text-black">
                  LIVE
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Laser-Atmosphäre, DJ-Soundboard & Pyro-Effekte in Schwarz & Neon-Grün
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Main Atmosphere Toggles */}
        <div className="space-y-4 mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-[#00ff66]">
            1. Visuelle Club-Atmosphäre
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Laser Show Toggle */}
            <button
              onClick={onToggleLaser}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                isLaserActive
                  ? 'bg-[#00ff66]/20 border-[#00ff66] text-white shadow-[0_0_20px_rgba(0,255,102,0.35)]'
                  : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className={`w-5 h-5 ${isLaserActive ? 'text-[#00ff66]' : 'text-zinc-400'}`} />
                <div>
                  <div className="text-xs font-bold">Neon Laser Show</div>
                  <div className="text-[11px] text-zinc-400">Grüne Cyber-Strahlen</div>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isLaserActive ? 'bg-[#00ff66] text-black' : 'bg-black text-zinc-400'}`}>
                {isLaserActive ? 'AN' : 'AUS'}
              </span>
            </button>

            {/* Strobe / Pulse Toggle */}
            <button
              onClick={onToggleStrobe}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                isStrobeActive
                  ? 'bg-white/20 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio className={`w-5 h-5 ${isStrobeActive ? 'text-white' : 'text-zinc-400'}`} />
                <div>
                  <div className="text-xs font-bold">Strobe Pulse</div>
                  <div className="text-[11px] text-zinc-400">Rave Pulsschlag</div>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isStrobeActive ? 'bg-white text-black' : 'bg-black text-zinc-400'}`}>
                {isStrobeActive ? 'AN' : 'AUS'}
              </span>
            </button>
          </div>

          {/* Fullscreen Canvas Visualizer Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isVisualizerActive
              ? 'bg-[#00ff66]/10 border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.25)]'
              : 'bg-zinc-900/80 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  isVisualizerActive
                    ? 'bg-[#00ff66] text-black border-[#00ff66]'
                    : 'bg-black border-white/10 text-zinc-400'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-2">
                    <span>Fullscreen Audio Visualizer</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-[#00ff66]">
                      CANVAS 60FPS
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Reagiert live auf Bass, Kick-Transienten und Frequenzbänder
                  </div>
                </div>
              </div>

              <button
                onClick={onToggleVisualizer}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  isVisualizerActive
                    ? 'bg-[#00ff66] text-black shadow-[0_0_15px_rgba(0,255,102,0.6)]'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {isVisualizerActive ? 'AKTIV' : 'STARTEN'}
              </button>
            </div>

            {/* Visualizer Mode Selection */}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Modus:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onChangeVisualizerMode('ring')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                    visualizerMode === 'ring'
                      ? 'bg-[#00ff66] text-black'
                      : 'bg-black/60 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Disc3 className="w-3 h-3" />
                  <span>Cyber Ring</span>
                </button>
                <button
                  onClick={() => onChangeVisualizerMode('wave')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                    visualizerMode === 'wave'
                      ? 'bg-[#00ff66] text-black'
                      : 'bg-black/60 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>Oszilloskop</span>
                </button>
                <button
                  onClick={() => onChangeVisualizerMode('particles')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                    visualizerMode === 'particles'
                      ? 'bg-[#00ff66] text-black'
                      : 'bg-black/60 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Partikel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Confetti Cannon Triggers */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-[#00ff66]">
            2. Konfetti & Festival Pyro
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={triggerConfettiCannon}
              className="py-3 px-4 rounded-xl bg-linear-to-r from-[#00ff66] to-[#10b981] hover:brightness-110 text-black text-xs font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Neon Konfetti</span>
            </button>

            <button
              onClick={triggerStarsExplosion}
              className="py-3 px-4 rounded-xl bg-linear-to-r from-white to-zinc-200 hover:brightness-110 text-black text-xs font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 fill-black" />
              <span>Heller Sternregen</span>
            </button>
          </div>
        </div>

        {/* Section 3: Live DJ Soundboard */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-[#00ff66] flex items-center justify-between">
            <span>3. DJ Soundboard (Web Audio Synthesizer)</span>
            <span className="text-[10px] font-mono text-[#00ff66]">100% Echtzeit</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => soundEngine.playAirhorn()}
              className="p-3 rounded-xl bg-zinc-900 hover:bg-[#00ff66]/15 border border-white/10 hover:border-[#00ff66] text-zinc-200 hover:text-[#00ff66] transition-all active:scale-95 text-left"
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>🎺</span>
                <span>Airhorn</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Festival Horn</div>
            </button>

            <button
              onClick={() => soundEngine.playBassDrop()}
              className="p-3 rounded-xl bg-zinc-900 hover:bg-[#00ff66]/15 border border-white/10 hover:border-[#00ff66] text-zinc-200 hover:text-[#00ff66] transition-all active:scale-95 text-left"
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>💥</span>
                <span>Sub Bass Drop</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">808 Sub Boom</div>
            </button>

            <button
              onClick={() => soundEngine.playRiser()}
              className="p-3 rounded-xl bg-zinc-900 hover:bg-[#00ff66]/15 border border-white/10 hover:border-[#00ff66] text-zinc-200 hover:text-[#00ff66] transition-all active:scale-95 text-left"
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>📈</span>
                <span>Riser Build-Up</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Filter Sweep</div>
            </button>

            <button
              onClick={() => soundEngine.playLaserZap()}
              className="p-3 rounded-xl bg-zinc-900 hover:bg-[#00ff66]/15 border border-white/10 hover:border-[#00ff66] text-zinc-200 hover:text-[#00ff66] transition-all active:scale-95 text-left"
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>⚡</span>
                <span>Laser Zap</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Acid Synths</div>
            </button>

            <button
              onClick={() => soundEngine.playCrowdCheer()}
              className="p-3 rounded-xl bg-zinc-900 hover:bg-[#00ff66]/15 border border-white/10 hover:border-[#00ff66] text-zinc-200 hover:text-[#00ff66] transition-all active:scale-95 text-left col-span-2 sm:col-span-2"
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>🙌</span>
                <span>Crowd Cheer & Roar</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Festival Crowd Jubel</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span>Tipp: Schalte Musik ein für die volle Party-Synchronisation.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
