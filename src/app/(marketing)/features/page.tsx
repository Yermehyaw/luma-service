'use client';

import React from 'react';
import { Radio, ShieldCheck, Share2, BarChart3, Users, Building2 } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    { title: 'Timed Arrival Windows', desc: 'Customers pick 30-minute arrival windows to eliminate crowded lobbies.', icon: Radio },
    { title: 'AI Document Pre-Clearance', desc: 'Upload documents from home with automated OCR verification.', icon: ShieldCheck },
    { title: 'Social Studio Workstation', desc: 'Monitor social media complaints & route directly into branch queues.', icon: Share2 },
    { title: 'Executive Analytics Radar', desc: 'Track wait times, branch throughput, and SLA compliance in real time.', icon: BarChart3 },
    { title: 'Customer CRM & History', desc: 'Unified view of customer visits, document approvals, and sentiment history.', icon: Users },
    { title: 'Multi-Branch Management', desc: 'Configure services, staff counters, and opening hours across all locations.', icon: Building2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Luma Platform Features</h1>
        <p className="text-xs text-slate-500">Comprehensive customer service & queue management modules built for scale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="rounded-xl bg-orange-50 text-orange-600 p-3 w-fit">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
