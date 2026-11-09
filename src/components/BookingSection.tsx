import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Download, FileText } from 'lucide-react';
import { BookingInquiry } from '../types';

interface BookingSectionProps {
  onAddBooking: (booking: Omit<BookingInquiry, 'id' | 'status' | 'submittedAt'>) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ onAddBooking }) => {
  const [organizerName, setOrganizerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<BookingInquiry['eventType']>('Club Night');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [expectedGuests, setExpectedGuests] = useState('500 - 1.000');
  const [budgetBracket, setBudgetBracket] = useState('5.000 € - 7.500 €');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerName || !email || !eventName || !eventDate || !location) return;

    onAddBooking({
      organizerName,
      email,
      phone,
      eventName,
      eventType,
      eventDate,
      location,
      expectedGuests,
      budgetBracket,
      message,
    });

    setIsSubmitted(true);
  };

  const handleDownloadRider = () => {
    const riderText = `DJ WULF - OFFICIAL TECHNICAL & HOSPITALITY RIDER 2026/2027

1. DJ BOOTH SETUP:
- 3x Pioneer CDJ-3000 (connected via Pro DJ Link Hub)
- 1x Pioneer DJM-V10 or DJM-900NXS2 mixer
- 2x High-end active booth monitors with separate booth volume control
- 1x Shure SM58 wireless microphone

2. SOUND & LIGHTING:
- Main PA capable of 105 dB undistorted at FOH with clean sub-bass coverage down to 30 Hz
- Atmospheric haze/smoke machine (water-based)
- Synchronized laser array preferred

3. HOSPITALITY:
- 4x Still water (room temperature)
- 2x Sugarfree energy drinks
- Clean hand towels
- Secure backstage dressing room with Wi-Fi

Booking Contact: management@djwulf.com`;

    const blob = new Blob([riderText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DJ_WULF_Technical_Rider_2026.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="booking" className="py-16 sm:py-24 border-b border-white/10 bg-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Booking Info & Technical Rider */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
                Booking & Management
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                DJ Wulf für dein Event anfragen
              </h2>
              <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
                Ob Festival-Headliner, Club-Nacht, exklusives Secret Showcase oder internationales Booking:
                Unser Management beantwortet Anfragen in der Regel innerhalb von 24–48 Stunden.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] text-[#00ff66]">
                Direkter Kontakt Management
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Mail className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>booking@djwulf.com</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Phone className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>+49 (0) 30 892 411 00 (Agentur Berlin)</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>Wolfpack Music & Management, Kreuzberg, Berlin</span>
              </div>
            </div>

            {/* Technical Rider Download Box */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Technischer Rider (2026/27)</div>
                  <div className="text-[11px] text-zinc-400">Pioneer CDJ-3000, DJM-V10, Monitore</div>
                </div>
              </div>

              <button
                onClick={handleDownloadRider}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-[#00ff66] transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Rider PDF/TXT</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-6 sm:p-8 bg-zinc-950 border border-white/10 shadow-xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#00ff66]/20 border border-[#00ff66]/50 text-[#00ff66] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Anfrage erfolgreich übermittelt!</h3>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Vielen Dank für deine Booking-Anfrage für <strong className="text-white">{eventName}</strong>.
                    Unser Booking-Team prüft deinen Terminplan und meldet sich umgehend mit Verfügbarkeit und
                    Gagenstruktur.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition-colors"
                  >
                    Weitere Anfrage senden
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">
                        Veranstalter / Agentur *
                      </label>
                      <input
                        type="text"
                        required
                        value={organizerName}
                        onChange={(e) => setOrganizerName(e.target.value)}
                        placeholder="z.B. Rave Culture Events GmbH"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">E-Mail-Adresse *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="booking@veranstalter.de"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Telefonnummer</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+49 171 1234567"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Event-Format *</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as BookingInquiry['eventType'])}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ff66]"
                      >
                        <option value="Club Night">Club Night (Resident / Headliner)</option>
                        <option value="Festival">Festival Mainstage / Techno Tent</option>
                        <option value="Open Air">Open Air Rave</option>
                        <option value="Corporate">Corporate / Fashion Week Showcase</option>
                        <option value="Private">Private Exclusive Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Name des Events *</label>
                      <input
                        type="text"
                        required
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="z.B. Neon Horizon Open Air 2027"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Event-Datum *</label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ff66]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Ort & Location *</label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="z.B. München, Zenith Halle"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">Erwartete Besucher</label>
                      <select
                        value={expectedGuests}
                        onChange={(e) => setExpectedGuests(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ff66]"
                      >
                        <option value="Unter 500">Unter 500 Gäste</option>
                        <option value="500 - 1.500">500 - 1.500 Gäste (Intimer Club)</option>
                        <option value="1.500 - 5.000">1.500 - 5.000 Gäste (Halle / Stage)</option>
                        <option value="5.000 - 20.000+">5.000 - 20.000+ Gäste (Großes Festival)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">
                      Zusätzliche Wünsche, Set-Länge & Infos
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Details zur Bühne, gewünschte Spielzeit (z.B. 90-120 Min), Co-Headliner..."
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00ff66] text-black text-xs font-black uppercase tracking-wider hover:bg-[#33ff88] transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Verbindliche Anfrage absenden</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
