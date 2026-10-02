'use client';

import React from 'react';
import { Ticket } from '../../../types/ticket';
import { Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="bg-[var(--tenant-primary,#0057B8)] px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium opacity-80">{ticket.tenantName}</span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            {ticket.status.toUpperCase()}
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <h2 className="text-3xl font-black tracking-tight">{ticket.code}</h2>
          <span className="text-xs font-semibold text-white/90">Position #{ticket.position}</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{ticket.serviceName}</h4>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {ticket.branchName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
          <div>
            <span className="text-slate-400">Arrival Window</span>
            <p className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {ticket.windowStart} - {ticket.windowEnd}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Est. Waiting</span>
            <p className="font-bold text-[var(--tenant-primary,#0057B8)] mt-0.5">
              ~{ticket.estimatedWaitMinutes} minutes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">Documents Verified</span>
          </div>
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        </div>
      </div>
    </div>
  );
};
