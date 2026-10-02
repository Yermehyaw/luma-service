'use client';

import React, { useState } from 'react';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { useTenant } from '../../../../../lib/tenant-context';
import { Settings, Palette, Sliders, CheckCircle2, Save } from 'lucide-react';
import { TenantFeatures } from '../../../../../types/tenant';

export default function TenantSettingsPage() {
  const { tenant } = useTenant();
  const [primaryColor, setPrimaryColor] = useState(tenant.branding.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(tenant.branding.secondaryColor);
  const [accentColor, setAccentColor] = useState(tenant.branding.accentColor);
  const [features, setFeatures] = useState<TenantFeatures>({ ...tenant.features });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof TenantFeatures) => {
    setFeatures({ ...features, [key]: !features[key] });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    tenant.branding.primaryColor = primaryColor;
    tenant.branding.secondaryColor = secondaryColor;
    tenant.branding.accentColor = accentColor;
    tenant.features = features;

    // Apply CSS vars dynamically to DOM
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--tenant-primary', primaryColor);
      document.documentElement.style.setProperty('--tenant-secondary', secondaryColor);
      document.documentElement.style.setProperty('--tenant-accent', accentColor);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <TenantStaffLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Tenant Branding & Feature Settings</h1>
            <p className="text-xs text-slate-500">Dynamically customize colors, logos, and feature module flags for {tenant.name}.</p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Tenant configuration and CSS variables updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Branding Colors */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <Palette className="h-4 w-4 text-[var(--tenant-primary,#0057B8)]" />
              Tenant Branding Engine Colors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Primary Brand Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-12 rounded-xl border border-slate-200 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Secondary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-12 rounded-xl border border-slate-200 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Accent Highlight Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-12 rounded-xl border border-slate-200 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <Sliders className="h-4 w-4 text-[var(--tenant-primary,#0057B8)]" />
              Tenant Feature Flags Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {(Object.keys(features) as (keyof TenantFeatures)[]).map((key) => (
                <div key={key} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 bg-slate-50">
                  <span className="font-semibold capitalize text-slate-800">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                      features[key] ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        features[key] ? 'translate-x-5' : 'translate-x-0.5'
                      } my-0.5`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800"
          >
            <Save className="h-4 w-4" />
            <span>Save Tenant Configuration</span>
          </button>
        </form>
      </div>
    </TenantStaffLayout>
  );
}
