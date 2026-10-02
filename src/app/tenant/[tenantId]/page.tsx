import { getTenantBySlug } from '../../../lib/tenant';
import { notFound } from 'next/navigation';
import { TenantCustomerLayout } from '../../../components/layouts/TenantCustomerLayout';
import Link from 'next/link';
import { Ticket, ShieldCheck, MapPin, ArrowRight, Clock, Users, Radio } from 'lucide-react';
import { MOCK_BRANCHES } from '../../../mock/branches';
import { MOCK_SERVICES } from '../../../mock/services';

export default async function TenantCustomerPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const resolvedParams = await params;
  const tenant = await getTenantBySlug(resolvedParams.tenantId);

  if (!tenant) {
    notFound();
  }

  const branches = MOCK_BRANCHES.filter((b) => b.tenantId === tenant.id);
  const services = MOCK_SERVICES.filter((s) => s.tenantId === tenant.id);
  const basePath = `/tenant/${tenant.slug}`;

  return (
    <TenantCustomerLayout initialTenant={tenant}>
      <div className="space-y-16 pb-20">
        {/* Dynamic Tenant Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[var(--tenant-primary,#0057B8)]/10 via-[var(--tenant-bg,#F4F8FC)] to-[var(--tenant-bg,#F4F8FC)] py-16">
          <div className="mx-auto max-w-6xl px-6 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              Live Queue System Operating · Zero Walk-in Waiting
            </span>

            <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Welcome to <span style={{ color: tenant.branding.primaryColor }}>{tenant.name}</span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm text-slate-600 leading-relaxed">
              {tenant.tagline}. Reserve a 30-minute arrival window or pre-clear your documents from home to bypass lobby queues entirely.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href={`${basePath}/book-queue`}
                className="flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: tenant.branding.primaryColor }}
              >
                <Ticket className="h-4 w-4" />
                <span>Book a Timed Ticket</span>
              </Link>
              <Link
                href={`${basePath}/verify`}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Pre-Verify Documents</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Available Services */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">Services & Priority Windows</h2>
              <p className="text-xs text-slate-500">Select a service to request a digital arrival ticket.</p>
            </div>
            <Link href={`${basePath}/book-queue`} className="text-xs font-bold text-[var(--tenant-primary,#0057B8)] flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    ~{s.minutes} mins
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                <Link
                  href={`${basePath}/book-queue?service=${s.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--tenant-primary,#0057B8)] pt-2"
                >
                  Book Window <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Live Branch Locations */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">Live Branch Network</h2>
              <p className="text-xs text-slate-500">Real-time status and wait times across {tenant.name} branches.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((b) => (
              <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{b.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {b.address}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Open until {b.openUntil}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 capitalize">
                    {b.liveLoad} Load
                  </span>
                  <p className="text-xs font-extrabold text-[var(--tenant-primary,#0057B8)]">
                    ~{b.waitMin} min wait
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TenantCustomerLayout>
  );
}
