import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';

interface TicketVisualProps {
  code: string;
  institution_name: string;
  branch_name: string;
  service_name: string;
  name: string;
  visit_date: string;
  window_start: string;
  window_end: string;
  status: string;
  counter?: string | null;
  position?: number;
  payment_status?: string;
  payment_amount?: number;
  dark?: boolean;
  className?: string;
}

export const TicketVisual: React.FC<TicketVisualProps> = ({
  code,
  institution_name,
  branch_name,
  service_name,
  name,
  visit_date,
  window_start,
  window_end,
  status,
  counter = null,
  position = 1,
  payment_status = 'pending',
  payment_amount = 0,
  dark = false,
  className = ""
}) => {
  const isCompleted = status === 'completed';
  const isCalled = status === 'called' || status === 'serving';

  // Format Date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-[28px] border p-6 ${dark ? "border-white/10 bg-navy-900 text-white" : "border-ink-900/[0.08] bg-white text-ink-900"} shadow-lift ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-dashed border-ink-100/30 pb-4 mb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-50">LUNA Smart Ticket</p>
          <h4 className="font-display text-lg font-bold mt-0.5">{institution_name}</h4>
        </div>
        <div className="text-right">
          <span className={`pill ${isCompleted ? "bg-green-100 text-green-700" : isCalled ? "bg-pink-100 text-pink-600 animate-pulse" : "bg-orange-100 text-orange-700"} font-bold capitalize`}>
            {status === 'waiting' ? 'Queued' : status}
          </span>
        </div>
      </div>

      {/* Ticket Code Hero */}
      <div className="text-center py-5 my-1 bg-cream-50/50 rounded-2xl border border-ink-900/[0.03]">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-40">Your Ticket Code</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight mt-1 text-orange-500">{code}</h1>
        {counter && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200/50 text-xs font-bold">
            <CheckCircle2 size={12} />
            <span>Proceed to {counter}</span>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm mt-5">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider opacity-40">Customer</p>
          <div className="flex items-center gap-1.5 font-semibold">
            <User size={14} className="opacity-60" />
            <span className="truncate">{name}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider opacity-40">Service</p>
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck size={14} className="opacity-60" />
            <span className="truncate">{service_name}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider opacity-40">Branch Location</p>
          <div className="flex items-center gap-1.5 font-semibold">
            <MapPin size={14} className="opacity-60" />
            <span className="truncate">{branch_name}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider opacity-40">Arrival Window</p>
          <div className="flex items-center gap-1.5 font-semibold">
            <Clock size={14} className="opacity-60" />
            <span>{window_start} - {window_end}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 border-t border-ink-100/20 pt-4 flex items-center justify-between text-xs opacity-60">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{formatDate(visit_date)}</span>
        </div>
        <div>
          {payment_status === 'completed' || payment_status === 'paid' ? (
            <span className="text-green-600 font-bold">✓ Paid ₦{payment_amount?.toLocaleString()}</span>
          ) : payment_amount > 0 ? (
            <span className="text-orange-500 font-bold">Pending ₦{payment_amount?.toLocaleString()}</span>
          ) : (
            <span className="text-ink-500">No Service Fee</span>
          )}
        </div>
      </div>

      {/* Decorative Ticket Notch */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 h-6 w-6 rounded-full bg-cream-50 border-r border-ink-900/[0.08] z-10" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 h-6 w-6 rounded-full bg-cream-50 border-l border-ink-900/[0.08] z-10" />
    </motion.div>
  );
};
