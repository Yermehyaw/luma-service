import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LumaMark } from './LumaMark';
import supabase from '../lib/supabase';
import { Menu, X, LogOut, ChevronRight, LayoutDashboard, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      const elementId = to.slice(2);
      if (location.pathname !== '/') {
        navigate('/' + to);
      } else {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, '', to);
      }
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x">
        <div className={`mt-3 flex h-16 items-center justify-between rounded-full border px-3 pl-4 transition-all duration-300 sm:px-4 sm:pl-5 ${scrolled ? "border-ink-900/[0.07] bg-white/95 shadow-[0_12px_36px_-12px_rgba(32,41,87,0.22)] backdrop-blur-xl" : "border-transparent bg-white/60 backdrop-blur-md"}`}>
          <Link to="/" className="group flex items-center gap-2 focus-visible:outline-none" aria-label="Luma home">
            <LumaMark size={32} />
            <span className="font-display text-lg font-bold tracking-tight text-ink-900">LUNA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-[14.5px] font-medium text-ink-700">
            <Link to="/#how" onClick={(e) => handleNavClick(e, '/#how')} className="hover:text-ink-900 transition">How it works</Link>
            <Link to="/#features" onClick={(e) => handleNavClick(e, '/#features')} className="hover:text-ink-900 transition">Solutions</Link>
            <Link to="/institutions" className="hover:text-ink-900 transition">Branches</Link>
            <Link to="/#pricing" onClick={(e) => handleNavClick(e, '/#pricing')} className="hover:text-ink-900 transition">Pricing</Link>
            <Link to="/company" className="hover:text-ink-900 transition">Company</Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/console" className="btn btn-outline btn-sm">
                  <LayoutDashboard size={14} />
                  <span>Console</span>
                </Link>
                <button onClick={handleSignOut} className="btn btn-navy btn-sm" aria-label="Sign out">
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm text-ink-700 hover:text-ink-900">Sign in</Link>
                <Link to="/signup" className="btn btn-navy btn-sm">Get started</Link>
              </div>
            )}

            {/* Book Now Button */}
            <Link to="/book" className="btn btn-primary btn-sm shadow-sm">
              Book slot
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 text-ink-700 md:hidden focus-visible:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[76px] z-40 bg-navy-950/60 backdrop-blur-md md:hidden animate-fade-in">
          <div className="absolute inset-x-4 top-2 rounded-3xl border border-ink-900/10 bg-white p-6 shadow-2xl animate-pop">
            <nav className="flex flex-col gap-4 text-base font-semibold text-ink-700">
              <Link to="/#how" onClick={(e) => handleNavClick(e, '/#how')} className="flex items-center justify-between border-b border-ink-100 pb-2 hover:text-ink-900">
                <span>How it works</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/#features" onClick={(e) => handleNavClick(e, '/#features')} className="flex items-center justify-between border-b border-ink-100 pb-2 hover:text-ink-900">
                <span>Solutions</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/institutions" className="flex items-center justify-between border-b border-ink-100 pb-2 hover:text-ink-900">
                <span>Browse Branches</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/#pricing" onClick={(e) => handleNavClick(e, '/#pricing')} className="flex items-center justify-between border-b border-ink-100 pb-2 hover:text-ink-900">
                <span>Pricing</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/company" className="flex items-center justify-between border-b border-ink-100 pb-2 hover:text-ink-900">
                <span>Company</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/verify" className="flex items-center justify-between border-b border-ink-100 pb-2 hover:text-ink-900">
                <span>Verify Documents</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/track" className="flex items-center justify-between border-b border-ink-100 pb-2 hover:text-ink-900">
                <span>Track Ticket</span>
                <ChevronRight size={16} />
              </Link>
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/console" className="btn btn-outline btn-md w-full">
                    <LayoutDashboard size={16} />
                    <span>Console ({displayName})</span>
                  </Link>
                  <button onClick={handleSignOut} className="btn btn-navy btn-md w-full">
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline btn-md w-full">Sign in</Link>
                  <Link to="/signup" className="btn btn-navy btn-md w-full">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
