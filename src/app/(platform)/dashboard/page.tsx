'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_TENANTS } from '../../../mock/tenants';
import { Building2, Users, CreditCard, ShieldCheck, ArrowRight, Plus } from 'lucide-react';
import { INDUSTRY_LABELS } from '../../../lib/constants';

export default function PlatformDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Luma SaaS Platform Dashboard</h1>
          <p className="text-xs text-slate-500">Global overview of registered tenants, active subscriptions, and platform metrics.</p>
        </div>
        <Link
          href="/platform/organizations"
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          <span>Provision New Tenant</span>
        </Link>
      </div>

      {/* Global SaaS Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Active Tenants</span>
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{MOCK_TENANTS.length}</span>
          <p className="text-[11px] text-emerald-600 font-bold">+2 onboarded this week</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Monthly Recurring Revenue</span>
            <CreditCard className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">$34,800</span>
          <p className="text-[11px] text-emerald-600 font-bold">+14.2% MRR growth</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Monthly Queues Processed</span>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">148,200</span>
          <p className="text-[11px] text-purple-600 font-bold">Zero downtime SLA</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Verified Documents</span>
            <ShieldCheck className="h-5 w-5 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">42,900</span>
          <p className="text-[11px] text-amber-600 font-bold">99.1% AI OCR accuracy</p>
        </div>
      </div>

      {/* Tenant Directory & Quick Switch */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-slate-900">Provisioned Multi-Tenant Organizations</h3>
          <span className="text-xs text-slate-500">All powered by single App Router codebase</span>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_TENANTS.map((t) => (
            <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-sm shrink-0"
                  style={{ backgroundColor: t.branding.primaryColor }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {INDUSTRY_LABELS[t.industry]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{t.domain} · {t.city}, {t.area}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/tenant/${t.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Customer App
                </Link>
                <Link
                  href={`/tenant/${t.slug}/staff/ops-console`}
                  className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <span>Staff App</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
