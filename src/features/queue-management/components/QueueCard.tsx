'use client';

import React from 'react';
import { BranchQueue } from '../types';
import { Users, Clock, Radio, ArrowRight } from 'lucide-react';

interface QueueCardProps {
  queue: BranchQueue;
  onSelect?: (queue: BranchQueue) => void;
}

export const QueueCard: React.FC<QueueCardProps> = ({ queue, onSelect }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
            Live Queue Active
          </span>
          <h3 className="mt-2 font-display text-lg font-bold text-slate-900">{queue.branchName}</h3>
          <p className="text-xs text-slate-500">{queue.serviceName}</p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black tracking-tight text-[var(--tenant-primary,#0057B8)]">
            {queue.currentNumber || '---'}
          </span>
          <p className="text-[10px] font-semibold text-slate-400">COUNTER {queue.servingCounter || 1}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="h-4 w-4 text-slate-400" />
          <span><strong>{queue.totalWaiting}</strong> customers waiting</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          <span><strong>~{queue.averageWaitTimeMin} min</strong> avg wait</span>
        </div>
      </div>

      {onSelect && (
        <button
          onClick={() => onSelect(queue)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--tenant-primary,#0057B8)] px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <span>Manage Queue Console</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
