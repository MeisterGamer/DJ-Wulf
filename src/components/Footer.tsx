import React from 'react';
import { WolfEmblem } from './VisualArt';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenParty: () => void;
  onOpenUser: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenParty,
  onOpenUser,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-28 sm:pb-24 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Wordmark & Persona */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-black text-white">
              <div className="w-8 h-8 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center">
                <WolfEmblem className="w-5 h-5" />
              </div>
              <span className="font-heading tracking-wider">DJ WULF</span>
            </div>
            <p className="text-zinc-300 leading-relaxed text-xs">
              Elektronische Musik aus dem Berliner Untergrund. Unerbittliche Techno-Grooves, melodische
              Reisen und Festival-Primetime.
            </p>
            <div className="text-[11px] text-zinc-500 font-mono">
              Wolfpack Records & Management Berlin · Est. 2020
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white text-[11px]">
              Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#mixes" className="hover:text-[#00ff66] transition-colors">
                  Aktuelle Mixes & Tracks
                </a>
              </li>
              <li>
                <a href="#tour" className="hover:text-[#00ff66] transition-colors">
                  Tourdaten & Tickets
                </a>
              </li>
              <li>
                <a href="#playlists" className="hover:text-[#00ff66] transition-colors">
                  Playlists & Streaming Hub
                </a>
              </li>
              <li>
                <a href="#mediathek" className="hover:text-[#00ff66] transition-colors">
                  Mediathek & Fotogalerie
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-[#00ff66] transition-colors">
                  Wolfpack Community Forum
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Fan Features */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white text-[11px]">
              Fan Hub & Tools
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenUser} className="hover:text-[#00ff66] transition-colors">
                  Mein Wolfpack Profil & Downloads
                </button>
              </li>
              <li>
                <button onClick={onOpenParty} className="hover:text-[#00ff66] transition-colors">
                  Party-Effekte & DJ Soundboard
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-[#00ff66] transition-colors">
                  Veranstalter-Booking anfragen
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-[#00ff66] transition-colors">
                  Management Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Streaming & Socials */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white text-[11px]">
              Streaming & Social Media
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#00ff66]/20 text-zinc-300 hover:text-[#00ff66] transition-colors"
              >
                Spotify
              </a>
              <a
                href="https://soundcloud.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#00ff66]/20 text-zinc-300 hover:text-[#00ff66] transition-colors"
              >
                SoundCloud
              </a>
              <a
                href="https://beatport.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#00ff66]/20 text-zinc-300 hover:text-[#00ff66] transition-colors"
              >
                Beatport
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#00ff66]/20 text-zinc-300 hover:text-[#00ff66] transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#00ff66]/20 text-zinc-300 hover:text-[#00ff66] transition-colors"
              >
                TikTok
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#00ff66]/20 text-zinc-300 hover:text-[#00ff66] transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} DJ Wulf / Wolfpack Records Berlin. Alle Rechte vorbehalten.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">Impressum</span>
            <span>·</span>
            <span className="hover:text-zinc-300 cursor-pointer">Datenschutz</span>
            <span>·</span>
            <span className="hover:text-zinc-300 cursor-pointer">Technical Rider</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
