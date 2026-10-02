'use client';

import React from 'react';
import Link from 'next/link';
import { LumaLogo } from '../shared/LumaMark';
import { LayoutDashboard, Building2, CreditCard, Shield, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export const PlatformLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Platform Admin Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <LumaLogo size={28} />
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">SaaS Platform</span>
        </div>

        <nav className="mt-6 space-y-1">
          <Link href="/platform/dashboard" className="flex items-center gap-3 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white">
            <LayoutDashboard className="h-4 w-4" />
            <span>Platform Overview</span>
          </Link>
          <Link href="/platform/organizations" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <Building2 className="h-4 w-4" />
            <span>Organizations (Tenants)</span>
          </Link>
          <Link href="/platform/billing" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <CreditCard className="h-4 w-4" />
            <span>SaaS Billing & Plans</span>
          </Link>
          <Link href="/platform/settings" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <Settings className="h-4 w-4" />
            <span>Platform Settings</span>
          </Link>
        </nav>

        <div className="mt-auto pt-10 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Admin: {user?.name || 'Super Admin'}</span>
            <button onClick={() => logout()} className="text-rose-600 font-bold hover:underline">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};
