'use client';

import React from 'react';
import { CustomerNavbar } from '../navigation/CustomerNavbar';
import { TenantProvider } from '../../lib/tenant-context';
import { Tenant } from '../../types/tenant';

interface TenantCustomerLayoutProps {
  initialTenant?: Tenant;
  children: React.ReactNode;
}

export const TenantCustomerLayout: React.FC<TenantCustomerLayoutProps> = ({ initialTenant, children }) => {
  return (
    <TenantProvider initialTenant={initialTenant}>
      <div className="flex min-h-screen flex-col bg-[var(--tenant-bg,#F4F8FC)] text-[var(--tenant-text,#0B1D3A)] transition-colors">
        <CustomerNavbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200/60 bg-white py-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Luma Multi-Tenant Queue Engine. Powered by unified App Router architecture.</p>
        </footer>
      </div>
    </TenantProvider>
  );
};
