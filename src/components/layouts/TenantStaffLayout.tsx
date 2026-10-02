'use client';

import React from 'react';
import { TenantSidebar } from '../navigation/TenantSidebar';
import { StaffHeader } from '../navigation/StaffHeader';
import { TenantProvider } from '../../lib/tenant-context';
import { Tenant } from '../../types/tenant';

interface TenantStaffLayoutProps {
  initialTenant?: Tenant;
  children: React.ReactNode;
}

export const TenantStaffLayout: React.FC<TenantStaffLayoutProps> = ({ initialTenant, children }) => {
  return (
    <TenantProvider initialTenant={initialTenant}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <TenantSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <StaffHeader />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </TenantProvider>
  );
};
