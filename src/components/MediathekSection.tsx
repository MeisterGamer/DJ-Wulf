import React, { useState } from 'react';
import { Image as ImageIcon, Video, Heart, Download, Maximize2, MapPin, X } from 'lucide-react';
import { MediaItem } from '../types';
import { VisualArtwork } from './VisualArt';

interface MediathekSectionProps {
  mediaItems: MediaItem[];
  onLikeMedia: (id: string) => void;
  onOpenAdminPanel: () => void;
  isAdmin: boolean;
}

export const MediathekSection: React.FC<MediathekSectionProps> = ({
  mediaItems,
  onLikeMedia,
  onOpenAdminPanel,
  isAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'video'>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<MediaItem | null>(null);

  const categories = ['Alle', 'Festival', 'Club', 'Studio', 'Backstage'];

  const filteredMedia = mediaItems.filter((item) => {
    const matchesCat = selectedCategory === 'Alle' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesCat && matchesType;
  });

  const handleDownload = (item: MediaItem) => {
    const content = `DJ WULF PRESS ARCHIVE\nTitel: ${item.title}\nDatum: ${item.date}\nOrt: ${item.location}\nFotograf: ${item.photographer}\nLizenz: Kostenfreie redaktionelle Nutzung freigegeben.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DJ_WULF_${item.title.replace(/\s+/g, '_')}_PressKit.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="mediathek" className="py-16 sm:py-24 border-b border-white/10 bg-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
              Visual Archives
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Mediathek & Galerie
            </h2>
            <p className="text-sm text-zinc-300 mt-2 max-w-xl">
              Exklusive Einblicke vor und hinter die Kulissen: Festival-Mainstages, verschwitzte Club-Nächte,
              Patch-Sessions im Berliner Studio und Backstage-Momente.
            </p>
          </div>

          {/* Filters & Admin Action */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-white/10 rounded-xl text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedType === 'all' ? 'bg-[#00ff66] text-black' : 'text-zinc-300 hover:text-white'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setSelectedType('photo')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedType === 'photo' ? 'bg-[#00ff66] text-black' : 'text-zinc-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Fotos</span>
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedType === 'video' ? 'bg-[#00ff66] text-black' : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos</span>
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenAdminPanel}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#00ff66]/25 transition-colors"
              >
                + Mediathek verwalten
              </button>
            )}
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#00ff66] text-black shadow-sm'
                  : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Bento Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-[#00ff66]/50 transition-all flex flex-col justify-between"
            >
              {/* Media Visual Tile */}
              <div className="relative overflow-hidden cursor-pointer" onClick={() => setActiveLightboxItem(item)}>
                <VisualArtwork
                  type={item.svgIcon}
                  gradient={item.gradient}
                  aspect={item.aspectRatio}
                  title=""
                  className="transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#00ff66] border border-[#00ff66]/30">
                    {item.category}
                  </span>
                  {item.type === 'video' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-black flex items-center gap-1">
                      <Video className="w-3 h-3" /> Video
                    </span>
                  )}
                </div>

                {/* Hover overlay with Lightbox trigger */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <div className="p-2.5 rounded-full bg-[#00ff66] text-black shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Media Meta Details */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#00ff66] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                    <MapPin className="w-3 h-3 text-[#00ff66] shrink-0" />
                    <span className="truncate">{item.location}</span>
                    <span>·</span>
                    <span>{item.date}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-zinc-500 truncate max-w-[150px]">
                    Foto: {item.photographer}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLikeMedia(item.id)}
                      className="flex items-center gap-1 text-zinc-400 hover:text-[#00ff66] transition-colors"
                      title="Gefällt mir"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px] tabular-nums">{item.likes}</span>
                    </button>

                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                      title="Presse-Info herunterladen"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeLightboxItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <div className="relative max-w-4xl w-full bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{activeLightboxItem.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span className="text-[#00ff66] font-bold">{activeLightboxItem.category}</span>
                    <span>·</span>
                    <span>{activeLightboxItem.location}</span>
                    <span>·</span>
                    <span>{activeLightboxItem.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveLightboxItem(null)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Body */}
              <div className="p-6 flex-1 flex flex-col items-center justify-center bg-black overflow-y-auto">
                <VisualArtwork
                  type={activeLightboxItem.svgIcon}
                  gradient={activeLightboxItem.gradient}
                  aspect="16:9"
                  className="w-full max-w-2xl shadow-2xl"
                />

                <p className="text-sm text-zinc-300 mt-6 max-w-xl text-center leading-relaxed">
                  {activeLightboxItem.description}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-zinc-950 flex items-center justify-between text-xs">
                <div className="text-zinc-400">
                  Fotograf: <strong className="text-white">{activeLightboxItem.photographer}</strong>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLikeMedia(activeLightboxItem.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200 hover:text-[#00ff66] transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{activeLightboxItem.likes} Gefällt mir</span>
                  </button>
                  <button
                    onClick={() => handleDownload(activeLightboxItem)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00ff66] text-black font-black hover:bg-[#33ff88] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Presse-Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
