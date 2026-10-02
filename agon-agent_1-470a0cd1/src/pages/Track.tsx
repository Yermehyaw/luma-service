import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, CalendarDays, Clock3, Hourglass, MapPin, ScanLine, SearchX, Ticket, TriangleAlert } from 'lucide-react';
import { LumaMark, LumaSpinner } from '../components/LumaMark';
import { QueueRibbon } from '../components/TicketVisual';
import { Reveal } from '../components/ui';
import { apiGet, niceDate } from '../lib/api';
import type { Document, Ticket as TicketType, TicketStatus } from '../lib/types';

const STEPS: { key: TicketStatus[]; label: string; desc: string }[] = [
  { key: ['waiting'], label: 'Booked', desc: 'Window secured' },
  { key: ['waiting'], label: 'In queue', desc: 'Watch your position' },
  { key: ['called'], label: 'Called', desc: 'Head to your counter' },
  { key: ['serving'], label: 'At counter', desc: 'Being served' },
  { key: ['completed'], label: 'Done', desc: 'Day kept' },
];

function stepIndex(status: TicketStatus) {
  switch (status) {
    case 'waiting': return 1;
    case 'called': return 2;
    case 'serving': return 3;
    case 'completed': return 4;
    default: return -1;
  }
}

const STATUS_PILL: Record<TicketStatus, { bg: string; label: string }> = {
  waiting: { bg: 'bg-orange-100 text-orange-700', label: 'Waiting in queue' },
  called: { bg: 'bg-pink-100 text-pink-600', label: 'Being called now' },
  serving: { bg: 'bg-green-100 text-green-700', label: 'At the counter' },
  completed: { bg: 'bg-green-600 text-white', label: 'Completed' },
  noshow: { bg: 'bg-orange-100 text-orange-700', label: 'Missed window' },
  cancelled: { bg: 'bg-ink-100 text-ink-500', label: 'Cancelled' },
};

export default function Track() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get('code') ?? '');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (c: string) => {
    const clean = c.trim().toUpperCase();
    if (clean.length < 4) return;
    setLoading(true);
    setNotFound(false);
    setError('');
    try {
      const t = await apiGet<TicketType>(`/api/tickets?code=${encodeURIComponent(clean)}`);
      setTicket(t);
      apiGet<Document[]>(`/api/documents?ticket_code=${encodeURIComponent(t.code)}`)
        .then(setDocs)
        .catch(() => setDocs([]));
    } catch (err) {
      setTicket(null);
      if (err instanceof Error && err.message.includes('404')) setNotFound(true);
      else setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const c = params.get('code');
    if (c) lookup(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = ticket ? stepIndex(ticket.status) : -1;
  const docsVerified = docs.some((d) => d.status === 'verified');

  return (
    <div className="grad-hero min-h-screen pt-28 sm:pt-32">
      <div className="container-x max-w-2xl pb-24">
        <Reveal className="text-center">
          <span className="eyebrow"><span className="eyebrow-dot bg-pink-400" /> Live tracking</span>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.025em] text-ink-900 sm:text-[2.6rem]">
            Where's my ticket?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-500">
            Enter your ticket code to see live status, position and your exact arrival window.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={(e) => { e.preventDefault(); lookup(code); }}
            className="card mt-8 flex flex-col gap-3 !rounded-[26px] p-3 sm:flex-row sm:items-center"
            style={{ boxShadow: 'var(--shadow-lift)' }}
          >
            <div className="relative flex-1">
              <Ticket size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="LM-A042"
                maxLength={8}
                className="h-12 w-full rounded-2xl bg-cream-100/70 pl-11 pr-4 font-display text-lg font-bold uppercase tracking-[0.2em] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-4 focus:ring-orange-500/15"
                aria-label="Ticket code"
              />
            </div>
            <button className="btn btn-primary btn-md sm:btn-lg" disabled={loading || code.trim().length < 4}>
              {loading ? <LumaSpinner size={17} /> : <ScanLine size={17} />}
              {loading ? 'Checking…' : 'Track live'}
            </button>
          </form>
        </Reveal>

        {loading && (
          <div className="flex justify-center py-14">
            <LumaSpinner size={30} />
          </div>
        )}

        {notFound && !loading && (
          <Reveal>
            <div className="mt-8 flex flex-col items-center rounded-[26px] border-[1.5px] border-dashed border-pink-400/60 bg-pink-50 px-6 py-12 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600"><SearchX size={24} /></span>
              <p className="font-display text-lg font-bold text-ink-900">Ticket not found</p>
              <p className="mt-1.5 max-w-xs text-sm text-ink-500">No ticket with that code. Check the SMS or email we sent you and try again.</p>
              {error && <p className="mt-2 text-xs text-pink-600">{error}</p>}
            </div>
          </Reveal>
        )}

        {ticket && !loading && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
            {(ticket.status === 'noshow' || ticket.status === 'cancelled') && (
              <div className="mb-5 flex items-start gap-3 rounded-[22px] border border-orange-200 bg-orange-50 px-5 py-4">
                <TriangleAlert size={18} className="mt-0.5 shrink-0 text-orange-600" />
                <div>
                  <p className="font-display text-[15px] font-bold text-ink-900">
                    {ticket.status === 'noshow' ? 'This window was missed' : 'This ticket was cancelled'}
                  </p>
                  <p className="mt-1 text-[13.5px] text-ink-500">
                    No shame in it — re-booking takes 20 seconds.{' '}
                    <Link to="/book" className="font-bold text-orange-600 underline underline-offset-2">Book a new slot</Link>
                  </p>
                </div>
              </div>
            )}

            <div className="card overflow-hidden !rounded-[30px] p-0" style={{ boxShadow: 'var(--shadow-lift)' }}>
              <div className="flex items-center justify-between border-b border-dashed border-ink-900/10 bg-cream-50 px-6 py-4">
                <span className="flex items-center gap-2.5">
                  <LumaMark size={30} />
                  <span className="font-display text-[13px] font-bold text-ink-900">{ticket.institution_name}</span>
                </span>
                <span className={`pill ${STATUS_PILL[ticket.status].bg}`}>{STATUS_PILL[ticket.status].label}</span>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-[42px] font-extrabold leading-none tracking-[-0.03em] text-ink-900">
                      {ticket.code.slice(0, 3)}<span className="grad-text-warm">{ticket.code.slice(3)}</span>
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink-700">
                      <MapPin size={13} className="text-orange-600" /> {ticket.branch_name} · {ticket.service_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-300">
                      <CalendarDays size={12} /> Arrival window
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold text-ink-900">
                      {niceDate(ticket.visit_date)} · {ticket.window_start}–{ticket.window_end}
                    </p>
                  </div>
                </div>

                {/* progress stepper */}
                <div className="mt-7 flex items-center">
                  {STEPS.map((s, i) => {
                    const done = active >= i && active !== -1;
                    const current = active === i;
                    return (
                      <div key={s.label} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={`flex items-center justify-center rounded-full font-display text-[11px] font-extrabold transition-all ${
                              current
                                ? 'h-9 w-9 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[var(--shadow-orange)]'
                                : done
                                  ? 'h-7 w-7 bg-green-600 text-white'
                                  : 'h-7 w-7 bg-cream-100 text-ink-300'
                            }`}
                          >
                            {done && !current ? <BadgeCheck size={14} /> : i + 1}
                          </span>
                          <span className={`text-center text-[10px] font-bold uppercase tracking-wide ${current ? 'text-orange-600' : done ? 'text-green-700' : 'text-ink-300'}`}>
                            {s.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <span className={`mx-1 mb-5 h-[3px] flex-1 rounded-full ${active > i ? 'bg-green-500' : 'bg-ink-900/[0.08]'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {(ticket.status === 'waiting' || ticket.status === 'called') && (
                  <>
                    <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-cream-100 p-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">Queue position</p>
                        <p className="mt-1 font-display text-xl font-extrabold text-ink-900">#{ticket.position}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">Estimated wait</p>
                        <p className="mt-1 font-display text-xl font-extrabold text-orange-600">~{ticket.eta_min} min</p>
                      </div>
                    </div>
                    <QueueRibbon ahead={Math.min(9, ticket.position + 5)} me={Math.min(9, ticket.position)} className="mt-3" />
                  </>
                )}

                {docsVerified && (
                  <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-green-50 px-4 py-3">
                    <BadgeCheck size={16} className="shrink-0 text-green-600" />
                    <p className="text-[12.5px] font-semibold text-green-700">
                      Documents verified — skip the desk, go straight to {ticket.counter ? `counter ${ticket.counter}` : 'your counter'}.
                    </p>
                  </div>
                )}

                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
                  <Hourglass size={14} className="mt-0.5 shrink-0 text-orange-600" />
                  Arrive inside your window and you keep priority. Running late? Your ticket stays valid for 30 min
                  after the window.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/verify" className="btn btn-navy btn-md">Verify documents for this visit</Link>
              <Link to="/book" className="btn btn-outline btn-md">Book another ticket</Link>
            </div>
          </motion.div>
        )}

        {!ticket && !loading && !notFound && (
          <Reveal delay={0.15} className="mt-10 text-center">
            <p className="text-[13px] text-ink-300">
              Tip: your code looks like <b className="font-display text-ink-500">LM-A042</b> and lives in your confirmation SMS.
            </p>
            <Clock3 size={1} className="hidden" />
          </Reveal>
        )}
      </div>
    </div>
  );
}
