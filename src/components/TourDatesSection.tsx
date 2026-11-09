import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Check, Download } from 'lucide-react';
import { TourDate } from '../types';

interface TourDatesSectionProps {
  tourDates: TourDate[];
  rsvpTourIds: string[];
  onToggleRsvp: (tourId: string) => void;
  onOpenBooking: () => void;
}

export const TourDatesSection: React.FC<TourDatesSectionProps> = ({
  tourDates,
  rsvpTourIds,
  onToggleRsvp,
  onOpenBooking,
}) => {
  const [filterType, setFilterType] = useState<string>('Alle');

  const filterOptions = ['Alle', 'Club', 'Festival'];

  const filteredDates =
    filterType === 'Alle'
      ? tourDates
      : tourDates.filter((t) => t.type === filterType);

  const downloadIcs = (gig: TourDate) => {
    const startDate = gig.isoDate.replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DJ WULF//Tour Event//DE
BEGIN:VEVENT
UID:${gig.id}@djwulf.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
SUMMARY:DJ Wulf @ ${gig.venue} (${gig.city})
DESCRIPTION:${gig.eventName} - Stage Time: ${gig.stageTime}
LOCATION:${gig.venue}, ${gig.city}, ${gig.country}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DJ_WULF_${gig.city.toUpperCase()}_${gig.dayNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="tour" className="py-16 sm:py-24 border-b border-white/10 bg-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-[#00ff66] mb-2">
              Live & Gigs
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tourdaten 2026 / 2027
            </h2>
            <p className="text-sm text-zinc-300 mt-2 max-w-xl">
              Erlebe das Wolfpack live. Von legendären Berliner Club-Nächten bis zu gigantischen
              Festival-Bühnen. Sichere dir Tickets oder setze dich auf die Gästeliste.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-white/10 rounded-xl">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilterType(opt)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  filterType === opt
                    ? 'bg-[#00ff66] text-black shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Dates List */}
        <div className="space-y-3">
          {filteredDates.map((gig) => {
            const isRsvpd = rsvpTourIds.includes(gig.id);
            const isSoldOut = gig.ticketStatus === 'Ausverkauft';

            return (
              <div
                key={gig.id}
                className="group rounded-xl p-4 sm:p-5 bg-zinc-950 border border-white/10 hover:border-[#00ff66]/40 hover:bg-zinc-900/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Date & Location */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  {/* Date Badge Box */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-black border border-white/10 flex flex-col items-center justify-center shrink-0 group-hover:border-[#00ff66]/50 transition-colors">
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#00ff66] leading-none">
                      {gig.dayNumber}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-1">
                      {gig.monthYear}
                    </span>
                  </div>

                  {/* Gig Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                      <span className="text-white font-bold">{gig.type}</span>
                      <span>·</span>
                      <span>Stage Time: {gig.stageTime}</span>
                      {gig.ticketPrice && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-zinc-300">{gig.ticketPrice}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5 truncate">
                      {gig.city}, {gig.country}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-zinc-300 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
                      <span className="font-bold text-white">{gig.venue}</span>
                      <span className="text-zinc-600">—</span>
                      <span className="text-zinc-400 truncate">{gig.eventName}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      gig.ticketStatus === 'Ausverkauft'
                        ? 'text-zinc-500 bg-zinc-900 border border-zinc-800'
                        : gig.ticketStatus === 'Fast Ausverkauft'
                        ? 'text-yellow-400 bg-yellow-950/40 border border-yellow-900/30'
                        : 'text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30'
                    }`}
                  >
                    {gig.ticketStatus}
                  </span>

                  {/* Add to Calendar Button */}
                  <button
                    onClick={() => downloadIcs(gig)}
                    className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="In Kalender (.ics) speichern"
                    aria-label={`${gig.city} Gig in Kalender speichern`}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* RSVP Button */}
                  <button
                    onClick={() => onToggleRsvp(gig.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      isRsvpd
                        ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]'
                        : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {isRsvpd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                        <span>Dabei!</span>
                      </>
                    ) : (
                      <span>RSVP</span>
                    )}
                  </button>

                  {/* Ticket Buy or Waitlist Link */}
                  {isSoldOut ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-600 bg-zinc-900 border border-zinc-800 cursor-not-allowed"
                    >
                      Ausverkauft
                    </button>
                  ) : (
                    <a
                      href={gig.ticketUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider text-black bg-[#00ff66] hover:bg-[#33ff88] transition-colors shadow-sm"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{gig.ticketStatus === 'Gästeliste' ? 'Gästeliste' : 'Tickets'}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Promoter Booking Teaser banner */}
        <div className="mt-8 p-6 rounded-2xl bg-zinc-950 border border-[#00ff66]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Veranstalter oder Club-Betreiber?</h4>
            <p className="text-xs text-zinc-300 mt-0.5">
              Buche DJ Wulf für Festivals, Club-Nächte, Corporate Events oder Special Showcases.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-[#00ff66] hover:bg-[#33ff88] transition-colors shrink-0 shadow-lg"
          >
            Booking anfragen
          </button>
        </div>
      </div>
    </section>
  );
};
