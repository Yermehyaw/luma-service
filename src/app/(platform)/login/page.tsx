'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';
import { LumaLogo } from '../../../components/shared/LumaMark';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@luma.com');
  const [password, setPassword] = useState('password123');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    router.push('/platform/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F3] p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl space-y-6 text-center">
        <div className="flex justify-center">
          <LumaLogo size={40} />
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Sign in to Luma SaaS Platform</h2>
          <p className="text-xs text-slate-500 mt-1">Multi-Tenant Admin & Staff Authentication Console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
          <div>
            <label className="font-semibold text-slate-700">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-slate-800 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-slate-800 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800"
          >
            <span>Sign In to Platform</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p className="font-medium text-slate-700">Mock Demo Auth Profiles:</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-center text-[11px]">
            <button onClick={() => setEmail('admin@luma.com')} className="rounded-md bg-slate-100 px-2 py-1 font-mono">
              Super Admin
            </button>
            <button onClick={() => setEmail('manager@acmebank.com')} className="rounded-md bg-slate-100 px-2 py-1 font-mono">
              Acme Bank Owner
            </button>
            <button onClick={() => setEmail('triage@cityhospital.org')} className="rounded-md bg-slate-100 px-2 py-1 font-mono">
              Hospital Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
