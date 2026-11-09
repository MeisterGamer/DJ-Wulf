import React, { useState } from 'react';
import { CheckCircle2, Download, Gift, ShieldCheck, ArrowRight } from 'lucide-react';
import { WolfEmblem } from './VisualArt';

interface NewsletterSectionProps {
  onSubscribe: (email: string, name: string) => void;
  isAlreadySubscribed: boolean;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  onSubscribe,
  isAlreadySubscribed,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(isAlreadySubscribed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    onSubscribe(email, name || 'Wolfpack Member');
    setSubmitted(true);
  };

  const handleDownloadBootleg = () => {
    const content = `DJ WULF EXCLUSIVE VIP BOOTLEG DOWNLOAD LINK\nTrack: Silence of the Pack (VIP Club Cut - 24bit WAV)\nBPM: 128 | Key: F Minor\nRelease: Exklusiv für Wolfpack Newsletter Abonnenten.\n\nVielen Dank für deine Unterstützung im Rudel!`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DJ_WULF_Silence_Of_The_Pack_VIP_Bootleg.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section className="py-16 sm:py-24 border-b border-white/10 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,102,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl p-8 sm:p-12 bg-zinc-950 border border-[#00ff66]/40 shadow-[0_0_50px_rgba(0,255,102,0.15)]">
          <div className="max-w-2xl mx-auto text-center">
            {/* Wolfpack Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <WolfEmblem className="w-8 h-8" />
            </div>

            <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
              Wolfpack VIP Fanbindung
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Werde Teil des Rudels & sichere dir unveröffentlichte Musik
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed mb-8">
              Abonnenten erhalten vor allen anderen exklusiven Pre-Sale Zugang zu Club-Tickets, geheime
              Gästelisten-Verlosungen und monatliche VIP-Edits & Bootlegs direkt ins Postfach. Kein Spam.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-black border border-[#00ff66] text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#00ff66] font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-[#00ff66]" />
                  <span>Willkommen im Rudel! Dein VIP-Zugang ist aktiviert.</span>
                </div>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  Als Dankeschön steht dein kostenloser Download von{' '}
                  <strong className="text-white">"Silence of the Pack (VIP Club Cut)"</strong> sofort bereit:
                </p>
                <button
                  onClick={handleDownloadBootleg}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ff66] text-black font-black text-xs uppercase tracking-wider hover:bg-[#33ff88] transition-colors shadow-[0_0_20px_rgba(0,255,102,0.4)]"
                >
                  <Download className="w-4 h-4" />
                  <span>VIP Bootleg herunterladen (Free WAV/MP3)</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dein Vorname"
                    className="sm:w-44 px-4 py-3 bg-black border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Deine E-Mail-Adresse"
                    className="flex-1 max-w-md px-4 py-3 bg-black border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#00ff66] text-black font-black text-xs uppercase tracking-wider hover:bg-[#33ff88] transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>Beitreten</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-400 pt-2">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-[#00ff66]" /> Sofort-Download inklusive
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66]" /> Jederzeit abbestellbar
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
