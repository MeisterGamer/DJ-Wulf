import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MixesSection } from './components/MixesSection';
import { TourDatesSection } from './components/TourDatesSection';
import { PlaylistsSection } from './components/PlaylistsSection';
import { MediathekSection } from './components/MediathekSection';
import { ForumSection } from './components/ForumSection';
import { SocialFeedSection } from './components/SocialFeedSection';
import { NewsletterSection } from './components/NewsletterSection';
import { BookingSection } from './components/BookingSection';
import { AudioPlayerDock } from './components/AudioPlayerDock';
import { PartyEffectsModal } from './components/PartyEffectsModal';
import { UserPanelModal } from './components/UserPanelModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { BackstageChatSidebar } from './components/BackstageChatSidebar';
import { FullscreenVisualizerCanvas, VisualizerMode } from './components/FullscreenVisualizerCanvas';
import { Footer } from './components/Footer';

import {
  INITIAL_TRACKS,
  INITIAL_TOUR_DATES,
  INITIAL_PLAYLISTS,
  INITIAL_MEDIA,
  INITIAL_FORUM_THREADS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_SUBSCRIBERS,
  INITIAL_BOOKINGS,
  INITIAL_USER,
  INITIAL_BACKSTAGE_MESSAGES,
} from './data/mockData';
import {
  TrackItem,
  TourDate,
  PlaylistItem,
  MediaItem,
  ForumThread,
  SocialPost,
  NewsletterSubscriber,
  BookingInquiry,
  UserProfile,
  BackstageChatMessage,
} from './types';
import { soundEngine } from './utils/audioEngine';

export default function App() {
  // Main Domain Data State
  const [tracks, setTracks] = useState<TrackItem[]>(INITIAL_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<TrackItem>(INITIAL_TRACKS[0]);
  const [tourDates, setTourDates] = useState<TourDate[]>(INITIAL_TOUR_DATES);
  const [playlists] = useState<PlaylistItem[]>(INITIAL_PLAYLISTS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(INITIAL_FORUM_THREADS);
  const [socialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(INITIAL_SUBSCRIBERS);
  const [bookings, setBookings] = useState<BookingInquiry[]>(INITIAL_BOOKINGS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);

  // Real-Time Backstage Chat State
  const [chatMessages, setChatMessages] = useState<BackstageChatMessage[]>(INITIAL_BACKSTAGE_MESSAGES);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  // Audio Playback & Real-time Visualizer State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  const animFrameRef = useRef<number | null>(null);

  // Modals
  const [partyModalOpen, setPartyModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Party visual effects state
  const [isPartyActive, setIsPartyActive] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [isVisualizerActive, setIsVisualizerActive] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('ring');

  // Sync with Web Audio Engine
  useEffect(() => {
    const unsub = soundEngine.subscribe(() => {
      setIsPlaying(soundEngine.getIsPlaying());
    });
    return () => unsub();
  }, []);

  // Multi-tab real-time sync for Backstage Chat via BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('wulfpack_backstage_chat');
      channel.onmessage = (event) => {
        const msg = event.data as BackstageChatMessage;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      };
      return () => channel.close();
    }
  }, []);

  // Poll real-time frequency analysis when playing for audio visualizer bars
  useEffect(() => {
    const updateFrequency = () => {
      if (isPlaying) {
        setFrequencyData(soundEngine.getFrequencyData());
      }
      animFrameRef.current = requestAnimationFrame(updateFrequency);
    };

    animFrameRef.current = requestAnimationFrame(updateFrequency);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleSelectTrack = (track: TrackItem) => {
    setCurrentTrack(track);
    soundEngine.setPreset(track.synthPreset, track.bpm, track.rawLoudnessLUFS);
    soundEngine.play();

    // Broadcast DJ Booth notification in Backstage Chat
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const boothMsg: BackstageChatMessage = {
      id: `sys-${Date.now()}`,
      trackId: track.id,
      authorName: 'DJ BOOTH',
      authorBadge: 'DJ BOOTH',
      authorAvatar: 'WULF',
      content: `🎧 Neu auf Deck: ${track.title} [${track.bpm} BPM · ${track.key}] — Volume aufdrehen!`,
      timestamp: timeStr,
      likes: 6,
      isSystem: true,
    };
    setChatMessages((prev) => [...prev, boothMsg]);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundEngine.pause();
    } else {
      soundEngine.setPreset(currentTrack.synthPreset, currentTrack.bpm, currentTrack.rawLoudnessLUFS);
      soundEngine.play();
    }
  };

  const handleSendMessage = (content: string, trackId: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: BackstageChatMessage = {
      id: `msg-${Date.now()}`,
      trackId,
      authorName: currentUser.name,
      authorBadge: currentUser.badge,
      authorAvatar: currentUser.avatarSeed,
      content,
      timestamp: timeStr,
      likes: 0,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Broadcast to other open windows/tabs
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('wulfpack_backstage_chat');
        channel.postMessage(newMsg);
        channel.close();
      }
    } catch {
      // Broadcast fallback
    }
  };

  const handleLikeChatMessage = (id: string) => {
    setChatMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  const handleToggleFavoriteMix = (trackId: string) => {
    setCurrentUser((prev) => {
      const isFav = prev.favoriteMixIds.includes(trackId);
      return {
        ...prev,
        favoriteMixIds: isFav
          ? prev.favoriteMixIds.filter((id) => id !== trackId)
          : [...prev.favoriteMixIds, trackId],
      };
    });
  };

  const handleToggleRsvp = (tourId: string) => {
    setCurrentUser((prev) => {
      const isRsvpd = prev.rsvpTourIds.includes(tourId);
      return {
        ...prev,
        rsvpTourIds: isRsvpd
          ? prev.rsvpTourIds.filter((id) => id !== tourId)
          : [...prev.rsvpTourIds, tourId],
      };
    });
  };

  const handleToggleBookmarkThread = (threadId: string) => {
    setCurrentUser((prev) => {
      const isBookmarked = prev.bookmarkedThreadIds.includes(threadId);
      return {
        ...prev,
        bookmarkedThreadIds: isBookmarked
          ? prev.bookmarkedThreadIds.filter((id) => id !== threadId)
          : [...prev.bookmarkedThreadIds, threadId],
      };
    });
  };

  const handleLikeMedia = (id: string) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  const handleLikeThread = (threadId: string) => {
    setForumThreads((prev) =>
      prev.map((th) => (th.id === threadId ? { ...th, likesCount: th.likesCount + 1 } : th))
    );
  };

  const handleAddForumThread = (
    newThreadData: Omit<
      ForumThread,
      'id' | 'createdAt' | 'repliesCount' | 'viewsCount' | 'likesCount' | 'replies'
    >
  ) => {
    const thread: ForumThread = {
      ...newThreadData,
      id: `thread-${Date.now()}`,
      createdAt: 'Gerade eben',
      repliesCount: 0,
      viewsCount: 1,
      likesCount: 1,
      replies: [],
    };
    setForumThreads([thread, ...forumThreads]);
  };

  const handleAddForumReply = (threadId: string, replyContent: string) => {
    setForumThreads((prev) =>
      prev.map((th) => {
        if (th.id !== threadId) return th;
        const newReply = {
          id: `rep-${Date.now()}`,
          authorName: currentUser.name,
          authorBadge: currentUser.badge,
          authorAvatar: currentUser.avatarSeed,
          content: replyContent,
          createdAt: 'Gerade eben',
          likes: 0,
        };
        return {
          ...th,
          replies: [...th.replies, newReply],
          repliesCount: th.replies.length + 1,
        };
      })
    );
  };

  const handleSubscribeNewsletter = (email: string, name: string) => {
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      name,
      subscribedAt: new Date().toLocaleDateString('de-DE'),
      perkClaimed: true,
    };
    setSubscribers([newSub, ...subscribers]);
  };

  const handleAddBooking = (bookingData: Omit<BookingInquiry, 'id' | 'status' | 'submittedAt'>) => {
    const newBooking: BookingInquiry = {
      ...bookingData,
      id: `book-${Date.now()}`,
      status: 'Neu',
      submittedAt: 'Gerade eben',
    };
    setBookings([newBooking, ...bookings]);
  };

  const handleScrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-[#00ff66]/30 selection:text-[#00ff66]">
      {/* Laser Light Sweepers Overlay (Neon Green & White beams) */}
      {isLaserActive && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[1200px] h-[3px] bg-linear-to-r from-transparent via-[#00ff66] to-transparent blur-xs transform -rotate-40 animate-laser" />
          <div className="absolute -top-40 right-1/4 w-[1200px] h-[3px] bg-linear-to-r from-transparent via-white to-transparent blur-xs transform rotate-35 animate-laser" style={{ animationDelay: '1.5s' }} />
        </div>
      )}

      {/* Strobe Light Pulse Overlay */}
      {isStrobeActive && (
        <div className="fixed inset-0 pointer-events-none z-20 bg-[#00ff66]/10 mix-blend-screen animate-pulse" />
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenBooking={handleScrollToBooking}
        onOpenPartyEffects={() => setPartyModalOpen(true)}
        onOpenUserPanel={() => setUserModalOpen(true)}
        onOpenAdminPanel={() => setAdminModalOpen(true)}
        onOpenBackstageChat={() => setChatSidebarOpen(true)}
        isPartyActive={isPartyActive || isLaserActive || isStrobeActive}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        unreadChatCount={chatMessages.length}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <HeroSection
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onOpenBooking={handleScrollToBooking}
          onOpenPartyEffects={() => setPartyModalOpen(true)}
          frequencyData={frequencyData}
        />

        {/* Aktuelle Mixes */}
        <MixesSection
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onSelectTrack={handleSelectTrack}
          onTogglePlay={handleTogglePlay}
          favoriteMixIds={currentUser.favoriteMixIds}
          onToggleFavorite={handleToggleFavoriteMix}
        />

        {/* Tourdaten & Tickets */}
        <TourDatesSection
          tourDates={tourDates}
          rsvpTourIds={currentUser.rsvpTourIds}
          onToggleRsvp={handleToggleRsvp}
          onOpenBooking={handleScrollToBooking}
        />

        {/* Playlists & Streaming Hub */}
        <PlaylistsSection
          playlists={playlists}
          onPlayPreview={handleTogglePlay}
        />

        {/* Mediathek & Galerie */}
        <MediathekSection
          mediaItems={mediaItems}
          onLikeMedia={handleLikeMedia}
          onOpenAdminPanel={() => setAdminModalOpen(true)}
          isAdmin={currentUser.role === 'admin'}
        />

        {/* Community Forum mit Volltextsuche */}
        <ForumSection
          threads={forumThreads}
          currentUser={currentUser}
          onAddThread={handleAddForumThread}
          onAddReply={handleAddForumReply}
          onLikeThread={handleLikeThread}
          bookmarkedThreadIds={currentUser.bookmarkedThreadIds}
          onToggleBookmark={handleToggleBookmarkThread}
        />

        {/* Social Media Feeds */}
        <SocialFeedSection
          posts={socialPosts}
          onPlaySample={handleTogglePlay}
        />

        {/* Newsletter Fanbindung */}
        <NewsletterSection
          onSubscribe={handleSubscribeNewsletter}
          isAlreadySubscribed={subscribers.some((s) => s.email === currentUser.email)}
        />

        {/* Kontakt & Booking Formular */}
        <BookingSection onAddBooking={handleAddBooking} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={handleScrollToBooking}
        onOpenParty={() => setPartyModalOpen(true)}
        onOpenUser={() => setUserModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Persistent Audio Player Dock with Chat Sync */}
      <AudioPlayerDock
        currentTrack={currentTrack}
        tracks={tracks}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSelectTrack={handleSelectTrack}
        frequencyData={frequencyData}
        isFavorite={currentUser.favoriteMixIds.includes(currentTrack.id)}
        onToggleFavorite={handleToggleFavoriteMix}
        onOpenBackstageChat={() => setChatSidebarOpen(true)}
      />

      {/* Real-Time Backstage Chat Sidebar (Synced with AudioPlayerDock) */}
      <BackstageChatSidebar
        isOpen={chatSidebarOpen}
        onClose={() => setChatSidebarOpen(false)}
        currentTrack={currentTrack}
        currentUser={currentUser}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onLikeMessage={handleLikeChatMessage}
      />

      {/* Fullscreen Background Canvas Visualizer (Audio Reactive) */}
      <FullscreenVisualizerCanvas
        isActive={isVisualizerActive}
        mode={visualizerMode}
        onChangeMode={setVisualizerMode}
        onClose={() => setIsVisualizerActive(false)}
        isPlaying={isPlaying}
      />

      {/* Party Effects Modal */}
      <PartyEffectsModal
        isOpen={partyModalOpen}
        onClose={() => setPartyModalOpen(false)}
        isPartyActive={isPartyActive}
        onTogglePartyMode={() => setIsPartyActive(!isPartyActive)}
        isLaserActive={isLaserActive}
        onToggleLaser={() => setIsLaserActive(!isLaserActive)}
        isStrobeActive={isStrobeActive}
        onToggleStrobe={() => setIsStrobeActive(!isStrobeActive)}
        isVisualizerActive={isVisualizerActive}
        onToggleVisualizer={() => setIsVisualizerActive(!isVisualizerActive)}
        visualizerMode={visualizerMode}
        onChangeVisualizerMode={setVisualizerMode}
      />

      {/* User Panel Modal */}
      <UserPanelModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={currentUser}
        tracks={tracks}
        forumThreads={forumThreads}
        tourDates={tourDates}
        onPlayTrack={handleSelectTrack}
        onSwitchRole={(newRole) => setCurrentUser({ ...currentUser, role: newRole })}
        onUpdateUser={(updated) => setCurrentUser({ ...currentUser, ...updated })}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        tourDates={tourDates}
        onAddTourDate={(newTour) => setTourDates([...tourDates, newTour])}
        onDeleteTourDate={(id) => setTourDates(tourDates.filter((t) => t.id !== id))}
        tracks={tracks}
        onAddTrack={(newTrack) => setTracks([...tracks, newTrack])}
        onDeleteTrack={(id) => setTracks(tracks.filter((t) => t.id !== id))}
        mediaItems={mediaItems}
        onAddMedia={(newMedia) => setMediaItems([newMedia, ...mediaItems])}
        onDeleteMedia={(id) => setMediaItems(mediaItems.filter((m) => m.id !== id))}
        forumThreads={forumThreads}
        onTogglePinThread={(id) =>
          setForumThreads(
            forumThreads.map((th) => (th.id === id ? { ...th, isPinned: !th.isPinned } : th))
          )
        }
        onDeleteThread={(id) => setForumThreads(forumThreads.filter((th) => th.id !== id))}
        subscribers={subscribers}
        bookings={bookings}
        onUpdateBookingStatus={(id, status) =>
          setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)))
        }
      />
    </div>
  );
}
