import React, { useState } from 'react';
import { Play, Pause, Heart, Music, ChevronDown, ChevronUp, Disc } from 'lucide-react';
import { TrackItem } from '../types';

interface MixesSectionProps {
  tracks: TrackItem[];
  currentTrack: TrackItem;
  isPlaying: boolean;
  onSelectTrack: (track: TrackItem) => void;
  onTogglePlay: () => void;
  favoriteMixIds: string[];
  onToggleFavorite: (id: string) => void;
}

export const MixesSection: React.FC<MixesSectionProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  favoriteMixIds,
  onToggleFavorite,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Alle');
  const [expandedTracklistId, setExpandedTracklistId] = useState<string | null>(null);

  const genres = ['Alle', 'Melodic Techno', 'Peak Time Techno', 'Festival EDM', 'Deep House'];

  const filteredTracks =
    selectedGenre === 'Alle'
      ? tracks
      : tracks.filter((t) => t.genre === selectedGenre);

  const handleTrackAction = (track: TrackItem) => {
    if (currentTrack.id === track.id) {
      onTogglePlay();
    } else {
      onSelectTrack(track);
    }
  };

  return (
    <section id="mixes" className="py-16 sm:py-24 border-b border-white/10 bg-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
              Discography & Sets
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Aktuelle Mixes & Veröffentlichungen
            </h2>
            <p className="text-sm text-zinc-300 mt-2 max-w-xl">
              Tauche ein in die neuesten Club-Edits, Sets und Studio-Singles. Direkt abspielbar im
              integrierten Hi-Fi Player oder über deine bevorzugte Streaming-Plattform.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-white/10 rounded-xl overflow-x-auto">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedGenre === g
                    ? 'bg-[#00ff66] text-black shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Mixes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTracks.map((track) => {
            const isCurrent = currentTrack.id === track.id;
            const isThisPlaying = isCurrent && isPlaying;
            const isFav = favoriteMixIds.includes(track.id);
            const isTracklistOpen = expandedTracklistId === track.id;

            return (
              <div
                key={track.id}
                className={`group rounded-2xl p-5 border transition-all duration-300 bg-zinc-950 ${
                  isCurrent
                    ? 'border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.2)] ring-1 ring-[#00ff66]'
                    : 'border-white/10 hover:border-[#00ff66]/40 hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Artwork / Play Trigger */}
                  <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black border border-white/10 shadow-md">
                    <div className="w-full h-full bg-linear-to-br from-black via-zinc-900 to-black flex items-center justify-center">
                      <div
                        className={`w-16 h-16 rounded-full border border-dashed border-[#00ff66]/40 flex items-center justify-center ${
                          isThisPlaying ? 'animate-spin' : ''
                        }`}
                      >
                        <Disc className="w-8 h-8 text-[#00ff66]" />
                      </div>
                    </div>

                    {/* Play button overlay */}
                    <button
                      onClick={() => handleTrackAction(track)}
                      className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors group-hover:scale-105"
                      aria-label={`${track.title} abspielen`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#00ff66] text-black flex items-center justify-center shadow-lg">
                        {isThisPlaying ? (
                          <Pause className="w-4 h-4 fill-black" />
                        ) : (
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-zinc-400 font-medium">
                        {track.genre} · {track.releaseDate}
                      </div>
                      <button
                        onClick={() => onToggleFavorite(track.id)}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                          isFav ? 'text-[#00ff66]' : 'text-zinc-400 hover:text-white'
                        }`}
                        title="Favorisieren"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-[#00ff66]' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 truncate">
                      {track.title}
                    </h3>

                    {/* Clean unboxed metadata with separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mt-1.5 tabular-nums">
                      <span className="text-[#00ff66] font-bold">{track.bpm} BPM</span>
                      <span>·</span>
                      <span>Key: {track.key}</span>
                      <span>·</span>
                      <span>{track.durationFormatted}</span>
                      <span>·</span>
                      <span title="Inhärenter Master-Pegel des Uploads vor Auto-Gain Normalisierung">
                        Master: {track.rawLoudnessLUFS.toFixed(1)} LUFS
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-2 mt-2 leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>

                {/* Tracklist Toggle & External Streaming Links */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => setExpandedTracklistId(isTracklistOpen ? null : track.id)}
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-[#00ff66] font-medium transition-colors"
                  >
                    <Music className="w-3.5 h-3.5 text-[#00ff66]" />
                    <span>Tracklist ({track.tracklist.length} Abschnitte)</span>
                    {isTracklistOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Direct Streaming Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={track.streamingLinks.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-[#00ff66] font-medium transition-colors"
                    >
                      Spotify
                    </a>
                    <span className="text-zinc-600">·</span>
                    <a
                      href={track.streamingLinks.soundcloud}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-[#00ff66] font-medium transition-colors"
                    >
                      SoundCloud
                    </a>
                    <span className="text-zinc-600">·</span>
                    <a
                      href={track.streamingLinks.beatport}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-[#00ff66] font-medium transition-colors"
                    >
                      Beatport
                    </a>
                  </div>
                </div>

                {/* Accordion Tracklist */}
                {isTracklistOpen && (
                  <div className="mt-3 pt-3 border-t border-dashed border-white/10 space-y-1.5 text-xs font-mono bg-black/60 p-3 rounded-lg">
                    {track.tracklist.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-zinc-300">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[#00ff66]">{item.time}</span>
                          <span className="truncate">{item.title}</span>
                        </div>
                        <span className="text-zinc-500 text-[11px] shrink-0">{item.artist}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
