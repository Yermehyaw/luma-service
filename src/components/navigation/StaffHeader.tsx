'use client';

import React from 'react';
import { TenantSwitcher } from '../../features/tenant-management/components/TenantSwitcher';
import { useAuth } from '../../lib/auth';
import { Bell, Search, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { Role } from '../../types/user';

export const StaffHeader: React.FC = () => {
  const { user, switchUserRole, logout } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roles: { role: Role; label: string }[] = [
    { role: 'TENANT_OWNER', label: 'Tenant Owner' },
    { role: 'MANAGER', label: 'Branch Manager' },
    { role: 'STAFF', label: 'Counter Staff' },
    { role: 'SUPER_ADMIN', label: 'Platform Super Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets, customers, branches..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-700 focus:border-[var(--tenant-primary,#0057B8)] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Tenant Switcher */}
        <TenantSwitcher />

        {/* Notifications Icon */}
        <button className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 text-xs hover:bg-slate-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--tenant-primary,#0057B8)] font-bold text-white text-xs">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-bold text-slate-900 leading-tight">{user?.name || 'Staff User'}</p>
              <p className="text-[10px] text-slate-400 font-semibold">{user?.role || 'STAFF'}</p>
            </div>
            <Shield className="h-3.5 w-3.5 text-amber-500 ml-1" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Frontend Role UI</p>
                <p className="text-[11px] text-slate-500">Test UX per user permission level</p>
              </div>

              <div className="mt-1 space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs ${
                      user?.role === r.role ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setRoleMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
