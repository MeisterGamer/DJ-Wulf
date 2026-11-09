import React, { useState } from 'react';
import {
  Shield,
  Calendar,
  Disc3,
  Image,
  MessageSquare,
  Users,
  FileCheck,
  Trash2,
  X,
  Download,
  Search
} from 'lucide-react';
import {
  TourDate,
  TrackItem,
  MediaItem,
  ForumThread,
  NewsletterSubscriber,
  BookingInquiry
} from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourDates: TourDate[];
  onAddTourDate: (tour: TourDate) => void;
  onDeleteTourDate: (id: string) => void;
  tracks: TrackItem[];
  onAddTrack: (track: TrackItem) => void;
  onDeleteTrack: (id: string) => void;
  mediaItems: MediaItem[];
  onAddMedia: (media: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  forumThreads: ForumThread[];
  onTogglePinThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
  subscribers: NewsletterSubscriber[];
  bookings: BookingInquiry[];
  onUpdateBookingStatus: (id: string, newStatus: BookingInquiry['status']) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  tourDates,
  onAddTourDate,
  onDeleteTourDate,
  tracks,
  onAddTrack,
  onDeleteTrack,
  mediaItems,
  onAddMedia,
  onDeleteMedia,
  forumThreads,
  onTogglePinThread,
  onDeleteThread,
  subscribers,
  bookings,
  onUpdateBookingStatus,
}) => {
  const [activeTab, setActiveTab] = useState<
    'tour' | 'tracks' | 'media' | 'forum' | 'subscribers' | 'bookings'
  >('tour');

  // Tour Date Form State
  const [tourCity, setTourCity] = useState('');
  const [tourCountry, setTourCountry] = useState('Deutschland');
  const [tourVenue, setTourVenue] = useState('');
  const [tourDateText, setTourDateText] = useState('');
  const [tourDayNum, setTourDayNum] = useState('28');
  const [tourMonthYear, setTourMonthYear] = useState('FEB 2027');
  const [tourType, setTourType] = useState<TourDate['type']>('Club');
  const [tourTime, setTourTime] = useState('01:00 - 04:00');

  // Track Form State
  const [trackTitle, setTrackTitle] = useState('');
  const [trackGenre, setTrackGenre] = useState<TrackItem['genre']>('Melodic Techno');
  const [trackBpm, setTrackBpm] = useState(128);
  const [trackKey, setTrackKey] = useState('G Minor');
  const [trackDuration, setTrackDuration] = useState('06:30');

  // Media Form State
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCat, setMediaCat] = useState<MediaItem['category']>('Festival');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaLoc, setMediaLoc] = useState('');
  const [mediaPhotographer, setMediaPhotographer] = useState('');

  // Subscriber search
  const [subSearch, setSubSearch] = useState('');

  if (!isOpen) return null;

  const exportSubscribersCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Name,Email,SubscribedAt,PerkClaimed\n' +
      subscribers
        .map((s) => `${s.id},"${s.name}","${s.email}",${s.subscribedAt},${s.perkClaimed}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DJ_WULF_Newsletter_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourCity || !tourVenue) return;

    onAddTourDate({
      id: `tour-${Date.now()}`,
      city: tourCity,
      country: tourCountry,
      venue: tourVenue,
      date: tourDateText || '28. Feb 2027',
      dayNumber: tourDayNum,
      monthYear: tourMonthYear,
      isoDate: '2027-02-28T23:00:00',
      eventName: `${tourCity} Rave Night`,
      type: tourType,
      ticketStatus: 'Verfügbar',
      stageTime: tourTime,
      ticketPrice: '25,00 €',
      ticketUrl: 'https://ra.co',
    });

    setTourCity('');
    setTourVenue('');
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle) return;

    onAddTrack({
      id: `track-${Date.now()}`,
      title: trackTitle,
      artist: 'DJ Wulf',
      durationFormatted: trackDuration,
      durationSeconds: 390,
      bpm: Number(trackBpm),
      key: trackKey,
      genre: trackGenre,
      releaseDate: 'November 2026',
      coverGradient: 'from-black via-zinc-900 to-black',
      synthPreset: 'anthem',
      rawLoudnessLUFS: -14.0,
      playsCount: 1200,
      likesCount: 140,
      description: 'Neuer unveröffentlichter Track direkt aus dem Kreuzberger Studio.',
      tracklist: [
        { time: '00:00', title: 'Intro', artist: 'DJ Wulf' },
        { time: '02:15', title: 'Main Drop', artist: 'DJ Wulf' }
      ],
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        soundcloud: 'https://soundcloud.com',
        appleMusic: 'https://music.apple.com',
        beatport: 'https://beatport.com',
        youtube: 'https://youtube.com',
      },
    });

    setTrackTitle('');
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle) return;

    onAddMedia({
      id: `media-${Date.now()}`,
      title: mediaTitle,
      type: mediaType,
      category: mediaCat,
      date: 'November 2026',
      location: mediaLoc || 'Berlin, Deutschland',
      photographer: mediaPhotographer || 'Crew Cam',
      gradient: 'from-black via-zinc-900 to-black',
      svgIcon: mediaCat === 'Festival' ? 'stage' : mediaCat === 'Studio' ? 'synth' : 'turntable',
      description: `Neuer Mediathek-Eintrag: ${mediaTitle}`,
      likes: 0,
      aspectRatio: '16:9',
    });

    setMediaTitle('');
    setMediaLoc('');
  };

  const filteredSubs = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.name.toLowerCase().includes(subSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative max-w-4xl w-full bg-zinc-950 border border-[#00ff66]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Admin Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff66]/15 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">DJ Wulf Management Control</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00ff66] text-black">
                  ADMINISTRATOR
                </span>
              </div>
              <div className="text-xs text-zinc-400">Verwalte Tourdaten, Mediathek, Musik & Buchungen</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/install.php"
              download="install.php"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-[#00ff66]/40 text-[#00ff66] hover:bg-[#00ff66]/15 text-xs font-bold transition-colors"
              title="PHP Full-Stack Installer herunterladen / ausführen"
            >
              <Download className="w-3.5 h-3.5" />
              <span>install.php</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-5 pt-2 border-b border-white/5 bg-zinc-950 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('tour')}
            className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'tour'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tourdaten ({tourDates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'tracks'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>Mixes & Tracks ({tracks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'media'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Mediathek ({mediaItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'forum'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Forum Moderation ({forumThreads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'subscribers'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Newsletter ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'bookings'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Booking Anfragen ({bookings.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: TOUR DATES */}
          {activeTab === 'tour' && (
            <div className="space-y-6 text-xs">
              <form onSubmit={handleAddTour} className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3">
                <div className="font-black text-[#00ff66] uppercase tracking-wider text-[11px]">
                  + Neuen Tourtermin anlegen
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Stadt *</label>
                    <input
                      type="text"
                      required
                      value={tourCity}
                      onChange={(e) => setTourCity(e.target.value)}
                      placeholder="z.B. Frankfurt"
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Location / Club *</label>
                    <input
                      type="text"
                      required
                      value={tourVenue}
                      onChange={(e) => setTourVenue(e.target.value)}
                      placeholder="Tanzhaus West"
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Format</label>
                    <select
                      value={tourType}
                      onChange={(e) => setTourType(e.target.value as TourDate['type'])}
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                    >
                      <option value="Club">Club</option>
                      <option value="Festival">Festival</option>
                      <option value="OpenAir">Open Air</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#00ff66] text-black font-black uppercase tracking-wider hover:bg-[#33ff88]"
                  >
                    Gig speichern
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <div className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                  Aktuelle Tourdaten
                </div>
                {tourDates.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {g.city}, {g.country} — {g.venue}
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        {g.date} · {g.type} · Status: <span className="text-[#00ff66] font-bold">{g.ticketStatus}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteTourDate(g.id)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MIXES & TRACKS */}
          {activeTab === 'tracks' && (
            <div className="space-y-6 text-xs">
              <form onSubmit={handleAddTrack} className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3">
                <div className="font-black text-[#00ff66] uppercase tracking-wider text-[11px]">
                  + Neuen Mix / Track hinzufügen
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Titel *</label>
                    <input
                      type="text"
                      required
                      value={trackTitle}
                      onChange={(e) => setTrackTitle(e.target.value)}
                      placeholder="z.B. Wolfpack Euphoria (Original Mix)"
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Genre</label>
                    <select
                      value={trackGenre}
                      onChange={(e) => setTrackGenre(e.target.value as TrackItem['genre'])}
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                    >
                      <option value="Melodic Techno">Melodic Techno</option>
                      <option value="Peak Time Techno">Peak Time Techno</option>
                      <option value="Festival EDM">Festival EDM</option>
                      <option value="Deep House">Deep House</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">BPM & Key</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={trackBpm}
                        onChange={(e) => setTrackBpm(Number(e.target.value))}
                        className="w-1/2 bg-black border border-white/10 rounded-lg p-2 text-white"
                      />
                      <input
                        type="text"
                        value={trackKey}
                        onChange={(e) => setTrackKey(e.target.value)}
                        placeholder="A Minor"
                        className="w-1/2 bg-black border border-white/10 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#00ff66] text-black font-black uppercase tracking-wider hover:bg-[#33ff88]"
                  >
                    Track zur Mediathek hinzufügen
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {tracks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{t.title}</div>
                      <div className="text-zinc-400 text-[11px]">
                        {t.genre} · <span className="text-[#00ff66] font-bold">{t.bpm} BPM</span> · {t.key} · {t.durationFormatted}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteTrack(t.id)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEDIATHEK */}
          {activeTab === 'media' && (
            <div className="space-y-6 text-xs">
              <form onSubmit={handleAddMedia} className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3">
                <div className="font-black text-[#00ff66] uppercase tracking-wider text-[11px]">
                  + Neues Foto oder Video anlegen
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Titel / Event *</label>
                    <input
                      type="text"
                      required
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      placeholder="Laser Show Amsterdam"
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Kategorie</label>
                    <select
                      value={mediaCat}
                      onChange={(e) => setMediaCat(e.target.value as MediaItem['category'])}
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                    >
                      <option value="Festival">Festival</option>
                      <option value="Club">Club</option>
                      <option value="Studio">Studio</option>
                      <option value="Backstage">Backstage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Ort & Fotograf</label>
                    <input
                      type="text"
                      value={mediaLoc}
                      onChange={(e) => setMediaLoc(e.target.value)}
                      placeholder="Berlin / Fotograf"
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#00ff66] text-black font-black uppercase tracking-wider hover:bg-[#33ff88]"
                  >
                    Medium speichern
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mediaItems.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <div className="font-bold text-white truncate">{m.title}</div>
                      <div className="text-[11px] text-zinc-400">
                        {m.category} · {m.type} · {m.location}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteMedia(m.id)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FORUM MODERATION */}
          {activeTab === 'forum' && (
            <div className="space-y-4 text-xs">
              <div className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                Forum Moderation (Anheften / Löschen)
              </div>
              <div className="space-y-2">
                {forumThreads.map((th) => (
                  <div
                    key={th.id}
                    className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{th.title}</div>
                      <div className="text-[11px] text-zinc-400">
                        Von: {th.authorName} · {th.category} · {th.replies.length} Antworten
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onTogglePinThread(th.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                          th.isPinned
                            ? 'bg-[#00ff66] text-black border-[#00ff66]'
                            : 'bg-zinc-800 border-white/10 text-zinc-300'
                        }`}
                      >
                        {th.isPinned ? 'Angeheftet' : 'Anheften'}
                      </button>
                      <button
                        onClick={() => onDeleteThread(th.id)}
                        className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Thema löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    placeholder="Abonnenten filtern..."
                    className="w-full pl-9 pr-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00ff66]"
                  />
                </div>
                <button
                  onClick={exportSubscribersCsv}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00ff66] text-black font-black hover:bg-[#33ff88] shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV Exportieren</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-white/10">
                <table className="w-full text-left font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 text-[11px] uppercase">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">E-Mail</th>
                      <th className="p-3">Datum</th>
                      <th className="p-3">VIP Bootleg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-zinc-950">
                    {filteredSubs.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-900">
                        <td className="p-3 font-sans font-bold text-white">{s.name}</td>
                        <td className="p-3 text-[#00ff66]">{s.email}</td>
                        <td className="p-3 text-zinc-400">{s.subscribedAt}</td>
                        <td className="p-3">
                          {s.perkClaimed ? (
                            <span className="text-[#00ff66] font-bold">Aktiviert ✓</span>
                          ) : (
                            <span className="text-zinc-500">Ausstehend</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 text-xs">
              <div className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                Eingegangene Veranstalter-Anfragen
              </div>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{b.eventName}</h4>
                        <div className="text-zinc-400 text-[11px]">
                          Veranstalter: <strong className="text-white">{b.organizerName}</strong> · {b.eventType} · Datum: {b.eventDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-[11px]">Status:</span>
                        <select
                          value={b.status}
                          onChange={(e) =>
                            onUpdateBookingStatus(b.id, e.target.value as BookingInquiry['status'])
                          }
                          className="bg-black border border-white/20 rounded px-2.5 py-1 text-[#00ff66] font-bold text-xs"
                        >
                          <option value="Neu">Neu</option>
                          <option value="In Prüfung">In Prüfung</option>
                          <option value="Bestätigt">Bestätigt</option>
                          <option value="Abgelehnt">Abgelehnt</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-zinc-300 bg-black p-2.5 rounded-lg border border-white/5">
                      "{b.message}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400 pt-2 border-t border-white/5">
                      <div>
                        Kontakt: <span className="text-[#00ff66]">{b.email}</span> · {b.phone}
                      </div>
                      <div>Ort: {b.location} | Erwartete Gäste: {b.expectedGuests}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
