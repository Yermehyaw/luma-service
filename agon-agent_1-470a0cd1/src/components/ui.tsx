import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Star } from 'lucide-react';

/* ---------- Section header: eyebrow + title + sub ---------- */
export function SectionHead({
  eyebrow,
  dot = '#FF8A00',
  title,
  sub,
  align = 'center',
  dark = false,
}: {
  eyebrow: string;
  dot?: string;
  title: ReactNode;
  sub?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <span className={`eyebrow ${dark ? '!border-white/15 !bg-white/10 !text-white' : ''}`}>
        <span className="eyebrow-dot" style={{ background: dot }} />
        {eyebrow}
      </span>
      <h2
        className={`mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[2.75rem] ${
          dark ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </h2>
      {sub && <p className={`mt-4 text-[16px] leading-relaxed ${dark ? 'text-white/65' : 'text-ink-500'}`}>{sub}</p>}
    </div>
  );
}

/* ---------- Scroll reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Live load badge ---------- */
const LOAD_STYLE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  low: { bg: 'bg-green-100', text: 'text-green-700', dot: '#12A05A', label: 'Calm' },
  moderate: { bg: 'bg-orange-100', text: 'text-orange-700', dot: '#F45B16', label: 'Moderate' },
  busy: { bg: 'bg-pink-100', text: 'text-pink-600', dot: '#DB6FA0', label: 'Busy' },
};

export function LoadBadge({ load, wait }: { load: string; wait?: number }) {
  const s = LOAD_STYLE[load] ?? LOAD_STYLE.low;
  return (
    <span className={`pill ${s.bg} ${s.text}`}>
      <span className="dot" style={{ background: s.dot }}>
        <span />
      </span>
      {s.label}
      {typeof wait === 'number' && <span className="font-medium opacity-80">· {wait} min wait</span>}
    </span>
  );
}

/* ---------- Stars ---------- */
export function Stars({ n = 5, className = '' }: { n?: number; className?: string }) {
  return (
    <span className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < n ? 'fill-yellow-400 text-yellow-400' : 'fill-ink-100 text-ink-100'} />
      ))}
    </span>
  );
}

/* ---------- Initial avatar ---------- */
const AV_COLORS = [
  ['#FFE9D2', '#B35309'],
  ['#DDF5E8', '#0D7F47'],
  ['#FCE8F1', '#AD4A7D'],
  ['#E5E9F8', '#39448C'],
];
export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AV_COLORS.length;
  const [bg, fg] = AV_COLORS[idx];
  const ini = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.34 }}
    >
      {ini}
    </span>
  );
}

/* ---------- Skeleton loader ---------- */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-2xl bg-[linear-gradient(90deg,#FFF3E6_25%,#FFE9D2_50%,#FFF3E6_75%)] bg-[length:400px_100%] ${className}`}
    />
  );
}

/* ---------- Empty state ---------- */
export function Empty({ icon, title, body }: { icon: ReactNode; title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[26px] border-[1.5px] border-dashed border-ink-900/[0.14] bg-white/70 px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100 text-orange-600" style={{ boxShadow: 'var(--shadow-card)' }}>
        {icon}
      </span>
      <p className="font-display text-lg font-bold text-ink-900">{title}</p>
      {body && <p className="mt-1.5 max-w-xs text-sm text-ink-500">{body}</p>}
    </div>
  );
}
