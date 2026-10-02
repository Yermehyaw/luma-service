'use client';

import React from 'react';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { MOCK_BRANCHES } from '../../../../../mock/branches';
import { useTenant } from '../../../../../lib/tenant-context';
import { Building2, MapPin, Clock, Radio, Plus } from 'lucide-react';

export default function BranchesPage() {
  const { tenant } = useTenant();
  const branches = MOCK_BRANCHES.filter((b) => b.tenantId === tenant.id);

  return (
    <TenantStaffLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Branch Network Management</h1>
            <p className="text-xs text-slate-500">Configure physical branch locations, operating hours, and live load status.</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800">
            <Plus className="h-4 w-4" />
            <span>Add Branch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((b) => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
                  Live ({b.liveLoad})
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {b.address}, {b.city}
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Open until {b.openUntil} · Avg wait ~{b.waitMin}m
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Active Counters: 4</span>
                <button className="font-bold text-[var(--tenant-primary,#0057B8)] hover:underline">Edit Branch Configuration</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TenantStaffLayout>
  );
}
