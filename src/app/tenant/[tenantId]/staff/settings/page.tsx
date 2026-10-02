'use client';

import React, { useState } from 'react';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { useTenant } from '../../../../../lib/tenant-context';
import { updateTenant } from '../../../../../lib/tenant';
import { Palette, Sliders, CheckCircle2, Save, Globe, Layout, Sparkles, ExternalLink, Mail, Phone, Type } from 'lucide-react';
import { TenantFeatures } from '../../../../../types/tenant';

export default function TenantSettingsPage() {
  const { tenant } = useTenant();

  // Branding Colors
  const [primaryColor, setPrimaryColor] = useState(tenant.branding.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(tenant.branding.secondaryColor);
  const [accentColor, setAccentColor] = useState(tenant.branding.accentColor);

  // Landing Page Copy
  const [heroTitle, setHeroTitle] = useState(tenant.branding.heroTitle || `Welcome to ${tenant.name}`);
  const [heroSubtitle, setHeroSubtitle] = useState(tenant.branding.heroSubtitle || tenant.tagline);
  const [announcementTicker, setAnnouncementTicker] = useState(tenant.branding.announcementTicker || 'Live Queue System Operating · Zero Walk-in Waiting');
  const [ctaButtonText, setCtaButtonText] = useState(tenant.branding.ctaButtonText || 'Book a Timed Ticket');
  const [contactEmail, setContactEmail] = useState(tenant.branding.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(tenant.branding.contactPhone || '');

  // Subdomain & Features
  const [subdomain, setSubdomain] = useState(tenant.slug);
  const [features, setFeatures] = useState<TenantFeatures>({ ...tenant.features });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'luma.com';
  const customSubdomainUrl = `https://${subdomain}.${platformDomain}`;
  const localSubdomainUrl = `/tenant/${subdomain}`;

  const handleToggle = (key: keyof TenantFeatures) => {
    setFeatures({ ...features, [key]: !features[key] });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedBranding = {
      ...tenant.branding,
      primaryColor,
      secondaryColor,
      accentColor,
      heroTitle,
      heroSubtitle,
      announcementTicker,
      ctaButtonText,
      contactEmail,
      contactPhone,
    };

    tenant.branding = updatedBranding;
    tenant.features = features;

    // Apply CSS vars dynamically to DOM
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--tenant-primary', primaryColor);
      document.documentElement.style.setProperty('--tenant-secondary', secondaryColor);
      document.documentElement.style.setProperty('--tenant-accent', accentColor);
    }

    await updateTenant(tenant.slug, {
      branding: updatedBranding,
      features,
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <TenantStaffLayout>
      <div className="mx-auto max-w-4xl space-y-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Custom Subdomain & Landing Page Builder</h1>
            <p className="text-xs text-slate-500">Configure your business landing page copy, custom subdomain, brand theme colors, and module permissions.</p>
          </div>

          <a
            href={localSubdomainUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
          >
            <Globe className="h-4 w-4 text-sky-400" />
            <span>Preview Landing Page</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-sm animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Landing page customizations and theme styles published successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Subdomain Configuration Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <Globe className="h-4 w-4 text-[var(--tenant-primary,#0057B8)]" />
              Business Custom Subdomain Settings
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Subdomain Slug</label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <span className="px-3 text-xs font-bold text-slate-400 bg-slate-100 py-2.5 border-r border-slate-200">https://</span>
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full bg-white px-3 py-2.5 text-xs font-bold font-mono text-slate-900 focus:outline-none"
                />
                <span className="px-3 text-xs font-bold text-slate-500 bg-slate-100 py-2.5 border-l border-slate-200">.{platformDomain}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Your customer landing page is instantly accessible at <span className="font-bold text-slate-800">{customSubdomainUrl}</span> or locally at <span className="font-bold text-slate-800">http://{subdomain}.localhost:3000</span>.
              </p>
            </div>
          </div>

          {/* Landing Page Content Customizer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <Layout className="h-4 w-4 text-[var(--tenant-primary,#0057B8)]" />
              Custom Landing Page Content & Messaging
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-slate-400" /> Hero Headline
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="e.g. Welcome to Acme Bank Customer Service"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 font-semibold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Hero Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Explain your customer arrival and queue booking window details"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-slate-400" /> Announcement Bar Ticker
                </label>
                <input
                  type="text"
                  value={announcementTicker}
                  onChange={(e) => setAnnouncementTicker(e.target.value)}
                  placeholder="e.g. Live Queue Operating · Priority windows available"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Call-To-Action (CTA) Button Text</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  placeholder="e.g. Book a Timed Ticket"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Customer Support Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="support@yourcompany.com"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Support Hotline
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+234 800 123 4567"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Branding Colors */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <Palette className="h-4 w-4 text-[var(--tenant-primary,#0057B8)]" />
              Custom Brand Theme & CSS Palette
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
              Enabled Customer Modules & Features
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
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-emerald-400" />
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish Landing Page'}</span>
          </button>
        </form>
      </div>
    </TenantStaffLayout>
  );
}
