import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/ui';
import { SectionHeader } from '../components/LumaMark';
import { 
  ArrowRight, ShieldCheck, Clock, Users, Sparkles, MessageSquare, 
  CreditCard, Share2, BarChart3, ChevronRight, Check, CheckCircle2,
  Building, GraduationCap, Activity, Store, Landmark, RefreshCw
} from 'lucide-react';

const marqueeItems = [
  "Union Bank Lekki · wait time cut by 78% · Live",
  "Makerere transcript clearance · zero walk-in queue today · Live",
  "Lagoon Hospital VI · 9 min average consultation wait · Live",
  "National ID Center Abuja · 1,240 enrollments pre-cleared tonight · Live",
  "Lekki Microfinance · SME loan approvals processed in 15 min · Live",
  "Standard Chartered VI · wealth consultation priority window active · Live"
];

const steps = [
  { num: "01", label: "Choose service", desc: "Select from listed banks, schools, hospitals, or civic centers." },
  { num: "02", label: "Book a time", desc: "Pick a convenient 30-minute arrival window that works for you." },
  { num: "03", label: "Verify documents", desc: "Upload required paperwork from home for instant pre-clearance." },
  { num: "04", label: "Pay securely", desc: "Settle service fees in advance to bypass billing desks entirely." },
  { num: "05", label: "Track your queue", desc: "Watch your live position and get called on your phone." },
  { num: "06", label: "Get served", desc: "Walk straight to your designated counter and get served in minutes." },
  { num: "07", label: "Leave feedback", desc: "Share your experience instantly to keep branches accountable." }
];

const modules = [
  {
    id: "social",
    title: "Social Studio",
    tagline: "Turn conversations into customer insight.",
    desc: "Monitor social media feeds with native sentiment analysis. Route complaints directly into your branch queue with suggested AI smart replies.",
    ui: (
      <div className="border border-ink-100 bg-white rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-pink-500" />
            <span className="font-bold text-ink-900">Social Studio Workstation</span>
          </div>
          <span className="pill bg-pink-50 text-pink-600 font-bold">X (Twitter) Feed</span>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-cream-50 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink-700">@Oluwaseun_T</span>
              <span className="text-[10px] text-pink-600 font-bold">Sentiment: Negative (-0.82)</span>
            </div>
            <p className="text-ink-500">I have been waiting at Lekki branch for 45 mins just for card collection. Why is the queue so long?!</p>
          </div>
          <div className="p-3 bg-green-50/50 border border-green-200/50 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-green-700 font-bold">
              <Sparkles size={12} />
              <span>Suggested AI Reply</span>
            </div>
            <p className="text-ink-700">Hello Oluwaseun! We apologize for the wait. Card collection is currently high volume. Tap below to book a priority slot on Luma and bypass the desk immediately.</p>
            <button className="btn btn-primary btn-sm !h-7 !text-[11px]">Apply & Reply</button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "queue",
    title: "Smart Queue & Bookings",
    tagline: "Replace waiting with certainty.",
    desc: "Customers select arrival windows and track their live queue position. Staff call tickets and manage desks from a central, real-time board.",
    ui: (
      <div className="border border-ink-100 bg-white rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink-900">Ticket Active State</span>
          </div>
          <span className="pill bg-orange-100 text-orange-700 font-bold">Live Position</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
            <div>
              <p className="text-[10px] font-bold text-ink-500">TICKET CODE</p>
              <h3 className="font-display text-xl font-extrabold text-orange-500">LM-A024</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-ink-500">ESTIMATED WAIT</p>
              <p className="font-display text-lg font-bold text-ink-900">12 mins</p>
            </div>
          </div>
          <div className="p-3 bg-ink-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Now Serving: <b>LM-A021</b></span>
            </div>
            <span className="text-[10px] text-orange-400 font-bold">Counter 3</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "verify",
    title: "Document Verification",
    tagline: "Fix paperwork before the customer arrives.",
    desc: "Secure home document uploads. AI-assisted authenticity verification guarantees bank-grade confidence scores before they walk in.",
    ui: (
      <div className="border border-ink-100 bg-white rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink-900">Document Pre-Clearance</span>
          </div>
          <span className="pill bg-green-100 text-green-700 font-bold">96% Confidence</span>
        </div>
        <div className="space-y-2">
          <div className="p-3 border border-ink-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={16} />
              <div>
                <p className="font-bold text-ink-900">National ID Card</p>
                <p className="text-[10px] text-ink-500">Oluwaseun_ID.png</p>
              </div>
            </div>
            <span className="pill bg-green-50 text-green-700 font-bold">Verified</span>
          </div>
          <div className="p-3 border border-ink-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-500" size={16} />
              <div>
                <p className="font-bold text-ink-900">Proof of Address</p>
                <p className="text-[10px] text-ink-500">Utility_Bill.pdf</p>
              </div>
            </div>
            <span className="pill bg-orange-50 text-orange-700 font-bold">Processing</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "payments",
    title: "Payments",
    tagline: "Connect payment to the service.",
    desc: "Secure pre-payment of administrative fees. Bypass cash desks completely and combine receipts with smart tickets in one step.",
    ui: (
      <div className="border border-ink-100 bg-white rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink-900">Administrative Settle</span>
          </div>
          <span className="pill bg-green-100 text-green-700 font-bold">Paid</span>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-cream-50 rounded-xl space-y-1">
            <div className="flex justify-between">
              <span className="text-ink-500">Service Fee</span>
              <span className="font-bold text-ink-900">₦2,500</span>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-1.5 mt-1.5">
              <span className="font-bold text-ink-700">Total Charged</span>
              <span className="font-bold text-green-600">₦2,500</span>
            </div>
          </div>
          <div className="p-2.5 bg-green-50 border border-green-200/50 rounded-xl flex items-center gap-2 text-green-700 font-bold">
            <CheckCircle2 size={14} />
            <span>Payment Successful · Ticket Active</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "branch",
    title: "BranchConnect",
    tagline: "When one branch learns, every branch benefits.",
    desc: "Internal knowledge sharing and collaboration feed. Share playbooks, fraud warnings, and operational reports across your network instantly.",
    ui: (
      <div className="border border-ink-100 bg-white rounded-2xl p-5 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-ink-100 pb-2">
          <span className="font-bold text-ink-900">BranchConnect Feed</span>
          <span className="pill bg-orange-100 text-orange-700 font-bold">Alert</span>
        </div>
        <div className="space-y-2">
          <div className="p-2.5 bg-orange-50 border border-orange-200/50 rounded-xl space-y-1">
            <p className="font-bold text-orange-700">Fraud Alert: Fake National ID</p>
            <p className="text-ink-700 leading-relaxed text-[11px]">Lagos branches: Watch out for paper ID cards with altered laminate. Verification checklist shared on template library.</p>
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl flex justify-between items-center">
            <span className="font-semibold text-ink-700">Elderly Priority SOP Playbook</span>
            <span className="text-ink-500 text-[10px]">142 downloads</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "intelligence",
    title: "LUNA Intelligence",
    tagline: "See the service. Understand the business.",
    desc: "Clean management dashboards. Real-time metrics on customer volume, satisfaction, branch wait times, and open complaints.",
    ui: (
      <div className="border border-ink-100 bg-white rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <span className="font-bold text-ink-900">Executive Dashboard</span>
          <span className="text-[10px] text-ink-500 font-semibold">Today · Live</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 bg-cream-50 rounded-xl">
            <p className="text-[10px] text-ink-500 uppercase font-bold">Total Served</p>
            <p className="font-display text-lg font-extrabold text-ink-900">1,248</p>
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl">
            <p className="text-[10px] text-ink-500 uppercase font-bold">Avg Wait</p>
            <p className="font-display text-lg font-extrabold text-ink-900">14 min</p>
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl">
            <p className="text-[10px] text-ink-500 uppercase font-bold">CSAT Score</p>
            <p className="font-display text-lg font-extrabold text-green-600">4.6/5</p>
          </div>
          <div className="p-2.5 bg-pink-50 rounded-xl">
            <p className="text-[10px] text-pink-600 uppercase font-bold">Complaints</p>
            <p className="font-display text-lg font-extrabold text-pink-600">38</p>
          </div>
        </div>
      </div>
    )
  }
];

const industries = [
  { icon: <Landmark size={22} />, title: "Financial Services", desc: "Reduce branch queue bottlenecks, pre-clear KYC documents, and streamline SME loan processing." },
  { icon: <Activity size={22} />, title: "Healthcare", desc: "Coordinate patient arrivals, pre-verify insurance files, and slash waiting room congestion." },
  { icon: <GraduationCap size={22} />, title: "Education", desc: "Manage transcript pickup queues, verify certificate submissions, and automate enrollment check-ins." },
  { icon: <Store size={22} />, title: "Retail & Services", desc: "Connect online bookings with physical checkout desks and collect instant customer feedback." },
  { icon: <Building size={22} />, title: "Government", desc: "Bring order to civic centers, automate ID processing, and deliver dignity to citizens." }
];

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    tickets_issued: 14820,
    avg_wait_min: 14,
    active_branches: 42,
    documents_verified: 8920
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setStats(data);
      })
      .catch(err => console.error('Fetch stats error:', err));
  }, []);

  return (
    <div className="space-y-0">
      {/* Ticker Marquee */}
      <div className="marquee-mask relative overflow-hidden border-b border-ink-900/[0.06] bg-white py-3 backdrop-blur mt-16">
        <div className="animate-marquee flex w-max items-center gap-10 pr-10">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2.5 text-[12.5px] font-semibold text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="grad-hero min-h-[90vh] flex items-center pt-10 pb-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <FadeIn className="space-y-6">
            <span className="eyebrow">
              <span className="eyebrow-dot bg-orange-500 animate-pulse" />
              Connected Service Platform
            </span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.5rem] leading-[1.05]">
              Customer service, <br />
              <span className="grad-text-warm">without the runaround.</span>
            </h1>
            <p className="text-base sm:text-lg text-ink-500 leading-relaxed max-w-xl">
              LUNA connects bookings, queues, payments, document verification and customer conversations into one seamless service experience—while giving your teams the intelligence to serve better.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/book" className="btn btn-primary btn-lg shadow-lift">
                Get a ticket
                <ArrowRight size={16} />
              </Link>
              <Link to="/institutions" className="btn btn-outline btn-lg">
                Browse branches
              </Link>
            </div>
          </FadeIn>

          {/* Realistic Product UI Hero Visual */}
          <FadeIn delay={0.15}>
            <div className="relative border border-ink-900/10 rounded-[32px] bg-white p-6 shadow-float max-w-sm mx-auto">
              <div className="flex items-center justify-between border-b border-ink-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-[14px] font-bold text-ink-900">Union Bank</h4>
                    <p className="text-[11px] text-ink-500">Lekki Phase 1 Branch</p>
                  </div>
                </div>
                <span className="pill bg-green-50 text-green-700 font-bold">✓ Confirmed</span>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 bg-cream-50 rounded-2xl space-y-1 border border-ink-900/[0.02]">
                  <p className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Service Selected</p>
                  <p className="text-sm font-bold text-ink-900">Business Account Opening</p>
                  <p className="text-xs text-ink-500">Today · 10:40 AM Arrival Window</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3.5 border border-ink-900/[0.06] rounded-xl flex items-center gap-2 bg-white">
                    <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                    <span className="text-xs font-bold text-ink-700">Documents Ready</span>
                  </div>
                  <div className="p-3.5 border border-ink-900/[0.06] rounded-xl flex items-center gap-2 bg-white">
                    <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                    <span className="text-xs font-bold text-ink-700">Paid ₦2,500</span>
                  </div>
                </div>

                <div className="p-4 bg-ink-900 text-white rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-white/40 tracking-wider">YOUR TICKET</p>
                    <h3 className="font-display text-2xl font-extrabold text-orange-400">A024</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/40 tracking-wider">EST. WAIT</p>
                    <p className="font-display text-base font-bold text-white">12 mins</p>
                  </div>
                </div>

                <Link to="/track?code=LM-A103" className="btn btn-outline btn-md w-full !h-10 text-xs">
                  Track live queue
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-ink-900/[0.05] py-12">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Tickets Issued</p>
              <h2 className="font-display text-3xl font-extrabold text-ink-900">{stats.tickets_issued.toLocaleString()}</h2>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Average Wait Time</p>
              <h2 className="font-display text-3xl font-extrabold text-orange-500">{stats.avg_wait_min} mins</h2>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Active Branches</p>
              <h2 className="font-display text-3xl font-extrabold text-ink-900">{stats.active_branches}</h2>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Documents Verified</p>
              <h2 className="font-display text-3xl font-extrabold text-green-500">{stats.documents_verified.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Journey Section */}
      <section id="how" className="py-20 bg-cream-50">
        <div className="container-x space-y-12">
          <SectionHeader
            eyebrow="Customer Journey"
            title="From 'I need help' to 'It’s done.'"
            sub="LUNA simplifies the friction of visiting high-volume branches into a clean, unified digital pipeline."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            {steps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.05} className="card p-6 card-hover space-y-3">
                <span className="font-display text-3xl font-extrabold text-orange-500/20 block">{step.num}</span>
                <h3 className="font-display text-base font-bold text-ink-900">{step.label}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Connected Operations Section */}
      <section className="py-20 bg-white border-y border-ink-900/[0.05]">
        <div className="container-x space-y-12">
          <SectionHeader
            eyebrow="Connected Operations"
            title="Behind every great customer experience is a connected team."
            sub="No more fragmented desks. LUNA bridges front-office staff, social teams, and management into a single, cohesive workflow."
          />

          <div className="relative rounded-[36px] bg-ink-900 p-8 text-white overflow-hidden grad-cta max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3 relative z-10">
              <div className="space-y-3">
                <span className="pill bg-orange-100/10 text-orange-400 font-bold">01 / Front Desk</span>
                <h3 className="font-display text-base font-bold">Smart Queue Control</h3>
                <p className="text-xs text-white/60 leading-relaxed">Staff operate a clean calling board, call next queues, assign counters, and view pre-cleared document scores before clients sit down.</p>
              </div>
              <div className="space-y-3">
                <span className="pill bg-orange-100/10 text-orange-400 font-bold">02 / Social Studio</span>
                <h3 className="font-display text-base font-bold">Conversational Intent</h3>
                <p className="text-xs text-white/60 leading-relaxed">Social media managers view incoming complaints, run AI intent analysis, and issue priority queue bookings right inside the chat.</p>
              </div>
              <div className="space-y-3">
                <span className="pill bg-orange-100/10 text-orange-400 font-bold">03 / Executive Suite</span>
                <h3 className="font-display text-base font-bold">Intelligence Dashboard</h3>
                <p className="text-xs text-white/60 leading-relaxed">Management monitors real-time wait times, customer satisfaction, active tickets, and operational alerts across all branches globally.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Core Modules Section */}
      <section className="py-20 bg-cream-50">
        <div className="container-x space-y-12">
          <SectionHeader
            eyebrow="Platform Modules"
            title="Six modules. One connected ecosystem."
            sub="LUNA replaces fragmented point solutions with a unified customer service stack."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <FadeIn key={mod.id} className="card p-6 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <span className="pill bg-orange-100 text-orange-700 font-bold capitalize">{mod.title}</span>
                  <h3 className="font-display text-lg font-bold text-ink-900">{mod.tagline}</h3>
                  <p className="text-xs text-ink-500 leading-relaxed">{mod.desc}</p>
                </div>
                <div className="pt-2">
                  {mod.ui}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white border-t border-ink-900/[0.05]">
        <div className="container-x space-y-12">
          <SectionHeader
            eyebrow="Industries"
            title="Built for businesses where service matters."
            sub="From banking halls to university registries, LUNA delivers operational efficiency and citizen dignity."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, idx) => (
              <div key={idx} className="card p-6 space-y-4">
                <div className="h-10 w-10 rounded-full bg-cream-100 text-ink-900 flex items-center justify-center">
                  {ind.icon}
                </div>
                <h3 className="font-display text-base font-bold text-ink-900">{ind.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-cream-50 border-t border-ink-900/[0.05]">
        <div className="container-x space-y-12">
          <SectionHeader
            eyebrow="Pricing Plans"
            title="Flexible tiers for every scale."
            sub="Choose the package that aligns with your branch network and service complexity."
          />

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="card p-8 bg-white space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Basic Tier</p>
                <div>
                  <h2 className="font-display text-3xl font-extrabold text-ink-900">₦75,000</h2>
                  <p className="text-xs text-ink-500 mt-1">per branch / month</p>
                </div>
                <p className="text-xs text-ink-500">For SMEs and local single-branch businesses seeking smart scheduling.</p>
                <div className="h-px bg-ink-100" />
                <ul className="space-y-2.5 text-xs text-ink-700">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Custom booking page</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Queue/Booking Lite</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Administrative payments</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Social Studio Lite</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Basic intelligence stats</li>
                </ul>
              </div>
              <Link to="/signup" className="btn btn-outline btn-md w-full">Start Basic</Link>
            </div>

            {/* Pro */}
            <div className="card p-8 bg-white border-2 border-orange-400 relative space-y-6 flex flex-col justify-between shadow-lift">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 pill bg-orange-400 text-ink-900 font-bold text-[10px] uppercase">Most Popular</span>
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">Pro Tier</p>
                <div>
                  <h2 className="font-display text-3xl font-extrabold text-ink-900">₦180,000</h2>
                  <p className="text-xs text-ink-500 mt-1">per branch / month</p>
                </div>
                <p className="text-xs text-ink-500">For growing and multi-branch businesses needing cross-branch coordination.</p>
                <div className="h-px bg-ink-100" />
                <ul className="space-y-2.5 text-xs text-ink-700">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Everything in Basic</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Advanced Queue flow</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Social Studio Pro</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> BranchConnect Internal Feed</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Cross-branch intelligence</li>
                </ul>
              </div>
              <Link to="/signup" className="btn btn-primary btn-md w-full">Start Pro</Link>
            </div>

            {/* Enterprise */}
            <div className="card p-8 bg-white space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Enterprise</p>
                <div>
                  <h2 className="font-display text-3xl font-extrabold text-ink-900">Custom</h2>
                  <p className="text-xs text-ink-500 mt-1">tailored agreements</p>
                </div>
                <p className="text-xs text-ink-500">For banks, universities, hospitals, and large government institutions.</p>
                <div className="h-px bg-ink-100" />
                <ul className="space-y-2.5 text-xs text-ink-700">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Document Pre-Clearance</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Dedicated API & SDK access</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Custom integrations & SSO</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Local/Private Cloud deployment</li>
                </ul>
              </div>
              <Link to="/company" className="btn btn-outline btn-md w-full">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-ink-900 text-white relative overflow-hidden grad-cta">
        <div className="container-x max-w-3xl text-center space-y-6 relative z-10">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl leading-tight">
            Your customers shouldn’t have to work hard to get served.
          </h2>
          <p className="text-base text-white/70 max-w-xl mx-auto">
            Give them one connected way to get things done. Launch LUNA across your branch network and begin delivering dignifying service.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/signup" className="btn btn-primary btn-lg shadow-lift">
              Start with LUNA
            </Link>
            <Link to="/company#contact" className="btn btn-outline btn-lg !bg-transparent !text-white !border-white/20 hover:!border-white/50">
              Talk to our team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
