import { TrackItem, TourDate, PlaylistItem, MediaItem, ForumThread, SocialPost, NewsletterSubscriber, BookingInquiry, UserProfile } from '../types';

export const INITIAL_TRACKS: TrackItem[] = [
  {
    id: 'track-1',
    title: 'Midnight Protocol (Club Mix)',
    artist: 'DJ Wulf',
    durationFormatted: '06:14',
    durationSeconds: 374,
    bpm: 126,
    key: 'F Minor',
    genre: 'Melodic Techno',
    releaseDate: 'Oktober 2026',
    coverGradient: 'from-black via-zinc-900 to-black',
    synthPreset: 'midnight',
    rawLoudnessLUFS: -14.0,
    playsCount: 284500,
    likesCount: 14200,
    description: 'Treibende Melodic-Techno Hymne mit rollendem Sub-Bass und analogem Synthesizer-Aufbau für den Primetime Club-Slot.',
    tracklist: [
      { time: '00:00', title: 'Intro Atmosphere & Sub Pulsing', artist: 'DJ Wulf' },
      { time: '01:32', title: 'Modular Lead Intro', artist: 'DJ Wulf' },
      { time: '03:15', title: 'The Main Drop', artist: 'DJ Wulf' },
      { time: '04:45', title: 'Outro Transition Cut', artist: 'DJ Wulf' }
    ],
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      soundcloud: 'https://soundcloud.com',
      appleMusic: 'https://music.apple.com',
      beatport: 'https://www.beatport.com',
      youtube: 'https://youtube.com'
    }
  },
  {
    id: 'track-2',
    title: 'Pack Anthem (Festival Overdrive)',
    artist: 'DJ Wulf x KRONOS',
    durationFormatted: '05:38',
    durationSeconds: 338,
    bpm: 132,
    key: 'A Minor',
    genre: 'Festival EDM',
    releaseDate: 'September 2026',
    coverGradient: 'from-zinc-950 via-zinc-900 to-black',
    synthPreset: 'anthem',
    rawLoudnessLUFS: -8.6,
    playsCount: 412000,
    likesCount: 22800,
    description: 'Große Festival-Hook mit explosiven Drops und energetischem Sägezahn-Lead, gespielt auf der Mainstage vor 25.000 Menschen.',
    tracklist: [
      { time: '00:00', title: 'Crowd Hype Intro', artist: 'DJ Wulf' },
      { time: '01:15', title: 'Melody Build Up', artist: 'DJ Wulf x KRONOS' },
      { time: '02:08', title: 'Maximum Pressure Drop', artist: 'DJ Wulf' },
      { time: '04:10', title: 'Final Apex Beat', artist: 'DJ Wulf' }
    ],
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      soundcloud: 'https://soundcloud.com',
      appleMusic: 'https://music.apple.com',
      beatport: 'https://www.beatport.com',
      youtube: 'https://youtube.com'
    }
  },
  {
    id: 'track-3',
    title: 'Subterranean Echoes (Berghain Cut)',
    artist: 'DJ Wulf',
    durationFormatted: '07:22',
    durationSeconds: 442,
    bpm: 138,
    key: 'D Minor',
    genre: 'Peak Time Techno',
    releaseDate: 'August 2026',
    coverGradient: 'from-black via-zinc-950 to-black',
    synthPreset: 'subterranean',
    rawLoudnessLUFS: -19.4,
    playsCount: 198300,
    likesCount: 9800,
    description: 'Dunkler, unerbittlicher Warehouse-Techno mit hypnotischer 303-Acid-Line und industriellen Reverb-Räumen.',
    tracklist: [
      { time: '00:00', title: 'Industrial Kick Pattern', artist: 'DJ Wulf' },
      { time: '02:20', title: 'Acid Modulation Start', artist: 'DJ Wulf' },
      { time: '04:12', title: 'Hypnotic Resonance Peak', artist: 'DJ Wulf' },
      { time: '06:00', title: 'Warehouse Groove Fade', artist: 'DJ Wulf' }
    ],
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      soundcloud: 'https://soundcloud.com',
      appleMusic: 'https://music.apple.com',
      beatport: 'https://www.beatport.com',
      youtube: 'https://youtube.com'
    }
  },
  {
    id: 'track-4',
    title: 'Ibiza Sunset Solitude (Deep Mix)',
    artist: 'DJ Wulf',
    durationFormatted: '06:05',
    durationSeconds: 365,
    bpm: 122,
    key: 'C Minor',
    genre: 'Deep House',
    releaseDate: 'Juli 2026',
    coverGradient: 'from-black via-zinc-900 to-black',
    synthPreset: 'sunset',
    rawLoudnessLUFS: -11.5,
    playsCount: 341000,
    likesCount: 18400,
    description: 'Warme organische Percussions, dezente Marimba-Plucks und eine samtige Basslinie für goldene Stunden am Strand.',
    tracklist: [
      { time: '00:00', title: 'Balearic Wave Ambiance', artist: 'DJ Wulf' },
      { time: '01:40', title: 'Organic Percussion Enter', artist: 'DJ Wulf' },
      { time: '03:10', title: 'Sunset Melody Swell', artist: 'DJ Wulf' },
      { time: '05:00', title: 'Gentle Horizon Outro', artist: 'DJ Wulf' }
    ],
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      soundcloud: 'https://soundcloud.com',
      appleMusic: 'https://music.apple.com',
      beatport: 'https://www.beatport.com',
      youtube: 'https://youtube.com'
    }
  }
];

export const INITIAL_TOUR_DATES: TourDate[] = [
  {
    id: 'tour-1',
    date: '14. Nov 2026',
    isoDate: '2026-11-14T23:00:00',
    dayNumber: '14',
    monthYear: 'NOV 2026',
    city: 'Berlin',
    country: 'Deutschland',
    venue: 'Watergate Club',
    eventName: 'Wolfpack Club Night: Extended 4h Set',
    type: 'Club',
    ticketStatus: 'Fast Ausverkauft',
    ticketPrice: '22,00 €',
    stageTime: '01:30 - 05:30',
    ticketUrl: 'https://ra.co'
  },
  {
    id: 'tour-2',
    date: '21. Nov 2026',
    isoDate: '2026-11-21T22:00:00',
    dayNumber: '21',
    monthYear: 'NOV 2026',
    city: 'Amsterdam',
    country: 'Niederlande',
    venue: 'Warehouse Elementenstraat',
    eventName: 'ADE Hangover Series',
    type: 'Club',
    ticketStatus: 'Verfügbar',
    ticketPrice: '28,50 €',
    stageTime: '02:00 - 04:30',
    ticketUrl: 'https://ticketmaster.com'
  },
  {
    id: 'tour-3',
    date: '05. Dez 2026',
    isoDate: '2026-12-05T20:00:00',
    dayNumber: '05',
    monthYear: 'DEZ 2026',
    city: 'Zürich',
    country: 'Schweiz',
    venue: 'Halle 622',
    eventName: 'Winter Electro Gala',
    type: 'Festival',
    ticketStatus: 'Verfügbar',
    ticketPrice: '45,00 CHF',
    stageTime: '23:00 - 01:00',
    ticketUrl: 'https://starticket.ch'
  },
  {
    id: 'tour-4',
    date: '12. Dez 2026',
    isoDate: '2026-12-12T23:30:00',
    dayNumber: '12',
    monthYear: 'DEZ 2026',
    city: 'Wien',
    country: 'Österreich',
    venue: 'Pratersauna',
    eventName: 'Dark Winter Resonance',
    type: 'Club',
    ticketStatus: 'Gästeliste',
    ticketPrice: '18,00 €',
    stageTime: '01:00 - 04:00',
    ticketUrl: 'https://ntry.at'
  },
  {
    id: 'tour-5',
    date: '31. Dez 2026',
    isoDate: '2026-12-31T21:00:00',
    dayNumber: '31',
    monthYear: 'DEZ 2026',
    city: 'München',
    country: 'Deutschland',
    venue: 'Zenith Halle',
    eventName: 'Silvester Neon Rave 2027',
    type: 'Festival',
    ticketStatus: 'Ausverkauft',
    ticketPrice: '55,00 €',
    stageTime: '23:30 - 02:00',
    ticketUrl: 'https://eventim.de'
  },
  {
    id: 'tour-6',
    date: '16. Jan 2027',
    isoDate: '2027-01-16T23:00:00',
    dayNumber: '16',
    monthYear: 'JAN 2027',
    city: 'Prag',
    country: 'Tschechien',
    venue: 'Roxy Prague',
    eventName: 'Bohemian Nights',
    type: 'Club',
    ticketStatus: 'Verfügbar',
    ticketPrice: '420 CZK',
    stageTime: '01:00 - 03:30',
    ticketUrl: 'https://goout.net'
  }
];

export const INITIAL_PLAYLISTS: PlaylistItem[] = [
  {
    id: 'pl-1',
    title: 'DJ Wulf: Selected Primetime',
    curatedBy: 'DJ Wulf',
    description: 'Die härtesten Club-Tracks, exklusive unveröffentlichte Dubplates und melodische Peak-Time Banger.',
    trackCount: 48,
    duration: '3 Std. 45 Min.',
    gradient: 'from-cyan-950 via-slate-900 to-black',
    genre: 'Melodic Techno & Peak Time',
    links: {
      spotify: 'https://open.spotify.com',
      apple: 'https://music.apple.com',
      soundcloud: 'https://soundcloud.com',
      beatport: 'https://beatport.com'
    }
  },
  {
    id: 'pl-2',
    title: 'The Wolfpack Lounge: Deep & Atmospheric',
    curatedBy: 'DJ Wulf',
    description: 'Für Afterhours, lange Autofahrten und Late-Night Sessions im Studio. Deep House, Melodic Plucks & Vocal Chills.',
    trackCount: 62,
    duration: '4 Std. 20 Min.',
    gradient: 'from-purple-950 via-slate-900 to-black',
    genre: 'Deep & Progressive House',
    links: {
      spotify: 'https://open.spotify.com',
      apple: 'https://music.apple.com',
      soundcloud: 'https://soundcloud.com',
      beatport: 'https://beatport.com'
    }
  },
  {
    id: 'pl-3',
    title: 'Festival Anthems & Live IDs',
    curatedBy: 'DJ Wulf & Crew',
    description: 'Die Tracklist der Sommer-Festival-Tour 2026. Gigantische Drops, Vocals und massive Crowd-Chants.',
    trackCount: 35,
    duration: '2 Std. 30 Min.',
    gradient: 'from-amber-950 via-zinc-900 to-black',
    genre: 'Festival EDM & Big Room Techno',
    links: {
      spotify: 'https://open.spotify.com',
      apple: 'https://music.apple.com',
      soundcloud: 'https://soundcloud.com',
      beatport: 'https://beatport.com'
    }
  },
  {
    id: 'pl-4',
    title: 'Studio Inspiration & Analog Synthesizers',
    curatedBy: 'DJ Wulf',
    description: 'Synthesizer-Legenden, Jean-Michel Jarre Vibes, 80s Cyberpunk Wurzeln und zeitloser Detroit Techno.',
    trackCount: 40,
    duration: '3 Std. 10 Min.',
    gradient: 'from-emerald-950 via-slate-900 to-black',
    genre: 'Synthwave & Electronic Heritage',
    links: {
      spotify: 'https://open.spotify.com',
      apple: 'https://music.apple.com',
      soundcloud: 'https://soundcloud.com',
      beatport: 'https://beatport.com'
    }
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Tomorrowland Mainstage Sundown Set',
    type: 'photo',
    category: 'Festival',
    date: 'Juli 2026',
    location: 'Boom, Belgien',
    photographer: 'Elena Rostova / VisualPack',
    gradient: 'from-cyan-900 via-indigo-950 to-black',
    svgIcon: 'stage',
    description: 'Blick vom DJ-Pult über 35.000 feiernde Fans während des Sonnenuntergangs und der ersten Laser-Zündung.',
    likes: 1240,
    aspectRatio: '16:9'
  },
  {
    id: 'media-2',
    title: 'Laser Kathedrale im Watergate Berlin',
    type: 'photo',
    category: 'Club',
    date: 'Oktober 2026',
    location: 'Berlin, Deutschland',
    photographer: 'Markus Lindner',
    gradient: 'from-purple-900 via-slate-950 to-black',
    svgIcon: 'laser',
    description: 'Die berühmte Decken-Lichtinstallation im Watergate spiegelt sich in den CDJ-3000 Displays wider.',
    likes: 890,
    aspectRatio: '4:3'
  },
  {
    id: 'media-3',
    title: 'Analog Modular Synth Session: The Lead sound',
    type: 'video',
    category: 'Studio',
    date: 'September 2026',
    location: 'Studio Kreuzberg, Berlin',
    photographer: 'DJ Wulf Studio Cam',
    gradient: 'from-amber-900 via-zinc-950 to-black',
    svgIcon: 'synth',
    description: 'Live-Patching des Eurorack-Modularsystems für die Bassline von Midnight Protocol.',
    likes: 2150,
    aspectRatio: '16:9'
  },
  {
    id: 'media-4',
    title: 'Backstage Moments with the Crew',
    type: 'photo',
    category: 'Backstage',
    date: 'August 2026',
    location: 'Ibiza, Amnesia',
    photographer: 'Svenja Kraft',
    gradient: 'from-slate-800 via-neutral-900 to-black',
    svgIcon: 'turntable',
    description: 'Fünf Minuten vor Stage-Time. Kopfhörer auf, Tracklist im Kopf, voller Fokus auf die Menge.',
    likes: 740,
    aspectRatio: '4:3'
  },
  {
    id: 'media-5',
    title: 'Crowd Energy at Nature One',
    type: 'photo',
    category: 'Festival',
    date: 'August 2026',
    location: 'Kastellaun, Deutschland',
    photographer: 'RaveVision Agency',
    gradient: 'from-rose-950 via-zinc-950 to-black',
    svgIcon: 'crowd',
    description: 'Pure Euphorie im Century Circus Zelt als der Drop nach 64 Takten Build-Up einschlug.',
    likes: 1680,
    aspectRatio: '16:9'
  },
  {
    id: 'media-6',
    title: 'Mastering Deck & Tape Machine Workflow',
    type: 'photo',
    category: 'Studio',
    date: 'Oktober 2026',
    location: 'Berlin Mastering Lab',
    photographer: 'Lukas Bauer',
    gradient: 'from-emerald-950 via-slate-950 to-black',
    svgIcon: 'synth',
    description: 'Finales analoges Bandsättigen auf der Studer A80 für diesen warmen, körperbetonten Club-Sound.',
    likes: 960,
    aspectRatio: '4:3'
  }
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'Track ID gesucht: Der unveröffentlichte Vocal-Track aus dem Berlin Watergate Set (ca. Minute 42)?',
    content: 'Hi Wolfpack! War gestern jemand im Watergate? Bei ungefähr 02:15 Uhr hat Wulf diesen unglaublichen Track mit einer tiefen gesprochenen Frauenstimme und dieser rollenden Acid-Bassline gespielt. Hat jemand den ID oder ist das eine unreleased Wulf ID?',
    authorName: 'TechnoViktor',
    authorBadge: 'Wolfpack VIP',
    authorAvatar: 'VT',
    category: 'Track IDs & IDs',
    createdAt: 'Gestern, 14:20',
    repliesCount: 4,
    viewsCount: 680,
    likesCount: 38,
    isPinned: true,
    tags: ['TrackID', 'Watergate', 'Berlin', 'Unreleased'],
    replies: [
      {
        id: 'rep-1',
        authorName: 'DJ Wulf',
        authorBadge: 'Producer',
        authorAvatar: 'WULF',
        content: 'Hey Viktor! Das war mein neuer Bootleg "Silence of the Pack". Erscheint nächsten Monat exklusiv für Newsletter-Abonnenten hier auf der Seite als Gratis-Download! Danke für den Support gestern, war eine magische Nacht!',
        createdAt: 'Gestern, 16:05',
        likes: 54
      },
      {
        id: 'rep-2',
        authorName: 'Sarah_Beats',
        authorBadge: 'Resident',
        authorAvatar: 'SB',
        content: 'Der Übergang war der Wahnsinn! Der ganze Raum hat gebebt.',
        createdAt: 'Gestern, 17:12',
        likes: 12
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'Tomorrowland & Festival Tour 2027: Treffpunkt & Wolfpack Camp?',
    content: 'Servus Leute! Wir planen für den kommenden Sommer wieder ein gemeinsames Wolfpack Camp. Wer ist am Start? Wir bringen wieder eigene Pavillons mit Wulf-Flagge und ein DJ-Pult fürs Warm-up mit!',
    authorName: 'FestivalMax',
    authorBadge: 'Resident',
    authorAvatar: 'FM',
    category: 'Tour & Meetups',
    createdAt: 'Vor 3 Tagen',
    repliesCount: 8,
    viewsCount: 1240,
    likesCount: 64,
    isPinned: false,
    tags: ['Festival', 'Tomorrowland', 'Camping', 'Meetup'],
    replies: [
      {
        id: 'rep-3',
        authorName: 'Laura_Rave',
        authorBadge: 'Fan',
        authorAvatar: 'LR',
        content: 'Bin mit 4 Leuten aus München dabei! Tragt mich bitte in die WhatsApp/Signal-Gruppe ein.',
        createdAt: 'Vor 2 Tagen',
        likes: 8
      }
    ]
  },
  {
    id: 'thread-3',
    title: 'Produzenten-Frage: Welcher Synth erzeugt den Bass in "Subterranean Echoes"?',
    content: 'Moin Wulf & Produzenten-Kollegen! Ich versuche gerade diesen knurrigen, warmen Mittenbereich im Bass nachzubauen. Nutzt du dafür eher einen Moog Subsequent oder ist das komplett Eurorack? Und wie komprimierst du die Kicks gegen den Subbass?',
    authorName: 'AlexSynthesizer',
    authorBadge: 'Producer',
    authorAvatar: 'AS',
    category: 'Studio & Gear',
    createdAt: 'Vor 5 Tagen',
    repliesCount: 6,
    viewsCount: 940,
    likesCount: 42,
    isPinned: false,
    tags: ['Produktion', 'Ableton', 'Moog', 'Mixdown'],
    replies: [
      {
        id: 'rep-4',
        authorName: 'DJ Wulf',
        authorBadge: 'Producer',
        authorAvatar: 'WULF',
        content: 'Gute Ohren! Das Fundament ist ein Studio Electronics SE-1X durch einen analogem Thermionic Culture Vulture Overdrive geschickt. Sidechaining mache ich per Volume-Shaper statt Kompressor für chirurgische Präzision.',
        createdAt: 'Vor 4 Tagen',
        likes: 67
      }
    ]
  },
  {
    id: 'thread-4',
    title: 'Offizieller Remix-Contest: Stem-Paket "Alpha Wolf" ist online!',
    content: 'Liebe Producer-Community! Ab sofort stehen die offiziellen Stems (Drums, Vocals, Leads, Basslines) in 24-bit WAV für euch bereit. Der beste Remix erhält einen offiziellen Release auf dem kommenden Wulfpack Sampler und 2 VIP-Tickets für ein Festival eurer Wahl!',
    authorName: 'DJ Wulf',
    authorBadge: 'Producer',
    authorAvatar: 'WULF',
    category: 'Remix Contest',
    createdAt: 'Vor 1 Woche',
    repliesCount: 15,
    viewsCount: 2310,
    likesCount: 112,
    isPinned: true,
    tags: ['RemixContest', 'Stems', 'FreeDownload', 'Producer'],
    replies: [
      {
        id: 'rep-5',
        authorName: 'KlangKuenstler_99',
        authorBadge: 'Producer',
        authorAvatar: 'KK',
        content: 'Stems sind geladen! Die Vocal-Takes sind extrem sauber aufgenommen. Deadline ist der 30. November, richtig?',
        createdAt: 'Vor 6 Tagen',
        likes: 19
      }
    ]
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'soc-1',
    platform: 'instagram',
    handle: '@djwulf_official',
    postedAgo: 'Vor 2 Stunden',
    caption: 'BERLIN! 🖤 4 Stunden purer Rausch im Watergate. Danke an jeden Einzelnen, der bis zum Morgengrauen durchgetanzt hat. Neuer Mix landet diese Woche!',
    likes: 8420,
    comments: 243,
    shares: 412,
    mediaType: 'photo',
    gradient: 'from-cyan-900 via-slate-900 to-black',
    trackTag: 'DJ Wulf — Midnight Protocol'
  },
  {
    id: 'soc-2',
    platform: 'tiktok',
    handle: '@djwulf',
    postedAgo: 'Vor 1 Tag',
    caption: 'Wenn der Drop nach 64 Takten endlich zündet... ⚡👀 Wer war in Amsterdam dabei?',
    likes: 34100,
    comments: 1120,
    shares: 4890,
    mediaType: 'video',
    gradient: 'from-amber-900 via-zinc-950 to-black',
    trackTag: 'Pack Anthem (Festival Overdrive)'
  },
  {
    id: 'soc-3',
    platform: 'x',
    handle: '@djwulf_music',
    postedAgo: 'Vor 2 Tagen',
    caption: 'Studio-Nachtschicht beendet. 3 neue Club-Skizzen sind fertig. Wer will ein Preview im Forum hören?',
    likes: 1890,
    comments: 156,
    shares: 210,
    mediaType: 'photo',
    gradient: 'from-purple-950 via-slate-900 to-black'
  }
];

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'technofan_berlin@gmail.com', name: 'Viktor M.', subscribedAt: '01.11.2026', perkClaimed: true },
  { id: 'sub-2', email: 'sarah.rave@gmx.de', name: 'Sarah B.', subscribedAt: '28.10.2026', perkClaimed: true },
  { id: 'sub-3', email: 'marc.amsterdam@outlook.com', name: 'Marc van Dijk', subscribedAt: '25.10.2026', perkClaimed: false },
  { id: 'sub-4', email: 'felix.beats@icloud.com', name: 'Felix Keller', subscribedAt: '20.10.2026', perkClaimed: true }
];

export const INITIAL_BOOKINGS: BookingInquiry[] = [
  {
    id: 'book-1',
    organizerName: 'Julian Sommer / RaveCulture Events',
    email: 'booking@raveculture.de',
    phone: '+49 171 8923411',
    eventName: 'Lighthouse Open Air 2027',
    eventType: 'Festival',
    eventDate: '24. Juli 2027',
    location: 'Hamburg HafenCity',
    expectedGuests: '8.000 - 10.000',
    budgetBracket: '10.000 € - 15.000 €',
    message: 'Wir möchten DJ Wulf als Headliner für unseren Techno Stage Samstagnacht anfragen. 90-120 Min Slot mit voller Laser-Show.',
    status: 'In Prüfung',
    submittedAt: 'Vor 2 Tagen'
  },
  {
    id: 'book-2',
    organizerName: 'Claire Dupont',
    email: 'events@club-elysee.fr',
    phone: '+33 6 12 34 56 78',
    eventName: 'Paris Fashion Week Techno Showcase',
    eventType: 'Club Night',
    eventDate: '02. März 2027',
    location: 'Paris, Rex Club',
    expectedGuests: '1.200',
    budgetBracket: '7.500 € - 10.000 €',
    message: 'Exklusives Set während der Fashion Week Paris. Gerne Melodic Techno Schwerpunkt.',
    status: 'Neu',
    submittedAt: 'Gestern'
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Dominik Neumail',
  handle: '@dominik_wulfpack',
  email: 'dominik.neumail@gmail.com',
  role: 'user', // Can be toggled to 'admin' in UI
  badge: 'Wolfpack VIP',
  avatarSeed: 'DN',
  favoriteMixIds: ['track-1', 'track-2'],
  bookmarkedThreadIds: ['thread-1', 'thread-4'],
  rsvpTourIds: ['tour-1', 'tour-5'],
  unlockedDownloads: ['bootleg-vip-wav', 'presskit-2026', 'wallpaper-4k-pack']
};

export const INITIAL_BACKSTAGE_MESSAGES = [
  {
    id: 'chat-1',
    trackId: 'track-1',
    authorName: 'DJ BOOTH',
    authorBadge: 'DJ BOOTH' as const,
    authorAvatar: 'WULF',
    content: '🎧 Live auf Deck: Midnight Protocol (Club Mix) [126 BPM · F Minor] — Volume aufdrehen!',
    timestamp: '23:41',
    likes: 18,
    isSystem: true
  },
  {
    id: 'chat-2',
    trackId: 'track-1',
    authorName: 'Sarah_Beats',
    authorBadge: 'Resident' as const,
    authorAvatar: 'SB',
    content: 'Dieser analoge Moog Sub-Bass schiebt so brutal nach vorne! ⚡🔥',
    timestamp: '23:42',
    likes: 9
  },
  {
    id: 'chat-3',
    trackId: 'track-1',
    authorName: 'TechnoViktor',
    authorBadge: 'Wolfpack VIP' as const,
    authorAvatar: 'VT',
    content: 'Watergate Crowd war komplett im Ausnahmezustand bei dem Drop 🐺',
    timestamp: '23:43',
    likes: 14
  },
  {
    id: 'chat-4',
    trackId: 'track-1',
    authorName: 'AlexSynthesizer',
    authorBadge: 'Producer' as const,
    authorAvatar: 'AS',
    content: 'Hört ihr den Cutoff-Sweep bei 02:15? So sauber abgemischt.',
    timestamp: '23:44',
    likes: 7
  },
  {
    id: 'chat-5',
    trackId: 'track-2',
    authorName: 'DJ BOOTH',
    authorBadge: 'DJ BOOTH' as const,
    authorAvatar: 'WULF',
    content: '⚡ Live auf Deck: Pack Anthem (Festival Overdrive) [132 BPM · A Minor]',
    timestamp: '23:48',
    likes: 24,
    isSystem: true
  },
  {
    id: 'chat-6',
    trackId: 'track-2',
    authorName: 'FestivalMax',
    authorBadge: 'Resident' as const,
    authorAvatar: 'FM',
    content: 'Mainstage Euphorie pur! 🚀 Wer ist in Amsterdam dabei?',
    timestamp: '23:49',
    likes: 11
  },
  {
    id: 'chat-7',
    trackId: 'track-3',
    authorName: 'DJ BOOTH',
    authorBadge: 'DJ BOOTH' as const,
    authorAvatar: 'WULF',
    content: '💣 Live auf Deck: Subterranean Echoes (Berghain Cut) [138 BPM · D Minor]',
    timestamp: '23:52',
    likes: 19,
    isSystem: true
  },
  {
    id: 'chat-8',
    trackId: 'track-3',
    authorName: 'Sven_Berlin',
    authorBadge: 'Fan' as const,
    authorAvatar: 'SV',
    content: 'Acid 303 Rolling Bassline... genau mein Sound für 4 Uhr morgens.',
    timestamp: '23:53',
    likes: 6
  }
];

