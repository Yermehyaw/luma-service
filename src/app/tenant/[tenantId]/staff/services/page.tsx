'use client';

import React from 'react';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { MOCK_SERVICES } from '../../../../../mock/services';
import { useTenant } from '../../../../../lib/tenant-context';
import { Briefcase, Plus, Clock } from 'lucide-react';

export default function ServicesPage() {
  const { tenant } = useTenant();
  const services = MOCK_SERVICES.filter((s) => s.tenantId === tenant.id);

  return (
    <TenantStaffLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Services Catalog Management</h1>
            <p className="text-xs text-slate-500">Configure ticketed services, estimated service durations, and window availability.</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800">
            <Plus className="h-4 w-4" />
            <span>Create New Service</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                  ~{s.minutes} mins
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-emerald-600">Active Service</span>
                <button className="font-bold text-slate-900 hover:underline">Edit Duration</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TenantStaffLayout>
  );
}
