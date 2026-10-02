'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';
import { LumaLogo } from '../../../components/shared/LumaMark';
import { ArrowRight, Lock, Mail, User, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
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
          <h2 className="font-display text-2xl font-bold text-slate-900">Create Luma Platform Account</h2>
          <p className="text-xs text-slate-500 mt-1">Start your 14-day multi-tenant SaaS trial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left text-xs">
          <div>
            <label className="font-semibold text-slate-700">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Dr. Temitope Adebayo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Organization Name</label>
            <div className="relative mt-1">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Acme Bank"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Work Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="temitope@acmebank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-slate-800"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800"
          >
            <span>Create Organization Account</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/platform/login" className="font-bold text-[var(--tenant-primary,#0057B8)] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
