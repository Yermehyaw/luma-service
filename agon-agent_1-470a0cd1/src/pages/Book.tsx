import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Check, Clock3, Mail, MapPin, PartyPopper, Pencil,
  Phone, ScanLine, Search, Send, Ticket, User,
} from 'lucide-react';
import { LumaMark, LumaSpinner } from '../components/LumaMark';
import { Avatar, Empty, LoadBadge, Reveal, Skeleton } from '../components/ui';
import { apiGet, apiSend, makeWindows, niceDate, todayISO } from '../lib/api';
import type { Branch, Institution, Service, Ticket as TicketType } from '../lib/types';

const STEP_LABELS = ['Institution', 'Service & branch', 'Date & window', 'Your details'];

export default function Book() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);

  const [institutions, setInstitutions] = useState<Institution[] | null>(null);
  const [instSearch, setInstSearch] = useState('');
  const [institution, setInstitution] = useState<Institution | null>(null);

  const [services, setServices] = useState<Service[] | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);

  const [dateIdx, setDateIdx] = useState(0); // 0 today, 1 tomorrow, 2 day after
  const [window_, setWindow_] = useState<{ start: string; end: string } | null>(null);
  const [dayTickets, setDayTickets] = useState<TicketType[]>([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [booked, setBooked] = useState<TicketType | null>(null);

  /* load institutions (with branches) once */
  useEffect(() => {
    apiGet<Institution[]>('/api/institutions?embed=1')
      .then((d) => {
        setInstitutions(d);
        const pre = params.get('institution');
        if (pre) {
          const found = d.find((i) => i.id === pre);
          if (found) {
            setInstitution(found);
            setStep(1);
          }
        }
      })
      .catch(() => setInstitutions([]));
  }, [params]);

  /* load services when institution changes */
  useEffect(() => {
    if (!institution) return;
    setServices(null);
    setService(null);
    setBranch(null);
    apiGet<Service[]>(`/api/services?institution_id=${institution.id}`)
      .then(setServices)
      .catch(() => setServices([]));
  }, [institution]);

  /* load that day's tickets for capacity display */
  const visitDate = todayISO(dateIdx);
  useEffect(() => {
    if (!branch) return;
    apiGet<TicketType[]>(`/api/tickets?branch_id=${branch.id}&visit_date=${visitDate}`)
      .then(setDayTickets)
      .catch(() => setDayTickets([]));
  }, [branch, visitDate]);

  const windows = useMemo(() => makeWindows(8, 16, 30), []);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const windowCount = (wStart: string) =>
    dayTickets.filter((t) => t.window_start === wStart && t.status !== 'cancelled').length;

  const filteredInstitutions = useMemo(() => {
    if (!institutions) return null;
    const n = instSearch.trim().toLowerCase();
    if (!n) return institutions;
    return institutions.filter(
      (i) => i.name.toLowerCase().includes(n) || i.city.toLowerCase().includes(n) || i.category.includes(n),
    );
  }, [institutions, instSearch]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^[+\d][\d\s-]{6,16}$/.test(phone.trim())) e.phone = phone.trim() ? 'Enter a valid phone number' : 'Phone number is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirm = async () => {
    if (!institution || !service || !branch || !window_ || !validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const t = await apiSend<TicketType>('/api/tickets', 'POST', {
        institution_id: institution.id,
        branch_id: branch.id,
        service_id: service.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        visit_date: visitDate,
        window_start: window_.start,
        window_end: window_.end,
      });
      setBooked(t);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not create your ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const dateChip = (i: number) => niceDate(todayISO(i));

  /* ---------- SUCCESS SCREEN ---------- */
  if (step === 4 && booked) {
    return (
      <div className="grad-hero min-h-screen pt-28 sm:pt-32">
        <div className="container-x max-w-xl pb-24">
          <Reveal className="text-center">
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-[0_14px_36px_-10px_rgba(18,160,90,0.55)]"
            >
              <PartyPopper size={26} />
            </motion.span>
            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              You're booked, {booked.user_name.split(' ')[0]}.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              A confirmation SMS and email are on the way to <b className="text-ink-900">{booked.phone}</b>. Arrive in
              your window and walk straight in.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card mt-8 overflow-hidden !rounded-[30px] p-0" style={{ boxShadow: 'var(--shadow-lift)' }}>
              <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
                <span className="flex items-center gap-2.5">
                  <LumaMark size={28} tile={false} />
                  <span className="font-display text-sm font-bold">Digital ticket</span>
                </span>
                <span className="pill bg-white/10 text-green-300"><ScanLine size={12} /> Scan at door</span>
              </div>
              <div className="p-6">
                <p className="text-center font-display text-[44px] font-extrabold tracking-[-0.03em] text-ink-900">
                  {booked.code.slice(0, 3)}<span className="grad-text-warm">{booked.code.slice(3)}</span>
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-cream-100 p-4 text-sm sm:grid-cols-2">
                  {[
                    ['Institution', booked.institution_name],
                    ['Branch', booked.branch_name],
                    ['Service', booked.service_name],
                    ['Visit date', niceDate(booked.visit_date)],
                    ['Arrival window', `${booked.window_start} – ${booked.window_end}`],
                    ['Queue position', `#${booked.position} · ~${booked.eta_min} min`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">{k}</p>
                      <p className="mt-0.5 font-display text-[13.5px] font-bold text-ink-900">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
                  <Clock3 size={14} className="mt-0.5 shrink-0 text-orange-600" />
                  Arrive inside your window and you keep priority. Running late? Your ticket stays valid for 30 min
                  after the window.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to={`/track?code=${booked.code}`} className="btn btn-primary btn-md">
              <Ticket size={16} /> Track this ticket
            </Link>
            <Link to="/verify" className="btn btn-outline btn-md">
              Verify documents from home
            </Link>
          </Reveal>
        </div>
      </div>
    );
  }

  /* ---------- WIZARD ---------- */
  return (
    <div className="grad-hero min-h-screen pt-28 sm:pt-32">
      <div className="container-x max-w-4xl pb-24">
        <Reveal className="text-center">
          <span className="eyebrow"><span className="eyebrow-dot bg-orange-500" /> Timed tickets</span>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.025em] text-ink-900 sm:text-[2.6rem]">
            Book your visit in 60 seconds
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-500">
            Choose a bank, school, hospital or civic office, select the exact service you need, and pick a timed
            window that fits your day.
          </p>
        </Reveal>

        {/* stepper */}
        <Reveal delay={0.08} className="mb-10 mt-8 flex items-center justify-center gap-1 overflow-x-auto pb-1">
          {STEP_LABELS.map((l, i) => (
            <div key={l} className="flex flex-1 items-center gap-1 whitespace-nowrap">
              <button
                onClick={() => { if (i < step) setStep(i); }}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-bold transition ${
                  i === step ? 'bg-navy-900 text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-white text-ink-300'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] ${
                    i < step ? 'bg-green-600 text-white' : i === step ? 'bg-orange-500 text-white' : 'bg-cream-100 text-ink-300'
                  }`}
                >
                  {i < step ? <Check size={11} strokeWidth={3} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{l}</span>
              </button>
              {i < STEP_LABELS.length - 1 && <span className="h-px flex-1 bg-ink-900/10" />}
            </div>
          ))}
        </Reveal>

        {/* STEP 1: institution */}
        {step === 0 && (
          <Reveal>
            <div className="relative mx-auto mb-5 max-w-md">
              <Search size={16} className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-300" style={{ left: 18 }} />
              <input
                value={instSearch}
                onChange={(e) => setInstSearch(e.target.value)}
                placeholder="Search institutions…"
                className="input !rounded-full !pl-11"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredInstitutions === null ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[74px]" />)
              ) : filteredInstitutions.length === 0 ? (
                <div className="sm:col-span-2">
                  <Empty icon={<Search size={20} />} title="No institutions found" body="Try a different search term." />
                </div>
              ) : (
                filteredInstitutions.map((ins) => (
                  <button
                    key={ins.id}
                    onClick={() => { setInstitution(ins); setStep(1); }}
                    className="card card-hover flex cursor-pointer items-center gap-3.5 p-4 text-left"
                  >
                    <Avatar name={ins.name} size={46} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[15px] font-bold tracking-tight text-ink-900">{ins.name}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                        <span className="capitalize">{ins.category}</span> · {ins.city}
                      </span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-ink-300" />
                  </button>
                ))
              )}
            </div>
          </Reveal>
        )}

        {/* STEP 2: service + branch */}
        {step === 1 && institution && (
          <Reveal>
            <button onClick={() => setStep(0)} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-ink-500 hover:text-ink-900">
              <Pencil size={13} /> Change institution
            </button>
            <div className="card mb-6 flex items-center gap-3.5 p-4">
              <Avatar name={institution.name} size={44} />
              <div>
                <p className="font-display text-[15.5px] font-bold text-ink-900">{institution.name}</p>
                <p className="text-xs capitalize text-ink-500">{institution.category} · {institution.area}, {institution.city}</p>
              </div>
            </div>

            <p className="label">Choose the service you need</p>
            {services === null ? (
              <div className="grid gap-3 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[68px]" />)}</div>
            ) : services.length === 0 ? (
              <Empty icon={<Clock3 size={20} />} title="No services listed" body="This institution has no services configured yet." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setService(s)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-[20px] border-[1.5px] p-4 text-left transition-all ${
                      service?.id === s.id ? 'border-orange-500 bg-orange-50 shadow-[var(--shadow-card)]' : 'border-ink-900/[0.08] bg-white hover:border-ink-900/25'
                    }`}
                  >
                    <span>
                      <span className="block font-display text-[15px] font-bold text-ink-900">{s.name}</span>
                      <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-green-700">
                        <Clock3 size={12} /> ~{s.minutes} min at the counter
                      </span>
                    </span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] transition ${
                        service?.id === s.id ? 'border-orange-500 bg-orange-500 text-white' : 'border-ink-900/15 text-transparent'
                      }`}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {service && (
              <>
                <p className="label mb-3 mt-8">Pick a branch</p>
                <div className="grid gap-3">
                  {(institution.branches ?? []).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setBranch(b); setWindow_(null); }}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-[20px] border-[1.5px] p-4 text-left transition-all ${
                        branch?.id === b.id ? 'border-orange-500 bg-orange-50 shadow-[var(--shadow-card)]' : 'border-ink-900/[0.08] bg-white hover:border-ink-900/20'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-100 text-navy-900">
                          <MapPin size={17} />
                        </span>
                        <span>
                          <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink-900">{b.name}</span>
                          <span className="mt-0.5 block text-xs text-ink-500">{b.address} · open until {b.open_until}</span>
                        </span>
                      </span>
                      <LoadBadge load={b.live_load} wait={b.wait_min} />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 flex justify-end">
              <button disabled={!service || !branch} onClick={() => setStep(2)} className="btn btn-primary btn-md">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        )}

        {/* STEP 3: date + window */}
        {step === 2 && institution && service && branch && (
          <Reveal>
            <button onClick={() => setStep(1)} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-ink-500 hover:text-ink-900">
              <Pencil size={13} /> Change service
            </button>

            <p className="label flex items-center gap-1.5"><CalendarDays size={15} className="text-orange-600" /> Pick a day</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Today', 'Tomorrow', niceDate(todayISO(2)).split(',')[0]].map((l, i) => (
                <button
                  key={l}
                  onClick={() => { setDateIdx(i); setWindow_(null); }}
                  className={`flex cursor-pointer flex-col items-center rounded-[18px] border-[1.5px] px-5 py-3 transition ${
                    dateIdx === i ? 'border-navy-900 bg-navy-900 text-white shadow-lg' : 'border-ink-900/[0.1] bg-white text-ink-700 hover:border-ink-900/25'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${dateIdx === i ? 'text-white/60' : 'text-ink-300'}`}>
                    {i === 2 ? 'Day after' : l}
                  </span>
                  <span className="mt-0.5 font-display text-sm font-bold">{dateChip(i)}</span>
                </button>
              ))}
            </div>

            <p className="label mb-3 mt-7 flex items-center gap-1.5">
              <Clock3 size={15} className="text-orange-600" /> Choose your arrival window <span className="font-normal text-ink-300">· {branch.name}</span>
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {windows.map((w) => {
                const [h, m] = w.start.split(':').map(Number);
                const past = dateIdx === 0 && h * 60 + m <= nowMinutes + 20;
                const count = windowCount(w.start);
                const full = count >= 6;
                const sel = window_?.start === w.start;
                return (
                  <button
                    key={w.start}
                    disabled={past || full}
                    onClick={() => setWindow_(w)}
                    className={`cursor-pointer rounded-[16px] border-[1.5px] px-3 py-2.5 text-center transition disabled:cursor-not-allowed disabled:opacity-35 ${
                      sel ? 'border-orange-500 bg-orange-500 text-white shadow-[var(--shadow-orange)]' : 'border-ink-900/[0.1] bg-white text-ink-700 hover:border-orange-500/50 hover:bg-orange-50'
                    }`}
                  >
                    <span className="block font-display text-[13.5px] font-bold">
                      {w.start}–{w.end}
                    </span>
                    <span className={`mt-0.5 block text-[10px] font-bold uppercase ${sel ? 'text-white/70' : full ? 'text-pink-600' : count > 3 ? 'text-orange-600' : 'text-green-600'}`}>
                      {full ? 'Full' : count === 0 ? 'Quiet' : `${count}/6 booked`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button disabled={!window_} onClick={() => setStep(3)} className="btn btn-primary btn-md">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        )}

        {/* STEP 4: details */}
        {step === 3 && institution && service && branch && window_ && (
          <Reveal>
            <button onClick={() => setStep(2)} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-ink-500 hover:text-ink-900">
              <Pencil size={13} /> Change time
            </button>

            <div className="card overflow-hidden !rounded-[26px] p-0">
              <div className="grad-band-warm border-b border-ink-900/[0.06] px-6 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500">Booking summary</p>
                <p className="mt-1 font-display text-[15.5px] font-bold text-ink-900">
                  {service.name} · {institution.name} · {branch.name}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-orange-700">
                  {niceDate(visitDate)} · arrive between {window_.start} – {window_.end}
                </p>
              </div>
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="bk-name">Full name</label>
                  <div className="relative">
                    <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                    <input
                      id="bk-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amara Okafor"
                      className="input !pl-11"
                    />
                  </div>
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="bk-phone">Phone number</label>
                  <div className="relative">
                    <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                    <input
                      id="bk-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 801 234 5678"
                      className="input !pl-11"
                      inputMode="tel"
                    />
                  </div>
                  {errors.phone && <p className="field-error">{errors.phone}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="bk-email">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                    <input
                      id="bk-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input !pl-11"
                      inputMode="email"
                    />
                  </div>
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
              </div>
            </div>

            {submitError && (
              <p className="mt-4 rounded-2xl bg-pink-100 px-4 py-3 text-sm font-semibold text-pink-600">
                {submitError.startsWith('Could not') ? submitError : 'Booking failed — please try again.'}
              </p>
            )}

            <div className="mt-7 flex justify-end">
              <button onClick={confirm} disabled={submitting} className="btn btn-primary btn-lg">
                {submitting ? <LumaSpinner size={18} /> : <Send size={16} />}
                {submitting ? 'Securing your slot…' : 'Confirm booking'}
              </button>
            </div>
          </Reveal>
        )}
      </div>
      {/* small helper row */}
      <div className="container-x flex max-w-4xl items-center gap-2 pb-16 text-[13px] text-ink-500">
        <ArrowLeft size={14} className="text-ink-300" />
        Already booked? <Link to="/track" className="font-bold text-orange-600 hover:underline">Track your ticket</Link>
        or <Link to="/verify" className="font-bold text-green-700 hover:underline">verify documents tonight <BadgeCheck size={13} className="inline" /></Link>
      </div>
    </div>
  );
}
