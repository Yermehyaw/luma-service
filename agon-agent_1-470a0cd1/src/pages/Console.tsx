import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck, BookOpenText, CalendarClock, CheckCheck, CircleAlert, Clock3, FileCheck2, Flag, Inbox,
  Landmark, LayoutDashboard, LogOut, Megaphone, MessageSquareQuote, Mic2, Plus, RefreshCw, ScanLine,
  Send, SkipForward, Trash2, UploadCloud, Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { LumaSpinner } from '../components/LumaMark';
import { Avatar, Empty, LoadBadge, Reveal, Skeleton } from '../components/ui';
import { apiGet, apiSend, niceDate } from '../lib/api';
import type { Branch, Document, Institution, Message, Resource, SocialPost, Ticket } from '../lib/types';

type Tab = 'overview' | 'queue' | 'documents' | 'social' | 'resources';

const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'queue', label: 'Queue board', icon: ScanLine },
  { key: 'documents', label: 'Documents', icon: FileCheck2 },
  { key: 'social', label: 'Social', icon: MessageSquareQuote },
  { key: 'resources', label: 'Resources', icon: BookOpenText },
];

const STATUS_META: Record<string, { bg: string; label: string }> = {
  waiting: { bg: 'bg-orange-100 text-orange-700', label: 'Waiting' },
  called: { bg: 'bg-pink-100 text-pink-600', label: 'Called' },
  serving: { bg: 'bg-navy-100 text-navy-800', label: 'Serving' },
  completed: { bg: 'bg-green-100 text-green-700', label: 'Completed' },
  noshow: { bg: 'bg-pink-100 text-pink-600', label: 'No-show' },
  cancelled: { bg: 'bg-ink-100 text-ink-500', label: 'Cancelled' },
};

export default function Console() {
  const { session, user } = useAuth();
  const token = session?.access_token;
  const [tab, setTab] = useState<Tab>('overview');

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [docs, setDocs] = useState<Document[] | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [posts, setPosts] = useState<SocialPost[] | null>(null);
  const [resources, setResources] = useState<Resource[] | null>(null);

  const [toast, setToast] = useState('');
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  /* boot: institution + branches */
  useEffect(() => {
    apiGet<Institution[]>('/api/institutions?embed=1')
      .then((list) => {
        const inst = list[0] ?? null;
        setInstitution(inst);
        setBranches(inst?.branches ?? []);
        setBranch(inst?.branches?.[0] ?? null);
      })
      .catch(() => setInstitution(null));
  }, []);

  const loadTickets = () => {
    if (!branch) return;
    setTickets(null);
    apiGet<Ticket[]>(`/api/tickets?branch_id=${branch.id}`)
      .then(setTickets)
      .catch(() => setTickets([]));
  };
  useEffect(loadTickets, [branch?.id]); // eslint-disable-line

  useEffect(() => { apiGet<Document[]>('/api/documents').then(setDocs).catch(() => setDocs([])); }, []);
  useEffect(() => { apiGet<Message[]>('/api/messages').then(setMessages).catch(() => setMessages([])); }, []);
  useEffect(() => { apiGet<SocialPost[]>('/api/social-posts').then(setPosts).catch(() => setPosts([])); }, []);
  useEffect(() => { apiGet<Resource[]>('/api/resources').then(setResources).catch(() => setResources([])); }, []);

  /* derived queue state */
  const day = useMemo(() => {
    if (!tickets?.length) return null;
    return tickets[0].visit_date;
  }, [tickets]);
  const dayTickets = useMemo(() => (tickets ?? []).filter((t) => t.visit_date === day), [tickets, day]);
  const waiting = dayTickets.filter((t) => t.status === 'waiting').sort((a, b) => a.position - b.position);
  const serving = dayTickets.find((t) => t.status === 'serving') ?? dayTickets.find((t) => t.status === 'called') ?? null;
  const done = dayTickets.filter((t) => t.status === 'completed' || t.status === 'noshow');

  const act = async (t: Ticket, action: 'call' | 'complete' | 'noshow' | 'recall') => {
    await apiSend('/api/tickets', 'PUT', { id: t.id, action }, token).catch(() => say('Action failed — try again'));
    loadTickets();
  };

  const callNext = async () => {
    const next = waiting[0];
    if (!next) { say('No ticket is being served.'); return; }
    await apiSend('/api/tickets', 'PUT', { id: next.id, action: 'call' }, token).catch(() => say('Action failed — try again'));
    say(`${next.code} called to the counter`);
    loadTickets();
  };

  const verifyDoc = async (d: Document, status: 'verified' | 'flagged') => {
    await apiSend('/api/documents', 'PUT', { id: d.id, status }, token).catch(() => say('Update failed'));
    setDocs((p) => (p ? p.map((x) => (x.id === d.id ? { ...x, status } : x)) : p));
    say(status === 'verified' ? `${d.doc_type} verified for ${d.person}` : `${d.doc_type} flagged for review`);
  };

  const initialsMsg = (user?.user_metadata?.full_name as string) || user?.email || 'Console';

  return (
    <div className="min-h-screen bg-cream-50 pt-24 sm:pt-28">
      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.96 }}
            className="fixed left-1/2 top-24 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-navy-900 py-2.5 pl-4 pr-5 text-[13px] font-semibold text-white shadow-2xl"
          >
            <CheckCheck size={15} className="text-green-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-x pb-24">
        {/* header */}
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={institution?.name ?? 'Luma Institution'} size={52} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-300">Institution console</p>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
                {institution ? institution.name : 'Loading…'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="pill bg-green-100 text-green-700"><span className="dot bg-green-600"><span /></span> Branch live</span>
            <span className="hidden text-[13px] font-semibold text-ink-500 sm:block">{initialsMsg}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="btn btn-ghost btn-sm"
              title="Sign out"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </Reveal>

        {/* tabs */}
        <Reveal delay={0.05} className="mt-7 flex gap-1.5 overflow-x-auto rounded-full border border-ink-900/[0.07] bg-white p-1.5 shadow-[var(--shadow-card)]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 font-display text-[13.5px] font-bold transition ${
                tab === t.key ? 'bg-navy-900 text-white shadow-md' : 'text-ink-500 hover:bg-cream-100 hover:text-ink-900'
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </Reveal>

        {/* ======== OVERVIEW ======== */}
        {tab === 'overview' && (
          <div className="mt-6 grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Users, label: 'Waiting now', value: tickets === null ? '—' : String(waiting.length), tint: '#FF8A00', bg: 'bg-orange-100', fg: 'text-orange-600' },
                { icon: ScanLine, label: 'Serving', value: tickets === null ? '—' : String(serving ? 1 : 0), tint: '#F45B16', bg: 'bg-orange-100', fg: 'text-orange-700' },
                { icon: BadgeCheck, label: 'Completed today', value: tickets === null ? '—' : String(done.filter((d) => d.status === 'completed').length), tint: '#12A05A', bg: 'bg-green-100', fg: 'text-green-600' },
                { icon: FileCheck2, label: 'Docs awaiting review', value: docs === null ? '—' : String(docs.filter((d) => d.status === 'queued' || d.status === 'awaiting').length), tint: '#DB6FA0', bg: 'bg-pink-100', fg: 'text-pink-600' },
              ].map((s) => (
                <Reveal key={s.label}>
                  <div className="card card-hover flex items-center gap-4 p-5">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.bg} ${s.fg}`}>
                      <s.icon size={20} strokeWidth={2.2} />
                    </span>
                    <div>
                      <p className="font-display text-[26px] font-extrabold leading-none tracking-tight text-ink-900">{s.value}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-300">{s.label}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* mini live board */}
              <Reveal delay={0.06}>
                <div className="card h-full p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[16px] font-extrabold tracking-tight text-ink-900">Live board · {branch?.name ?? '—'}</h3>
                    <button onClick={() => setTab('queue')} className="btn btn-ghost btn-sm">Open board <Landmark size={14} /></button>
                  </div>
                  <div className="mt-5 rounded-2xl bg-navy-900 p-5 text-center text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Now serving</p>
                    <p className="mt-1 font-display text-3xl font-extrabold tracking-tight">
                      {serving ? <>{serving.code.slice(0, 3)}<span className="text-orange-500">{serving.code.slice(3)}</span></> : '—'}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{serving ? `${serving.service_name} · Counter ${serving.counter ?? '—'}` : 'No ticket is being served.'}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {tickets === null ? (
                      <Skeleton className="h-12" />
                    ) : waiting.length === 0 ? (
                      <p className="rounded-2xl bg-cream-100 px-4 py-3.5 text-sm font-medium text-ink-500">Queue is clear — a perfect morning.</p>
                    ) : (
                      waiting.slice(0, 4).map((t) => (
                        <div key={t.id} className="flex items-center justify-between rounded-2xl bg-cream-100 px-4 py-3">
                          <span className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-display text-[11px] font-extrabold text-orange-600 shadow-sm">{t.position}</span>
                            <span className="font-display text-[13.5px] font-bold text-ink-900">{t.code}</span>
                            <span className="hidden text-xs text-ink-500 sm:inline">{t.service_name}</span>
                          </span>
                          <span className="text-xs font-semibold text-ink-500">{t.window_start} window</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Reveal>

              {/* recent activity */}
              <Reveal delay={0.12}>
                <div className="card h-full p-6">
                  <h3 className="font-display text-[16px] font-extrabold tracking-tight text-ink-900">Needs attention</h3>
                  <div className="mt-5 space-y-2.5">
                    {docs === null || messages === null ? (
                      <>
                        <Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" />
                      </>
                    ) : (
                      <>
                        {docs.filter((d) => d.status === 'queued' || d.status === 'awaiting').slice(0, 2).map((d) => (
                          <button key={`d${d.id}`} onClick={() => setTab('documents')} className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-pink-50 px-4 py-3 text-left transition hover:bg-pink-100">
                            <FileCheck2 size={16} className="shrink-0 text-pink-600" />
                            <span className="flex-1 text-[13px] font-semibold text-ink-900">{d.doc_type} — {d.person}</span>
                            <span className="text-[11px] font-bold text-pink-600">Review</span>
                          </button>
                        ))}
                        {messages.filter((m) => m.status === 'new').slice(0, 3).map((m) => (
                          <button key={`m${m.id}`} onClick={() => setTab('social')} className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-cream-100 px-4 py-3 text-left transition hover:bg-cream-200">
                            <Inbox size={16} className="shrink-0 text-orange-600" />
                            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink-900">{m.author}: {m.body}</span>
                            <span className="text-[11px] font-bold text-orange-600">Reply</span>
                          </button>
                        ))}
                        {!docs.some((d) => d.status === 'queued' || d.status === 'awaiting') && !messages.some((m) => m.status === 'new') && (
                          <p className="rounded-2xl bg-green-50 px-4 py-3.5 text-sm font-semibold text-green-700">All clear — nothing waiting on you.</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button onClick={() => setTab('social')} className="btn btn-outline btn-sm w-full"><Megaphone size={14} /> Compose post</button>
                    <button onClick={() => setTab('resources')} className="btn btn-outline btn-sm w-full"><UploadCloud size={14} /> Share a resource</button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        )}

        {/* ======== QUEUE BOARD ======== */}
        {tab === 'queue' && (
          <QueueBoard
            branches={branches}
            branch={branch}
            setBranch={setBranch}
            tickets={tickets}
            day={day}
            waiting={waiting}
            serving={serving}
            done={done}
            callNext={callNext}
            act={act}
            refresh={loadTickets}
            token={token}
            onBroadcast={() => say('Live board updated.')}
            say={say}
          />
        )}

        {/* ======== DOCUMENTS ======== */}
        {tab === 'documents' && (
          <Reveal className="mt-6">
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-[17px] font-extrabold tracking-tight text-ink-900">Home verification inbox</h3>
                  <p className="mt-0.5 text-[13px] text-ink-500">Uploaded documents from the Verify page show up here. Approve or flag in one tap.</p>
                </div>
                <span className="pill bg-pink-100 text-pink-600"><Flag size={12} /> Fraud alerts auto-raised under 70% confidence</span>
              </div>
              <div className="mt-6 space-y-3">
                {docs === null ? (
                  <>{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[76px]" />)}</>
                ) : docs.length === 0 ? (
                  <Empty icon={<FileCheck2 size={22} />} title="No documents yet" body="Uploaded documents from the Verify page will show up here." />
                ) : (
                  docs.map((d) => (
                    <div
                      key={d.id}
                      className={`flex flex-col gap-4 rounded-[22px] border-[1.5px] p-4 sm:flex-row sm:items-center ${
                        d.status === 'verified' ? 'border-green-200 bg-green-50' : d.status === 'flagged' ? 'border-pink-200 bg-pink-50' : 'border-ink-900/[0.07] bg-white'
                      }`}
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        d.status === 'verified' ? 'bg-green-600 text-white' : d.status === 'flagged' ? 'bg-pink-500 text-white' : 'bg-cream-100 text-navy-900'
                      }`}>
                        {d.status === 'verified' ? <BadgeCheck size={19} /> : d.status === 'flagged' ? <Flag size={17} /> : <FileCheck2 size={19} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[14.5px] font-bold text-ink-900">{d.person} · {d.doc_type}</p>
                        <p className="mt-0.5 truncate text-xs text-ink-500">
                          {d.file_name} {d.ticket_code ? <>{'· linked to '}<b className="text-navy-900">{d.ticket_code}</b></> : '· Not linked to a ticket'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-300">Confidence</p>
                          <p className={`font-display text-[16px] font-extrabold ${d.confidence >= 85 ? 'text-green-600' : d.confidence >= 70 ? 'text-orange-600' : 'text-pink-600'}`}>{d.confidence}%</p>
                        </div>
                        <span className={`pill ${d.status === 'verified' ? 'bg-green-100 text-green-700' : d.status === 'flagged' ? 'bg-pink-100 text-pink-600' : 'bg-orange-100 text-orange-700'}`}>
                          {d.status === 'queued' ? 'Awaiting review' : d.status === 'awaiting' ? 'Awaiting review' : d.status === 'verified' ? 'Verified' : 'Flagged for review'}
                        </span>
                        <a href={d.file_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-navy-700 underline underline-offset-2 hover:text-orange-600">
                          View submitted document
                        </a>
                        {(d.status === 'queued' || d.status === 'awaiting') && (
                          <div className="flex gap-2">
                            <button onClick={() => verifyDoc(d, 'verified')} className="btn btn-green btn-sm"><BadgeCheck size={13} /> Approve</button>
                            <button onClick={() => verifyDoc(d, 'flagged')} className="btn btn-outline btn-sm !border-pink-400 !text-pink-600 hover:!border-pink-600"><Flag size={13} /> Flag</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* ======== SOCIAL ======== */}
        {tab === 'social' && (
          <SocialTab messages={messages} setMessages={setMessages} posts={posts} setPosts={setPosts} token={token} say={say} />
        )}

        {/* ======== RESOURCES ======== */}
        {tab === 'resources' && (
          <ResourcesTab resources={resources} setResources={setResources} token={token} say={say} />
        )}
      </div>
    </div>
  );
}

/* ================= QUEUE BOARD ================= */
function QueueBoard({
  branches, branch, setBranch, tickets, day, waiting, serving, done, callNext, act, refresh, token, onBroadcast, say,
}: {
  branches: Branch[];
  branch: Branch | null;
  setBranch: (b: Branch) => void;
  tickets: Ticket[] | null;
  day: string | null;
  waiting: Ticket[];
  serving: Ticket | null;
  done: Ticket[];
  callNext: () => void;
  act: (t: Ticket, a: 'call' | 'complete' | 'noshow' | 'recall') => void;
  refresh: () => void;
  token?: string;
  onBroadcast: () => void;
  say: (m: string) => void;
}) {
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const broadcast = async () => {
    if (!msg.trim() || !branch) return;
    setSending(true);
    try {
      await apiSend('/api/broadcast', 'POST', { branch_id: branch.id, message: msg.trim() }, token);
      setMsg('');
      onBroadcast();
    } catch {
      say('Broadcast failed — try again');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[0.62fr_1.38fr]">
      {/* left: branch + controls */}
      <div className="space-y-5">
        <Reveal>
          <div className="card p-5">
            <p className="label">Branch</p>
            <div className="space-y-2">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBranch(b)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[18px] border-[1.5px] px-4 py-3 text-left transition ${
                    branch?.id === b.id ? 'border-orange-500 bg-orange-50' : 'border-ink-900/[0.08] bg-white hover:border-ink-900/20'
                  }`}
                >
                  <span>
                    <span className="block font-display text-[14px] font-bold text-ink-900">{b.name}</span>
                    <span className="block text-xs text-ink-500">{b.address}</span>
                  </span>
                  <LoadBadge load={b.live_load} />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="card p-5">
            <p className="label flex items-center gap-1.5"><Mic2 size={15} className="text-orange-600" /> Branch controls</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={callNext} className="btn btn-primary btn-md col-span-2"><SkipForward size={16} /> Call next ticket</button>
              <button onClick={refresh} className="btn btn-outline btn-sm col-span-2"><RefreshCw size={14} /> Refresh board</button>
            </div>
            <div className="mt-5 border-t border-ink-900/[0.07] pt-4">
              <p className="label">Broadcast to branch displays</p>
              <div className="flex gap-2">
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="e.g. Counter 2 is now handling ATM cards"
                  className="input input-sm flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && broadcast()}
                />
                <button onClick={broadcast} disabled={sending || !msg.trim()} className="btn btn-navy btn-sm">
                  {sending ? <LumaSpinner size={14} /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* right: board */}
      <div className="space-y-5">
        <Reveal delay={0.05}>
          <div className="grad-cta relative overflow-hidden rounded-[28px] p-6 text-center text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
              Now serving {day ? `· ${niceDate(day)}` : ''} {branch ? `· ${branch.name}` : ''}
            </p>
            <p className="mt-2 font-display text-6xl font-extrabold tracking-[-0.03em]">
              {serving ? <>{serving.code.slice(0, 3)}<span className="text-orange-500">{serving.code.slice(3)}</span></> : <span className="text-white/25">————</span>}
            </p>
            <p className="mt-2 text-sm font-medium text-white/55">
              {serving ? `${serving.service_name} · Counter ${serving.counter ?? 1}` : 'No ticket is being served. Call the next one.'}
            </p>
            {serving && (
              <div className="mt-5 flex justify-center gap-2">
                <button onClick={() => act(serving, 'complete')} className="btn btn-green btn-sm"><CheckCheck size={14} /> Complete</button>
                <button onClick={() => act(serving, 'noshow')} className="btn btn-white btn-sm"><CircleAlert size={14} /> No-show</button>
                <button onClick={() => act(serving, 'recall')} className="btn btn-white btn-sm"><RefreshCw size={14} /> Recall</button>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-display text-[15.5px] font-extrabold tracking-tight text-ink-900">
              <Clock3 size={16} className="text-orange-600" /> Up next ({waiting.length})
            </h3>
            <div className="mt-4 space-y-2.5">
              {tickets === null ? (
                <>{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14" />)}</>
              ) : waiting.length === 0 ? (
                <p className="rounded-2xl bg-green-50 px-4 py-4 text-sm font-semibold text-green-700">Queue clear. Nobody is waiting — exactly the point.</p>
              ) : (
                waiting.map((t) => (
                  <motion.div layout key={t.id} className="flex items-center gap-3 rounded-[18px] border border-ink-900/[0.06] bg-white px-4 py-3 shadow-[var(--shadow-card)]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 font-display text-[12px] font-extrabold text-orange-700">{t.position}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[14px] font-bold text-ink-900">{t.code} <span className="ml-1 font-body text-xs font-medium text-ink-500">{t.user_name}</span></p>
                      <p className="truncate text-xs text-ink-500">{t.service_name} · window {t.window_start}–{t.window_end}</p>
                    </div>
                    <span className={`pill ${STATUS_META[t.status].bg}`}>{STATUS_META[t.status].label}</span>
                    <button onClick={() => act(t, 'call')} className="btn btn-outline btn-sm">Call</button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="card p-5">
            <h3 className="font-display text-[15.5px] font-extrabold tracking-tight text-ink-900">Completed today ({done.length})</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {done.length === 0 ? (
                <p className="text-sm text-ink-500">Served and no-show tickets will appear here.</p>
              ) : (
                done.map((t) => (
                  <span key={t.id} className={`pill ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-600'}`}>
                    {t.status === 'completed' ? <CheckCheck size={12} /> : <CircleAlert size={12} />} {t.code}
                  </span>
                ))
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= SOCIAL ================= */
function SocialTab({
  messages, setMessages, posts, setPosts, token, say,
}: {
  messages: Message[] | null;
  setMessages: (m: Message[]) => void;
  posts: SocialPost[] | null;
  setPosts: (p: SocialPost[]) => void;
  token?: string;
  say: (m: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'dm' | 'comment'>('all');
  const [active, setActive] = useState<Message | null>(null);
  const [reply, setReply] = useState('');
  const [draft, setDraft] = useState('');
  const [when, setWhen] = useState('');
  const [busy, setBusy] = useState(false);

  const inbox = (messages ?? []).filter((m) => m.kind !== 'contact' && (filter === 'all' || m.kind === filter));

  const sendReply = async () => {
    if (!active || !reply.trim()) return;
    setBusy(true);
    try {
      const updated = await apiSend<Message>('/api/messages', 'PUT', { id: active.id, reply: reply.trim(), status: 'resolved' }, token);
      setMessages((messages ?? []).map((m) => (m.id === active.id ? updated : m)));
      setActive(updated);
      setReply('');
      say('Reply sent & resolved');
    } catch {
      say('Reply failed — try again');
    } finally {
      setBusy(false);
    }
  };

  const publish = async (status: 'draft' | 'scheduled' | 'published') => {
    if (!draft.trim()) return;
    setBusy(true);
    try {
      const p = await apiSend<SocialPost>('/api/social-posts', 'POST', {
        content: draft.trim(),
        status,
        scheduled_for: status === 'scheduled' ? when || null : null,
        platform: 'Instagram · X',
      }, token);
      setPosts([p, ...(posts ?? [])]);
      setDraft('');
      setWhen('');
      say(status === 'published' ? 'Post published' : status === 'scheduled' ? 'Post scheduled' : 'Draft saved');
    } catch {
      say('Could not save post');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: SocialPost) => {
    await apiSend('/api/social-posts', 'DELETE', { id: p.id }, token).catch(() => say('Delete failed'));
    setPosts((posts ?? []).filter((x) => x.id !== p.id));
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      {/* unified inbox */}
      <Reveal>
        <div className="card h-full p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-[16px] font-extrabold tracking-tight text-ink-900">
              <Inbox size={17} className="text-orange-600" /> Unified inbox
            </h3>
            <div className="flex gap-1.5">
              {(['all', 'dm', 'comment'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`chip !px-3 !py-1.5 !text-[11.5px] ${filter === f ? 'chip-active' : ''}`}>
                  {f === 'all' ? 'All' : f === 'dm' ? 'DMs' : 'Comments'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {messages === null ? (
              <>{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}</>
            ) : inbox.length === 0 ? (
              <Empty icon={<Inbox size={20} />} title="No messages match these filters" body="New DMs and comments will land here." />
            ) : (
              inbox.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setActive(m); setReply(m.reply ?? ''); }}
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-[18px] border-[1.5px] p-3.5 text-left transition ${
                    active?.id === m.id ? 'border-orange-500 bg-orange-50' : 'border-ink-900/[0.06] bg-white hover:border-ink-900/20'
                  }`}
                >
                  <Avatar name={m.author} size={36} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[13.5px] font-bold text-ink-900">{m.author}</span>
                      <span className="pill bg-cream-100 text-[10px] !py-0.5 text-ink-500">{m.kind === 'dm' ? 'DM' : 'Comment'}</span>
                      {m.status === 'new' ? (
                        <span className="pill bg-orange-100 text-[10px] !py-0.5 text-orange-700">Needs review</span>
                      ) : (
                        <span className="pill bg-green-100 text-[10px] !py-0.5 text-green-700">Resolved</span>
                      )}
                    </span>
                    <span className="mt-1 block truncate text-[13px] text-ink-500">{m.body}</span>
                  </span>
                </button>
              ))
            )}
          </div>

          {/* reply panel */}
          <div className="mt-5 rounded-[20px] bg-cream-100 p-4">
            {active ? (
              <>
                <p className="text-[13px] font-semibold text-ink-900">Replying to {active.author}</p>
                <p className="mt-1 text-[12.5px] italic text-ink-500">“{active.body}”</p>
                <div className="mt-3 flex gap-2">
                  <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a public reply…" className="input input-sm flex-1" onKeyDown={(e) => e.key === 'Enter' && sendReply()} />
                  <button onClick={sendReply} disabled={busy || !reply.trim()} className="btn btn-primary btn-sm">
                    {busy ? <LumaSpinner size={14} /> : <Send size={14} />} Reply
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-[13px] text-ink-500">Pick a message to read and reply.</p>
            )}
          </div>
        </div>
      </Reveal>

      {/* composer + queue */}
      <div className="space-y-5">
        <Reveal delay={0.05}>
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-[16px] font-extrabold tracking-tight text-ink-900">
              <Megaphone size={17} className="text-pink-600" /> Composer
            </h3>
            <p className="mt-1 text-[13px] text-ink-500">Compose a post or generate ideas to fill the calendar.</p>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} className="input mt-4" placeholder="Share a queue win with the network…" />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={() => publish('published')} disabled={busy || !draft.trim()} className="btn btn-primary btn-sm"><Send size={13} /> Publish now</button>
              <div className="flex items-center gap-1.5">
                <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="input input-sm !h-9 w-[190px] !text-[12px]" />
                <button onClick={() => publish('scheduled')} disabled={busy || !draft.trim()} className="btn btn-navy btn-sm"><CalendarClock size={13} /> Schedule post</button>
              </div>
              <button onClick={() => publish('draft')} disabled={busy || !draft.trim()} className="btn btn-ghost btn-sm">Save draft</button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card p-6">
            <h3 className="font-display text-[16px] font-extrabold tracking-tight text-ink-900">Content calendar</h3>
            <div className="mt-4 space-y-2.5">
              {posts === null ? (
                <>{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}</>
              ) : posts.length === 0 ? (
                <Empty icon={<CalendarClock size={20} />} title="Nothing scheduled" body="Compose a post above to fill the calendar." />
              ) : (
                posts.map((p) => (
                  <div key={p.id} className="flex items-start gap-3 rounded-[18px] border border-ink-900/[0.06] bg-white p-4 shadow-[var(--shadow-card)]">
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      p.status === 'published' ? 'bg-green-100 text-green-600' : p.status === 'scheduled' ? 'bg-orange-100 text-orange-600' : 'bg-cream-100 text-ink-500'
                    }`}>
                      {p.status === 'published' ? <CheckCheck size={16} /> : p.status === 'scheduled' ? <CalendarClock size={16} /> : <Megaphone size={16} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium leading-snug text-ink-900">{p.content}</p>
                      <p className="mt-1 text-[11.5px] font-semibold text-ink-300">
                        {p.platform} · <span className="capitalize">{p.status}</span>
                        {p.status === 'scheduled' && p.scheduled_for ? ` · ${new Date(p.scheduled_for).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : ''}
                      </p>
                    </div>
                    <button onClick={() => remove(p)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-300 transition hover:bg-pink-100 hover:text-pink-600" title="Delete post">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= RESOURCES ================= */
function ResourcesTab({
  resources, setResources, token, say,
}: {
  resources: Resource[] | null;
  setResources: (r: Resource[]) => void;
  token?: string;
  say: (m: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'template' | 'playbook' | 'guide'>('all');
  const [title, setTitle] = useState('');
  const [rtype, setRtype] = useState<'template' | 'playbook' | 'guide'>('template');
  const [blurb, setBlurb] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiGet<Resource[]>(`/api/resources${filter !== 'all' ? `?type=${filter}` : ''}`)
      .then(setResources)
      .catch(() => setResources([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const upload = async () => {
    if (title.trim().length < 3) { say('Give the resource a title'); return; }
    setBusy(true);
    try {
      const r = await apiSend<Resource>('/api/resources', 'POST', { title: title.trim(), rtype, blurb: blurb.trim() }, token);
      setResources([r, ...(resources ?? [])]);
      setTitle('');
      setBlurb('');
      say('Resource shared with the network');
    } catch {
      say('Upload failed — try again');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Reveal>
        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-display text-[16px] font-extrabold tracking-tight text-ink-900">
            <UploadCloud size={17} className="text-green-600" /> Share a resource
          </h3>
          <p className="mt-1 text-[13px] text-ink-500">Templates and playbooks sync to every branch on Luma.</p>
          <div className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="rs-title">Title</label>
              <input id="rs-title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="e.g. Friday peak playbook" />
            </div>
            <div>
              <label className="label">Type</label>
              <div className="flex gap-2">
                {(['template', 'playbook', 'guide'] as const).map((t) => (
                  <button key={t} onClick={() => setRtype(t)} className={`chip flex-1 justify-center capitalize ${rtype === t ? 'chip-active' : ''}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="rs-blurb">Short description</label>
              <textarea id="rs-blurb" value={blurb} onChange={(e) => setBlurb(e.target.value)} rows={3} className="input" placeholder="What does it help a branch do faster?" />
            </div>
            <button onClick={upload} disabled={busy} className="btn btn-primary btn-md w-full">
              {busy ? <LumaSpinner size={16} /> : <Plus size={16} />} Share with the network
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.07}>
        <div className="card h-full p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-[16px] font-extrabold tracking-tight text-ink-900">
              <BookOpenText size={17} className="text-navy-900" /> Network library
            </h3>
            <div className="flex gap-1.5">
              {(['all', 'template', 'playbook', 'guide'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`chip !px-3 !py-1.5 !text-[11.5px] capitalize ${filter === f ? 'chip-active' : ''}`}>{f === 'all' ? 'All' : `${f}s`}</button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {resources === null ? (
              <>{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20" />)}</>
            ) : resources.length === 0 ? (
              <Empty icon={<BookOpenText size={20} />} title="Nothing here yet" body="Upload the first template or playbook for the network." />
            ) : (
              resources.map((r) => (
                <div key={r.id} className="flex items-center gap-4 rounded-[18px] border border-ink-900/[0.06] bg-white p-4 shadow-[var(--shadow-card)]">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    r.rtype === 'template' ? 'bg-orange-100 text-orange-600' : r.rtype === 'playbook' ? 'bg-green-100 text-green-600' : 'bg-navy-100 text-navy-800'
                  }`}>
                    <BookOpenText size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[14.5px] font-bold text-ink-900">{r.title}</p>
                    <p className="truncate text-xs text-ink-500">{r.blurb}</p>
                  </div>
                  <span className="pill bg-cream-100 capitalize text-ink-500">{r.rtype}</span>
                  <span className="text-[11.5px] font-bold text-ink-300">{r.downloads} uses</span>
                </div>
              ))
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
