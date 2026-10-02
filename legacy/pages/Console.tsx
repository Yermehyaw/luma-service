import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SectionHeader } from '../components/LumaMark';
import { FadeIn, MetricCard } from '../components/ui';
import { 
  Users, Clock, Smile, AlertTriangle, Play, CheckCircle2, XCircle, 
  ShieldCheck, MessageSquare, BookOpen, Megaphone, Send, Trash2, 
  Sparkles, Download, Plus, Loader2, RefreshCw, LayoutDashboard
} from 'lucide-react';

const tabs = [
  { key: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { key: "queue", label: "Queue Board", icon: <Users size={16} /> },
  { key: "documents", label: "Documents", icon: <ShieldCheck size={16} /> },
  { key: "social", label: "Social Studio", icon: <MessageSquare size={16} /> },
  { key: "resources", label: "Resources", icon: <BookOpen size={16} /> }
];

export const Console: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Selection states
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  // Data states
  const [tickets, setTickets] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form states
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceType, setNewResourceType] = useState("template");
  const [newResourceBlurb, setNewResourceBlurb] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // Fetch branches on mount
  useEffect(() => {
    fetch('/api/institutions?embed=1')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Flatten all branches
          const allBranches: any[] = [];
          data.forEach(inst => {
            if (inst.branches) {
              inst.branches.forEach((b: any) => {
                allBranches.push({
                  ...b,
                  institution_name: inst.name
                });
              });
            }
          });
          setBranches(allBranches);
          if (allBranches.length > 0) {
            setSelectedBranch(allBranches[0]);
          }
        }
      })
      .catch(err => console.error('Error fetching branches:', err));
  }, []);

  // Fetch all console data
  const refreshData = () => {
    if (!selectedBranch) return;
    setLoading(true);

    const todayStr = new Date().toISOString().slice(0, 10);

    Promise.all([
      fetch(`/api/tickets?branch_id=${selectedBranch.id}&visit_date=${todayStr}`).then(r => r.json()),
      fetch('/api/documents').then(r => r.json()),
      fetch('/api/messages').then(r => r.json()),
      fetch('/api/social-posts').then(r => r.json()),
      fetch('/api/resources').then(r => r.json())
    ])
      .then(([tkts, docs, msgs, posts, rscs]) => {
        if (Array.isArray(tkts)) setTickets(tkts);
        if (Array.isArray(docs)) setDocuments(docs);
        if (Array.isArray(msgs)) setMessages(msgs);
        if (Array.isArray(posts)) setSocialPosts(posts);
        if (Array.isArray(rscs)) setResources(rscs);
      })
      .catch(err => console.error('Error refreshing console data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, [selectedBranch]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Queue actions
  const handleCallNext = async () => {
    const nextWaiting = tickets.find(t => t.status === 'waiting');
    if (!nextWaiting) {
      triggerToast("No customers waiting in queue.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: nextWaiting.id,
          status: 'called',
          counter: `Counter ${Math.floor(Math.random() * 3) + 1}`
        })
      });

      if (!res.ok) throw new Error("Failed to call next ticket.");
      triggerToast(`Ticket ${nextWaiting.code} called to counter!`);
      refreshData();
    } catch (err) {
      triggerToast("Error calling next ticket.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status.");
      triggerToast(`Ticket status updated to ${newStatus}.`);
      refreshData();
    } catch (err) {
      triggerToast("Error updating status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Document verification actions
  const handleVerifyDoc = async (id: number, approved: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: approved ? 'verified' : 'flagged'
        })
      });

      if (!res.ok) throw new Error("Failed to verify document.");
      triggerToast(approved ? "Document pre-cleared successfully!" : "Document flagged for review.");
      refreshData();
    } catch (err) {
      triggerToast("Error updating document status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Social Studio actions
  const handleCreatePost = async (status: 'published' | 'scheduled' | 'draft') => {
    if (!newPostContent.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/social-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent.trim(),
          status,
          platform: "X (Twitter)"
        })
      });

      if (!res.ok) throw new Error();
      triggerToast(`Post successfully ${status === 'published' ? 'published' : 'saved'}!`);
      setNewPostContent("");
      refreshData();
    } catch (err) {
      triggerToast("Could not save post.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/social-posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error();
      triggerToast("Post deleted.");
      refreshData();
    } catch (err) {
      triggerToast("Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Resources actions
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle.trim() || !newResourceBlurb.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResourceTitle.trim(),
          rtype: newResourceType,
          blurb: newResourceBlurb.trim()
        })
      });

      if (!res.ok) throw new Error();
      triggerToast("Resource shared with the LUNA network.");
      setNewResourceTitle("");
      setNewResourceBlurb("");
      refreshData();
    } catch (err) {
      triggerToast("Could not share resource.");
    } finally {
      setActionLoading(false);
    }
  };

  // Broadcast actions
  const handleSendBroadcast = async () => {
    if (!broadcastMsg.trim() || !selectedBranch) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_id: selectedBranch.id,
          message: broadcastMsg.trim()
        })
      });

      if (!res.ok) throw new Error();
      triggerToast("Announcement broadcasted live to branch terminals!");
      setBroadcastMsg("");
      refreshData();
    } catch (err) {
      triggerToast("Broadcast failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Derived statistics for selected branch
  const activeQueued = useMemo(() => tickets.filter(t => t.status === 'waiting').length, [tickets]);
  const servingCount = useMemo(() => tickets.filter(t => t.status === 'serving').length, [tickets]);
  const completedCount = useMemo(() => tickets.filter(t => t.status === 'completed').length, [tickets]);

  const branchCSAT = 4.6; // Mock rating
  const branchComplaints = messages.filter(m => m.status === 'pending').length;

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-24">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed left-1/2 top-24 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink-900 py-2.5 pl-4 pr-5 text-xs font-semibold text-white shadow-2xl animate-pop">
          <CheckCircle2 size={15} className="text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container-x space-y-8">
        {/* Header with branch selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink-100 pb-6">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-dot bg-orange-500 animate-pulse" />
              LUNA Command Console
            </span>
            <h1 className="font-display text-2xl font-extrabold text-ink-900 tracking-tight mt-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </h1>
          </div>

          {/* Branch selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink-500 uppercase">Active Branch:</span>
            <select
              value={selectedBranch?.id || ""}
              onChange={e => {
                const found = branches.find(b => b.id === parseInt(e.target.value));
                if (found) setSelectedBranch(found);
              }}
              className="input input-sm !w-56 !h-9 !text-xs !font-bold"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.institution_name} · {b.name}
                </option>
              ))}
            </select>
            <button onClick={refreshData} className="btn btn-outline btn-sm !h-9 !w-9 !p-0" aria-label="Refresh data">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-ink-100 pb-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition ${activeTab === tab.key ? "border-orange-500 text-ink-900 font-bold" : "border-transparent text-ink-500 hover:text-ink-700"}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : (
          /* Tab Contents */
          <div className="space-y-6">
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <FadeIn className="space-y-6">
                {/* Metric Cards Grid */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    title="Active Queued"
                    value={activeQueued}
                    sub="Customers waiting"
                    icon={<Users size={20} />}
                  />
                  <MetricCard
                    title="Average Wait"
                    value={`${selectedBranch?.wait_min || 14} min`}
                    sub="Current branch load"
                    icon={<Clock size={20} />}
                  />
                  <MetricCard
                    title="CSAT Rating"
                    value={`${branchCSAT}/5`}
                    sub="Customer satisfaction"
                    icon={<Smile size={20} />}
                  />
                  <MetricCard
                    title="Open Complaints"
                    value={branchComplaints}
                    sub="Pending resolution"
                    icon={<AlertTriangle size={20} />}
                  />
                </div>

                {/* Main Overview Dashboard */}
                <div className="grid gap-6 lg:grid-cols-[1.3fr_2fr]">
                  {/* Broadcast Messaging Box */}
                  <div className="card p-6 space-y-4">
                    <div className="flex items-center gap-2 text-ink-900 font-bold">
                      <Megaphone size={18} className="text-orange-500" />
                      <h3 className="font-display text-base">Live Branch Broadcast</h3>
                    </div>
                    <p className="text-xs text-ink-500 leading-relaxed">
                      Publish a real-time notification or announcement to all customer tracking screens and lobby displays at this branch instantly.
                    </p>
                    <div className="space-y-3 pt-2">
                      <textarea
                        rows={3}
                        value={broadcastMsg}
                        onChange={e => setBroadcastMsg(e.target.value)}
                        placeholder="e.g. Card collection is now moving to Counter 4. Please have your pre-clearance code ready."
                        className="input text-xs"
                      />
                      <button
                        onClick={handleSendBroadcast}
                        disabled={actionLoading || !broadcastMsg.trim()}
                        className="btn btn-primary btn-sm w-full"
                      >
                        {actionLoading ? "Sending..." : "Publish Broadcast"}
                        <Send size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Operational Feed */}
                  <div className="card p-6 space-y-4">
                    <h3 className="font-display text-base font-bold text-ink-900">Branch Operations Feed</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[300px]">
                      {tickets.length === 0 ? (
                        <p className="text-xs text-ink-500 py-6 text-center">No queue events recorded today yet.</p>
                      ) : (
                        tickets.map(t => (
                          <div key={t.id} className="flex items-center justify-between p-3 border border-ink-100 rounded-xl text-xs">
                            <div>
                              <p className="font-bold text-ink-900">Ticket {t.code} — {t.name}</p>
                              <p className="text-[10px] text-ink-500 mt-0.5">{t.service_name} · Status: <span className="capitalize font-semibold text-orange-500">{t.status}</span></p>
                            </div>
                            <span className="text-[10px] text-ink-300 font-bold">{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* TAB: QUEUE BOARD */}
            {activeTab === "queue" && (
              <FadeIn className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-900">Live Desk Controller</h3>
                    <p className="text-xs text-ink-500 mt-0.5">Manage incoming customers, call next tickets, and clear counters.</p>
                  </div>
                  <button
                    onClick={handleCallNext}
                    disabled={actionLoading || activeQueued === 0}
                    className="btn btn-primary btn-md shadow-lift"
                  >
                    <Play size={16} />
                    <span>Call Next Customer</span>
                  </button>
                </div>

                {/* Queue Table */}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-cream-100 border-b border-ink-100 text-ink-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Ticket</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Service</th>
                          <th className="p-4">Window</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Counter</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-100">
                        {tickets.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-ink-500">
                              No customers queued for this branch today.
                            </td>
                          </tr>
                        ) : (
                          tickets.map(t => (
                            <tr key={t.id} className="hover:bg-cream-50/40">
                              <td className="p-4 font-display font-extrabold text-orange-500 text-sm">{t.code}</td>
                              <td className="p-4 font-semibold text-ink-900">{t.name}</td>
                              <td className="p-4 text-ink-700">{t.service_name}</td>
                              <td className="p-4 font-medium text-ink-500">{t.window_start} - {t.window_end}</td>
                              <td className="p-4">
                                <span className={`pill font-bold !text-[9px] uppercase ${t.status === 'completed' ? "bg-green-100 text-green-700" : t.status === 'called' ? "bg-pink-100 text-pink-600" : t.status === 'serving' ? "bg-navy-100 text-navy-800" : "bg-orange-100 text-orange-700"}`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-ink-700">{t.counter || "—"}</td>
                              <td className="p-4 text-right space-x-1">
                                {t.status === 'waiting' && (
                                  <button
                                    onClick={() => handleUpdateStatus(t.id, 'called')}
                                    className="btn btn-outline btn-sm !h-8 !text-[11px]"
                                  >
                                    Call
                                  </button>
                                )}
                                {t.status === 'called' && (
                                  <button
                                    onClick={() => handleUpdateStatus(t.id, 'serving')}
                                    className="btn btn-navy btn-sm !h-8 !text-[11px]"
                                  >
                                    Serve
                                  </button>
                                )}
                                {t.status === 'serving' && (
                                  <button
                                    onClick={() => handleUpdateStatus(t.id, 'completed')}
                                    className="btn btn-green btn-sm !h-8 !text-[11px]"
                                  >
                                    Complete
                                  </button>
                                )}
                                {t.status !== 'completed' && t.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateStatus(t.id, 'cancelled')}
                                    className="btn btn-ghost btn-sm !h-8 !text-[11px] text-pink-600 hover:bg-pink-50"
                                    aria-label="Cancel ticket"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* TAB: DOCUMENTS */}
            {activeTab === "documents" && (
              <FadeIn className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900">Document Pre-Clearance Approvals</h3>
                  <p className="text-xs text-ink-500 mt-0.5">Review home-uploaded files and approve/flag paperwork before customers arrive.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {documents.length === 0 ? (
                    <div className="card p-8 text-center text-ink-500 sm:col-span-2">
                      No document pre-clearance uploads found.
                    </div>
                  ) : (
                    documents.map(doc => (
                      <div key={doc.id} className="card p-5 space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="pill bg-cream-100 text-ink-700 font-bold uppercase tracking-wider !text-[10px]">
                              {doc.doc_type}
                            </span>
                            <span className={`pill font-bold !text-[9px] uppercase ${doc.status === 'verified' ? "bg-green-100 text-green-700" : doc.status === 'flagged' ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-700"}`}>
                              {doc.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-bold text-ink-900 text-sm sm:text-base">{doc.person}</h4>
                            {doc.ticket_code && <p className="text-xs font-semibold text-orange-500">Linked Ticket: {doc.ticket_code}</p>}
                            <p className="text-xs text-ink-500">File: {doc.file_name}</p>
                          </div>

                          <div className="p-3 bg-green-50/50 rounded-xl flex items-center justify-between border border-green-200/40 text-xs">
                            <span className="text-ink-500 font-medium">LUNA AI Confidence:</span>
                            <span className="font-bold text-green-600">{doc.confidence}% Match</span>
                          </div>
                        </div>

                        <div className="border-t border-ink-100 pt-4 flex gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm flex-1 !text-xs"
                          >
                            View File
                          </a>
                          {doc.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerifyDoc(doc.id, false)}
                                className="btn btn-ghost btn-sm text-pink-600 hover:bg-pink-50 !h-9"
                              >
                                Flag
                              </button>
                              <button
                                onClick={() => handleVerifyDoc(doc.id, true)}
                                className="btn btn-green btn-sm !h-9 flex-1"
                              >
                                Approve
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </FadeIn>
            )}

            {/* TAB: SOCIAL STUDIO */}
            {activeTab === "social" && (
              <FadeIn className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900">Social Studio</h3>
                  <p className="text-xs text-ink-500 mt-0.5">Manage customer complaints from X and Instagram. Use AI replies to convert frustrations into booked appointments.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  {/* Create Post Form */}
                  <div className="card p-6 space-y-4">
                    <h4 className="font-display text-base font-bold text-ink-900">Publish / Schedule Reply</h4>
                    <div className="space-y-3.5">
                      <textarea
                        rows={4}
                        value={newPostContent}
                        onChange={e => setNewPostContent(e.target.value)}
                        placeholder="Write your response, announcement, or feedback update..."
                        className="input text-xs"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCreatePost('draft')}
                          disabled={actionLoading || !newPostContent.trim()}
                          className="btn btn-outline btn-sm flex-1"
                        >
                          Save Draft
                        </button>
                        <button
                          onClick={() => handleCreatePost('published')}
                          disabled={actionLoading || !newPostContent.trim()}
                          className="btn btn-primary btn-sm flex-1"
                        >
                          Publish Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Social Feed List */}
                  <div className="card p-6 space-y-4">
                    <h4 className="font-display text-base font-bold text-ink-900">Conversations Feed</h4>
                    <div className="space-y-4 overflow-y-auto max-h-[350px]">
                      {socialPosts.length === 0 ? (
                        <p className="text-xs text-ink-500 text-center py-10">No social conversations found.</p>
                      ) : (
                        socialPosts.map(post => (
                          <div key={post.id} className="p-4 border border-ink-100 rounded-2xl space-y-3 text-xs bg-cream-50/20">
                            <div className="flex justify-between items-center">
                              <span className="pill bg-pink-50 text-pink-600 font-bold !text-[9px] uppercase tracking-wider">
                                {post.platform}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`pill font-bold !text-[9px] uppercase ${post.sentiment === 'positive' ? "bg-green-100 text-green-700" : post.sentiment === 'negative' ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-700"}`}>
                                  {post.sentiment} sentiment
                                </span>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-ink-300 hover:text-pink-600 transition"
                                  aria-label="Delete post"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <p className="text-ink-700 leading-relaxed">{post.content}</p>

                            {post.suggested_reply && (
                              <div className="p-3 border border-green-200 bg-green-50/10 rounded-xl space-y-2">
                                <div className="flex items-center gap-1 text-green-700 font-bold text-[10px]">
                                  <Sparkles size={11} />
                                  <span>AI SUGGESTED REPLY</span>
                                </div>
                                <p className="text-ink-900 leading-relaxed text-[11px]">{post.suggested_reply}</p>
                                <button
                                  onClick={() => {
                                    setNewPostContent(post.suggested_reply);
                                    triggerToast("AI reply loaded into editor.");
                                  }}
                                  className="btn btn-outline btn-sm !h-7 !text-[10px]"
                                >
                                  Load into Editor
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* TAB: RESOURCES */}
            {activeTab === "resources" && (
              <FadeIn className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-900">BranchConnect Resource Library</h3>
                    <p className="text-xs text-ink-500 mt-0.5">Access playbooks, SOPs, templates, and fraud warnings shared across the LUNA network.</p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
                  {/* Share Resource Form */}
                  <div className="card p-6 space-y-4">
                    <h4 className="font-display text-base font-bold text-ink-900">Share a Template / Playbook</h4>
                    <form onSubmit={handleCreateResource} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="label">Resource Title</label>
                        <input
                          type="text"
                          required
                          value={newResourceTitle}
                          onChange={e => setNewResourceTitle(e.target.value)}
                          placeholder="e.g. Card Collection Verification SOP"
                          className="input text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="label">Resource Type</label>
                        <select
                          value={newResourceType}
                          onChange={e => setNewResourceType(e.target.value)}
                          className="input text-xs"
                        >
                          <option value="template">Template</option>
                          <option value="playbook">Playbook</option>
                          <option value="alert">Fraud Alert</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="label">Brief Description</label>
                        <textarea
                          required
                          rows={3}
                          value={newResourceBlurb}
                          onChange={e => setNewResourceBlurb(e.target.value)}
                          placeholder="What is this resource and how should branches utilize it?"
                          className="input text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading || !newResourceTitle.trim() || !newResourceBlurb.trim()}
                        className="btn btn-primary btn-sm w-full"
                      >
                        Share Resource
                        <Plus size={14} />
                      </button>
                    </form>
                  </div>

                  {/* Resource List */}
                  <div className="card p-6 space-y-4">
                    <h4 className="font-display text-base font-bold text-ink-900">Shared Resources</h4>
                    <div className="space-y-3.5 overflow-y-auto max-h-[350px]">
                      {resources.length === 0 ? (
                        <p className="text-xs text-ink-500 text-center py-10">No shared resources found.</p>
                      ) : (
                        resources.map(res => (
                          <div key={res.id} className="p-4 border border-ink-100 rounded-2xl flex items-start justify-between gap-4 text-xs bg-cream-50/20">
                            <div className="space-y-1.5">
                              <span className="pill bg-cream-100 text-ink-700 font-bold uppercase tracking-wider !text-[9px]">
                                {res.rtype}
                              </span>
                              <h5 className="font-bold text-ink-900 text-sm sm:text-base">{res.title}</h5>
                              <p className="text-ink-500 leading-relaxed">{res.blurb}</p>
                            </div>
                            <button
                              onClick={() => triggerToast(`Resource downloaded. (${res.title})`)}
                              className="btn btn-outline btn-sm !h-8 !w-8 !p-0 shrink-0"
                              aria-label="Download resource"
                            >
                              <Download size={13} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
