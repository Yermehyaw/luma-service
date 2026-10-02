import React from 'react';
import { Link } from 'react-router-dom';
import { LumaMark } from './LumaMark';
import { Shield, Globe, Award } from 'lucide-react';

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Book a ticket", to: "/book" },
      { label: "Track a queue", to: "/track" },
      { label: "Verify documents", to: "/verify" },
      { label: "Browse branches", to: "/institutions" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { label: "Social Studio", to: "/#features" },
      { label: "Smart Queue", to: "/#features" },
      { label: "Document Verification", to: "/verify" },
      { label: "Payments", to: "/#features" },
      { label: "BranchConnect", to: "/#features" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About LUNA", to: "/company" },
      { label: "How it works", to: "/#how" },
      { label: "Pricing plans", to: "/#pricing" },
      { label: "Contact sales", to: "/company#contact" }
    ]
  }
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-ink-900 text-white">
      {/* Abstract Background SVG */}
      <svg viewBox="0 0 300 300" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 opacity-[0.08]" fill="none" aria-hidden="true">
        <circle cx="150" cy="150" r="120" stroke="#F4B860" strokeWidth="34" />
        <circle cx="210" cy="210" r="90" stroke="#DB6FA0" strokeWidth="26" />
        <circle cx="70" cy="230" r="52" fill="#12A05A" />
      </svg>

      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2 focus-visible:outline-none">
              <LumaMark size={36} tile={false} />
              <span className="font-display text-xl font-bold tracking-tight text-white">LUNA</span>
            </Link>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-white/60">
              LUNA is a B2B2C customer-service delivery and intelligence platform connecting customers, branches, social-media teams, and management into one connected service ecosystem.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Shield size={14} className="text-orange-400" />
                <span>Bank-grade security · SOC2-style controls</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Globe size={14} className="text-green-400" />
                <span>Available in Nigeria, Uganda & East Africa</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-display text-[13.5px] font-bold uppercase tracking-[0.14em] text-white/40">
                {group.title}
              </h3>
              <ul className="space-y-2.5 text-[14px] font-medium text-white/70">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link to={link.to} className="hover:text-white transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} LUNA Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/company" className="hover:underline">Privacy Policy</Link>
            <Link to="/company" className="hover:underline">Terms of Service</Link>
            <div className="flex items-center gap-1.5 text-white/70">
              <Award size={14} className="text-pink-400" />
              <span>EN · SW · FR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
