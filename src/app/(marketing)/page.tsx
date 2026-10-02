'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_TENANTS } from '../../mock/tenants';
import { MOCK_TESTIMONIALS } from '../../mock/social';
import { ArrowRight, ShieldCheck, Clock, Users, Sparkles, Building2, CheckCircle, Radio } from 'lucide-react';
import { INDUSTRY_LABELS } from '../../lib/constants';

export default function MarketingHomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Live Marquee Ticker */}
      <div className="overflow-hidden border-y border-slate-200/60 bg-white/80 py-3 backdrop-blur">
        <div className="animate-marquee flex w-max items-center gap-8 pr-8 text-xs font-semibold text-slate-600">
          {[
            'LM-A042 called to Counter 3 · Acme Bank Lekki',
            'Amara checked in 2 min early · 11 min door-to-teller',
            'Lagoon General Hospital · lab queue currently calm',
            '94 documents verified overnight · Makerere Academic Registry',
            'Nairobi CBD · licence renewals at 9 min wait',
            'Saturday pilot cut waits 78% · Union Commercial',
          ].concat([
            'LM-A042 called to Counter 3 · Acme Bank Lekki',
            'Amara checked in 2 min early · 11 min door-to-teller',
            'Lagoon General Hospital · lab queue currently calm',
          ]).map((msg, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 text-center pt-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700">
          <Sparkles className="h-3.5 w-3.5" />
          Multi-Tenant Next.js Architecture v2.0
        </span>

        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15]">
          Customer Service & Intelligent Queues for the <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Digital Economy</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600">
          One unified platform powering timed arrival windows, home document pre-clearance, branch collaboration, and customer care for banks, hospitals, universities, and government identity centers.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tenant/acme-bank"
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <span>Demo Acme Bank Tenant</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/tenant/city-hospital"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            <span>Demo City Hospital Tenant</span>
          </Link>
        </div>
      </section>

      {/* Multi-Tenant Live Network Showcase */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">Organizations Live on Luma</h2>
          <p className="mt-1 text-xs text-slate-500">Every tenant uses the same unified frontend code with custom branding & features.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TENANTS.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold text-white"
                    style={{ backgroundColor: t.branding.primaryColor }}
                  >
                    {INDUSTRY_LABELS[t.industry] || t.industry}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Live Tenant
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-slate-900">{t.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{t.tagline}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Rating: <strong>★ {t.rating}</strong></span>
                <Link
                  href={`/tenant/${t.slug}`}
                  className="font-bold text-slate-900 hover:underline flex items-center gap-1"
                >
                  View Tenant App <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / 7 Steps */}
      <section className="bg-white py-16 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-slate-900">How Luma Transforms Branch Queues</h2>
            <p className="mt-1 text-xs text-slate-500">From home booking to instant counter service in 7 steps.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Choose service', desc: 'Select bank, hospital, or registry service.' },
              { num: '02', title: 'Book arrival window', desc: 'Pick a 30-minute window that fits your schedule.' },
              { num: '03', title: 'Verify documents', desc: 'Upload paperwork online for AI pre-clearance.' },
              { num: '04', title: 'Track live position', desc: 'Receive real-time queue position alerts on mobile.' },
            ].map((step, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-50 p-6 space-y-2 border border-slate-100">
                <span className="font-mono text-2xl font-black text-slate-300">{step.num}</span>
                <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
