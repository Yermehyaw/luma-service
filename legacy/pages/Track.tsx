import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SectionHeader } from '../components/LumaMark';
import { TicketVisual } from '../components/TicketVisual';
import { FadeIn } from '../components/ui';
import { Search, Loader2, AlertCircle, Clock, Users, Megaphone, ArrowRight } from 'lucide-react';

export const Track: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [codeQuery, setCodeQuery] = useState("");
  const [ticket, setTicket] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (codeStr: string) => {
    const formatted = codeStr.trim().toUpperCase();
    if (formatted.length < 4) return;

    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const res = await fetch(`/api/tickets?code=${encodeURIComponent(formatted)}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("No ticket found matching this code.");
        throw new Error("Could not retrieve ticket details.");
      }

      const data = await res.json();
      setTicket(data);

      // Fetch uploaded documents for this ticket
      fetch(`/api/documents?ticket_code=${encodeURIComponent(data.code)}`)
        .then(r => r.json())
        .then(docs => {
          if (Array.isArray(docs)) setDocuments(docs);
        })
        .catch(err => console.error('Error fetching documents:', err));

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setCodeQuery(code);
      handleSearch(code);
    }
  }, [searchParams]);

  // Simulated queue statistics
  const peopleAhead = ticket ? Math.max(0, ticket.position - 1) : 0;
  const estimatedWait = peopleAhead * 8; // 8 minutes per person

  return (
    <div className="grad-hero min-h-screen pt-28 pb-24">
      <div className="container-x max-w-2xl space-y-10">
        <SectionHeader
          eyebrow="Live Tracking"
          title="Track your queue position"
          sub="Watch your ticket live. See how many people are ahead of you, and walk straight to your counter when called."
        />

        {/* Code Search Input */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={18} />
            <input
              type="text"
              value={codeQuery}
              onChange={e => setCodeQuery(e.target.value)}
              placeholder="e.g. LM-A103"
              className="input !pl-10 uppercase font-bold tracking-wider"
              aria-label="Ticket code"
            />
          </div>
          <button
            onClick={() => handleSearch(codeQuery)}
            disabled={loading || codeQuery.length < 4}
            className="btn btn-primary btn-md w-full"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Searching...</span>
              </>
            ) : (
              <span>Track Ticket</span>
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-pink-50 border border-pink-200 text-pink-600 rounded-[20px] flex items-start gap-3 max-w-md mx-auto text-xs sm:text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="font-bold">Tracking failed</p>
              <p className="leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Ticket Live dashboard */}
        {ticket && (
          <FadeIn className="space-y-6">
            {/* Live Queue Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">People Ahead</p>
                  <p className="font-display text-xl font-extrabold text-ink-900">{peopleAhead} customers</p>
                </div>
              </div>

              <div className="card p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">Estimated Wait</p>
                  <p className="font-display text-xl font-extrabold text-green-600">{estimatedWait} mins</p>
                </div>
              </div>
            </div>

            {/* Ticket Card Visual */}
            <TicketVisual
              code={ticket.code}
              institution_name={ticket.institution_name}
              branch_name={ticket.branch_name}
              service_name={ticket.service_name}
              name={ticket.name}
              visit_date={ticket.visit_date}
              window_start={ticket.window_start}
              window_end={ticket.window_end}
              status={ticket.status}
              counter={ticket.counter}
              position={ticket.position}
              payment_status={ticket.payment_status}
              payment_amount={ticket.payment_amount}
            />

            {/* Verification Status Banner */}
            {documents.length > 0 && (
              <div className="card p-5 border border-green-200 bg-green-50/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-ink-900 text-xs sm:text-sm">Document Pre-Clearance Active</h4>
                    <p className="text-[11px] text-ink-500">{documents.length} document(s) checked with AI score.</p>
                  </div>
                </div>
                <span className="pill bg-green-50 text-green-700 font-bold capitalize">
                  {documents[0].status}
                </span>
              </div>
            )}

            {/* Hint */}
            <p className="text-center text-xs text-ink-500 leading-relaxed max-w-sm mx-auto">
              Tip: keep this page open. Your counter call will flash here live and trigger an SMS alert.
            </p>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
