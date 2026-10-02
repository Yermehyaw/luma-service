import React, { useState } from 'react';
import { SectionHeader } from '../components/LumaMark';
import { FadeIn } from '../components/ui';
import { Mail, Phone, MapPin, Send, ShieldCheck, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

const values = [
  {
    title: "Timing over waiting",
    body: "Every module we ship is measured by one thing: did it give someone their time back? We believe waiting is a design failure.",
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    title: "Radical social care",
    body: "Priority windows for the elderly, accessible queues, and public accountability at every branch. Service is a human right.",
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    title: "One network, shared brains",
    body: "When one branch learns a lesson, prevents fraud, or optimizes a flow, every other branch on LUNA benefits instantly.",
    color: "text-pink-500",
    bg: "bg-pink-50"
  }
];

export const Company: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgType, setOrgType] = useState("Financial Services");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || message.length < 10) {
      setError("Please fill out all fields. Message must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: name,
          email,
          org_type: orgType,
          body: message
        })
      });

      if (!res.ok) throw new Error("Could not send message.");
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-0 pt-24">
      {/* Hero Header */}
      <section className="grad-hero py-20">
        <div className="container-x max-w-4xl text-center space-y-6">
          <span className="eyebrow">
            <span className="eyebrow-dot bg-orange-500" />
            Our Mission
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl leading-tight">
            We are here to deliver <br />
            <span className="grad-text-warm">dignity and efficiency.</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-500 leading-relaxed max-w-2xl mx-auto">
            LUNA was founded on a simple premise: physical queues are a tax on human potential. We build B2B2C software that connects businesses, staff, and customers into a unified, respectful ecosystem.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white border-y border-ink-900/[0.05]">
        <div className="container-x space-y-12">
          <SectionHeader
            eyebrow="Core Values"
            title="What drives LUNA forward"
            sub="Our values define how we design products, support customers, and measure success."
          />

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {values.map((v, idx) => (
              <div key={idx} className="card p-6 space-y-4">
                <div className={`h-12 w-12 rounded-2xl ${v.bg} flex items-center justify-center font-bold text-lg ${v.color}`}>
                  {idx + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-ink-900">{v.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Sales Form */}
      <section id="contact" className="py-20 bg-cream-50">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] max-w-5xl mx-auto items-start">
          {/* Contact Details */}
          <div className="space-y-6">
            <span className="eyebrow">
              <span className="eyebrow-dot bg-orange-500" />
              Get in Touch
            </span>
            <h2 className="font-display text-3xl font-extrabold text-ink-900 leading-tight">
              Bring LUNA to your branch network.
            </h2>
            <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
              Ready to eliminate waiting rooms, pre-clear paperwork, and gain complete operational intelligence? Fill out the form and our solutions engineering team will reach out with a custom quote.
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-ink-700 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white border border-ink-100 flex items-center justify-center text-ink-900">
                  <Mail size={16} />
                </div>
                <span>solutions@luna-service.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white border border-ink-100 flex items-center justify-center text-ink-900">
                  <Phone size={16} />
                </div>
                <span>+234 1 293 8920</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white border border-ink-100 flex items-center justify-center text-ink-900">
                  <MapPin size={16} />
                </div>
                <span>Lekki Phase 1, Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="card p-6 sm:p-8 bg-white">
            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200">
                  <CheckCircle2 size={26} />
                </div>
                <h3 className="font-display text-lg font-bold text-ink-900">Message Sent!</h3>
                <p className="text-xs text-ink-500 max-w-sm mx-auto">
                  Thank you for reaching out. A solutions engineer has received your request and will contact you within 24 hours.
                </p>
                <button onClick={() => setSuccess(false)} className="btn btn-outline btn-sm !h-10 mt-2">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Chinedu Okafor"
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. chinedu@unionbank.com"
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label">Organization Sector</label>
                  <select
                    value={orgType}
                    onChange={e => setOrgType(e.target.value)}
                    className="input"
                  >
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Government">Government / Civil</option>
                    <option value="SME / Retail">SME / Retail</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="label">Message / Requirements</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your branch network, average wait times, and modules of interest..."
                    className="input"
                  />
                </div>

                {error && <p className="field-error">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg w-full"
                >
                  {submitting ? "Sending..." : "Send inquiry"}
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
