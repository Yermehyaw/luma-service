import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, BellRing, Building2, Check, ChevronDown, FileCheck2,
  GraduationCap, HeartPulse, Landmark, Megaphone, MessageSquareHeart, Minus, PiggyBank,
  ScanLine, ShieldCheck, Sparkles, Ticket, Timer,
} from 'lucide-react';
import TicketVisual, { QueueRibbon } from '../components/TicketVisual';
import { LumaMotif } from '../components/LumaMark';
import { Avatar, LoadBadge, Reveal, SectionHead, Skeleton, Stars } from '../components/ui';
import { apiGet } from '../lib/api';
import type { Institution, Stats, Testimonial } from '../lib/types';

/* ================= HERO ================= */

const TICKER = [
  ['#F45B16', 'LM-A042 called to Counter 3 · Sterling Ikeja'],
  ['#12A05A', 'Amara checked in 2 min early · 11 min door-to-teller'],
  ['#202957', 'Lagoon Hospitals · lab queue now calm'],
  ['#DB6FA0', '94 documents verified overnight · UNILAG'],
  ['#F45B16', 'LM-C118 completed · Aga Khan, Nairobi'],
  ['#12A05A', 'Nairobi County · licence renewals at 9 min wait'],
  ['#202957', 'Makerere transcripts · zero walk-in queue today'],
  ['#DB6FA0', 'Saturday pilot cut waits 78% · Union Bank Lekki'],
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-ink-900/[0.06] bg-white/70 py-3 backdrop-blur">
      <div className="animate-marquee flex w-max items-center gap-10 pr-10">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-2.5 text-[12.5px] font-semibold text-ink-500">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: t[0] }} />
            {t[1]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================= OLD WAY / LUMA WAY ================= */

function Comparison() {
  const oldWay = [
    'Arrive at dawn and take a paper number',
    'Wait for hours with no visibility on progress',
    'Get turned away for missing or invalid documents',
    'No way to know which counter is faster',
  ];
  const lumaWay = [
    'Book a timed arrival window in under a minute',
    'Live wait estimates and SMS reminders before you leave',
    'Verify documents from home, arrive pre-cleared',
    'Called by code the moment your counter is ready',
  ];
  return (
    <section className="container-x py-20 lg:py-24">
      <Reveal>
        <SectionHead
          eyebrow="The shift"
          dot="#DB6FA0"
          title={<>Timing beats queuing, <span className="grad-text-warm">every time</span></>}
          sub="The old way: arrive at dawn, take a paper number, wait all morning. The Luma way: book in 60 seconds, verify from your couch, arrive in your window."
        />
      </Reveal>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Reveal delay={0.05}>
          <div className="grad-band-pink relative h-full overflow-hidden rounded-[30px] border border-pink-200/60 p-8">
            <LumaMotif variant="c" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-40" />
            <p className="pill bg-pink-100 text-pink-600"><Minus size={13} /> The old way</p>
            <ul className="mt-6 space-y-4">
              {oldWay.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] font-medium text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-200 text-pink-600">
                    <Minus size={13} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-7 font-display text-sm font-bold text-pink-600">Average morning lost: 3 h 40 min</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="grad-band-green relative h-full overflow-hidden rounded-[30px] border border-green-200/70 p-8">
            <LumaMotif variant="b" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-50" />
            <p className="pill bg-green-600 text-white"><Check size={13} strokeWidth={3} /> The Luma way</p>
            <ul className="mt-6 space-y-4">
              {lumaWay.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] font-semibold text-ink-900">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-7 font-display text-sm font-bold text-green-700">Average errand on Luma: 11 minutes</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= FEATURES ================= */

const FEATURES = [
  {
    icon: Timer, tint: '#FF8A00', bg: 'bg-orange-100', fg: 'text-orange-600',
    title: 'Timed arrival windows',
    body: 'Every errand gets a 30-minute window. Arrive inside it and you keep priority — no paper numbers, no guessing.',
  },
  {
    icon: FileCheck2, tint: '#12A05A', bg: 'bg-green-100', fg: 'text-green-600',
    title: 'Home document verification',
    body: 'Upload IDs and papers the night before. Verified visitors skip the desk and walk straight to their counter.',
  },
  {
    icon: ScanLine, tint: '#202957', bg: 'bg-navy-100', fg: 'text-navy-900',
    title: 'Smart queue board',
    body: 'Branch load, live positions and estimated waits — visible on your phone, at the door, and on branch displays.',
  },
  {
    icon: BellRing, tint: '#F45B16', bg: 'bg-orange-100', fg: 'text-orange-600',
    title: 'Call-ahead reminders',
    body: 'SMS and push nudges time your journey perfectly. Running late? Your ticket holds for a 30-minute grace.',
  },
  {
    icon: Megaphone, tint: '#DB6FA0', bg: 'bg-pink-100', fg: 'text-pink-600',
    title: 'Branch collaboration',
    body: 'Playbooks, templates and broadcasts shared across every branch. A lesson learned once, applies everywhere.',
  },
  {
    icon: MessageSquareHeart, tint: '#12A05A', bg: 'bg-green-100', fg: 'text-green-600',
    title: 'Social care windows',
    body: 'Priority slots for the elderly and accessible queues — public accountability built into every branch.',
  },
];

function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-cream-100 py-20 lg:py-24">
      <LumaMotif className="pointer-events-none absolute -left-24 top-10 h-64 w-64 opacity-60" />
      <LumaMotif variant="b" className="pointer-events-none absolute -right-20 bottom-16 h-56 w-56 opacity-60" />
      <div className="container-x relative">
        <Reveal>
          <SectionHead
            eyebrow="Features"
            title="One platform, every reason people wait"
            sub="Timed tickets, home verification and a live queue engine — designed for banks, schools, hospitals and civic offices that respect people's time."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={0.04 * (i % 3)}>
              <div className="card card-hover group h-full p-7">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg} ${f.fg} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105`}>
                  <f.icon size={21} strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 font-display text-[17.5px] font-bold tracking-tight text-ink-900">{f.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{f.body}</p>
                <span className="mt-5 block h-1 w-10 rounded-full transition-all duration-300 group-hover:w-16" style={{ background: f.tint }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= HOW IT WORKS ================= */

const STEPS = [
  { icon: Landmark, tint: '#FF8A00', title: 'Choose institution & service', body: 'Pick a bank, school, hospital or civic office and the exact service you need.' },
  { icon: Timer, tint: '#12A05A', title: 'Pick your timed window', body: 'See live wait times and choose an arrival slot that fits your day.' },
  { icon: FileCheck2, tint: '#DB6FA0', title: 'Verify docs from home', body: 'Upload your documents the night before and arrive pre-cleared.' },
  { icon: Ticket, tint: '#202957', title: 'Arrive, get seated, get called', body: 'Scan at the door, get seated, and get called by code and SMS on time.' },
];

function HowItWorks() {
  return (
    <section id="how" className="container-x py-20 lg:py-24">
      <Reveal>
        <SectionHead
          eyebrow="How it works"
          dot="#12A05A"
          title="From booking to being called, in four steps"
          sub="Under a minute to book. Zero minutes in a queue."
        />
      </Reveal>
      <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* connector arc */}
        <svg className="pointer-events-none absolute -top-7 left-0 hidden h-14 w-full lg:block" viewBox="0 0 1000 60" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M40 48 C 200 6, 320 6, 500 40 S 800 60, 960 18" stroke="#FF8A00" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 10" className="animate-dash" />
        </svg>
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={0.08 * i}>
            <div className="card card-hover relative h-full overflow-hidden p-6">
              <span className="absolute -right-2 -top-5 font-display text-[88px] font-extrabold leading-none tracking-tighter text-ink-900/[0.055]">
                {i + 1}
              </span>
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg" style={{ background: s.tint }}>
                <s.icon size={20} strokeWidth={2.2} />
              </span>
              <h3 className="relative mt-5 font-display text-[16.5px] font-bold tracking-tight text-ink-900">{s.title}</h3>
              <p className="relative mt-2 text-[13.5px] leading-relaxed text-ink-500">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2} className="mt-10 flex justify-center">
        <Link to="/book" className="btn btn-primary btn-lg">
          <Ticket size={18} /> Get your ticket — it's free
        </Link>
      </Reveal>
    </section>
  );
}

/* ================= SECTORS ================= */

const SECTORS = [
  { icon: Landmark, img: '/img/bank.jpg', name: 'Banks', body: 'ATM cards, token reset, mobile & internet banking, everyday teller visits.', span: 'lg:col-span-2 lg:row-span-2', minH: 'min-h-[300px] lg:min-h-full' },
  { icon: GraduationCap, img: '/img/students.jpg', name: 'Schools & universities', body: 'Admissions, transcripts & clearance — queued smartly by department.', span: '', minH: 'min-h-[220px]' },
  { icon: HeartPulse, img: '/img/hospital.jpg', name: 'Hospitals & clinics', body: 'Clinics, labs & records with timed arrival slots, no waiting rooms.', span: '', minH: 'min-h-[220px]' },
  { icon: Building2, img: '/img/civic.jpg', name: 'Civic offices', body: 'Permits, IDs and payments without the line at the counter.', span: '', minH: 'min-h-[220px]' },
  { icon: PiggyBank, img: '/img/phone.jpg', name: 'Microfinance & agents', body: 'Loans, savings and agent support scheduled around your day.', span: '', minH: 'min-h-[220px]' },
];

function Sectors() {
  return (
    <section className="container-x py-20 lg:py-24">
      <Reveal>
        <SectionHead
          eyebrow="Everywhere people wait"
          dot="#DB6FA0"
          title="One platform, every institution"
          sub="Not a lab demo — Luma runs on the floors of banks, schools, hospitals and civic offices."
        />
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {SECTORS.map((s, i) => (
          <Reveal key={s.name} delay={0.05 * i} className={s.span}>
            <Link
              to={`/institutions?category=${s.name.startsWith('School') ? 'school' : s.name.startsWith('Bank') ? 'bank' : s.name.startsWith('Hosp') ? 'hospital' : s.name.startsWith('Civic') ? 'civic' : 'microfinance'}`}
              className={`group relative block h-full w-full overflow-hidden rounded-[30px] ${s.minH}`}
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src={s.img}
                alt={s.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/95 text-navy-900 backdrop-blur">
                  <s.icon size={18} strokeWidth={2.2} />
                </span>
                <div className="mt-3 flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold tracking-tight text-white">{s.name}</h3>
                  <ArrowUpRight size={16} className="text-white/60 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <p className="mt-1 max-w-md text-[13px] leading-relaxed text-white/75">{s.body}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= INSTITUTIONS PREVIEW ================= */

function InstitutionsPreview() {
  const [inst, setInst] = useState<Institution[] | null>(null);
  useEffect(() => {
    apiGet<Institution[]>('/api/institutions?embed=1')
      .then((d) => setInst(d.slice(0, 6)))
      .catch(() => setInst([]));
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-orange-50 to-cream-50 py-20 lg:py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHead
              align="left"
              eyebrow="Live network"
              dot="#12A05A"
              title="Institutions already on Luma"
              sub="Real branches, real queues, real wait times — public by design."
            />
            <Link to="/institutions" className="btn btn-outline btn-md shrink-0">
              Browse all institutions <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inst === null
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)
            : inst.map((ins, i) => {
                const calmest = [...(ins.branches ?? [])].sort((a, b) => a.wait_min - b.wait_min)[0];
                return (
                  <Reveal key={ins.id} delay={0.04 * (i % 3)}>
                    <Link to={`/book?institution=${ins.id}`} className="card card-hover group block h-full p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex items-center gap-3">
                          <Avatar name={ins.name} size={44} />
                          <span>
                            <span className="block font-display text-[15.5px] font-bold tracking-tight text-ink-900">{ins.name}</span>
                            <span className="mt-0.5 block text-xs font-medium capitalize text-ink-500">
                              {ins.category} · {ins.area}, {ins.city}
                            </span>
                          </span>
                        </span>
                        <ArrowUpRight size={17} className="mt-1 text-ink-300 transition group-hover:text-orange-600" />
                      </div>
                      <p className="mt-3 text-[13px] leading-relaxed text-ink-500">{ins.tagline}</p>
                      <div className="mt-4 flex items-center justify-between">
                        {calmest ? (
                          <LoadBadge load={calmest.live_load} wait={calmest.wait_min} />
                        ) : (
                          <span className="pill bg-cream-100 text-ink-500">Opening soon</span>
                        )}
                        <Stars n={Math.round(ins.rating)} />
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */

function Testimonials() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  useEffect(() => {
    apiGet<Testimonial[]>('/api/testimonials').then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="container-x py-20 lg:py-24">
      <Reveal>
        <SectionHead
          eyebrow="Word on the street"
          dot="#F45B16"
          title="Nobody believes it until they try it"
          sub="From Lagos to Nairobi — people keep their mornings, institutions keep their calm."
        />
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items === null
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52" />)
          : items.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} delay={0.05 * (i % 3)}>
                <figure className="card card-hover flex h-full flex-col p-7">
                  <Stars n={t.rating} />
                  <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink-700">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-900/[0.06] pt-4">
                    <Avatar name={t.name} size={38} />
                    <div>
                      <p className="text-[13.5px] font-bold text-ink-900">{t.name}</p>
                      <p className="text-xs text-ink-500">{t.role} · {t.org}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

const FAQS: [string, string][] = [
  ['How does a timed ticket actually work?',
    'Book a service and pick a 30-minute arrival window. Scan your code at the door, take a seat, and get called by code and SMS when your counter is ready. The average Luma visit takes 11 minutes, door to done.'],
  ['What happens if I\'m running late?',
    'Life happens. Your ticket stays valid for 30 minutes after your window ends, and we send a nudge before it lapses. After that, re-booking takes about twenty seconds.'],
  ['Does Luma cost me anything?',
    'Never. Booking, tracking and home verification are free for visitors — institutions pay a simple subscription because shorter queues are worth it.'],
  ['Which documents can I verify from home?',
    'National IDs, utility bills, proof of address, student IDs, referral letters and more. Upload a photo the night before; our checks return a confidence score in minutes.'],
  ['Is my data safe with Luma?',
    'Files are encrypted in transit and at rest, with SOC2-style controls. Verification documents are automatically purged after 90 days.'],
  ['Do I need a smartphone to use Luma?',
    'No. Every ticket works over SMS and USSD codes, and branch kiosks print the same timed tickets for walk-ins — nobody queues because of their phone.'],
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative overflow-hidden bg-cream-100 py-20 lg:py-24">
      <LumaMotif variant="b" className="pointer-events-none absolute -left-16 bottom-10 h-56 w-56 opacity-50" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <SectionHead
              align="left"
              eyebrow="FAQ"
              dot="#202957"
              title="Fair questions, straight answers"
              sub="Still wondering something? Our team answers every message within one working hour."
            />
            <Link to="/company#contact" className="btn btn-navy btn-md mt-8">
              Talk to the team <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map(([q, a], i) => (
            <Reveal key={q} delay={0.04 * i}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className={`card w-full cursor-pointer p-5 text-left transition-all ${open === i ? '!border-orange-500/40 !shadow-[var(--shadow-lift)]' : ''}`}
                aria-expanded={open === i}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="font-display text-[15.5px] font-bold tracking-tight text-ink-900">{q}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${open === i ? 'rotate-180 bg-orange-100 text-orange-600' : 'bg-cream-100 text-ink-500'}`}>
                    <ChevronDown size={16} />
                  </span>
                </span>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-[14px] leading-relaxed text-ink-500">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= BUSINESS CTA (intensity level 1) ================= */

function BusinessCta() {
  return (
    <section className="container-x pb-24 pt-4">
      <Reveal>
        <div className="grad-cta relative overflow-hidden rounded-[36px] px-7 py-14 sm:px-12">
          <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-10 -top-14 h-64 w-64 opacity-25" fill="none" aria-hidden="true">
            <circle cx="100" cy="100" r="86" stroke="#FF8A00" strokeWidth="22" />
            <circle cx="150" cy="150" r="58" stroke="#F4AFCB" strokeWidth="18" />
          </svg>
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="eyebrow !border-white/15 !bg-white/10 !text-white">
                <span className="eyebrow-dot !bg-orange-500" /> For institutions
              </span>
              <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] text-white sm:text-[2.75rem]">
                Run an institution? Give your customers their time back.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/65">
                Launch timed tickets, document pre-verification and live queue control for your branches in days — not
                months. Call tickets, manage counters and watch live load across every branch.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/console" className="btn btn-primary btn-lg">
                  <ScanLine size={18} /> Explore the console
                </Link>
                <Link to="/company#contact" className="btn btn-white btn-lg">
                  Talk to us <ArrowRight size={16} />
                </Link>
              </div>
              <div className="mt-9 grid max-w-md grid-cols-2 gap-4">
                {[
                  ['11 min', 'average wait across the network'],
                  ['94%', 'of tickets arrive on time'],
                  ['40+', 'institutions live on Luma'],
                  ['−78%', 'Saturday waits after pilot days'],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                    <p className="font-display text-2xl font-extrabold tracking-tight text-white">{v}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-white/55">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* console preview card */}
            <div className="relative">
              <div className="animate-floaty rounded-[26px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-xl" style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)' }}>
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-bold text-white">Live board — Ikeja Branch</p>
                  <span className="pill bg-white/10 text-[11px] text-green-300"><span className="dot bg-green-400"><span /></span> Live</span>
                </div>
                <div className="mt-4 rounded-2xl bg-navy-950/60 p-5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Now calling</p>
                  <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white">
                    LM-<span className="text-orange-500">A043</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-white/50">Counter 4 · ATM card &amp; token</p>
                </div>
                <QueueRibbon ahead={8} me={9} dark className="mt-3" />
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    ['7', 'waiting', 'text-orange-400'],
                    ['18', 'served today', 'text-green-400'],
                    ['9 min', 'avg wait', 'text-pink-400'],
                  ].map(([v, l, c]) => (
                    <div key={l} className="rounded-xl bg-white/[0.06] py-2.5">
                      <p className={`font-display text-[15px] font-extrabold ${c}`}>{v}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= PAGE ================= */

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const loc = useLocation();

  useEffect(() => {
    apiGet<Stats>('/api/stats').then(setStats).catch(() => setStats(null));
  }, []);

  // hash deep-links (/#how, /#features, /#faq)
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [loc.hash]);

  const heroStats: [string, string][] = stats
    ? [
        [stats.tickets_issued, 'Tickets issued'],
        [stats.avg_wait, 'Average wait'],
        [stats.institutions_live, 'Institutions live'],
        [stats.on_time, 'Arrive on time'],
      ]
    : [];

  return (
    <>
      {/* HERO */}
      <section className="grad-hero relative overflow-hidden pt-32 sm:pt-36">
        <LumaMotif className="pointer-events-none absolute -right-24 top-24 h-72 w-72 opacity-70" />
        <LumaMotif variant="c" className="pointer-events-none absolute -left-16 bottom-40 h-52 w-52 opacity-60" />
        <div className="container-x relative grid items-center gap-14 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="eyebrow">
                <span className="eyebrow-dot bg-orange-500" />
                Smart queuing for Africa's institutions
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-6 font-display text-[2.9rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900 sm:text-6xl lg:text-[4.4rem]"
            >
              NEVER
              <br />
              <span className="relative inline-block">
                QUEUE
                <svg viewBox="0 0 260 20" className="absolute -bottom-2 left-0 w-[104%]" fill="none" aria-hidden="true">
                  <motion.path
                    d="M4 15C60 5 150 3 256 11"
                    stroke="#FF8A00"
                    strokeWidth="7"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
              </span>{' '}
              AGAIN.
              <span className="mt-3 block text-[0.42em] font-bold leading-tight tracking-[-0.02em] text-ink-500">
                Keep your day. Keep your dignity.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-500 sm:text-[17.5px]"
            >
              Luma gives every bank, school, hospital and civic office one system for timed tickets, home document
              verification and live branch operations — so you arrive exactly when you're needed, not a minute before.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/book" className="btn btn-primary btn-lg">
                <Ticket size={18} /> Get your ticket
              </Link>
              <Link to="/track" className="btn btn-outline btn-lg">
                Track a ticket <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <span className="flex -space-x-2.5">
                {['Amara Okafor', 'David Mwangi', 'Kofi Boateng', 'Funke Adeleke'].map((n) => (
                  <span key={n} className="rounded-full ring-[2.5px] ring-cream-50">
                    <Avatar name={n} size={34} />
                  </span>
                ))}
              </span>
              <p className="text-[13px] font-medium leading-snug text-ink-500">
                <b className="text-ink-900">1.2m+ errands</b> freed from queues across
                <br className="hidden sm:block" /> Nigeria, Kenya, Ghana &amp; Uganda
              </p>
              <span className="hidden h-8 w-px bg-ink-900/10 sm:block" />
              <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-700">
                <ShieldCheck size={16} className="text-green-600" /> Bank-grade security
              </p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }} className="pt-6 lg:pt-0">
            <TicketVisual />
          </motion.div>
        </div>

        <Ticker />

        {/* stats band — intensity level 2 */}
        <div className="grad-band-green border-b border-ink-900/[0.06]">
          <div className="container-x grid grid-cols-2 gap-8 py-10 sm:py-12 lg:grid-cols-4">
            {(heroStats.length ? heroStats : [
              ['—', 'Tickets issued'], ['—', 'Average wait'], ['—', 'Institutions live'], ['—', 'Arrive on time'],
            ]).map(([v, l], i) => (
              <Reveal key={l} delay={0.05 * i}>
                <div className="text-center sm:text-left">
                  <p className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-[2.5rem]">{v}</p>
                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-500">{l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Comparison />
      <Features />
      <HowItWorks />
      <Sectors />
      <InstitutionsPreview />
      <Testimonials />
      <Faq />
      <BusinessCta />

      {/* closing line */}
      <div className="container-x pb-16">
        <div className="flex items-center justify-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink-300">
          <Sparkles size={14} className="text-orange-500" />
          Dignity is a scheduled slot
          <Sparkles size={14} className="text-pink-400" />
        </div>
      </div>
    </>
  );
}
