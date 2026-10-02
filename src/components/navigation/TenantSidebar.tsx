'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '../../lib/tenant-context';
import { useAuth } from '../../lib/auth';
import { hasPermission } from '../../lib/permissions';
import {
  LayoutDashboard,
  Radio,
  Users,
  Building2,
  Briefcase,
  Share2,
  BarChart3,
  Settings,
  ShieldCheck,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { NavItem } from '../../types/common';

export const TenantSidebar: React.FC = () => {
  const pathname = usePathname();
  const { tenant, isFeatureEnabled } = useTenant();
  const { user } = useAuth();

  const basePath = `/tenant/${tenant.slug}/staff`;

  const allNavItems: (NavItem & { featureKey?: keyof typeof tenant.features })[] = [
    { title: 'Ops Console', href: `${basePath}/ops-console`, icon: 'LayoutDashboard' },
    { title: 'Live Queues', href: `${basePath}/ops-console`, icon: 'Radio', featureKey: 'queue' },
    { title: 'Social Studio', href: `${basePath}/social-studio`, icon: 'Share2', featureKey: 'social', permission: 'social.view' },
    { title: 'Customers', href: `${basePath}/customers`, icon: 'Users', featureKey: 'customerManagement', permission: 'customers.view' },
    { title: 'Branches', href: `${basePath}/branches`, icon: 'Building2', featureKey: 'branchManagement' },
    { title: 'Services', href: `${basePath}/services`, icon: 'Briefcase', featureKey: 'servicesManagement' },
    { title: 'Document Verification', href: `${basePath}/verify`, icon: 'ShieldCheck', featureKey: 'verification', permission: 'tickets.verify' },
    { title: 'Analytics', href: `${basePath}/analytics`, icon: 'BarChart3', featureKey: 'analytics', permission: 'analytics.view' },
    { title: 'Settings', href: `${basePath}/settings`, icon: 'Settings' },
  ];

  const filteredItems = allNavItems.filter((item) => {
    if (item.featureKey && !isFeatureEnabled(item.featureKey)) return false;
    if (item.permission && !hasPermission(user, item.permission as any)) return false;
    return true;
  });

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className="h-4 w-4" />;
      case 'Radio': return <Radio className="h-4 w-4 text-emerald-500" />;
      case 'Share2': return <Share2 className="h-4 w-4" />;
      case 'Users': return <Users className="h-4 w-4" />;
      case 'Building2': return <Building2 className="h-4 w-4" />;
      case 'Briefcase': return <Briefcase className="h-4 w-4" />;
      case 'ShieldCheck': return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
      case 'BarChart3': return <BarChart3 className="h-4 w-4" />;
      case 'Settings': return <Settings className="h-4 w-4" />;
      default: return <LayoutDashboard className="h-4 w-4" />;
    }
  };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 shadow-sm min-h-screen">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl font-black text-white shadow-sm"
          style={{ backgroundColor: tenant.branding.primaryColor }}
        >
          {tenant.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-sm font-bold text-slate-900">{tenant.name}</h2>
          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {tenant.industry} Portal
          </span>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {filteredItems.map((item) => {
          const active = pathname === item.href || (item.href !== basePath && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                active
                  ? 'bg-[var(--tenant-primary,#0057B8)] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {renderIcon(item.icon)}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-2xl bg-[var(--tenant-bg,#F4F8FC)] p-4 text-xs border border-slate-200/60">
        <p className="font-bold text-[var(--tenant-text,#0B1D3A)]">Dynamic Tenant Configuration</p>
        <p className="mt-1 text-slate-500 leading-relaxed text-[11px]">
          Feature modules and navigation auto-adapt based on {tenant.name}&apos;s active tenant plan.
        </p>
      </div>
    </aside>
  );
};
