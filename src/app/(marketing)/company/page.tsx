'use client';

import React from 'react';
import { Building2, Shield, Users, Mail, Phone, MapPin } from 'lucide-react';

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="rounded-full bg-slate-900 px-3.5 py-1 text-xs font-bold text-white">About Luma</span>
        <h1 className="font-display text-4xl font-extrabold text-slate-900">Building Infrastructure for Zero-Wait Customer Experiences</h1>
        <p className="text-sm text-slate-600">
          Luma is modernizing physical branch interactions across banking, healthcare, education, and public sector institutions throughout Africa and emerging markets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
          <Building2 className="h-6 w-6 text-orange-600" />
          <h3 className="font-bold text-slate-900">Multi-Tenant SaaS Engine</h3>
          <p className="text-xs text-slate-500">Deploy custom-branded customer & staff portals for any organization within minutes.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
          <Shield className="h-6 w-6 text-emerald-600" />
          <h3 className="font-bold text-slate-900">Document Pre-Verification</h3>
          <p className="text-xs text-slate-500">Eliminate turn-aways by verifying customer paperwork at home before branch arrival.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-slate-900">Branch Collaboration</h3>
          <p className="text-xs text-slate-500">Empower counter staff with live triage tools and integrated social care radar.</p>
        </div>
      </div>
    </div>
  );
}
