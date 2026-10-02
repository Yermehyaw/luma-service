'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_TENANTS } from '../../../mock/tenants';
import { ArrowRight, Radio } from 'lucide-react';
import { INDUSTRY_LABELS } from '../../../lib/constants';

export default function InstitutionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Institutions & Live Branches Directory</h1>
        <p className="text-xs text-slate-500">Explore real-time branch wait times, active services, and online ticket booking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_TENANTS.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="rounded-md px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: t.branding.primaryColor }}>
                {INDUSTRY_LABELS[t.industry]}
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <Radio className="h-3 w-3 animate-pulse" /> Live
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-lg">{t.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.description}</p>
            </div>

            <Link
              href={`/tenant/${t.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--tenant-primary,#0057B8)] hover:underline"
            >
              Open Tenant Customer App <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
