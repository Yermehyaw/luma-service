'use client';

import React from 'react';
import Link from 'next/link';
import { LumaLogo } from '../shared/LumaMark';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';

export const MarketingNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#FFF9F3]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <LumaLogo />
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-semibold text-slate-700 md:flex">
          <Link href="/#how" className="hover:text-slate-900">How it works</Link>
          <Link href="/features" className="hover:text-slate-900">Features</Link>
          <Link href="/institutions" className="hover:text-slate-900">Institutions</Link>
          <Link href="/company" className="hover:text-slate-900">For Business</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/platform/login"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Sign in
          </Link>
          <Link
            href="/tenant/acme-bank"
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
          >
            <span>Launch Live Multi-Tenant Demo</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
