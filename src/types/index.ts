export type MusicGenre = 'Melodic Techno' | 'Peak Time Techno' | 'Deep House' | 'Festival EDM' | 'Afro House';

export type LoudnessStandard = '-14 LUFS (EBU R128)' | '-11 LUFS (Club Punch)' | '-18 LUFS (High Dynamic)';

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  durationFormatted: string;
  durationSeconds: number;
  bpm: number;
  key: string;
  genre: MusicGenre;
  releaseDate: string;
  coverGradient: string;
  synthPreset: 'midnight' | 'anthem' | 'subterranean' | 'sunset';
  rawLoudnessLUFS: number; // Inherent upload loudness before normalization
  playsCount: number;
  likesCount: number;
  description: string;
  tracklist: { time: string; title: string; artist: string }[];
  streamingLinks: {
    spotify: string;
    soundcloud: string;
    appleMusic: string;
    beatport: string;
    youtube: string;
  };
}

export interface TourDate {
  id: string;
  date: string;
  isoDate: string;
  dayNumber: string;
  monthYear: string;
  city: string;
  country: string;
  venue: string;
  eventName: string;
  type: 'Festival' | 'Club' | 'OpenAir' | 'Special';
  ticketStatus: 'Verfügbar' | 'Fast Ausverkauft' | 'Ausverkauft' | 'Gästeliste';
  ticketPrice?: string;
  stageTime: string;
  ticketUrl: string;
}

export interface PlaylistItem {
  id: string;
  title: string;
  curatedBy: string;
  description: string;
  trackCount: number;
  duration: string;
  gradient: string;
  genre: string;
  links: {
    spotify: string;
    apple: string;
    soundcloud: string;
    beatport: string;
  };
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  category: 'Festival' | 'Club' | 'Studio' | 'Backstage';
  date: string;
  location: string;
  photographer: string;
  gradient: string;
  svgIcon: 'stage' | 'turntable' | 'synth' | 'crowd' | 'laser';
  description: string;
  likes: number;
  aspectRatio: '16:9' | '4:3' | '1:1';
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorBadge: 'Wolfpack VIP' | 'Resident' | 'Producer' | 'Fan';
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorBadge: 'Wolfpack VIP' | 'Resident' | 'Producer' | 'Fan';
  authorAvatar: string;
  category: 'Track IDs & IDs' | 'Tour & Meetups' | 'Studio & Gear' | 'Wolfpack Lounge' | 'Remix Contest';
  createdAt: string;
  repliesCount: number;
  viewsCount: number;
  likesCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  tags: string[];
  replies: ForumReply[];
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'x';
  handle: string;
  postedAgo: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  mediaType: 'photo' | 'video';
  gradient: string;
  trackTag?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
  perkClaimed: boolean;
}

export interface BookingInquiry {
  id: string;
  organizerName: string;
  email: string;
  phone: string;
  eventName: string;
  eventType: 'Festival' | 'Club Night' | 'Open Air' | 'Corporate' | 'Private';
  eventDate: string;
  location: string;
  expectedGuests: string;
  budgetBracket: string;
  message: string;
  status: 'Neu' | 'In Prüfung' | 'Bestätigt' | 'Abgelehnt';
  submittedAt: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  email: string;
  role: 'user' | 'admin';
  badge: 'Wolfpack VIP' | 'Resident' | 'Producer' | 'Fan';
  avatarSeed: string;
  favoriteMixIds: string[];
  bookmarkedThreadIds: string[];
  rsvpTourIds: string[];
  unlockedDownloads: string[];
}

export interface BackstageChatMessage {
  id: string;
  trackId: string;
  authorName: string;
  authorBadge: 'Wolfpack VIP' | 'Resident' | 'Producer' | 'Fan' | 'DJ BOOTH';
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isSystem?: boolean;
}

