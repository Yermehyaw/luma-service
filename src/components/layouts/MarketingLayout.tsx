'use client';

import React from 'react';
import { MarketingNavbar } from '../navigation/MarketingNavbar';
import Link from 'next/link';

export const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFF9F3] text-slate-900">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200/80 bg-slate-900 py-12 text-white text-xs">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold">Luma</h3>
            <p className="mt-2 text-slate-400">Customer service & intelligent queue infrastructure for the digital economy.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-300 mb-2">Industries</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Commercial Banking</li>
              <li>Healthcare & Hospitals</li>
              <li>Telecom Retail</li>
              <li>Academic Registries</li>
              <li>Gov Identity Centers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-300 mb-2">Platform</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Timed Tickets</li>
              <li>Home Document Verification</li>
              <li>Social Studio</li>
              <li>Branch Console</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-300 mb-2">Multi-Tenant Engine</h4>
            <p className="text-slate-400 mb-3">One Next.js frontend serving all tenant customer & staff experiences.</p>
            <Link
              href="/tenant/acme-bank"
              className="inline-block rounded-lg bg-[var(--tenant-primary,#FF8A00)] px-3 py-1.5 text-xs font-bold text-white"
            >
              Demo Multi-Tenant Apps
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
