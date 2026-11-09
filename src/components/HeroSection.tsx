import React, { useEffect, useState } from 'react';
import { Play, Pause, Calendar, Disc, Sparkles, ArrowRight } from 'lucide-react';
import { WolfEmblem } from './VisualArt';
import { TrackItem } from '../types';

interface HeroSectionProps {
  currentTrack: TrackItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenBooking: () => void;
  onOpenPartyEffects: () => void;
  frequencyData: Uint8Array;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onOpenBooking,
  onOpenPartyEffects,
  frequencyData,
}) => {
  const [countdown, setCountdown] = useState({ days: 11, hours: 8, minutes: 24, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-white/10 bg-black">
      {/* Background neon green ambient aura */}
      <div className="absolute top-0 left-1/4 -z-10 w-[600px] h-[450px] bg-[#00ff66]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 -z-10 w-[500px] h-[500px] bg-white/[0.04] blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean unboxed kicker */}
            <div className="flex items-center gap-2.5 text-xs font-black tracking-widest uppercase text-[#00ff66] mb-4">
              <span>Berlin Underground</span>
              <span className="text-zinc-600">/</span>
              <span>Acid & Melodic Techno</span>
              <span className="text-zinc-600">/</span>
              <span>Tour 2026-2027</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] mb-6">
              BASS. ENERGIE.{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00ff66] via-white to-[#00ff66]">
                DAS RUDEL BEBT.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8">
              Willkommen im offiziellen Portal von <strong className="text-white font-bold">DJ Wulf</strong>.
              Treibende Warehouse-Grooves, kompromissloser Peak-Time Sound, exklusive unveröffentlichte
              Mixes und Tickets für die Europa-Tour.
            </p>

            {/* Next Show Countdown Bar */}
            <div className="mb-8 p-4 rounded-xl bg-zinc-950/80 border border-white/10 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Nächster Tour-Stopp:</div>
                    <div className="text-sm font-bold text-white">Watergate Berlin (14. Nov 2026)</div>
                  </div>
                </div>

                {/* Tabular Numerals Countdown */}
                <div className="flex items-center gap-2 font-mono tabular-nums text-center text-xs">
                  <div className="bg-black px-2.5 py-1.5 rounded border border-[#00ff66]/30">
                    <span className="text-base font-black text-[#00ff66]">{countdown.days}</span>
                    <span className="block text-[10px] text-zinc-400">Tage</span>
                  </div>
                  <span className="text-zinc-600 font-bold">:</span>
                  <div className="bg-black px-2.5 py-1.5 rounded border border-[#00ff66]/30">
                    <span className="text-base font-black text-[#00ff66]">
                      {String(countdown.hours).padStart(2, '0')}
                    </span>
                    <span className="block text-[10px] text-zinc-400">Std</span>
                  </div>
                  <span className="text-zinc-600 font-bold">:</span>
                  <div className="bg-black px-2.5 py-1.5 rounded border border-[#00ff66]/30">
                    <span className="text-base font-black text-[#00ff66]">
                      {String(countdown.minutes).padStart(2, '0')}
                    </span>
                    <span className="block text-[10px] text-zinc-400">Min</span>
                  </div>
                  <span className="text-zinc-600 font-bold">:</span>
                  <div className="bg-black px-2.5 py-1.5 rounded border border-[#00ff66]/30">
                    <span className="text-base font-black text-[#00ff66]">
                      {String(countdown.seconds).padStart(2, '0')}
                    </span>
                    <span className="block text-[10px] text-zinc-400">Sek</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onTogglePlay}
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-black bg-[#00ff66] hover:bg-[#33ff88] transition-all shadow-[0_0_25px_rgba(0,255,102,0.45)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{isPlaying ? 'Sound anhalten' : 'Live Beat starten'}</span>
              </button>

              <a
                href="#tour"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 transition-colors"
              >
                <span>Tourdaten ansehen</span>
                <ArrowRight className="w-4 h-4 text-[#00ff66]" />
              </a>

              <button
                onClick={onOpenPartyEffects}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-[#00ff66] bg-[#00ff66]/10 hover:bg-[#00ff66]/20 border border-[#00ff66]/40 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#00ff66]" />
                <span>Party Modus</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Stage & Rotating Vinyl Deck */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative h-full min-h-[380px] rounded-2xl bg-zinc-950 border border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-hidden group">
              {/* Top Bar of Deck */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <Disc className="w-4 h-4 text-[#00ff66] animate-spin" />
                  <span>On Deck · {currentTrack.bpm} BPM</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#00ff66] bg-black px-2 py-0.5 rounded border border-[#00ff66]/40">
                  {currentTrack.key}
                </span>
              </div>

              {/* Central Vinyl Deck & Wolf Emblem */}
              <div className="relative my-6 flex items-center justify-center">
                <div
                  className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-linear-to-br from-black via-zinc-900 to-black border-8 border-zinc-800/90 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex items-center justify-center transition-transform duration-1000 ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: isPlaying ? '2.8s' : '0s' }}
                >
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-zinc-700/60 flex items-center justify-center">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-dashed border-[#00ff66]/30 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-black border-2 border-[#00ff66] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.5)]">
                        <WolfEmblem className="w-10 h-10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tone Arm */}
                <div
                  className={`absolute right-4 top-2 w-16 h-28 border-r-4 border-t-4 border-[#00ff66]/80 rounded-tr-2xl transition-transform duration-500 origin-top-right ${
                    isPlaying ? 'rotate-18' : 'rotate-0'
                  }`}
                />
              </div>

              {/* Bottom Track Meta & Live Audio Visualizer */}
              <div className="z-10 bg-black/80 rounded-xl p-4 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="truncate pr-2">
                    <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
                    <p className="text-xs text-zinc-400">{currentTrack.artist} · {currentTrack.genre}</p>
                  </div>
                  <button
                    onClick={onTogglePlay}
                    className="p-2.5 rounded-lg bg-[#00ff66] text-black hover:bg-[#33ff88] transition-colors shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                    aria-label="Track abspielen"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                  </button>
                </div>

                {/* Live Real-Time Equalizer Waveform Bars (Neon Green & White) */}
                <div className="flex items-end justify-between h-8 gap-1 pt-2">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const freq = frequencyData[i % frequencyData.length] || 0;
                    const heightPercent = isPlaying ? Math.max(15, Math.min(100, (freq / 255) * 100)) : 10;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all duration-75"
                        style={{
                          height: `${heightPercent}%`,
                          opacity: isPlaying ? 0.7 + (heightPercent / 100) * 0.3 : 0.25,
                          backgroundColor: i > 18 ? '#ffffff' : '#00ff66',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Strip below hero split */}
        <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">140.000+</div>
            <div className="text-xs text-zinc-400 font-medium">Monatliche Hörer weltweit</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-[#00ff66]">42+ Shows</div>
            <div className="text-xs text-zinc-400 font-medium">Clubs & Festivals gebucht</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">18 Releases</div>
            <div className="text-xs text-zinc-400 font-medium">Originals, EPs & Bootlegs</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-[#00ff66]">100% Live</div>
            <div className="text-xs text-zinc-400 font-medium">Analog Synth & CDJ-Sets</div>
          </div>
        </div>
      </div>
    </section>
  );
};
