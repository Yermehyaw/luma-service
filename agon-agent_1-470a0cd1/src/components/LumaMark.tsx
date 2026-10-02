/**
 * The Luma mark — an original motif of overlapping curved forms:
 * a full sun-disc (orange), an open halo ring (green) and
 * a rising dot (warm pink) on a deep navy rounded tile.
 */
export function LumaMark({ size = 36, tile = true, className = '' }: { size?: number; tile?: boolean; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      {tile && <rect width="40" height="40" rx="13" fill="#202957" />}
      <circle cx="16" cy="14.5" r="8.4" fill="#FF8A00" />
      <circle cx="24.5" cy="26" r="8" fill={tile ? '#202957' : '#FFF9F3'} />
      <path
        d="M31.2 30.2a8 8 0 1 1-8.9-9.2"
        stroke="#12A05A"
        strokeWidth="4.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="30" cy="13" r="3.4" fill="#F4AFCB" />
    </svg>
  );
}

/** Wordmark: mark + "Luma" */
export function LumaLogo({ dark = false, size = 34 }: { dark?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LumaMark size={size} className="shrink-0 transition-transform duration-300 group-hover:rotate-[8deg]" />
      <span className={`font-display text-[22px] font-extrabold tracking-[-0.03em] ${dark ? 'text-white' : 'text-ink-900'}`}>
        Luma
      </span>
    </span>
  );
}

/**
 * Ambient motif: overlapping circles + halo arcs in brand colours.
 * Pure decoration — use sparingly behind heroes and section headers.
 */
export function LumaMotif({ variant = 'a', className = '' }: { variant?: 'a' | 'b' | 'c'; className?: string }) {
  if (variant === 'b') {
    return (
      <svg viewBox="0 0 220 160" fill="none" className={className} aria-hidden="true">
        <circle cx="70" cy="80" r="52" fill="#FFE9D2" />
        <circle cx="130" cy="62" r="44" fill="#DDF5E8" />
        <path d="M168 118a48 48 0 1 1 6-86" stroke="#F4AFCB" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.9" />
        <circle cx="52" cy="34" r="10" fill="#FF8A00" />
      </svg>
    );
  }
  if (variant === 'c') {
    return (
      <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
        <rect x="14" y="60" width="120" height="120" rx="42" fill="#FCE8F1" />
        <circle cx="128" cy="76" r="52" fill="#DDF5E8" />
        <path d="M36 42a44 44 0 0 1 62-22" stroke="#FF8A00" strokeWidth="16" strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
      <circle cx="80" cy="90" r="62" fill="#FFE9D2" />
      <circle cx="150" cy="70" r="54" fill="#DDF5E8" />
      <circle cx="186" cy="116" r="40" fill="#FCE8F1" />
      <path d="M114 150a58 58 0 0 1-92-16" stroke="#202957" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.14" />
      <circle cx="214" cy="44" r="9" fill="#F45B16" />
    </svg>
  );
}

/** Loading spinner built from the mark halo */
export function LumaSpinner({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`animate-spin ${className}`} aria-label="Loading">
      <circle cx="20" cy="20" r="15" stroke="#FFE9D2" strokeWidth="5" fill="none" />
      <path d="M35 20a15 15 0 0 0-15-15" stroke="#F45B16" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
