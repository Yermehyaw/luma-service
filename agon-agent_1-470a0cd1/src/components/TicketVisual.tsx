import { motion } from 'framer-motion';
import { BadgeCheck, BellRing, Clock3, MapPin, ScanLine } from 'lucide-react';
import { LumaMark } from './LumaMark';

/**
 * Luma queue ribbon — the signature smart-queue visualization.
 * A flowing row of position pips along a dashed track, leading into the
 * "now serving" counter. People further along glow green; you are orange.
 */
export function QueueRibbon({
  ahead = 7,
  me = 3,
  dark = false,
  className = '',
}: {
  ahead?: number;
  me?: number;
  dark?: boolean;
  className?: string;
}) {
  const total = ahead + 1; // includes you
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-4 py-3.5 ${
        dark ? 'border-white/10 bg-white/[0.06]' : 'border-ink-900/[0.07] bg-white'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${dark ? 'text-white/50' : 'text-ink-300'}`}>
          Live queue
        </p>
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-green-600">
          <span className="dot bg-green-600"><span /></span> Flowing
        </p>
      </div>

      <div className="relative mt-3.5">
        {/* track */}
        <svg className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2" preserveAspectRatio="none" viewBox="0 0 100 3">
          <line x1="0" y1="1.5" x2="100" y2="1.5" stroke={dark ? 'rgba(255,255,255,0.25)' : '#E9E6E1'} strokeWidth="2.4" strokeDasharray="4 5" strokeLinecap="round" className="animate-dash" />
        </svg>
        <div className="relative flex items-center justify-between">
          {Array.from({ length: total }).map((_, i) => {
            const pos = total - i; // 1 = front
            const isMe = pos === me;
            const done = pos < me;
            return (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35 + i * 0.07, type: 'spring', stiffness: 380, damping: 20 }}
                className="relative z-10 flex items-center justify-center rounded-full"
                style={{
                  width: isMe ? 30 : 16,
                  height: isMe ? 30 : 16,
                  background: isMe ? 'linear-gradient(135deg,#FF8A00,#F45B16)' : done ? '#DDF5E8' : dark ? 'rgba(255,255,255,0.16)' : '#FFF3E6',
                  border: isMe ? '2.5px solid #fff' : done ? '2px solid #12A05A' : `2px solid ${dark ? 'rgba(255,255,255,0.25)' : '#E4D6C4'}`,
                  boxShadow: isMe ? '0 6px 16px -4px rgba(244,91,22,0.5)' : undefined,
                }}
              >
                {isMe && <span className="font-display text-[11px] font-extrabold text-white">{pos}</span>}
                {done && <span className="block h-1 w-1 rounded-full bg-green-600" />}
              </motion.span>
            );
          })}
          {/* counter */}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35 + total * 0.07, type: 'spring', stiffness: 380, damping: 20 }}
            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white shadow-lg"
          >
            <ScanLine size={13} />
          </motion.span>
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold">
          <span className={dark ? 'text-white/40' : 'text-ink-300'}>You joined</span>
          <span className={dark ? 'text-white/70' : 'text-ink-500'}>{me - 1} ahead of you</span>
          <span className={dark ? 'text-white/40' : 'text-ink-300'}>Counter 4</span>
        </div>
      </div>
    </div>
  );
}

/* Animated ETA ring */
function EtaRing({ pct = 0.72, minutes = 12 }: { pct?: number; minutes?: number }) {
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-[68px] w-[68px]">
      <svg viewBox="0 0 68 68" className="h-full w-full -rotate-90">
        <circle cx="34" cy="34" r={R} fill="none" stroke="#FFF3E6" strokeWidth="7" />
        <motion.circle
          cx="34"
          cy="34"
          r={R}
          fill="none"
          stroke="url(#etaGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - pct) }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />
        <defs>
          <linearGradient id="etaGrad" x1="0" y1="0" x2="68" y2="68">
            <stop offset="0%" stopColor="#FF8A00" />
            <stop offset="100%" stopColor="#F45B16" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-extrabold leading-none text-ink-900">{minutes}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-ink-300">min</span>
      </div>
    </div>
  );
}

/**
 * Hero product composition — a real-feeling Luma digital ticket,
 * queue ribbon, arrival window, ETA ring and push notification.
 */
export default function TicketVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* ambient motif plate */}
      <div className="absolute -left-8 -top-10 h-40 w-56 -rotate-6 opacity-90">
        <svg viewBox="0 0 240 180" fill="none" className="h-full w-full">
          <circle cx="90" cy="90" r="60" fill="#FFE9D2" />
          <circle cx="150" cy="66" r="44" fill="#DDF5E8" />
        </svg>
      </div>
      <div className="absolute -bottom-8 -right-6 h-36 w-48 rotate-3 opacity-90">
        <svg viewBox="0 0 240 180" fill="none" className="h-full w-full">
          <rect x="20" y="40" width="140" height="120" rx="44" fill="#FCE8F1" />
          <circle cx="168" cy="60" r="34" fill="#DDF5E8" />
        </svg>
      </div>

      {/* main ticket */}
      <motion.div
        initial={{ opacity: 0, y: 34, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="card relative z-10 overflow-hidden !rounded-[30px] p-0"
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        <div className="flex items-center justify-between border-b border-dashed border-ink-900/10 bg-cream-50 px-6 py-4">
          <span className="flex items-center gap-2.5">
            <LumaMark size={30} />
            <span className="font-display text-[13px] font-bold tracking-tight text-ink-900">Digital ticket</span>
          </span>
          <span className="pill bg-green-100 text-green-700">
            <BadgeCheck size={13} /> Confirmed
          </span>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-[40px] font-extrabold leading-none tracking-[-0.04em] text-ink-900">
                LM-<span className="grad-text-warm">A042</span>
              </p>
              <p className="mt-2 text-[13.5px] font-semibold text-ink-900">Sterling Bank · Ikeja Branch</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
                <MapPin size={12} className="text-orange-600" /> 12 Allen Avenue · ATM card &amp; token
              </p>
            </div>
            <EtaRing pct={0.72} minutes={12} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-2xl bg-cream-100 p-3.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">Window</p>
              <p className="mt-1 font-display text-[13px] font-bold text-ink-900">10:30–11:00</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">Position</p>
              <p className="mt-1 font-display text-[13px] font-bold text-ink-900">#3 in queue</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">ETA</p>
              <p className="mt-1 font-display text-[13px] font-bold text-green-600">~12 min</p>
            </div>
          </div>

          <QueueRibbon ahead={7} me={3} className="mt-3" />

          <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-green-50 px-4 py-3">
            <BadgeCheck size={16} className="shrink-0 text-green-600" />
            <p className="text-[12.5px] font-semibold leading-snug text-green-700">
              Documents verified — skip the desk, go straight to counter 4.
            </p>
          </div>
        </div>

        {/* perforation + barcode strip */}
        <div className="relative border-t-2 border-dashed border-ink-900/[0.08] px-6 py-4">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cream-50" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cream-50" />
          <div className="flex h-7 items-stretch justify-between gap-[3px] opacity-70">
            {[3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 5, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 4, 2, 1, 2].map((w, i) => (
              <span key={i} className="rounded-full bg-navy-900" style={{ width: w }} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* push notification */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: 10, rotate: 3 }}
        animate={{ opacity: 1, y: 0, x: 0, rotate: 3 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="animate-floaty absolute -right-3 -top-12 z-20 w-[240px] rounded-[20px] border border-ink-900/[0.07] bg-white/95 p-3.5 backdrop-blur sm:-right-8"
        style={{ boxShadow: 'var(--shadow-lift)', ['--float-rot' as string]: '3deg' }}
      >
        <div className="flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <BellRing size={14} />
          </span>
          <div className="min-w-0">
            <p className="flex items-center justify-between gap-2 text-[11px] font-bold text-ink-900">
              LUMA <span className="font-medium text-ink-300">now</span>
            </p>
            <p className="mt-0.5 text-[12px] font-medium leading-snug text-ink-500">
              You're up next, Amara — please head to <b className="text-ink-900">Counter 3</b>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* branch load chip */}
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="animate-floaty-slow absolute -bottom-10 -left-2 z-20 flex items-center gap-2.5 rounded-2xl border border-ink-900/[0.07] bg-white/95 px-4 py-3 backdrop-blur sm:-left-10"
        style={{ boxShadow: 'var(--shadow-lift)', ['--float-rot' as string]: '-4deg' }}
      >
        <span className="dot bg-green-600"><span /></span>
        <p className="text-[12px] font-bold text-ink-900">
          Branch load: Calm <span className="font-medium text-ink-500">· 9 min avg</span>
        </p>
        <Clock3 size={14} className="text-green-600" />
      </motion.div>
    </div>
  );
}
