import React from 'react';

export const WolfEmblem: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 4L34 16L40 28L36 44L24 38L12 44L8 28L14 16L24 4Z"
      className="stroke-[#00ff66]"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M24 4V38M14 16L24 24L34 16M8 28L24 38L40 28"
      className="stroke-[#00ff66]/60"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="22" r="1.5" className="fill-white" />
    <circle cx="29" cy="22" r="1.5" className="fill-white" />
    <path d="M21 30L24 33L27 30" className="stroke-[#00ff66]" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface ArtworkProps {
  type: 'stage' | 'turntable' | 'synth' | 'crowd' | 'laser' | 'album' | 'vinyl';
  title?: string;
  gradient?: string;
  className?: string;
  aspect?: '16:9' | '4:3' | '1:1';
}

export const VisualArtwork: React.FC<ArtworkProps> = ({
  type,
  title,
  gradient = 'from-black via-zinc-950 to-black',
  className = '',
  aspect = '16:9'
}) => {
  const aspectClass =
    aspect === '16:9' ? 'aspect-video' : aspect === '1:1' ? 'aspect-square' : 'aspect-4/3';

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-linear-to-br ${gradient} border border-white/10 ${aspectClass} ${className} group`}
    >
      {/* Background neon green glow mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,102,0.14),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:24px_24px] pointer-events-none" />

      {/* Domain artistic vectors */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {type === 'stage' && (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-40 opacity-85" fill="none">
            {/* Festival lasers */}
            <line x1="100" y1="100" x2="10" y2="10" stroke="url(#neonGreenLaser)" strokeWidth="2" />
            <line x1="100" y1="100" x2="60" y2="5" stroke="url(#neonGreenLaser)" strokeWidth="1.5" />
            <line x1="100" y1="100" x2="140" y2="5" stroke="url(#neonGreenLaser)" strokeWidth="1.5" />
            <line x1="100" y1="100" x2="190" y2="10" stroke="url(#neonGreenLaser)" strokeWidth="2" />
            {/* Stage Truss */}
            <rect x="70" y="70" width="60" height="30" rx="4" fill="#09090b" stroke="#00ff66" strokeWidth="1.5" />
            {/* Crowd Silhouette */}
            <path
              d="M0 120 C 30 100, 60 115, 90 95 C 110 115, 140 100, 200 115 L 200 120 Z"
              fill="#000000"
            />
            {/* Hands raised */}
            <path d="M40 100 L43 90 M47 98 L50 88 M150 100 L148 88 M158 98 L160 86" stroke="#00ff66" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="neonGreenLaser" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00ff66" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00ff66" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {type === 'turntable' && (
          <div className="relative flex items-center justify-center">
            {/* Vinyl record platter */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-linear-to-tr from-black via-zinc-900 to-black border-4 border-zinc-700/60 shadow-2xl flex items-center justify-center group-hover:rotate-45 transition-transform duration-700">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-[#00ff66]/30 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00ff66]/20 border-2 border-[#00ff66] flex items-center justify-center">
                  <WolfEmblem className="w-5 h-5" />
                </div>
              </div>
            </div>
            {/* Tone arm */}
            <div className="absolute -top-3 -right-3 w-12 h-20 border-r-2 border-t-2 border-[#00ff66]/80 rounded-tr-lg transform rotate-12" />
          </div>
        )}

        {type === 'synth' && (
          <svg viewBox="0 0 160 100" className="w-full h-full max-h-36 opacity-85" fill="none">
            {/* Modular rack */}
            <rect x="10" y="10" width="140" height="80" rx="6" fill="#09090b" stroke="#27272a" strokeWidth="2" />
            {/* Patch cables */}
            <path d="M30 35 C 40 70, 70 75, 80 40" stroke="#00ff66" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M60 40 C 70 85, 110 80, 120 40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Dials & Jacks */}
            <circle cx="30" cy="35" r="5" fill="#18181b" stroke="#00ff66" strokeWidth="1.5" />
            <circle cx="80" cy="40" r="5" fill="#18181b" stroke="#00ff66" strokeWidth="1.5" />
            <circle cx="60" cy="40" r="5" fill="#18181b" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="120" cy="40" r="5" fill="#18181b" stroke="#ffffff" strokeWidth="1.5" />
            {/* VU Meter LEDs */}
            <rect x="25" y="65" width="4" height="12" fill="#00ff66" />
            <rect x="33" y="65" width="4" height="12" fill="#00ff66" />
            <rect x="41" y="65" width="4" height="12" fill="#00ff66" />
            <rect x="49" y="65" width="4" height="12" fill="#ffffff" />
          </svg>
        )}

        {type === 'laser' && (
          <svg viewBox="0 0 160 100" className="w-full h-full max-h-36" fill="none">
            <line x1="0" y1="0" x2="160" y2="100" stroke="#00ff66" strokeWidth="2" />
            <line x1="160" y1="0" x2="0" y2="100" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="80" cy="50" r="24" stroke="#00ff66" strokeWidth="1.5" className="animate-pulse" />
            <circle cx="80" cy="50" r="8" fill="#ffffff" />
          </svg>
        )}

        {type === 'crowd' && (
          <svg viewBox="0 0 160 90" className="w-full h-full max-h-36" fill="none">
            <path
              d="M0 90 Q 20 60, 40 85 T 80 75 T 120 85 T 160 70 L 160 90 Z"
              fill="#09090b"
            />
            {/* Beams */}
            <polygon points="80,0 20,90 40,90" fill="url(#crowdNeon1)" />
            <polygon points="80,0 120,90 140,90" fill="url(#crowdNeon2)" />
            <defs>
              <linearGradient id="crowdNeon1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff66" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00ff66" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="crowdNeon2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {(type === 'album' || type === 'vinyl') && (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <WolfEmblem className="w-10 h-10" />
            </div>
            <span className="text-xs font-black tracking-widest text-[#00ff66] uppercase">
              DJ WULF
            </span>
          </div>
        )}
      </div>

      {/* Title overlay footer */}
      {title && (
        <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black via-black/60 to-transparent">
          <p className="text-xs font-medium text-white truncate">{title}</p>
        </div>
      )}
    </div>
  );
};
