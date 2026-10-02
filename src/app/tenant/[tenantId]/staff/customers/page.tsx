'use client';

import React from 'react';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { Users, Search, Award, Calendar } from 'lucide-react';
import { Customer } from '../../../../../types/common';

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c_1', tenantId: 'tenant_001', name: 'Chidi Nnamdi', phone: '+234 803 123 4567', email: 'chidi@gmail.com', totalVisits: 14, lastVisit: '2026-10-02', status: 'vip' },
  { id: 'c_2', tenantId: 'tenant_001', name: 'Amina Yusuf', phone: '+234 812 987 6543', email: 'amina@smehub.ng', totalVisits: 8, lastVisit: '2026-10-01', status: 'active' },
  { id: 'c_3', tenantId: 'tenant_001', name: 'Dr. Fatima Bello', phone: '+234 701 555 1234', email: 'fatima@bello.com', totalVisits: 22, lastVisit: '2026-09-28', status: 'vip' },
  { id: 'c_4', tenantId: 'tenant_001', name: 'Samuel Eke', phone: '+234 809 444 7788', email: 'samuel@eke.org', totalVisits: 3, lastVisit: '2026-09-20', status: 'active' },
];

export default function CustomersPage() {
  return (
    <TenantStaffLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Customer CRM Directory</h1>
            <p className="text-xs text-slate-500">Search customer visit history, VIP status, and pre-cleared document profiles.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              className="w-full rounded-xl border border-slate-200 py-1.5 pl-9 pr-3 text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="py-2.5 font-bold">Customer Name</th>
                  <th className="py-2.5 font-bold">Contact</th>
                  <th className="py-2.5 font-bold">Total Visits</th>
                  <th className="py-2.5 font-bold">Last Visit</th>
                  <th className="py-2.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {MOCK_CUSTOMERS.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 text-slate-500">{c.phone} {c.email ? `(${c.email})` : ''}</td>
                    <td className="py-3 font-semibold">{c.totalVisits} visits</td>
                    <td className="py-3 text-slate-500">{c.lastVisit}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          c.status === 'vip' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TenantStaffLayout>
  );
}
