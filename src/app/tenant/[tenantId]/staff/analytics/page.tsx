'use client';

import React from 'react';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { AnalyticsOverview } from '../../../../../features/analytics/components/AnalyticsOverview';
import { FeatureGate } from '../../../../../lib/feature-flags';
import { BarChart3, AlertCircle } from 'lucide-react';

export default function StaffAnalyticsPage() {
  return (
    <TenantStaffLayout>
      <FeatureGate
        feature="analytics"
        fallback={
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-amber-600 mx-auto" />
            <h3 className="font-bold text-amber-900 text-lg">Analytics Module Disabled</h3>
            <p className="text-xs text-amber-700 max-w-md mx-auto">
              Analytics radar is disabled for this tenant plan. Upgrade your tenant configuration to enable executive analytics.
            </p>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Branch Analytics & Executive Radar</h1>
              <p className="text-xs text-slate-500">Real-time throughput metrics, wait time reduction, and SLA compliance.</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
              <BarChart3 className="h-3.5 w-3.5 text-purple-600" />
              Live Analytics Feed
            </span>
          </div>

          <AnalyticsOverview />
        </div>
      </FeatureGate>
    </TenantStaffLayout>
  );
}
