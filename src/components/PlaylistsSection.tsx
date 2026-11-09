import React from 'react';
import { Play, Disc3, Radio } from 'lucide-react';
import { PlaylistItem } from '../types';

interface PlaylistsSectionProps {
  playlists: PlaylistItem[];
  onPlayPreview: () => void;
}

export const PlaylistsSection: React.FC<PlaylistsSectionProps> = ({ playlists, onPlayPreview }) => {
  return (
    <section id="playlists" className="py-16 sm:py-24 border-b border-white/10 bg-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
            Curated Sounds
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Offizielle Playlists & Streaming
          </h2>
          <p className="text-sm text-zinc-300 mt-2 max-w-xl">
            Vom DJ Wulf handverlesene Sets und Selektionen für jede Stimmung: Primetime-Raves,
            nächtliche Autofahrten oder Fokus im Studio.
          </p>
        </div>

        {/* Playlist Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className="rounded-2xl p-5 bg-zinc-950 border border-white/10 hover:border-[#00ff66]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Cover Box */}
                <div
                  className="relative rounded-xl overflow-hidden aspect-square bg-linear-to-br from-black via-zinc-900 to-black border border-white/10 p-5 flex flex-col justify-between mb-4 shadow-lg group-hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center justify-between text-[#00ff66]">
                    <Radio className="w-5 h-5" />
                    <span className="text-[10px] font-mono tracking-wider uppercase text-black bg-[#00ff66] font-bold px-2 py-0.5 rounded">
                      Curated
                    </span>
                  </div>

                  <div className="text-center my-auto">
                    <Disc3 className="w-12 h-12 text-[#00ff66] mx-auto opacity-80 group-hover:rotate-90 transition-transform duration-700" />
                  </div>

                  {/* Quick Preview overlay */}
                  <button
                    onClick={onPlayPreview}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    aria-label={`${pl.title} Vorhören`}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00ff66] text-black text-xs font-black shadow-lg">
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Preview abspielen</span>
                    </div>
                  </button>
                </div>

                <div className="text-xs text-[#00ff66] font-bold mb-1">{pl.genre}</div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00ff66] transition-colors">
                  {pl.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-3">
                  {pl.description}
                </p>
              </div>

              {/* Meta & Links */}
              <div className="mt-5 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3">
                  <span>{pl.trackCount} Tracks</span>
                  <span>·</span>
                  <span>{pl.duration}</span>
                </div>

                {/* Direct Streaming Buttons */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <a
                    href={pl.links.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-[#00ff66]/20 text-white hover:text-[#00ff66] font-semibold text-[11px] transition-colors"
                  >
                    Spotify
                  </a>
                  <a
                    href={pl.links.apple}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-[#00ff66]/20 text-white hover:text-[#00ff66] font-semibold text-[11px] transition-colors"
                  >
                    Apple Music
                  </a>
                  <a
                    href={pl.links.soundcloud}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-[#00ff66]/20 text-white hover:text-[#00ff66] font-semibold text-[11px] transition-colors"
                  >
                    SoundCloud
                  </a>
                  <a
                    href={pl.links.beatport}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-[#00ff66]/20 text-[#00ff66] font-semibold text-[11px] transition-colors"
                  >
                    Beatport
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
