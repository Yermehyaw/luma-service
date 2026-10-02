'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LumaLogo } from '../../../components/shared/LumaMark';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F3] p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl space-y-6 text-center">
        <div className="flex justify-center">
          <LumaLogo size={40} />
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Reset Your Password</h2>
          <p className="text-xs text-slate-500 mt-1">Enter your email for password recovery instructions.</p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 space-y-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Reset Link Dispatched</h4>
            <p className="text-xs text-emerald-700">Check your inbox ({email}) for instructions to reset your account password.</p>
            <Link
              href="/platform/login"
              className="inline-block text-xs font-bold text-slate-900 hover:underline pt-2"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
            <div>
              <label className="font-semibold text-slate-700">Account Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@luma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="pt-2">
          <Link href="/platform/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
