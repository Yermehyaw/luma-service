import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, CircleAlert, FileCheck2, FileText, MoonStar, ScanSearch, ShieldCheck, Ticket, UploadCloud, Zap } from 'lucide-react';
import { LumaSpinner } from '../components/LumaMark';
import { Reveal, SectionHead } from '../components/ui';
import { apiSend } from '../lib/api';

const DOC_TYPES = ['National ID', 'Passport photo page', 'Utility bill', 'Proof of address', 'Student ID', 'Referral letter', 'Other'];

const STEP_CARDS = [
  { icon: MoonStar, tint: '#202957', title: 'Upload tonight', body: 'Snap a clear photo of your document from your couch. JPEG, PNG or PDF, up to 8 MB.' },
  { icon: ScanSearch, tint: '#FF8A00', title: 'We check in minutes', body: 'Luma runs bank-grade authenticity checks and hands a confidence score to your branch.' },
  { icon: Zap, tint: '#12A05A', title: 'Skip the desk', body: 'Arrive pre-cleared and walk straight to your counter. No photocopies, no back-and-forth.' },
];

interface DoneInfo { status: string; confidence: number; }

export default function Verify() {
  const [person, setPerson] = useState('');
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [ticketCode, setTicketCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<DoneInfo | null>(null);
  const [fail, setFail] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      setErrors((e) => ({ ...e, file: 'File is larger than 8 MB' }));
      return;
    }
    setErrors((e) => { const { file: _drop, ...rest } = e; return rest; });
    setFile(f);
  };

  const submit = async () => {
    const e: Record<string, string> = {};
    if (person.trim().length < 2) e.person = 'Enter the name on the document';
    if (!file) e.file = 'Please attach a document to verify';
    setErrors(e);
    if (Object.keys(e).length || !file) return;

    setBusy(true);
    setFail('');
    try {
      const base64: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(',')[1]);
        r.onerror = () => reject(new Error('read failed'));
        r.readAsDataURL(file);
      });
      const up = await apiSend<{ url: string }>('/api/upload', 'POST', {
        fileName: file.name,
        fileBase64: base64,
        contentType: file.type || 'application/octet-stream',
      });
      const doc = await apiSend<{ status: string; confidence: number }>('/api/documents', 'POST', {
        person: person.trim(),
        doc_type: docType,
        file_name: file.name,
        file_url: up.url,
        ticket_code: ticketCode.trim() ? ticketCode.trim().toUpperCase() : null,
      });
      setDone({ status: doc.status, confidence: doc.confidence });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFail(err instanceof Error && /upload/i.test(err.message)
        ? 'Upload failed. Please try again.'
        : 'Could not queue your document for verification.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grad-hero min-h-screen pt-28 sm:pt-32">
      <div className="container-x grid items-start gap-12 pb-24 lg:grid-cols-[1fr_1.05fr]">
        {/* left: story */}
        <Reveal>
          <SectionHead
            align="left"
            eyebrow="Verify from home"
            dot="#12A05A"
            title="Verify your documents tonight"
            sub="Upload your document, get cleared in minutes, and walk straight to your counter tomorrow."
          />
          <div className="relative mt-8 overflow-hidden rounded-[30px]" style={{ boxShadow: 'var(--shadow-lift)' }}>
            <img src="/img/home.jpg" alt="A visitor verifying documents from her couch" className="h-64 w-full object-cover sm:h-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-display text-lg font-bold leading-snug text-white">
                “Most delays are not queues — they're missing papers.”
              </p>
              <p className="mt-1 text-[13px] text-white/70">
                Upload them tonight and your visit becomes a 10-minute errand.
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {STEP_CARDS.map((s) => (
              <div key={s.title} className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md" style={{ background: s.tint }}>
                  <s.icon size={19} strokeWidth={2.2} />
                </span>
                <div>
                  <p className="font-display text-[15.5px] font-bold tracking-tight text-ink-900">{s.title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* right: form / success */}
        <Reveal delay={0.1}>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card overflow-hidden !rounded-[30px] p-0" style={{ boxShadow: 'var(--shadow-lift)' }}>
              <div className="grad-band-green px-7 py-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-[0_14px_36px_-10px_rgba(18,160,90,0.55)]">
                  <FileCheck2 size={26} />
                </span>
                <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink-900">
                  In the verification queue
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-500">
                  Your document is now queued for verification. We'll SMS and email the outcome — usually within 15 minutes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-6">
                <div className="rounded-2xl bg-cream-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">Status</p>
                  <p className="mt-1 font-display text-[15px] font-bold capitalize text-orange-600">
                    {done.status === 'queued' ? 'Awaiting review' : done.status}
                  </p>
                </div>
                <div className="rounded-2xl bg-cream-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-300">First-pass confidence</p>
                  <p className="mt-1 font-display text-[15px] font-bold text-green-700">{done.confidence}%</p>
                </div>
                <button
                  onClick={() => { setDone(null); setFile(null); setTicketCode(''); setPerson(''); }}
                  className="btn btn-outline btn-md col-span-2"
                >
                  Verify another document
                </button>
                <Link to="/track" className="btn btn-ghost btn-md col-span-2">
                  <Ticket size={15} /> Track your ticket
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="card !rounded-[30px] p-7 sm:p-8" style={{ boxShadow: 'var(--shadow-lift)' }}>
              <h2 className="font-display text-xl font-extrabold tracking-tight text-ink-900">Upload for verification</h2>
              <p className="mt-1 text-[13.5px] text-ink-500">Free for every Luma visitor. Encrypted end to end.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="label" htmlFor="vf-name">Name on the document</label>
                  <input id="vf-name" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="e.g. Chidinma Eze" className="input" />
                  {errors.person && <p className="field-error">{errors.person}</p>}
                </div>

                <div>
                  <label className="label" htmlFor="vf-type">Document type</label>
                  <div className="relative">
                    <FileText size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                    <select id="vf-type" value={docType} onChange={(e) => setDocType(e.target.value)} className="input !pl-11">
                      {DOC_TYPES.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="vf-code">
                    Ticket code <span className="font-normal text-ink-300">(optional)</span>
                  </label>
                  <input
                    id="vf-code"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                    placeholder="LM-A042"
                    maxLength={8}
                    className="input"
                  />
                  <p className="mt-1.5 text-xs text-ink-500">Link this document to an upcoming visit.</p>
                </div>

                <div>
                  <span className="label">Document file</span>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0] ?? null); }}
                    className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed px-6 py-9 text-center transition ${
                      drag ? 'border-orange-500 bg-orange-50' : file ? 'border-green-500/60 bg-green-50' : 'border-ink-900/[0.14] bg-cream-100/50 hover:border-orange-500/50 hover:bg-orange-50/50'
                    }`}
                  >
                    {file ? (
                      <>
                        <BadgeCheck size={26} className="text-green-600" />
                        <p className="mt-2.5 font-display text-[14.5px] font-bold text-ink-900">{file.name}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{(file.size / 1024).toFixed(0)} KB · tap to replace</p>
                      </>
                    ) : (
                      <>
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-[var(--shadow-card)]">
                          <UploadCloud size={22} />
                        </span>
                        <p className="mt-3 font-display text-[14.5px] font-bold text-ink-900">Drop your document here</p>
                        <p className="mt-1 text-xs text-ink-500">or tap to browse · JPEG, PNG or PDF · max 8 MB</p>
                      </>
                    )}
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                  {errors.file && <p className="field-error">{errors.file}</p>}
                </div>

                {fail && (
                  <p className="flex items-center gap-2 rounded-2xl bg-pink-100 px-4 py-3 text-sm font-semibold text-pink-600">
                    <CircleAlert size={16} /> {fail}
                  </p>
                )}

                <button onClick={submit} disabled={busy} className="btn btn-primary btn-lg w-full">
                  {busy ? <LumaSpinner size={18} /> : <ShieldCheck size={18} />}
                  {busy ? 'Uploading securely…' : 'Verify my document'}
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-500">
                  <ShieldCheck size={14} className="text-green-600" />
                  Bank-grade security · Files are encrypted in transit and at rest.
                </p>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
