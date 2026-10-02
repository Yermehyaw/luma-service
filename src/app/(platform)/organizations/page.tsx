'use client';

import React, { useState } from 'react';
import { MOCK_TENANTS } from '../../../mock/tenants';
import { Tenant } from '../../../types/tenant';
import { Building2, Plus, Check, Shield } from 'lucide-react';
import { INDUSTRY_LABELS } from '../../../lib/constants';

export default function OrganizationsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [industry, setIndustry] = useState<Tenant['industry']>('banking');
  const [color, setColor] = useState('#0057B8');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    const newTenant: Tenant = {
      id: `tenant_${Date.now()}`,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      name,
      domain: `${slug.toLowerCase()}.luma.com`,
      industry,
      tagline: 'Custom Organization Branch Services',
      description: 'Newly provisioned multi-tenant organization.',
      city: 'Lagos',
      area: 'Central',
      rating: 5.0,
      reviewCount: 1,
      branding: {
        primaryColor: color,
        secondaryColor: '#000000',
        accentColor: '#FF8A00',
        backgroundColor: '#F4F8FC',
        textColor: '#0B1D3A',
      },
      features: {
        queue: true,
        ticketing: true,
        social: true,
        messaging: true,
        notifications: true,
        analytics: true,
        verification: true,
        customerManagement: true,
        branchManagement: true,
        servicesManagement: true,
        appointments: false,
      },
      createdAt: new Date().toISOString(),
    };
    setTenants([newTenant, ...tenants]);
    setShowModal(false);
    setName('');
    setSlug('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Organizations & Tenants</h1>
          <p className="text-xs text-slate-500">Manage SaaS multi-tenant accounts, custom domains, and feature entitlements.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Organization</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white"
                style={{ backgroundColor: t.branding.primaryColor }}
              >
                {t.name[0]}
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Active</span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.domain}</p>
              <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {INDUSTRY_LABELS[t.industry]}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-3 text-xs text-slate-500 flex justify-between">
              <span>Features Enabled:</span>
              <span className="font-bold text-slate-900">
                {Object.values(t.features).filter(Boolean).length} / 11 Modules
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">Provision New Tenant</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Union Bank Lekki"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Tenant Slug Subdomain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. union-bank"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Industry Sector</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Tenant['industry'])}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 bg-white"
                >
                  <option value="banking">Banking & Finance</option>
                  <option value="healthcare">Healthcare & Hospitals</option>
                  <option value="telecom">Telecom & Retail</option>
                  <option value="education">Education & Universities</option>
                  <option value="government">Government & Civic</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Brand Primary Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 p-1 cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 font-bold text-white hover:bg-slate-800"
                >
                  Provision Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
