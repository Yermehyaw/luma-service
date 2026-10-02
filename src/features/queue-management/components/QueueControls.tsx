'use client';

import React from 'react';
import { QueueItem } from '../types';
import { Bell, CheckCircle, SkipForward, User } from 'lucide-react';

interface QueueControlsProps {
  currentTicket: QueueItem | null;
  onCallNext: () => void;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  loading?: boolean;
}

export const QueueControls: React.FC<QueueControlsProps> = ({
  currentTicket,
  onCallNext,
  onComplete,
  onSkip,
  loading = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Serving</span>
          <h2 className="text-3xl font-extrabold text-slate-900">{currentTicket ? currentTicket.ticketCode : 'No Active Ticket'}</h2>
        </div>
        {currentTicket && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            Counter {currentTicket.counterNumber || 1}
          </span>
        )}
      </div>

      {currentTicket ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <User className="h-4 w-4 text-slate-400" />
            <span className="font-semibold">{currentTicket.customerName}</span>
            {currentTicket.customerPhone && <span className="text-xs text-slate-400">({currentTicket.customerPhone})</span>}
          </div>
          <p className="text-xs text-slate-500">Service: {currentTicket.serviceName}</p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={() => onComplete(currentTicket.id)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-hover hover:bg-emerald-700"
            >
              <CheckCircle className="h-4 w-4" />
              Complete Ticket
            </button>
            <button
              onClick={() => onSkip(currentTicket.id)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-hover hover:bg-slate-100"
            >
              <SkipForward className="h-4 w-4" />
              Skip Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-xs text-slate-500">Counter is idle. Call the next waiting customer when ready.</p>
        </div>
      )}

      <button
        onClick={onCallNext}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--tenant-primary,#0057B8)] px-4 py-3 text-sm font-bold text-white shadow-sm transition-hover hover:opacity-90"
      >
        <Bell className="h-4 w-4" />
        Call Next Customer
      </button>
    </div>
  );
};
