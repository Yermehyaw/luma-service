'use client';

import React from 'react';
import { VerificationDocument } from '../../../types/ticket';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface VerificationCardProps {
  document: VerificationDocument;
  onVerify?: (id: string) => void;
  onFlag?: (id: string) => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ document: doc, onVerify, onFlag }) => {
  const getStatusBadge = (status: VerificationDocument['status']) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>;
      case 'flagged':
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700"><AlertTriangle className="h-3.5 w-3.5" /> Flagged</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700"><Clock className="h-3.5 w-3.5" /> Pending Verification</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--tenant-primary,#0057B8)]" />
          <h4 className="font-bold text-slate-900 text-sm">{doc.docType}</h4>
        </div>
        {getStatusBadge(doc.status)}
      </div>

      <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
        <div className="flex justify-between text-slate-500">
          <span>Applicant:</span>
          <span className="font-semibold text-slate-900">{doc.personName}</span>
        </div>
        {doc.ticketCode && (
          <div className="flex justify-between text-slate-500">
            <span>Ticket Reference:</span>
            <span className="font-bold text-[var(--tenant-primary,#0057B8)]">{doc.ticketCode}</span>
          </div>
        )}
      </div>

      {/* OCR Confidence Gauge */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
          <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> AI OCR Confidence</span>
          <span>{doc.confidence}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${doc.confidence > 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: `${doc.confidence}%` }}
          />
        </div>
      </div>

      {doc.notes && <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">{doc.notes}</p>}

      {doc.status === 'queued' && (
        <div className="flex gap-2 pt-2">
          {onVerify && (
            <button
              onClick={() => onVerify(doc.id)}
              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Approve & Pre-Clear
            </button>
          )}
          {onFlag && (
            <button
              onClick={() => onFlag(doc.id)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
            >
              Flag
            </button>
          )}
        </div>
      )}
    </div>
  );
};
