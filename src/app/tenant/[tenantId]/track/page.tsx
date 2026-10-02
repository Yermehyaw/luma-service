'use client';

import React, { useState } from 'react';
import { TenantCustomerLayout } from '../../../../components/layouts/TenantCustomerLayout';
import { ticketRepository } from '../../../../features/ticketing/api/ticket-repository';
import { Ticket } from '../../../../types/ticket';
import { TicketCard } from '../../../../features/ticketing/components/TicketCard';
import { Search, Radio } from 'lucide-react';

export default function TrackTicketPage() {
  const [ticketCode, setTicketCode] = useState('LM-A042');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;
    setLoading(true);
    const found = await ticketRepository.getTicketByCode(ticketCode.trim());
    setTicket(found);
    setSearched(true);
    setLoading(false);
  };

  return (
    <TenantCustomerLayout>
      <div className="mx-auto max-w-xl px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-slate-900">Track Live Ticket & Queue Position</h1>
          <p className="text-xs text-slate-500">Enter your digital ticket code (e.g. LM-A042) for live status updates.</p>
        </div>

        <form onSubmit={handleSearch} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. LM-A042"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 font-mono text-sm font-bold text-slate-900 uppercase focus:border-slate-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
          >
            {loading ? 'Searching...' : 'Track Ticket Position'}
          </button>
        </form>

        {searched && (
          <div>
            {ticket ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
                    Live Tracking Signal Active
                  </span>
                  <span>Position #{ticket.position}</span>
                </div>
                <TicketCard ticket={ticket} />
              </div>
            ) : (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-800">
                <p className="font-bold">Ticket Code Not Found</p>
                <p className="mt-1 text-rose-600">Please double check your code or book a new ticket window.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </TenantCustomerLayout>
  );
}
