'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant } from '../types/tenant';
import { MOCK_TENANTS } from '../mock/tenants';
import { applyTenantBrandingToDom, getTenantCssVariables } from './tenant-branding';

interface TenantContextType {
  tenant: Tenant;
  allTenants: Tenant[];
  setTenantSlug: (slug: string) => void;
  cssVariables: Record<string, string>;
  isFeatureEnabled: (featureName: keyof Tenant['features']) => boolean;
}

const defaultTenant = MOCK_TENANTS[0];

const TenantContext = createContext<TenantContextType>({
  tenant: defaultTenant,
  allTenants: MOCK_TENANTS,
  setTenantSlug: () => {},
  cssVariables: getTenantCssVariables(defaultTenant.branding),
  isFeatureEnabled: (feat) => defaultTenant.features[feat] ?? false,
});

export const TenantProvider: React.FC<{
  initialTenant?: Tenant;
  children: React.ReactNode;
}> = ({ initialTenant, children }) => {
  const [tenant, setTenant] = useState<Tenant>(initialTenant || defaultTenant);

  useEffect(() => {
    if (initialTenant) {
      setTenant(initialTenant);
      applyTenantBrandingToDom(initialTenant.branding);
    }
  }, [initialTenant]);

  const setTenantSlug = (slug: string) => {
    const found = MOCK_TENANTS.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
    if (found) {
      setTenant(found);
      applyTenantBrandingToDom(found.branding);
    }
  };

  const isFeatureEnabled = (feat: keyof Tenant['features']): boolean => {
    return Boolean(tenant.features?.[feat]);
  };

  const cssVariables = getTenantCssVariables(tenant.branding);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        allTenants: MOCK_TENANTS,
        setTenantSlug,
        cssVariables,
        isFeatureEnabled,
      }}
    >
      <div style={cssVariables as React.CSSProperties}>{children}</div>
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
