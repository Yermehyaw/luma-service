'use client';

import React from 'react';
import { Ticket, Users, Clock, ShieldCheck, TrendingUp, Award } from 'lucide-react';

interface AnalyticsOverviewProps {
  ticketsIssued?: string;
  avgWait?: string;
  onTimeRate?: string;
  branchesLive?: number;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  ticketsIssued = '148,200+',
  avgWait = '8.4 mins',
  onTimeRate = '98.6%',
  branchesLive = 12,
}) => {
  const cards = [
    { title: 'Total Tickets Cleared', value: ticketsIssued, change: '+18.4% this month', icon: Ticket, color: 'text-blue-600 bg-blue-50' },
    { title: 'Average Door-to-Teller Wait', value: avgWait, change: '-78% vs paper queues', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'On-Time Appointment Rate', value: onTimeRate, change: '+4.2% SLA compliance', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50' },
    { title: 'Active Live Branches', value: String(branchesLive), change: '100% operational', icon: Award, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{c.title}</span>
                <div className={`rounded-xl p-2.5 ${c.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">{c.value}</span>
                <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {c.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Wait Time Bar Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-slate-900">Wait Time Reduction vs Legacy Paper Queues</h3>
        <p className="text-xs text-slate-500 mt-0.5">Average customer wait time (minutes) by arrival window</p>

        <div className="mt-6 space-y-4">
          {[
            { window: '08:00 - 10:00 (Peak Morning)', luma: 8, legacy: 48 },
            { window: '10:00 - 12:00 (Mid-day Clearance)', luma: 6, legacy: 35 },
            { window: '12:00 - 14:00 (Lunch Priority Window)', luma: 9, legacy: 52 },
            { window: '14:00 - 16:00 (Afternoon Closing)', luma: 7, legacy: 40 },
          ].map((bar, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between font-medium text-slate-700">
                <span>{bar.window}</span>
                <span>Luma: <strong>{bar.luma}m</strong> vs Paper: <span className="line-through text-slate-400">{bar.legacy}m</span></span>
              </div>
              <div className="flex h-3.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="bg-[var(--tenant-primary,#0057B8)] rounded-l-full"
                  style={{ width: `${(bar.luma / 60) * 100}%` }}
                />
                <div
                  className="bg-slate-300 rounded-r-full opacity-40"
                  style={{ width: `${((bar.legacy - bar.luma) / 60) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
