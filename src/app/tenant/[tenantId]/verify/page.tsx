'use client';

import React, { useState } from 'react';
import { TenantCustomerLayout } from '../../../../components/layouts/TenantCustomerLayout';
import { ShieldCheck, Upload, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export default function DocumentVerifyPage() {
  const [personName, setPersonName] = useState('Chidi Nnamdi');
  const [docType, setDocType] = useState('National ID & Utility Bill');
  const [ticketCode, setTicketCode] = useState('LM-A042');
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <TenantCustomerLayout>
      <div className="mx-auto max-w-xl px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Zero Turn-Aways Guarantee
          </span>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">Pre-Verify Documents Online</h1>
          <p className="text-xs text-slate-500">Upload required identity paperwork from home for instant AI OCR pre-clearance.</p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center space-y-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-display text-xl font-bold text-emerald-900">Document Uploaded & Pre-Cleared!</h3>
            <p className="text-xs text-emerald-700 max-w-sm mx-auto">
              Our AI engine matched your biometrics with NIN registry records with <strong>99.4% confidence</strong>. Show ticket <strong>{ticketCode}</strong> at the branch desk.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
            >
              Upload Another Document
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-5 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Applicant Full Name</label>
              <input
                type="text"
                required
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 bg-white"
              >
                <option value="National ID & Utility Bill">National ID & Utility Bill</option>
                <option value="Academic Transcript Request Form">Academic Transcript Request Form</option>
                <option value="HMO Referral & Medical History">HMO Referral & Medical History</option>
                <option value="SME Business Registration (CAC)">SME Business Registration (CAC)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Ticket Reference Code (Optional)</label>
              <input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono uppercase"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Upload PDF or Image File</label>
              <div className="mt-1 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 bg-slate-50">
                <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                <p className="text-slate-600 font-medium">Drag and drop file here, or browse</p>
                <input
                  type="file"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                  className="text-xs text-slate-400"
                />
                {fileName && <p className="text-emerald-600 font-bold">Selected: {fileName}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800"
            >
              Submit for Instant AI Verification
            </button>
          </form>
        )}
      </div>
    </TenantCustomerLayout>
  );
}
