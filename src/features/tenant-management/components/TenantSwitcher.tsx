'use client';

import React from 'react';
import { useTenant } from '../../../lib/tenant-context';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { INDUSTRY_LABELS } from '../../../lib/constants';

export const TenantSwitcher: React.FC = () => {
  const { tenant, allTenants, setTenantSlug } = useTenant();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tenant.branding.primaryColor }} />
        <Building2 className="h-3.5 w-3.5 text-slate-400" />
        <span>{tenant.name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Demo Tenant</p>
            <p className="text-xs text-slate-500">Live multi-tenant configuration demo</p>
          </div>

          <div className="mt-1 space-y-1">
            {allTenants.map((t) => {
              const active = t.id === tenant.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTenantSlug(t.slug);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                    active ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: t.branding.primaryColor }} />
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{INDUSTRY_LABELS[t.industry] || t.industry}</p>
                    </div>
                  </div>
                  {active && <Check className="h-4 w-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
