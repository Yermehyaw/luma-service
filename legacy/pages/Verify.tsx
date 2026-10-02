import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/LumaMark';
import { FadeIn } from '../components/ui';
import { Upload, ShieldCheck, CheckCircle2, AlertCircle, FileText, Loader2, Info } from 'lucide-react';

const docTypes = [
  "National ID",
  "Passport photo page",
  "Utility bill",
  "Proof of address",
  "Student ID",
  "Referral letter",
  "Other"
];

export const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [docType, setDocType] = useState("National ID");
  const [ticketCode, setTicketCode] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get('ticket');
    if (code) {
      setTicketCode(code.toUpperCase());
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) {
      setError("Please fill out your name and upload a document file.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(null);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        
        // 1. Upload file to Supabase storage via /api/upload
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64,
            contentType: file.type
          })
        });

        if (!uploadRes.ok) throw new Error("Upload to storage failed.");
        const { url } = await uploadRes.json();

        // 2. Save document record to database
        const docRes = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            person: name,
            doc_type: docType,
            file_name: file.name,
            file_url: url,
            ticket_code: ticketCode ? ticketCode.trim().toUpperCase() : null
          })
        });

        if (!docRes.ok) throw new Error("Failed to create document record.");
        const data = await docRes.json();
        setSuccess(data);

        // Reset form
        setName("");
        setFile(null);
        setTicketCode("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not upload document.");
      } finally {
        setSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grad-hero min-h-screen pt-28 pb-24">
      <div className="container-x grid items-start gap-12 pb-24 lg:grid-cols-[1fr_1.05fr] max-w-5xl mx-auto">
        {/* Left column: Explanations */}
        <div className="space-y-6">
          <SectionHeader
            align="left"
            eyebrow="Verify from Home"
            title="Verify your documents tonight"
            sub="Upload your required documents ahead of time. Our automated pipeline runs bank-grade authenticity checks so you skip the paperwork desk tomorrow."
          />

          <div className="space-y-4 pt-4">
            <div className="flex gap-3.5 p-4 border border-ink-900/[0.05] bg-white rounded-2xl">
              <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Upload size={16} />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 text-sm">Upload Tonight</h4>
                <p className="text-xs text-ink-500 leading-relaxed mt-0.5">Snap a clear photo of your ID or utility bill from your couch. JPEG, PNG, or PDF supported.</p>
              </div>
            </div>

            <div className="flex gap-3.5 p-4 border border-ink-900/[0.05] bg-white rounded-2xl">
              <div className="h-8 w-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 text-sm">We Check in Minutes</h4>
                <p className="text-xs text-ink-500 leading-relaxed mt-0.5">LUNA runs secure verification checks and issues a confidence score directly to your branch.</p>
              </div>
            </div>

            <div className="flex gap-3.5 p-4 border border-ink-900/[0.05] bg-white rounded-2xl">
              <div className="h-8 w-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 text-sm">Skip the Desk</h4>
                <p className="text-xs text-ink-500 leading-relaxed mt-0.5">Arrive pre-cleared. Walk straight to your counter without photocopies or back-and-forth delays.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form Card */}
        <div className="card p-6 sm:p-8 bg-white">
          {success ? (
            <div className="text-center py-10 space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200 shadow-lift">
                <CheckCircle2 size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-ink-900">Document Uploaded Successfully!</h3>
                <p className="text-xs text-ink-500 max-w-sm mx-auto">
                  LUNA AI-assisted pipeline has processed your document.
                </p>
              </div>

              <div className="p-4 bg-cream-50 rounded-2xl border border-ink-900/[0.02] inline-block space-y-1 text-xs">
                <div className="flex justify-between gap-8">
                  <span className="text-ink-500 font-medium">Document Type:</span>
                  <span className="font-bold text-ink-900">{success.doc_type}</span>
                </div>
                <div className="flex justify-between gap-8 pt-1.5 border-t border-ink-100/30">
                  <span className="text-ink-500 font-medium">AI Confidence Score:</span>
                  <span className="font-bold text-green-600">{success.confidence}% Confidence</span>
                </div>
                <div className="flex justify-between gap-8 pt-1.5 border-t border-ink-100/30">
                  <span className="text-ink-500 font-medium">Clearance Status:</span>
                  <span className="pill bg-orange-100 text-orange-700 font-bold !text-[10px] capitalize">{success.status}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                {success.ticket_code ? (
                  <button
                    onClick={() => navigate(`/track?code=${success.ticket_code}`)}
                    className="btn btn-primary btn-md w-full"
                  >
                    Track your ticket live
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/book')}
                    className="btn btn-primary btn-md w-full"
                  >
                    Book a ticket now
                  </button>
                )}
                <button onClick={() => setSuccess(null)} className="btn btn-outline btn-md w-full">
                  Upload another document
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-5">
              <div className="space-y-1.5">
                <label className="label">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Oluwaseun Taiwo"
                  className="input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="label">Document Type</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                    className="input"
                  >
                    {docTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="label">Ticket Code (Optional)</label>
                  <input
                    type="text"
                    value={ticketCode}
                    onChange={e => setTicketCode(e.target.value.toUpperCase())}
                    placeholder="e.g. LM-A103"
                    className="input uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="label">Upload Document File</label>
                <div className="border-2 border-dashed border-ink-100 hover:border-orange-500/50 rounded-2xl p-6 text-center cursor-pointer transition bg-cream-50/10">
                  <input
                    type="file"
                    required
                    id="doc-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer space-y-2 block">
                    <Upload className="mx-auto text-ink-300" size={32} />
                    {file ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-ink-900 truncate max-w-xs mx-auto">{file.name}</p>
                        <p className="text-xs text-ink-500">{(file.size / 1024 / 1024).toFixed(2)} MB · Tap to change</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-ink-700">Drag & drop or click to upload</p>
                        <p className="text-[10px] text-ink-500">Supports JPEG, PNG, or PDF up to 8 MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-pink-50 border border-pink-200 text-pink-600 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !file || !name}
                className="btn btn-primary btn-lg w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Uploading securely...</span>
                  </>
                ) : (
                  <span>Verify my document</span>
                )}
              </button>

              <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-500">
                <Info size={14} className="text-green-600" />
                <span>Bank-grade security · Files are encrypted in transit and at rest.</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
