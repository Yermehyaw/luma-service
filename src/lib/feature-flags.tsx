'use client';

import React from 'react';
import { TenantFeatures } from '../types/tenant';
import { useTenant } from './tenant-context';

export function isFeatureEnabled(features: TenantFeatures | undefined, featureKey: keyof TenantFeatures): boolean {
  if (!features) return false;
  return Boolean(features[featureKey]);
}

export function getEnabledFeatures(features: TenantFeatures | undefined): (keyof TenantFeatures)[] {
  if (!features) return [];
  return (Object.keys(features) as (keyof TenantFeatures)[]).filter((k) => features[k]);
}

interface FeatureGateProps {
  feature: keyof TenantFeatures;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ feature, fallback = null, children }) => {
  const { isFeatureEnabled } = useTenant();

  if (!isFeatureEnabled(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
