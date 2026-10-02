'use client';

import React from 'react';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { MOCK_TENANTS } from '../../../mock/tenants';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">SaaS Billing & Subscriptions</h1>
        <p className="text-xs text-slate-500">Monitor tenant subscription tier, active branch quotas, and monthly invoices.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Tenant Subscription Status</h3>

        <div className="divide-y divide-slate-100 text-xs">
          {MOCK_TENANTS.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-slate-700">$750 / mo</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">Paid & Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
