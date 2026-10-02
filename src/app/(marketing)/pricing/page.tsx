'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    { name: 'Starter Branch', price: '$290', period: '/month per branch', desc: 'Ideal for single branch clinics and credit unions.', features: ['Up to 2 live queues', 'Basic SMS queue alerts', 'Customer portal', 'Standard support'] },
    { name: 'Enterprise Network', price: '$750', period: '/month per branch', desc: 'Full multi-tenant suite for commercial banks and hospitals.', features: ['Unlimited live queues', 'AI Document Pre-Verification', 'Social Studio Workstation', 'Executive Analytics Radar', '24/7 Priority SLA'], highlight: true },
    { name: 'Government & Civic', price: 'Custom', period: 'volume licensing', desc: 'Custom identity & national enrollment infrastructure.', features: ['Dedicated private cloud / regional deployment', 'Custom NIN/ID integrations', 'On-premise hardware kiosk support', 'Dedicated TAM'] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Simple, Transparent SaaS Pricing</h1>
        <p className="text-xs text-slate-500">Scale Luma across your branch network with flexible multi-tenant licensing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-8 space-y-6 relative flex flex-col justify-between ${
              p.highlight ? 'border-orange-500 bg-white shadow-xl ring-2 ring-orange-500/20' : 'border-slate-200 bg-white shadow-sm'
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 right-6 rounded-full bg-orange-600 px-3 py-1 text-[10px] font-extrabold text-white">
                MOST POPULAR
              </span>
            )}
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{p.desc}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">{p.price}</span>
                <span className="text-xs text-slate-500">{p.period}</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/tenant/acme-bank"
              className={`block w-full text-center rounded-xl py-3 text-xs font-bold transition-all ${
                p.highlight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              Start Free 14-Day Trial
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
