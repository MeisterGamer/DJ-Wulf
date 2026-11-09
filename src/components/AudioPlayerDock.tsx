import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Heart,
  MessageSquare,
  SlidersHorizontal,
  Gauge,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { TrackItem } from '../types';
import { soundEngine } from '../utils/audioEngine';

interface AudioPlayerDockProps {
  currentTrack: TrackItem;
  tracks: TrackItem[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (track: TrackItem) => void;
  frequencyData: Uint8Array;
  isFavorite: boolean;
  onToggleFavorite: (trackId: string) => void;
  onOpenBackstageChat?: () => void;
}

export const AudioPlayerDock: React.FC<AudioPlayerDockProps> = ({
  currentTrack,
  tracks,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  frequencyData,
  isFavorite,
  onToggleFavorite,
  onOpenBackstageChat,
}) => {
  const [showTracklist, setShowTracklist] = useState(false);
  const [showGainPopover, setShowGainPopover] = useState(false);
  const [autoGainEnabled, setAutoGainEnabled] = useState(true);
  const [targetLoudness, setTargetLoudness] = useState(-14.0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [seekPos, setSeekPos] = useState(0);
  const [liveRmsDb, setLiveRmsDb] = useState(-24);

  // Sync state with audio engine
  useEffect(() => {
    setAutoGainEnabled(soundEngine.getNormalizationEnabled());
    setTargetLoudness(soundEngine.getTargetLoudnessLUFS());
  }, []);

  // Poll real-time RMS level when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setLiveRmsDb(soundEngine.getRmsDb());
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleToggleAutoGain = () => {
    const next = !autoGainEnabled;
    setAutoGainEnabled(next);
    soundEngine.setNormalizationEnabled(next);
  };

  const handleSelectTargetLoudness = (target: number) => {
    setTargetLoudness(target);
    soundEngine.setTargetLoudnessLUFS(target);
  };

  const appliedCompensationDb = autoGainEnabled
    ? targetLoudness - currentTrack.rawLoudnessLUFS
    : 0;

  const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % tracks.length;
    onSelectTrack(tracks[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
    onSelectTrack(tracks[prevIdx]);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
    soundEngine.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      soundEngine.setVolume(volume);
      setIsMuted(false);
    } else {
      soundEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSeekPos(val);
    soundEngine.seek(val);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside aria-label="Audio Player" className="fixed bottom-0 inset-x-0 z-50 transition-all duration-300">
      {/* Expandable Tracklist Drawer */}
      {showTracklist && (
        <div className="max-w-4xl mx-auto px-4 pb-2">
          <div className="bg-zinc-950 border border-white/10 rounded-t-2xl p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Wulfpack Player Queue & Set-Tracklist ({tracks.length} Mixes)
              </span>
              <button
                onClick={() => setShowTracklist(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Schließen ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
              {tracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTrack(t);
                    setShowTracklist(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-colors text-xs ${
                    t.id === currentTrack.id
                      ? 'bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/40'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold truncate">{t.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                      <span>{t.bpm} BPM · {t.key}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/60 border border-white/10 text-zinc-300">
                        Upload: {t.rawLoudnessLUFS.toFixed(1)} LUFS
                      </span>
                      {autoGainEnabled && (
                        <span className="font-mono text-[10px] text-[#00ff66]">
                          ➔ {targetLoudness.toFixed(0)} LUFS
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-zinc-400 shrink-0">{t.durationFormatted}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Auto-Gain Normalization Deck Popover */}
      {showGainPopover && (
        <div className="max-w-md mx-auto px-4 pb-2">
          <div className="bg-zinc-950/95 border border-[#00ff66]/40 rounded-2xl p-4 shadow-[0_0_40px_rgba(0,255,102,0.2)] backdrop-blur-xl">
            {/* Popover Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>Auto-Gain & Normalisierung</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#00ff66] text-black">
                      EBU R128
                    </span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    Gleicht Lautstärkesprünge zwischen unterschiedlichen DJ-Mix-Uploads aus.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGainPopover(false)}
                className="text-xs text-zinc-400 hover:text-white p-1"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>

            {/* Main Toggle Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10 mb-3">
              <div>
                <div className="text-xs font-bold text-white">Auto-Gain Normalizer</div>
                <div className="text-[10px] text-zinc-400">
                  {autoGainEnabled
                    ? 'Aktiv — Lautstärke wird auf Ziel-LUFS angeglichen'
                    : 'Deaktiviert — Rohpegel des jeweiligen Uploads'}
                </div>
              </div>
              <button
                onClick={handleToggleAutoGain}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  autoGainEnabled
                    ? 'bg-[#00ff66] text-black shadow-[0_0_12px_rgba(0,255,102,0.5)]'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {autoGainEnabled ? 'AKTIV' : 'AUS'}
              </button>
            </div>

            {/* Real-time Loudness Inspector */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-center mb-3">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Mix Upload</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">
                  {currentTrack.rawLoudnessLUFS.toFixed(1)} LUFS
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Kompensation</div>
                <div className={`text-xs font-mono font-black mt-0.5 ${
                  autoGainEnabled
                    ? appliedCompensationDb > 0
                      ? 'text-[#00ff66]'
                      : appliedCompensationDb < 0
                      ? 'text-amber-400'
                      : 'text-white'
                    : 'text-zinc-500'
                }`}>
                  {autoGainEnabled
                    ? `${appliedCompensationDb >= 0 ? '+' : ''}${appliedCompensationDb.toFixed(1)} dB`
                    : '0.0 dB'}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Ausgabe Pegel</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">
                  {isPlaying ? `${liveRmsDb.toFixed(0)} dBFS` : 'Idle'}
                </div>
              </div>
            </div>

            {/* Target Loudness Standard Selector */}
            <div className="space-y-1.5 mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>Ziel-Lautstärke Norm</span>
                <span className="font-mono text-[#00ff66]">{targetLoudness.toFixed(1)} LUFS</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Streaming', val: -14.0, desc: 'EBU R128' },
                  { label: 'Club Punch', val: -11.0, desc: 'Laut & Druckvoll' },
                  { label: 'Hi-Fi Dynamic', val: -18.0, desc: 'Dynamik' },
                ].map((norm) => (
                  <button
                    key={norm.val}
                    onClick={() => handleSelectTargetLoudness(norm.val)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      targetLoudness === norm.val
                        ? 'bg-[#00ff66]/15 border-[#00ff66] text-white shadow-[0_0_10px_rgba(0,255,102,0.2)]'
                        : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold leading-tight">{norm.label}</div>
                    <div className="text-[9px] font-mono text-zinc-400 mt-0.5">{norm.val} LUFS</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Limiter Protection Notice */}
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
              <span>Integrierter Studio Brickwall Limiter schützt vor digitalem Clipping bei lauten Boosts.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div className="bg-black/95 border-t border-white/10 backdrop-blur-xl px-4 py-2.5 sm:py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Track Meta */}
          <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-xs">
            <div
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-[#00ff66]/40 shrink-0 flex items-center justify-center"
            >
              <div
                className={`w-5 h-5 rounded-full border border-[#00ff66]/50 flex items-center justify-center ${
                  isPlaying ? 'animate-spin' : ''
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
              </div>
            </div>

            <div className="min-w-0 truncate">
              <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-2">
                <span className="truncate">{currentTrack.title}</span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5">
                <span>{currentTrack.artist}</span>
                <span>·</span>
                <span className="text-[#00ff66] font-mono font-bold">{currentTrack.bpm} BPM</span>
                {autoGainEnabled && (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline text-[9px] font-mono px-1 py-0.2 rounded bg-[#00ff66]/15 text-[#00ff66] font-bold border border-[#00ff66]/30">
                      NORM: {targetLoudness.toFixed(0)} LUFS
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Favorite & Share */}
            <button
              onClick={() => onToggleFavorite(currentTrack.id)}
              className={`hidden sm:inline-flex p-1.5 rounded-md hover:bg-white/10 transition-colors ${
                isFavorite ? 'text-[#00ff66]' : 'text-zinc-400'
              }`}
              title="Mix favorisieren"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#00ff66]' : ''}`} />
            </button>
          </div>

          {/* Center: Playback Controls & Progress */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handlePrev}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Vorheriger Mix"
                aria-label="Vorheriger Mix"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00ff66] text-black flex items-center justify-center hover:bg-[#33ff88] transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                aria-label={isPlaying ? 'Pausieren' : 'Abspielen'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Nächster Mix"
                aria-label="Nächster Mix"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar and time */}
            <div className="w-full flex items-center gap-2 text-[10px] font-mono text-zinc-400 tabular-nums">
              <span className="hidden sm:inline">{formatTime(soundEngine.getCurrentTime())}</span>
              <input
                type="range"
                min="0"
                max={soundEngine.getDuration()}
                step="1"
                value={soundEngine.getCurrentTime()}
                onChange={handleSeek}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00ff66]"
              />
              <span className="hidden sm:inline">{currentTrack.durationFormatted}</span>
            </div>
          </div>

          {/* Right: Streaming shortcuts, Auto-Gain, Volume, Tracklist toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Real-time mini visualizer */}
            <div className="hidden lg:flex items-end h-5 gap-0.5 w-14">
              {Array.from({ length: 8 }).map((_, i) => {
                const val = frequencyData[i * 2] || 0;
                const h = isPlaying ? Math.max(15, (val / 255) * 100) : 10;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-[#00ff66] rounded-t-xs"
                    style={{ height: `${h}%`, opacity: isPlaying ? 0.9 : 0.3 }}
                  />
                );
              })}
            </div>

            {/* Auto-Gain / Loudness Normalizer Button */}
            <button
              onClick={() => setShowGainPopover(!showGainPopover)}
              className={`px-2 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                autoGainEnabled
                  ? 'bg-[#00ff66]/15 border-[#00ff66]/70 text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.25)]'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Auto-Gain Normalisierung (EBU R128) für konsistente Lautstärke"
              aria-label="Auto-Gain Normalisierung"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Auto-Gain</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-black ${
                  autoGainEnabled ? 'bg-[#00ff66] text-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {autoGainEnabled
                  ? `${appliedCompensationDb >= 0 ? '+' : ''}${appliedCompensationDb.toFixed(1)}dB`
                  : 'OFF'}
              </span>
            </button>

            {/* Streaming Platform Badges */}
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              <a
                href={currentTrack.streamingLinks.spotify}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-white/5 hover:bg-[#00ff66]/20 text-white hover:text-[#00ff66] font-semibold text-[11px] transition-colors"
              >
                Spotify
              </a>
              <a
                href={currentTrack.streamingLinks.beatport}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] font-semibold text-[11px] transition-colors"
              >
                Beatport
              </a>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button onClick={toggleMute} className="text-zinc-400 hover:text-white" aria-label="Lautstärke stummschalten">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00ff66]"
              />
            </div>

            {/* Backstage Chat Quick Toggle */}
            {onOpenBackstageChat && (
              <button
                onClick={onOpenBackstageChat}
                className="p-2 rounded-lg border border-white/10 bg-white/5 text-[#00ff66] hover:bg-[#00ff66]/15 hover:border-[#00ff66]/40 transition-colors flex items-center gap-1.5"
                title="Backstage VIP Chat öffnen (Synchronisiert)"
                aria-label="Backstage Chat öffnen"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-bold text-white">Chat</span>
              </button>
            )}

            {/* Tracklist Toggle */}
            <button
              onClick={() => setShowTracklist(!showTracklist)}
              className={`p-2 rounded-lg border transition-colors ${
                showTracklist
                  ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Tracklist & Queue öffnen"
              aria-label="Tracklist öffnen"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
