import React, { useState } from 'react';
import { Sparkles, Shield, User, Menu, X, Disc3, MessageSquare } from 'lucide-react';
import { WolfEmblem } from './VisualArt';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  onOpenBooking: () => void;
  onOpenPartyEffects: () => void;
  onOpenUserPanel: () => void;
  onOpenAdminPanel: () => void;
  onOpenBackstageChat: () => void;
  isPartyActive: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  unreadChatCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenBooking,
  onOpenPartyEffects,
  onOpenUserPanel,
  onOpenAdminPanel,
  onOpenBackstageChat,
  isPartyActive,
  isPlaying,
  onTogglePlay,
  unreadChatCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-xl font-black tracking-wider text-white hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center group-hover:border-[#00ff66] transition-colors">
              <WolfEmblem className="w-5 h-5" />
            </div>
            <span className="font-heading">DJ WULF</span>
          </a>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
            <a href="#mixes" className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0">
              Mixes
            </a>
            <a href="#tour" className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0">
              Tourdaten
            </a>
            <a href="#playlists" className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0">
              Playlists
            </a>
            <a href="#mediathek" className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0">
              Mediathek
            </a>
            <a href="#community" className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0">
              Community
            </a>
          </nav>

          {/* Zone 3: 1 primary action + quick utility triggers */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Play/Pause trigger */}
            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause' : 'Play Beat'}
              aria-label={isPlaying ? 'Musik pausieren' : 'Beat abspielen'}
              className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                isPlaying
                  ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.4)]'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Disc3 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
            </button>

            {/* Party Effects Button */}
            <button
              onClick={onOpenPartyEffects}
              title="Party-Effekte & FX"
              aria-label="Party-Effekte öffnen"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isPartyActive
                  ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.35)]'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:border-[#00ff66]/50 hover:text-[#00ff66]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="hidden sm:inline">Party FX</span>
            </button>

            {/* Backstage Chat Button */}
            <button
              onClick={onOpenBackstageChat}
              title="Backstage VIP Chat (Synced mit Track)"
              aria-label="Backstage Chat öffnen"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-white/10 bg-white/5 text-zinc-200 hover:border-[#00ff66]/50 hover:text-[#00ff66] transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="hidden lg:inline">Backstage Chat</span>
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
            </button>

            {/* User Panel */}
            <button
              onClick={onOpenUserPanel}
              title="Mein Wolfpack Profil"
              aria-label="Nutzerprofil öffnen"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-[#00ff66] hover:border-[#00ff66]/40 transition-colors"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Admin Panel Toggle */}
            <button
              onClick={onOpenAdminPanel}
              title="Admin Panel"
              aria-label="Admin Panel öffnen"
              className={`p-2 rounded-lg border transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-[#00ff66]'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider text-black bg-[#00ff66] rounded-lg hover:bg-[#33ff88] transition-colors shadow-[0_0_20px_rgba(0,255,102,0.35)] whitespace-nowrap shrink-0"
            >
              Booking anfragen
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white"
              aria-label="Menü umschalten"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBackstageChat();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-base font-bold text-black bg-[#00ff66] rounded-lg"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Backstage VIP Chat</span>
            </span>
            <span className="text-xs bg-black text-[#00ff66] px-2 py-0.5 rounded font-mono">LIVE</span>
          </button>
          <a
            href="#mixes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-200 hover:text-[#00ff66] rounded-md"
          >
            Aktuelle Mixes
          </a>
          <a
            href="#tour"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-200 hover:text-[#00ff66] rounded-md"
          >
            Tourdaten & Tickets
          </a>
          <a
            href="#playlists"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-200 hover:text-[#00ff66] rounded-md"
          >
            Playlists & Streaming
          </a>
          <a
            href="#mediathek"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-200 hover:text-[#00ff66] rounded-md"
          >
            Mediathek & Galerie
          </a>
          <a
            href="#community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-zinc-200 hover:text-[#00ff66] rounded-md"
          >
            Community Forum & Suche
          </a>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPartyEffects();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66]"
            >
              <Sparkles className="w-4 h-4 text-[#00ff66]" />
              Party-Effekte & Club FX starten
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 text-sm font-black uppercase tracking-wider text-black bg-[#00ff66] rounded-lg"
            >
              Booking anfragen
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
