import React, { useState } from 'react';
import {
  Download,
  X,
  Play,
  CheckCircle,
} from 'lucide-react';
import { UserProfile, TrackItem, ForumThread, TourDate } from '../types';

interface UserPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  tracks: TrackItem[];
  forumThreads: ForumThread[];
  tourDates: TourDate[];
  onPlayTrack: (track: TrackItem) => void;
  onSwitchRole: (newRole: 'user' | 'admin') => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const UserPanelModal: React.FC<UserPanelModalProps> = ({
  isOpen,
  onClose,
  user,
  tracks,
  forumThreads,
  tourDates,
  onPlayTrack,
  onSwitchRole,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'bookmarks' | 'vault'>('profile');
  const [nameInput, setNameInput] = useState(user.name);
  const [handleInput, setHandleInput] = useState(user.handle);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const favoriteTracks = tracks.filter((t) => user.favoriteMixIds.includes(t.id));
  const bookmarkedThreads = forumThreads.filter((th) => user.bookmarkedThreadIds.includes(th.id));
  const rsvpGigs = tourDates.filter((g) => user.rsvpTourIds.includes(g.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: nameInput,
      handle: handleInput,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDownloadVaultItem = (itemKey: string, fileName: string) => {
    const text = `DJ WULF WOLFPACK VIP VAULT\nDatei: ${fileName}\nLizenz: Exklusiver Fan-Download für ${user.name} (${user.email}).`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black border border-[#00ff66] flex items-center justify-center font-black text-sm text-[#00ff66]">
              {user.avatarSeed}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{user.name}</h3>
                <span className="text-[10px] font-bold text-[#00ff66] px-2 py-0.5 rounded bg-black border border-[#00ff66]/40">
                  {user.badge}
                </span>
              </div>
              <div className="text-xs text-zinc-400">{user.handle} · {user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSwitchRole(user.role === 'admin' ? 'user' : 'admin')}
              className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
              title="Rolle umschalten"
            >
              Rolle: <strong className="text-[#00ff66] capitalize">{user.role}</strong> (Wechseln)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-white/5 bg-black text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 font-bold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Mein Profil
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3.5 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span>Favorisierte Mixes</span>
            <span className="font-mono text-[10px] bg-white/10 px-1.5 rounded">
              {favoriteTracks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3.5 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span>Lesezeichen & Gigs</span>
            <span className="font-mono text-[10px] bg-white/10 px-1.5 rounded">
              {bookmarkedThreads.length + rsvpGigs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3.5 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'vault'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span>VIP Downloads</span>
            <span className="font-mono text-[10px] bg-[#00ff66] text-black font-black px-1.5 rounded">
              3
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#00ff66] mb-3">
                  Fan-Profil anpassen
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Anzeigename</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Handle</label>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {isSaved ? (
                    <span className="text-[#00ff66] flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Gespeichert!
                    </span>
                  ) : <span />}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#00ff66] text-black font-black uppercase tracking-wider hover:bg-[#33ff88]"
                  >
                    Profil speichern
                  </button>
                </div>
              </div>

              {/* Badges Info */}
              <div className="p-4 rounded-xl bg-black border border-[#00ff66]/30">
                <div className="text-xs font-bold text-white mb-1">Dein Wolfpack Status</div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Als <strong className="text-[#00ff66]">{user.badge}</strong> hast du uneingeschränkten
                  Zugriff auf das Community-Forum, Track-Downloads und Prioritäts-RSVP für Gästelisten.
                </p>
              </div>
            </form>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-2">
              {favoriteTracks.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-8">
                  Noch keine Mixes favorisiert. Klicke auf das Herz-Symbol bei einem beliebigen Track!
                </p>
              ) : (
                favoriteTracks.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{tr.title}</div>
                      <div className="text-[11px] text-zinc-400">
                        {tr.bpm} BPM · {tr.key} · {tr.durationFormatted}
                      </div>
                    </div>
                    <button
                      onClick={() => onPlayTrack(tr)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff66] text-black font-black shrink-0 hover:bg-[#33ff88]"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Play</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#00ff66] mb-2">
                  Zugelagte Tourdaten (RSVP)
                </h4>
                {rsvpGigs.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Noch keine Gigs markiert.</p>
                ) : (
                  <div className="space-y-2">
                    {rsvpGigs.map((g) => (
                      <div
                        key={g.id}
                        className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">
                            {g.city} ({g.venue})
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {g.date} · {g.eventName}
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-[#00ff66] font-bold">
                          RSVP aktiv ✓
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#00ff66] mb-2">
                  Gespeicherte Forum-Diskussionen
                </h4>
                {bookmarkedThreads.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Noch keine Lesezeichen gesetzt.</p>
                ) : (
                  <div className="space-y-2">
                    {bookmarkedThreads.map((th) => (
                      <div
                        key={th.id}
                        className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs"
                      >
                        <div className="font-bold text-white">{th.title}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {th.category} · {th.authorName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-zinc-900 border border-[#00ff66]/40 text-xs">
                <h4 className="font-bold text-white mb-1">
                  Exklusiver Wolfpack Download-Tresor
                </h4>
                <p className="text-zinc-300 text-[11px]">
                  Nur für registrierte Fans und Abonnenten. Unveröffentlichte Master-Dateien in Studio-Qualität.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Silence of the Pack (VIP Club Mix)</div>
                    <div className="text-[11px] text-zinc-400 font-mono">24-bit 48kHz WAV · 68 MB</div>
                  </div>
                  <button
                    onClick={() =>
                      handleDownloadVaultItem(
                        'bootleg',
                        'DJ_WULF_Silence_Of_The_Pack_VIP_Club_Mix_24bit.txt'
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff66] text-black font-black hover:bg-[#33ff88]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Offizielles DJ Wulf Press Kit & Logos 2026</div>
                    <div className="text-[11px] text-zinc-400 font-mono">ZIP-Archiv · Vektoren & Pressefotos</div>
                  </div>
                  <button
                    onClick={() =>
                      handleDownloadVaultItem('presskit', 'DJ_WULF_Official_PressKit_2026.txt')
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">4K Wallpaper & Smartphone Lockscreen Pack</div>
                    <div className="text-[11px] text-zinc-400 font-mono">Cyber Wolf Neon Visuals · 12 Motive</div>
                  </div>
                  <button
                    onClick={() =>
                      handleDownloadVaultItem('wallpapers', 'DJ_WULF_Wallpapers_4K_Pack.txt')
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
