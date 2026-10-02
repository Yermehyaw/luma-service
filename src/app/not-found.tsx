'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md max-w-md w-full space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">404 — Page or Tenant Not Found</h2>
        <p className="text-xs text-slate-500">
          The page or tenant route you requested does not exist or has moved.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Luma Home
          </Link>
        </div>
      </div>
    </div>
  );
}
