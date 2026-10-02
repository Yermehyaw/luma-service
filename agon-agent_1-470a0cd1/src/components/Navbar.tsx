import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Ticket, X } from 'lucide-react';
import { LumaLogo } from './LumaMark';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { Avatar } from './ui';

const LINKS = [
  { to: '/#how', label: 'How it works' },
  { to: '/#features', label: 'Features' },
  { to: '/institutions', label: 'Institutions' },
  { to: '/company#business', label: 'For businesses' },
  { to: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => { setOpen(false); setMenu(false); }, [loc.pathname, loc.hash]);

  const goto = (to: string) => {
    if (to.startsWith('/#')) {
      const id = to.slice(2);
      if (loc.pathname !== '/') {
        nav(to);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, '', to);
      }
    } else if (to.includes('#')) {
      nav(to);
    } else {
      nav(to);
    }
    setOpen(false);
  };

  const name = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x">
        <div
          className={`mt-3 flex h-16 items-center justify-between rounded-full border px-3 pl-4 transition-all duration-300 sm:px-4 sm:pl-5 ${
            scrolled || open
              ? 'border-ink-900/[0.07] bg-white/95 shadow-[0_12px_36px_-12px_rgba(32,41,87,0.22)] backdrop-blur-xl'
              : 'border-transparent bg-white/60 backdrop-blur-md'
          }`}
        >
          <Link to="/" className="group focus-visible:outline-none" aria-label="Luma home">
            <LumaLogo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {LINKS.map((l) =>
              l.to === '/institutions' ? (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                      isActive ? 'bg-ink-900/[0.05] text-ink-900' : 'text-ink-500 hover:text-ink-900'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ) : (
                <button
                  key={l.to}
                  onClick={() => goto(l.to)}
                  className="cursor-pointer rounded-full px-4 py-2 text-[14px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
                >
                  {l.label}
                </button>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenu((m) => !m)}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-ink-900/10 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-ink-900/25"
                >
                  <Avatar name={name} size={30} />
                  <span className="max-w-[110px] truncate text-[13px] font-semibold text-ink-900">{name}</span>
                  <ChevronDown size={14} className="text-ink-300" />
                </button>
                <AnimatePresence>
                  {menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-ink-900/[0.08] bg-white p-1.5 shadow-[var(--shadow-lift)]"
                    >
                      <button onClick={() => nav('/console')} className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100">
                        <LayoutDashboard size={16} className="text-orange-600" /> Institution console
                      </button>
                      <button onClick={() => nav('/track')} className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100">
                        <Ticket size={16} className="text-green-600" /> Track a ticket
                      </button>
                      <div className="my-1.5 h-px bg-ink-900/[0.06]" />
                      <button
                        onClick={async () => { await supabase.auth.signOut(); nav('/'); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100"
                      >
                        <LogOut size={16} className="text-pink-600" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost btn-md">Log in</Link>
            )}
            <Link to="/book" className="btn btn-primary btn-md">
              <Ticket size={17} /> Get your ticket
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-900 transition hover:bg-ink-900/[0.05] lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="container-x lg:hidden"
          >
            <div className="mt-2 rounded-[26px] border border-ink-900/[0.07] bg-white p-2 shadow-[var(--shadow-lift)]">
              {[...LINKS, { to: '/track', label: 'Track ticket' }, { to: '/verify', label: 'Verify documents' }].map((l) => (
                <button
                  key={l.to}
                  onClick={() => goto(l.to)}
                  className="block w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-[15px] font-semibold text-ink-700 transition hover:bg-cream-100"
                >
                  {l.label}
                </button>
              ))}
              <div className="mt-2 grid gap-2 border-t border-ink-900/[0.07] p-2 pt-4">
                <Link to="/book" className="btn btn-primary btn-md w-full">
                  <Ticket size={16} /> Get your ticket
                </Link>
                {user ? (
                  <button
                    onClick={async () => { await supabase.auth.signOut(); setOpen(false); }}
                    className="btn btn-outline btn-md w-full"
                  >
                    <LogOut size={16} /> Sign out ({name})
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-outline btn-md w-full">Log in</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
