import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/LumaMark';
import { TicketVisual } from '../components/TicketVisual';
import { FadeIn } from '../components/ui';
import { 
  Building, MapPin, ShieldCheck, Clock, User, Phone, Mail, 
  CreditCard, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle 
} from 'lucide-react';

const steps = ["Institution", "Service & Branch", "Date & Window", "Your Details"];

interface Branch {
  id: number;
  institution_id: number;
  name: string;
  city: string;
  area: string;
  wait_min: number;
  load_status: string;
}

interface Service {
  id: number;
  institution_id: number;
  name: string;
  description: string;
  fee: number;
}

interface Institution {
  id: number;
  name: string;
  category: string;
  logo_url: string;
  branches?: Branch[];
}

const timeWindows = [
  { start: "09:00", end: "09:30" },
  { start: "09:30", end: "10:00" },
  { start: "10:00", end: "10:30" },
  { start: "10:30", end: "11:00" },
  { start: "11:00", end: "11:30" },
  { start: "11:30", end: "12:00" },
  { start: "12:00", end: "12:30" },
  { start: "12:30", end: "13:00" },
  { start: "13:00", end: "13:30" },
  { start: "13:30", end: "14:00" },
  { start: "14:00", end: "14:30" },
  { start: "14:30", end: "15:00" },
  { start: "15:00", end: "15:30" },
  { start: "15:30", end: "16:00" }
];

export const Book: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Selection states
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedWindow, setSelectedWindow] = useState<{ start: string; end: string } | null>(null);

  // Form details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdTicket, setCreatedTicket] = useState<any>(null);

  // Fetch institutions on load
  useEffect(() => {
    fetch('/api/institutions?embed=1')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInstitutions(data);

          // Handle pre-selected institution from URL
          const instId = searchParams.get('institution');
          if (instId) {
            const found = data.find((i: Institution) => i.id === parseInt(instId));
            if (found) {
              setSelectedInst(found);
              setCurrentStep(1);

              // Handle pre-selected branch from URL
              const branchId = searchParams.get('branch');
              if (branchId && found.branches) {
                const foundBranch = found.branches.find((b: Branch) => b.id === parseInt(branchId));
                if (foundBranch) {
                  setSelectedBranch(foundBranch);
                }
              }
            }
          }
        }
      })
      .catch(err => console.error('Error fetching institutions:', err));
  }, [searchParams]);

  // Fetch services when institution is selected
  useEffect(() => {
    if (selectedInst) {
      fetch(`/api/services?institution_id=${selectedInst.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setServices(data);
        })
        .catch(err => console.error('Error fetching services:', err));
    } else {
      setServices([]);
      setSelectedService(null);
      setSelectedBranch(null);
    }
  }, [selectedInst]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBook = async () => {
    if (!selectedInst || !selectedBranch || !selectedService || !selectedWindow || !name || !email || !phone) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_id: selectedInst.id,
          branch_id: selectedBranch.id,
          service_id: selectedService.id,
          name,
          email,
          phone,
          visit_date: selectedDate,
          window_start: selectedWindow.start,
          window_end: selectedWindow.end,
          payment_status: selectedService.fee > 0 && paymentDone ? 'completed' : 'pending',
          payment_amount: selectedService.fee
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Could not book ticket.");
      }

      const ticket = await res.json();
      setCreatedTicket(ticket);
      setCurrentStep(4); // Move to success step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get tomorrow and next 5 days
  const availableDates = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push({
        iso: d.toISOString().slice(0, 10),
        formatted: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        isToday: i === 0
      });
    }
    return list;
  }, []);

  return (
    <div className="grad-hero min-h-screen pt-28 pb-24">
      <div className="container-x max-w-3xl space-y-8">
        <SectionHeader
          eyebrow="Smart Booking"
          title="Reserve your arrival window"
          sub="Choose your branch, service, and timing. We'll handle the paperwork so you skip the line."
        />

        {/* Step Indicator */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between border-b border-ink-100 pb-4 max-w-xl mx-auto text-xs font-semibold text-ink-300">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${currentStep === idx ? "bg-orange-500 text-white" : currentStep > idx ? "bg-green-500 text-white" : "bg-ink-100 text-ink-500"}`}>
                  {idx + 1}
                </span>
                <span className={currentStep === idx ? "text-ink-900 font-bold" : ""}>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Select Institution */}
        {currentStep === 0 && (
          <FadeIn className="space-y-4 max-w-xl mx-auto">
            <h3 className="font-display text-lg font-bold text-ink-900">Select an Institution</h3>
            <div className="grid gap-3">
              {institutions.map(inst => (
                <button
                  key={inst.id}
                  onClick={() => {
                    setSelectedInst(inst);
                    handleNext();
                  }}
                  className="card p-4 flex items-center justify-between text-left hover:border-orange-500/50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cream-100 text-ink-900 flex items-center justify-center font-bold">
                      {inst.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink-900 text-sm sm:text-base">{inst.name}</h4>
                      <p className="text-xs text-ink-500 capitalize">{inst.category}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-ink-300" />
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Step 2: Select Branch & Service */}
        {currentStep === 1 && selectedInst && (
          <FadeIn className="space-y-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink-900">{selectedInst.name}</h3>
              <button onClick={handleBack} className="btn btn-ghost btn-sm text-ink-500">
                <ArrowLeft size={14} /> Change Institution
              </button>
            </div>

            {/* Select Branch */}
            <div className="space-y-3">
              <label className="label">Select Branch Location</label>
              <div className="grid gap-2.5">
                {(selectedInst.branches || []).map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranch(b)}
                    className={`card p-4 text-left flex items-center justify-between cursor-pointer transition ${selectedBranch?.id === b.id ? "border-orange-500 bg-orange-50/10 shadow-lift" : "hover:border-orange-500/30"}`}
                  >
                    <div>
                      <h4 className="font-bold text-ink-900 text-sm">{b.name}</h4>
                      <p className="text-xs text-ink-500">{b.area}, {b.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-ink-300 uppercase">Live Wait</p>
                      <p className="font-display text-sm font-bold text-orange-500">{b.wait_min} mins</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Service */}
            <div className="space-y-3">
              <label className="label">Select Service Required</label>
              <div className="grid gap-2.5">
                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`card p-4 text-left flex items-center justify-between cursor-pointer transition ${selectedService?.id === s.id ? "border-orange-500 bg-orange-50/10 shadow-lift" : "hover:border-orange-500/30"}`}
                  >
                    <div className="space-y-1 max-w-[75%]">
                      <h4 className="font-bold text-ink-900 text-sm">{s.name}</h4>
                      <p className="text-xs text-ink-500 leading-relaxed">{s.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-ink-300 uppercase">Service Fee</p>
                      <p className="font-display text-sm font-extrabold text-ink-900">
                        {s.fee > 0 ? `₦${s.fee.toLocaleString()}` : "Free"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleBack} className="btn btn-outline btn-md flex-1">Back</button>
              <button
                onClick={handleNext}
                disabled={!selectedBranch || !selectedService}
                className="btn btn-primary btn-md flex-1"
              >
                Continue
                <ArrowRight size={15} />
              </button>
            </div>
          </FadeIn>
        )}

        {/* Step 3: Select Date & Time Window */}
        {currentStep === 2 && selectedInst && selectedBranch && selectedService && (
          <FadeIn className="space-y-6 max-w-xl mx-auto">
            <h3 className="font-display text-lg font-bold text-ink-900">Select Date & Arrival Window</h3>

            {/* Date Grid */}
            <div className="space-y-3">
              <label className="label">Select Date</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableDates.map(d => (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition text-xs font-semibold ${selectedDate === d.iso ? "border-orange-500 bg-orange-50/10 text-orange-600 font-bold" : "border-ink-100 bg-white text-ink-700 hover:border-ink-300"}`}
                  >
                    <p>{d.formatted}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">{d.isToday ? "Today" : "Open"}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <label className="label">Select 30-minute Arrival Window</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeWindows.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWindow(w)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition text-xs font-semibold ${selectedWindow?.start === w.start ? "border-orange-500 bg-orange-50/10 text-orange-600 font-bold" : "border-ink-100 bg-white text-ink-700 hover:border-ink-300"}`}
                  >
                    <span>{w.start} - {w.end}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleBack} className="btn btn-outline btn-md flex-1">Back</button>
              <button
                onClick={handleNext}
                disabled={!selectedWindow}
                className="btn btn-primary btn-md flex-1"
              >
                Continue
                <ArrowRight size={15} />
              </button>
            </div>
          </FadeIn>
        )}

        {/* Step 4: Your Details & Payment */}
        {currentStep === 3 && selectedInst && selectedBranch && selectedService && selectedWindow && (
          <FadeIn className="space-y-6 max-w-xl mx-auto">
            <h3 className="font-display text-lg font-bold text-ink-900">Your Details & Confirmation</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Oluwaseun Taiwo"
                    className="input !pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. seun@gmail.com"
                    className="input !pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    className="input !pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Payments Module Integration */}
            {selectedService.fee > 0 && (
              <div className="card p-5 border border-orange-200 bg-orange-50/5 space-y-4">
                <div className="flex items-center gap-2.5 text-orange-500 font-bold">
                  <CreditCard size={18} />
                  <h4 className="font-display text-sm">Administrative Payment Required</h4>
                </div>
                <p className="text-xs text-ink-500 leading-relaxed">
                  This service requires a pre-paid administrative fee of <b>₦{selectedService.fee.toLocaleString()}</b>. Pay securely now to bypass the cash counter at the branch tomorrow.
                </p>

                {paymentDone ? (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={14} />
                    <span>Payment Simulated Successfully! Receipt attached to ticket.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPaymentDone(true)}
                    className="btn btn-navy btn-sm w-full"
                  >
                    Pay ₦{selectedService.fee.toLocaleString()} Securely
                  </button>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-pink-50 border border-pink-200 text-pink-600 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button onClick={handleBack} className="btn btn-outline btn-md flex-1">Back</button>
              <button
                onClick={handleBook}
                disabled={submitting || (selectedService.fee > 0 && !paymentDone) || !name || !email || !phone}
                className="btn btn-primary btn-md flex-1"
              >
                {submitting ? "Booking..." : "Book Ticket"}
                <ArrowRight size={15} />
              </button>
            </div>
          </FadeIn>
        )}

        {/* Step 5: Success Screen */}
        {currentStep === 4 && createdTicket && (
          <FadeIn className="space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200 shadow-lift">
                <CheckCircle2 size={26} />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-ink-900">Your Arrival Window is Secured!</h2>
              <p className="text-xs text-ink-500 max-w-sm mx-auto">
                We have sent a confirmation SMS and email with your ticket code. Please arrive within your selected window.
              </p>
            </div>

            {/* Ticket Card Visual */}
            <TicketVisual
              code={createdTicket.code}
              institution_name={selectedInst?.name || ""}
              branch_name={selectedBranch?.name || ""}
              service_name={selectedService?.name || ""}
              name={createdTicket.name}
              visit_date={createdTicket.visit_date}
              window_start={createdTicket.window_start}
              window_end={createdTicket.window_end}
              status={createdTicket.status}
              counter={createdTicket.counter}
              position={createdTicket.position}
              payment_status={createdTicket.payment_status}
              payment_amount={createdTicket.payment_amount}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => navigate(`/track?code=${createdTicket.code}`)}
                className="btn btn-primary btn-md flex-1"
              >
                Track live queue
              </button>
              <button
                onClick={() => navigate(`/verify?ticket=${createdTicket.code}`)}
                className="btn btn-outline btn-md flex-1"
              >
                Verify documents tonight
              </button>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
