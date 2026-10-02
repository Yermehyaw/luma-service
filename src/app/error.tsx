'use client';

import React from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 max-w-md w-full space-y-3">
        <h3 className="font-bold text-rose-900 text-base">Application Error</h3>
        <p className="text-xs text-rose-700">{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => reset()}
          className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
