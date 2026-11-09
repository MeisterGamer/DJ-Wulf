import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Radio,
  Users,
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Disc3,
  ThumbsUp,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { BackstageChatMessage, TrackItem, UserProfile } from '../types';
import { soundEngine } from '../utils/audioEngine';

interface BackstageChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: TrackItem;
  currentUser: UserProfile;
  messages: BackstageChatMessage[];
  onSendMessage: (content: string, trackId: string) => void;
  onLikeMessage: (id: string) => void;
}

export const BackstageChatSidebar: React.FC<BackstageChatSidebarProps> = ({
  isOpen,
  onClose,
  currentTrack,
  currentUser,
  messages,
  onSendMessage,
  onLikeMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [filterByCurrentTrack, setFilterByCurrentTrack] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showUsersList, setShowUsersList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages based on active track or global
  const displayedMessages = filterByCurrentTrack
    ? messages.filter((m) => m.trackId === currentTrack.id || m.isSystem)
    : messages;

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedMessages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim(), currentTrack.id);
    setInputText('');

    if (soundEnabled) {
      soundEngine.playLaserZap();
    }
  };

  const handleQuickReaction = (emoji: string) => {
    onSendMessage(`${emoji} ${currentTrack.title}`, currentTrack.id);
    if (soundEnabled) {
      soundEngine.playLaserZap();
    }
  };

  // Mock list of active backstage users
  const activeMembers = [
    { name: 'DJ Wulf', badge: 'Producer', avatar: 'WULF', online: true },
    { name: currentUser.name, badge: currentUser.badge, avatar: currentUser.avatarSeed, online: true, isMe: true },
    { name: 'Sarah_Beats', badge: 'Resident', avatar: 'SB', online: true },
    { name: 'TechnoViktor', badge: 'Wolfpack VIP', avatar: 'VT', online: true },
    { name: 'AlexSynthesizer', badge: 'Producer', avatar: 'AS', online: true },
    { name: 'FestivalMax', badge: 'Resident', avatar: 'FM', online: true },
    { name: 'Elena_Visuals', badge: 'Fan', avatar: 'EV', online: true },
    { name: 'Sven_Berlin', badge: 'Fan', avatar: 'SV', online: true }
  ];

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Backstage VIP Chat"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-black/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col transition-all duration-300 animate-in slide-in-from-right"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-zinc-950 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-wider text-white uppercase">
                  Backstage Chat
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00ff66] text-black">
                  LIVE
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                <span>54 Wolfpack Member online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowUsersList(!showUsersList)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                showUsersList
                  ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Online Mitglieder"
            >
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
              title={soundEnabled ? 'Chat-Sound an' : 'Chat-Sound aus'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00ff66]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              aria-label="Chat schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track Sync Banner (Synced with AudioPlayerDock) */}
        <div className="p-2.5 rounded-xl bg-black border border-[#00ff66]/30 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Disc3 className="w-4 h-4 text-[#00ff66] animate-spin shrink-0" />
            <div className="truncate">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">
                Synchronisiert mit Player
              </span>
              <span className="font-bold text-white truncate block">
                {currentTrack.title}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0 font-mono text-[11px] text-[#00ff66] font-bold">
            {currentTrack.bpm} BPM
          </div>
        </div>

        {/* Room Switcher Tabs */}
        <div className="flex items-center gap-1 text-[11px] font-bold">
          <button
            onClick={() => setFilterByCurrentTrack(true)}
            className={`flex-1 py-1 px-2 rounded-lg border transition-colors text-center ${
              filterByCurrentTrack
                ? 'bg-[#00ff66] text-black border-[#00ff66]'
                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            Aktueller Track
          </button>
          <button
            onClick={() => setFilterByCurrentTrack(false)}
            className={`flex-1 py-1 px-2 rounded-lg border transition-colors text-center ${
              !filterByCurrentTrack
                ? 'bg-[#00ff66] text-black border-[#00ff66]'
                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            Alle Räume ({messages.length})
          </button>
        </div>
      </div>

      {/* Online Users List overlay */}
      {showUsersList && (
        <div className="p-3 bg-zinc-900 border-b border-white/10 text-xs max-h-48 overflow-y-auto space-y-1.5 animate-in fade-in">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            Backstage VIPs & Gäste im Raum
          </div>
          {activeMembers.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-black/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-[#00ff66]/50 flex items-center justify-center font-bold text-[9px] text-[#00ff66]">
                  {m.avatar}
                </div>
                <span className="font-bold text-white text-xs">{m.name}</span>
                {m.isMe && <span className="text-[10px] text-zinc-400">(Du)</span>}
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-[#00ff66]">
                {m.badge}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-black/60">
        {displayedMessages.map((msg) => {
          const isMe = msg.authorName === currentUser.name;

          if (msg.isSystem) {
            return (
              <div
                key={msg.id}
                className="p-2.5 rounded-xl bg-zinc-950 border border-[#00ff66]/40 text-center my-2 shadow-[0_0_15px_rgba(0,255,102,0.15)]"
              >
                <div className="text-[10px] font-mono text-[#00ff66] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>DJ BOOTH BROADCAST · {msg.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-white mt-1 leading-relaxed">
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col text-xs ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-zinc-400">
                <span className="font-bold text-white">{msg.authorName}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-900 border border-white/10 text-[#00ff66]">
                  {msg.authorBadge}
                </span>
                <span>·</span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  isMe
                    ? 'bg-[#00ff66] text-black font-semibold rounded-tr-none'
                    : 'bg-zinc-900 border border-white/10 text-zinc-100 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>

              {/* Like / Reaction on message */}
              <button
                onClick={() => onLikeMessage(msg.id)}
                className="flex items-center gap-1 mt-1 text-[10px] font-mono text-zinc-400 hover:text-[#00ff66] transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{msg.likes > 0 ? msg.likes : ''}</span>
              </button>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Bar */}
      <div className="px-4 py-2 bg-zinc-950 border-t border-white/5 flex items-center justify-between gap-1 text-sm">
        {['🔥', '⚡', '🐺', '🔊', '🚀', '💣'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleQuickReaction(emoji)}
            className="flex-1 py-1 rounded hover:bg-zinc-800 transition-colors text-center active:scale-125"
            title={`Schnellreaktion ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Schreibe im Room '${currentTrack.title}'...`}
          className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#00ff66] text-black text-xs font-black uppercase tracking-wider hover:bg-[#33ff88] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-[0_0_15px_rgba(0,255,102,0.3)] shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Senden</span>
        </button>
      </form>
    </aside>
  );
};
