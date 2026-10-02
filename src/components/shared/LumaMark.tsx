'use client';

import React from 'react';

/** The Luma mark — original motif of overlapping curved forms */
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
      <span className={`font-display text-[22px] font-extrabold tracking-[-0.03em] ${dark ? 'text-white' : 'text-slate-900'}`}>
        Luma
      </span>
    </span>
  );
}

/** Loading spinner */
export function LumaSpinner({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`animate-spin ${className}`} aria-label="Loading">
      <circle cx="20" cy="20" r="15" stroke="#FFE9D2" strokeWidth="5" fill="none" />
      <path d="M35 20a15 15 0 0 0-15-15" stroke="#F45B16" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
