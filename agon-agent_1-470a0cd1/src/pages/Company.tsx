import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Accessibility, ArrowRight, BadgeCheck, Building2, Handshake, LandPlot, Mail, Network, Send, Timer, User } from 'lucide-react';
import { LumaMotif, LumaSpinner } from '../components/LumaMark';
import { Avatar, Reveal, SectionHead } from '../components/ui';
import { apiGet, apiSend } from '../lib/api';
import type { Stats } from '../lib/types';

const VALUES = [
  {
    icon: Timer, tint: '#FF8A00', bg: 'bg-orange-100', fg: 'text-orange-600',
    title: 'Timing over waiting',
    body: 'Every feature we ship is measured by one thing: did it give someone their time back?',
  },
  {
    icon: Accessibility, tint: '#12A05A', bg: 'bg-green-100', fg: 'text-green-600',
    title: 'Radical social care',
    body: 'Priority windows for the elderly, accessible queues, and public accountability at every branch.',
  },
  {
    icon: Network, tint: '#DB6FA0', bg: 'bg-pink-100', fg: 'text-pink-600',
    title: 'One network, shared brains',
    body: 'A lesson learned in one branch should never repeat in another. We build for collaboration.',
  },
];

const TEAM = [
  { name: 'Adaeze Nwosu', role: 'Co-founder & CEO', org: 'ex-branch manager, 9 years of queues' },
  { name: 'Brian Kiprop', role: 'Co-founder & CTO', org: 'traffic systems engineer, Nairobi' },
  { name: 'Temi Lawson', role: 'Head of Product', org: 'designs for the 6am queue she escaped' },
  { name: 'Kwame Asante', role: 'Head of Partnerships', org: '40+ institutions and counting' },
  { name: 'Zainab Bello', role: 'Design Lead', org: 'obsessed with calmer public spaces' },
  { name: 'Otis Morais', role: 'Customer Success', org: 'answers within the hour, truly' },
];

export default function Company() {
  const [stats, setStats] = useState<Stats | null>(null);
  const loc = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orgType, setOrgType] = useState('Bank');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [fail, setFail] = useState('');

  useEffect(() => { apiGet<Stats>('/api/stats').then(setStats).catch(() => setStats(null)); }, []);
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [loc.hash]);

  const submit = async () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email address';
    if (body.trim().length < 10) e.body = 'Add a little detail — 10+ characters helps us route you';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setFail('');
    try {
      await apiSend('/api/messages', 'POST', { author: name.trim(), email: email.trim(), org_type: orgType, body: body.trim() });
      setSent(true);
    } catch {
      setFail('Message not sent — please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32">
      {/* hero */}
      <section className="container-x">
        <Reveal className="relative overflow-hidden rounded-[36px] grad-band-warm px-7 py-14 sm:px-14 sm:py-20">
          <LumaMotif className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 opacity-70" />
          <LumaMotif variant="c" className="pointer-events-none absolute -left-10 bottom-0 h-44 w-44 opacity-60" />
          <div className="relative max-w-2xl">
            <span className="eyebrow"><span className="eyebrow-dot bg-orange-500" /> Why Luma exists</span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-ink-900 sm:text-6xl">
              Dignity is a <span className="grad-text-warm">scheduled slot.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-500 sm:text-lg">
              Luma builds the customer service layer for institutions that respect people's time — timed tickets,
              home document verification, branch collaboration and social care, in one connected platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/company#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn btn-primary btn-lg">
                Run an institution? Let's talk <ArrowRight size={16} />
              </Link>
              <Link to="/institutions" className="btn btn-outline btn-lg">See the network</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* stats */}
      <section className="container-x mt-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [stats?.avg_wait ?? '—', 'average wait across the network', '#FF8A00'],
            [stats?.on_time ?? '—', 'of tickets arrive on time', '#12A05A'],
            [stats?.institutions_live ?? '—', 'institutions live · 4 countries', '#DB6FA0'],
          ].map(([v, l, c], i) => (
            <Reveal key={l} delay={0.06 * i}>
              <div className="card card-hover relative overflow-hidden p-7">
                <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20" style={{ background: String(c) }} />
                <p className="font-display text-4xl font-extrabold tracking-[-0.03em] text-ink-900">{v}</p>
                <p className="mt-1.5 text-[13.5px] font-semibold text-ink-500">{l}</p>
                <span className="mt-4 block h-1 w-10 rounded-full" style={{ background: String(c) }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* values */}
      <section className="container-x py-20 lg:py-24">
        <Reveal>
          <SectionHead eyebrow="What we stand for" dot="#DB6FA0" title="Principles you can feel at the door" />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={0.06 * i}>
              <div className="card card-hover h-full p-7">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${v.bg} ${v.fg}`}>
                  <v.icon size={21} strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink-900">{v.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* photo banner */}
      <section className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px]" style={{ boxShadow: 'var(--shadow-lift)' }}>
            <img src="/img/team.jpg" alt="The Luma team in a working session, Lagos" className="h-72 w-full object-cover sm:h-96" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-7 sm:p-10">
              <span className="pill w-fit bg-white/15 text-white backdrop-blur"><Handshake size={13} /> Built for real institutions</span>
              <p className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                Not a lab demo — Luma runs on the floors of banks, schools, hospitals and civic offices.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* team */}
      <section className="container-x py-20 lg:py-24">
        <Reveal>
          <SectionHead eyebrow="The people" dot="#12A05A" title="Meet the team behind the promise" />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((t, i) => (
            <Reveal key={t.name} delay={0.05 * (i % 3)}>
              <div className="card card-hover flex h-full items-center gap-4 p-6">
                <Avatar name={t.name} size={54} />
                <div>
                  <p className="font-display text-[15.5px] font-bold tracking-tight text-ink-900">{t.name}</p>
                  <p className="text-[13px] font-semibold text-orange-600">{t.role}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{t.org}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* business + contact */}
      <section id="contact" className="relative overflow-hidden bg-cream-100 py-20 lg:py-24">
        <LumaMotif variant="b" className="pointer-events-none absolute -right-16 top-6 h-56 w-56 opacity-60" />
        <div className="container-x relative grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span id="business" className="absolute -top-24" />
            <SectionHead
              align="left"
              eyebrow="For businesses"
              dot="#F45B16"
              title="Run an institution? Give your customers their time back."
              sub="Join 40+ institutions running timed tickets, home verification and live branch operations on Luma. A specialist will respond within the hour."
            />
            <ul className="mt-8 space-y-3.5">
              {[
                'Timed tickets + SMS calling for every counter',
                'Bank-grade home document verification',
                'Live load boards on every branch, publicly',
                'Shared playbooks across your entire network',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] font-medium text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                    <BadgeCheck size={13} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="btn btn-navy btn-md"><LandPlot size={16} /> Start a pilot</Link>
              <Link to="/console" className="btn btn-ghost btn-md">Peek at the console <ArrowRight size={15} /></Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card !rounded-[30px] p-10 text-center" style={{ boxShadow: 'var(--shadow-lift)' }}>
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Send size={24} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink-900">Thank you for reaching out</h3>
                <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-ink-500">
                  A specialist will respond within the hour. Your reference has been logged.
                </p>
                <button
                  className="btn btn-outline btn-md mt-7"
                  onClick={() => { setSent(false); setBody(''); }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <div className="card !rounded-[30px] p-7 sm:p-8" style={{ boxShadow: 'var(--shadow-lift)' }}>
                <h3 className="font-display text-xl font-extrabold tracking-tight text-ink-900">Tell us about your institution</h3>
                <div className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="cp-name">Your name</label>
                      <div className="relative">
                        <User size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                        <input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} className="input !pl-10" placeholder="Funke Adeleke" />
                      </div>
                      {errors.name && <p className="field-error">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="label" htmlFor="cp-email">Work email</label>
                      <div className="relative">
                        <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                        <input id="cp-email" value={email} onChange={(e) => setEmail(e.target.value)} className="input !pl-10" placeholder="funke@bank.ng" />
                      </div>
                      {errors.email && <p className="field-error">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="cp-type">Institution type</label>
                    <div className="relative">
                      <Building2 size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                      <select id="cp-type" value={orgType} onChange={(e) => setOrgType(e.target.value)} className="input !pl-10">
                        {['Bank', 'School / university', 'Hospital / clinic', 'Civic office', 'Microfinance', 'Other'].map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="cp-body">What are you solving?</label>
                    <textarea
                      id="cp-body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={4}
                      className="input"
                      placeholder="We run 6 branches and want to pilot timed tickets…"
                    />
                    {errors.body && <p className="field-error">{errors.body}</p>}
                  </div>
                  {fail && <p className="rounded-2xl bg-pink-100 px-4 py-3 text-sm font-semibold text-pink-600">{fail}</p>}
                  <button onClick={submit} disabled={busy} className="btn btn-primary btn-lg w-full">
                    {busy ? <LumaSpinner size={18} /> : <Send size={17} />}
                    {busy ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
