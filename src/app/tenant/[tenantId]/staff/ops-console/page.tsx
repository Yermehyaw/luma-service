'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { useLiveQueue } from '../../../../../features/queue-management/hooks/useQueue';
import { QueueCard } from '../../../../../features/queue-management/components/QueueCard';
import { QueueControls } from '../../../../../features/queue-management/components/QueueControls';
import { MOCK_BRANCHES } from '../../../../../mock/branches';
import { MOCK_DOCUMENTS } from '../../../../../mock/tickets';
import { VerificationCard } from '../../../../../features/verification/components/VerificationCard';
import { Radio, Users, CheckCircle, Clock } from 'lucide-react';

export default function OpsConsolePage() {
  const params = useParams();
  const tenantSlug = (params?.tenantId as string) || 'acme-bank';
  const branchId = 'br_admiralty';

  const { queue, loading, callNext, completeCurrent, skipCurrent } = useLiveQueue(branchId);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);

  const activeTicket = queue?.items.find((i) => i.status === 'called' || i.status === 'serving') || null;

  const handleVerify = (id: string) => {
    setDocuments(documents.map((d) => (d.id === id ? { ...d, status: 'verified' } : d)));
  };

  const handleFlag = (id: string) => {
    setDocuments(documents.map((d) => (d.id === id ? { ...d, status: 'flagged' } : d)));
  };

  return (
    <TenantStaffLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Branch Operations Console</h1>
            <p className="text-xs text-slate-500">Live triage, counter calls, ticket queue, and document clearance.</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            Live Queue Console
          </span>
        </div>

        {/* Counter Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <QueueControls
              currentTicket={activeTicket}
              onCallNext={() => callNext(1)}
              onComplete={(id) => completeCurrent(id)}
              onSkip={(id) => skipCurrent(id)}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {queue && <QueueCard queue={queue} />}

            {/* Waiting Queue List Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Customers Waiting in Line</h3>
                <span className="text-xs font-semibold text-slate-400">Total: {queue?.items.length || 0}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="py-2.5 font-bold">Code</th>
                      <th className="py-2.5 font-bold">Customer Name</th>
                      <th className="py-2.5 font-bold">Service</th>
                      <th className="py-2.5 font-bold">Position</th>
                      <th className="py-2.5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {queue?.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 font-mono font-bold text-[var(--tenant-primary,#0057B8)]">{item.ticketCode}</td>
                        <td className="py-3">{item.customerName}</td>
                        <td className="py-3 text-slate-500">{item.serviceName}</td>
                        <td className="py-3 font-bold">#{item.position}</td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                              item.status === 'called'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Document Verification Queue */}
        <div className="space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900">Pre-Uploaded Documents Pending Clearance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <VerificationCard key={doc.id} document={doc} onVerify={handleVerify} onFlag={handleFlag} />
            ))}
          </div>
        </div>
      </div>
    </TenantStaffLayout>
  );
}
