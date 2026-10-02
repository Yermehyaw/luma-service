'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTenant } from '../../../../lib/tenant-context';
import { TenantCustomerLayout } from '../../../../components/layouts/TenantCustomerLayout';
import { ticketRepository } from '../../../../features/ticketing/api/ticket-repository';
import { Ticket } from '../../../../types/ticket';
import { TicketCard } from '../../../../features/ticketing/components/TicketCard';
import { MOCK_BRANCHES } from '../../../../mock/branches';
import { MOCK_SERVICES } from '../../../../mock/services';
import { Ticket as TicketIcon, Calendar, Clock, User, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function BookQueuePage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = (params?.tenantId as string) || 'acme-bank';
  const { tenant } = useTenant();

  const branches = MOCK_BRANCHES.filter((b) => b.tenantId === tenant.id);
  const services = MOCK_SERVICES.filter((s) => s.tenantId === tenant.id);

  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || 'br_admiralty');
  const [selectedService, setSelectedService] = useState(services[0]?.id || 'srv_cash');
  const [name, setName] = useState('Chidi Nnamdi');
  const [phone, setPhone] = useState('+234 803 123 4567');
  const [email, setEmail] = useState('chidi@gmail.com');
  const [timeWindow, setTimeWindow] = useState('10:30 - 11:00');
  const [issuedTicket, setIssuedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const branch = branches.find((b) => b.id === selectedBranch) || branches[0];
    const service = services.find((s) => s.id === selectedService) || services[0];

    const t = await ticketRepository.createTicket({
      tenantId: tenant.id,
      tenantName: tenant.name,
      branchId: branch?.id,
      branchName: branch?.name,
      serviceId: service?.id,
      serviceName: service?.name,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      windowStart: timeWindow.split(' - ')[0],
      windowEnd: timeWindow.split(' - ')[1],
    });

    setIssuedTicket(t);
    setLoading(false);
  };

  return (
    <TenantCustomerLayout>
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-slate-900">Book Arrival Window & Timed Ticket</h1>
          <p className="text-xs text-slate-500">Select branch location, service, and pick your 30-minute arrival slot.</p>
        </div>

        {issuedTicket ? (
          <div className="max-w-md mx-auto space-y-6 text-center">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg">Ticket Reserved Successfully!</h3>
              <p className="text-xs text-emerald-700">Present this digital ticket upon arrival at the branch.</p>
            </div>

            <TicketCard ticket={issuedTicket} />

            <div className="flex gap-3">
              <button
                onClick={() => setIssuedTicket(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Book Another Ticket
              </button>
              <button
                onClick={() => router.push(`/tenant/${tenantSlug}/track`)}
                className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                Track Live Ticket
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBook} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-bold text-slate-800">Select Branch Location</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 bg-white text-slate-800 font-medium"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.waitMin} min wait)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800">Select Service Required</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 bg-white text-slate-800 font-medium"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (~{s.minutes}m)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 text-xs">Select 30-Minute Arrival Slot</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {['09:00 - 09:30', '10:00 - 10:30', '10:30 - 11:00', '11:30 - 12:00', '14:00 - 14:30', '15:00 - 15:30'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeWindow(slot)}
                    className={`rounded-xl border p-3 font-semibold text-center transition-all ${
                      timeWindow === slot
                        ? 'border-[var(--tenant-primary,#0057B8)] bg-[var(--tenant-primary,#0057B8)] text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: tenant.branding.primaryColor }}
            >
              {loading ? 'Processing Reserve...' : 'Confirm Ticket Reservation'}
            </button>
          </form>
        )}
      </div>
    </TenantCustomerLayout>
  );
}
