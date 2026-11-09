import React, { useState, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  PlusCircle,
  Pin,
  ThumbsUp,
  Eye,
  Bookmark,
  Send,
  X,
  Filter
} from 'lucide-react';
import { ForumThread, UserProfile } from '../types';

interface ForumSectionProps {
  threads: ForumThread[];
  currentUser: UserProfile;
  onAddThread: (newThread: Omit<ForumThread, 'id' | 'createdAt' | 'repliesCount' | 'viewsCount' | 'likesCount' | 'replies'>) => void;
  onAddReply: (threadId: string, replyContent: string) => void;
  onLikeThread: (threadId: string) => void;
  bookmarkedThreadIds: string[];
  onToggleBookmark: (threadId: string) => void;
}

export const ForumSection: React.FC<ForumSectionProps> = ({
  threads,
  currentUser,
  onAddThread,
  onAddReply,
  onLikeThread,
  bookmarkedThreadIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumThread['category']>('Track IDs & IDs');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // Reply State
  const [replyInput, setReplyInput] = useState('');

  const categories = [
    'Alle',
    'Track IDs & IDs',
    'Tour & Meetups',
    'Studio & Gear',
    'Wolfpack Lounge',
    'Remix Contest'
  ];

  const filteredThreads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return threads.filter((t) => {
      if (selectedCategory !== 'Alle' && t.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      const titleMatch = t.title.toLowerCase().includes(q);
      const contentMatch = t.content.toLowerCase().includes(q);
      const authorMatch = t.authorName.toLowerCase().includes(q);
      const tagMatch = t.tags.some((tag) => tag.toLowerCase().includes(q));
      const repliesMatch = t.replies.some(
        (r) => r.content.toLowerCase().includes(q) || r.authorName.toLowerCase().includes(q)
      );

      return titleMatch || contentMatch || authorMatch || tagMatch || repliesMatch;
    });
  }, [threads, searchQuery, selectedCategory]);

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onAddThread({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      authorName: currentUser.name,
      authorBadge: currentUser.badge,
      authorAvatar: currentUser.avatarSeed,
      tags: tagsArray.length > 0 ? tagsArray : ['Wolfpack'],
    });

    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowNewThreadModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThread) return;

    onAddReply(activeThread.id, replyInput.trim());
    setReplyInput('');

    const updated = threads.find((t) => t.id === activeThread.id);
    if (updated) {
      setActiveThread(updated);
    }
  };

  const currentActiveThread = activeThread
    ? threads.find((t) => t.id === activeThread.id) || activeThread
    : null;

  return (
    <section id="community" className="py-16 sm:py-24 border-b border-white/10 bg-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
              Wolfpack Community
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Forum & Fan-Interaktion
            </h2>
            <p className="text-sm text-zinc-300 mt-2 max-w-xl">
              Der direkte Treffpunkt für Fans, DJs und Produzenten: Suche nach seltenen Track-IDs, plane
              Festival-Meetups, diskutiere Synth-Technik oder lade Stems für den Remix-Contest herunter.
            </p>
          </div>

          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-[#00ff66] hover:bg-[#33ff88] transition-colors shadow-[0_0_15px_rgba(0,255,102,0.3)] self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Neues Thema erstellen</span>
          </button>
        </div>

        {/* Volltext-Suche & Filterleiste */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-white/10 mb-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Volltextsuche: Track-IDs, Gigs, Synthesizer, Berlin, Remix, Nutzer..."
              className="w-full pl-11 pr-10 py-3 bg-black border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕ Löschen
              </button>
            )}
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#00ff66]" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#00ff66] text-black shadow-sm'
                    : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {searchQuery && (
            <div className="text-xs text-zinc-400 flex items-center gap-2 pt-1 border-t border-white/10">
              <span>Suchergebnisse für:</span>
              <strong className="text-[#00ff66]">"{searchQuery}"</strong>
              <span>({filteredThreads.length} Treffer)</span>
            </div>
          )}
        </div>

        {/* Forum Threads List */}
        <div className="space-y-3">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-16 bg-zinc-950 rounded-2xl border border-white/10 p-8">
              <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Keine passenden Diskussionen gefunden</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Deine Volltextsuche ergab keine Treffer. Versuche einen anderen Begriff oder eröffne das
                erste Thema zu dieser Frage!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Alle');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-[#00ff66] border border-white/10 font-bold"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isBookmarked = bookmarkedThreadIds.includes(thread.id);

              return (
                <div
                  key={thread.id}
                  className={`group rounded-xl p-4 sm:p-5 bg-zinc-950 border transition-all cursor-pointer ${
                    thread.isPinned
                      ? 'border-[#00ff66]/40 bg-zinc-900/60'
                      : 'border-white/10 hover:border-[#00ff66]/40 hover:bg-zinc-900'
                  }`}
                  onClick={() => setActiveThread(thread)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-black border border-[#00ff66]/60 text-[#00ff66] font-black text-xs flex items-center justify-center shrink-0">
                        {thread.authorAvatar}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          {thread.isPinned && (
                            <span className="text-[#00ff66] font-black flex items-center gap-1">
                              <Pin className="w-3 h-3" /> Angeheftet
                            </span>
                          )}
                          <span className="text-white font-bold">{thread.authorName}</span>
                          <span>·</span>
                          <span className="text-[#00ff66] font-semibold">{thread.authorBadge}</span>
                          <span>·</span>
                          <span>{thread.category}</span>
                          <span>·</span>
                          <span>{thread.createdAt}</span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-[#00ff66] transition-colors mt-1">
                          {thread.title}
                        </h3>

                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {thread.content}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {thread.tags.map((tag) => (
                            <span key={tag} className="text-[11px] text-[#00ff66] font-mono font-bold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="flex items-center gap-1.5" title="Antworten">
                        <MessageSquare className="w-3.5 h-3.5 text-[#00ff66]" />
                        <span className="tabular-nums font-bold text-white">
                          {thread.replies.length || thread.repliesCount}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5" title="Aufrufe">
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="tabular-nums">{thread.viewsCount}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeThread(thread.id);
                        }}
                        className="flex items-center gap-1 text-zinc-400 hover:text-[#00ff66] transition-colors"
                        title="Thema liken"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{thread.likesCount}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(thread.id);
                        }}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          isBookmarked ? 'text-[#00ff66]' : 'text-zinc-400'
                        }`}
                        title="Lesezeichen setzen"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#00ff66]' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Thread Detail Modal */}
        {currentActiveThread && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <div className="relative max-w-3xl w-full bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                    <span className="text-[#00ff66] font-bold">{currentActiveThread.category}</span>
                    <span>·</span>
                    <span>{currentActiveThread.createdAt}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {currentActiveThread.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveThread(null)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-black/40">
                <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-black border border-[#00ff66] flex items-center justify-center text-[#00ff66] text-xs font-black">
                      {currentActiveThread.authorAvatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{currentActiveThread.authorName}</span>
                        <span className="text-[11px] font-bold text-[#00ff66] bg-black px-2 py-0.5 rounded border border-[#00ff66]/40">
                          {currentActiveThread.authorBadge}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400">Themen-Ersteller</div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                    {currentActiveThread.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex gap-2 font-mono">
                      {currentActiveThread.tags.map((tg) => (
                        <span key={tg} className="text-[#00ff66] font-bold">
                          #{tg}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => onLikeThread(currentActiveThread.id)}
                      className="flex items-center gap-1.5 text-[#00ff66] hover:underline"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{currentActiveThread.likesCount} Gefällt mir</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Antworten ({currentActiveThread.replies.length})
                  </h4>
                </div>

                <div className="space-y-3">
                  {currentActiveThread.replies.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">Noch keine Antworten. Schreibe die erste Antwort!</p>
                  ) : (
                    currentActiveThread.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className={`p-3.5 rounded-xl border text-xs ${
                          rep.authorBadge === 'Producer'
                            ? 'bg-black border-[#00ff66]/50'
                            : 'bg-zinc-900 border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{rep.authorName}</span>
                            <span className="text-[10px] text-[#00ff66] px-1.5 py-0.5 rounded bg-zinc-950 font-bold border border-[#00ff66]/30">
                              {rep.authorBadge}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-400">{rep.createdAt}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{rep.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <form onSubmit={handleSendReply} className="p-4 border-t border-white/10 bg-zinc-950 flex gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder={`Antworte als ${currentUser.name}...`}
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                />
                <button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#00ff66] text-black text-xs font-black uppercase tracking-wider hover:bg-[#33ff88] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Senden</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Create New Thread Modal */}
        {showNewThreadModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-xl w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#00ff66]" />
                  Neues Thema im Wolfpack Forum eröffnen
                </h3>
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Kategorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ForumThread['category'])}
                    className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00ff66]"
                  >
                    <option value="Track IDs & IDs">Track IDs & Set-Suche</option>
                    <option value="Tour & Meetups">Tour & Meetups</option>
                    <option value="Studio & Gear">Studio & Gear (Synthesizer, Ableton)</option>
                    <option value="Wolfpack Lounge">Wolfpack Lounge (Allgemeiner Austausch)</option>
                    <option value="Remix Contest">Remix Contest</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Titel des Themas *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="z.B. Track ID aus dem Amsterdam Set gesucht..."
                    className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Dein Beitrag *</label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Beschreibe deine Frage, dein Erlebnis oder dein Anliegen..."
                    className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Tags (kommagetrennt)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Berlin, TrackID, Festival, Modular"
                    className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewThreadModal(false)}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#00ff66] text-black font-black uppercase tracking-wider hover:bg-[#33ff88] shadow-md"
                  >
                    Thema veröffentlichen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
