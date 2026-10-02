'use client';

import React from 'react';
import Link from 'next/link';
import { useTenant } from '../../lib/tenant-context';
import { TenantSwitcher } from '../../features/tenant-management/components/TenantSwitcher';
import { Ticket, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export const CustomerNavbar: React.FC = () => {
  const { tenant } = useTenant();
  const basePath = `/tenant/${tenant.slug}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-6 py-3.5 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href={basePath} className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl font-extrabold text-white shadow-sm"
            style={{ backgroundColor: tenant.branding.primaryColor }}
          >
            {tenant.name[0]}
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-slate-900 leading-tight">{tenant.name}</h1>
            <span className="text-[10px] font-semibold text-slate-400">Powered by Luma Zero-Wait Engine</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-semibold text-slate-600 md:flex">
          <Link href={`${basePath}/book-queue`} className="flex items-center gap-1.5 hover:text-slate-900">
            <Ticket className="h-3.5 w-3.5 text-slate-400" />
            <span>Book Queue</span>
          </Link>
          <Link href={`${basePath}/track`} className="flex items-center gap-1.5 hover:text-slate-900">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>Track Ticket</span>
          </Link>
          <Link href={`${basePath}/verify`} className="flex items-center gap-1.5 hover:text-slate-900">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            <span>Verify Docs</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <TenantSwitcher />
          <Link
            href={`${basePath}/staff/ops-console`}
            className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
          >
            <span>Staff Console</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </header>
  );
};
