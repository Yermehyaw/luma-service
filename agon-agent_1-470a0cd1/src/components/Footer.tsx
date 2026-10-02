import { Link } from 'react-router-dom';
import { Globe, Instagram, Linkedin, ShieldCheck, Twitter, Youtube } from 'lucide-react';
import { LumaMark } from './LumaMark';

const COLS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Book a ticket', to: '/book' },
      { label: 'Track ticket', to: '/track' },
      { label: 'Verify documents', to: '/verify' },
      { label: 'Institution network', to: '/institutions' },
    ],
  },
  {
    title: 'Institutions',
    links: [
      { label: 'For businesses', to: '/company#business' },
      { label: 'Console login', to: '/login' },
      { label: 'Create an account', to: '/signup' },
      { label: 'Contact sales', to: '/company#contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Luma', to: '/company' },
      { label: 'How it works', to: '/#how' },
      { label: 'Features', to: '/#features' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, label: 'Luma on X' },
  { icon: Instagram, label: 'Luma on Instagram' },
  { icon: Linkedin, label: 'Luma on LinkedIn' },
  { icon: Youtube, label: 'Luma on YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      {/* ambient motif */}
      <svg viewBox="0 0 300 300" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 opacity-[0.16]" fill="none" aria-hidden="true">
        <circle cx="150" cy="150" r="120" stroke="#FF8A00" strokeWidth="34" />
        <circle cx="210" cy="210" r="90" stroke="#F4AFCB" strokeWidth="26" />
        <circle cx="70" cy="230" r="52" fill="#12A05A" />
      </svg>
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-16 left-[-3rem] h-56 w-56 opacity-[0.12]" fill="none" aria-hidden="true">
        <rect x="10" y="60" width="130" height="130" rx="44" fill="#FF8A00" />
        <circle cx="150" cy="70" r="52" fill="#F4AFCB" />
      </svg>

      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <span className="inline-flex items-center gap-2.5">
              <LumaMark size={38} tile={false} className="[&>circle:first-child]:fill-orange-500" />
              <span className="font-display text-2xl font-extrabold tracking-[-0.03em]">Luma</span>
            </span>
            <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-white/60">
              The all-in-one platform for institutions that respect people's time — timed tickets, home document
              verification, branch collaboration and social care.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-white/70 transition hover:bg-white/[0.16] hover:text-white"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[14px] font-medium text-white/70 transition hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-[13px] text-white/45">© {new Date().getFullYear()} Luma Technologies Ltd. Made in Lagos &amp; Nairobi.</p>
          <p className="flex items-center gap-2 text-[13px] font-medium text-white/55">
            <ShieldCheck size={15} className="text-green-500" />
            Bank-grade security · SOC2-style controls · Nigeria &amp; beyond
          </p>
          <p className="flex items-center gap-2 text-[13px] font-medium text-white/55">
            <Globe size={15} className="text-pink-400" /> EN · FR · SW
          </p>
        </div>
      </div>
    </footer>
  );
}
