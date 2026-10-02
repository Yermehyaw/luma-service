import React from 'react';
import { LumaSpinner } from '../components/shared/LumaMark';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <LumaSpinner size={36} />
      <p className="text-xs font-semibold text-slate-500">Loading Luma Multi-Tenant Experience...</p>
    </div>
  );
}
