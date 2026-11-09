import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Play, ExternalLink } from 'lucide-react';
import { SocialPost } from '../types';

interface SocialFeedSectionProps {
  posts: SocialPost[];
  onPlaySample: () => void;
}

export const SocialFeedSection: React.FC<SocialFeedSectionProps> = ({ posts, onPlaySample }) => {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, initialLikes: number) => {
    const isLiked = userLikedMap[id];
    setUserLikedMap({ ...userLikedMap, [id]: !isLiked });
    setLikesMap({
      ...likesMap,
      [id]: (likesMap[id] ?? initialLikes) + (isLiked ? -1 : 1),
    });
  };

  return (
    <section className="py-16 sm:py-24 border-b border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
              Social Pulse & Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Live aus dem Wolfpack Feed
            </h2>
            <p className="text-sm text-zinc-300 mt-2 max-w-xl">
              Backstage-Videos, Tour-Highlights, Track-Teaser und exklusives Behind-the-Scenes Material von
              Instagram, TikTok und X.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#00ff66]/15 text-zinc-200 hover:text-[#00ff66] text-xs font-bold border border-white/10 transition-colors"
            >
              <span>Instagram @djwulf</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#00ff66]/15 text-zinc-200 hover:text-[#00ff66] text-xs font-bold border border-white/10 transition-colors"
            >
              <span>TikTok @djwulf</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const currentLikes = likesMap[post.id] ?? post.likes;
            const isLiked = userLikedMap[post.id];

            return (
              <div
                key={post.id}
                className="rounded-2xl p-5 bg-zinc-950 border border-white/10 hover:border-[#00ff66]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-black border border-[#00ff66]/50 flex items-center justify-center text-[10px] font-black text-[#00ff66]">
                        WULF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{post.handle}</span>
                          <span className="text-[#00ff66]">✓</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 uppercase font-mono">{post.platform} · {post.postedAgo}</div>
                      </div>
                    </div>
                  </div>

                  {/* Media Visual with sample play option */}
                  <div
                    className="relative rounded-xl overflow-hidden aspect-4/3 bg-linear-to-br from-black via-zinc-900 to-black border border-white/10 p-4 flex flex-col justify-between mb-4 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase bg-black px-2 py-0.5 rounded text-white border border-white/10">
                        {post.mediaType}
                      </span>
                      {post.trackTag && (
                        <button
                          onClick={onPlaySample}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00ff66] text-black text-[10px] font-black shadow-md hover:bg-[#33ff88] transition-colors"
                          title="Track-Ausschnitt anhören"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>Sound hören</span>
                        </button>
                      )}
                    </div>

                    <div className="my-auto text-center">
                      <div className="w-12 h-12 rounded-full bg-black/80 border border-[#00ff66]/40 mx-auto flex items-center justify-center text-[#00ff66] backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-[#00ff66] ml-0.5" />
                      </div>
                    </div>

                    {post.trackTag && (
                      <div className="text-[11px] font-mono text-[#00ff66] font-bold truncate bg-black/80 px-2 py-1 rounded border border-[#00ff66]/30">
                        🎵 {post.trackTag}
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-zinc-200 leading-relaxed mb-4">
                    {post.caption}
                  </p>
                </div>

                {/* Engagement Bar */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400 tabular-nums">
                  <button
                    onClick={() => handleLike(post.id, post.likes)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      isLiked ? 'text-[#00ff66] font-bold' : 'hover:text-[#00ff66]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#00ff66]' : ''}`} />
                    <span>{currentLikes.toLocaleString('de-DE')}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-zinc-400" />
                    <span>{post.comments}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-zinc-400" />
                    <span>{post.shares}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
