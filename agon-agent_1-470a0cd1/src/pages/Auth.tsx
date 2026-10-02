import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CircleAlert, KeyRound, Lock, Mail, MailCheck, Send, ShieldCheck, Ticket, User } from 'lucide-react';
import { LumaMark, LumaSpinner } from '../components/LumaMark';
import supabase from '../lib/supabase';
import { signInWithGoogle } from '../lib/googleAuth';

type Mode = 'login' | 'signup' | 'forgot' | 'reset';

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a7.2 7.2 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.96 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z" />
    </svg>
  );
}

/* Left brand panel shared by all auth screens */
function BrandPanel() {
  return (
    <div className="grad-cta relative hidden w-[44%] flex-col justify-between overflow-hidden rounded-[36px] p-10 text-white lg:flex">
      <svg viewBox="0 0 240 180" className="pointer-events-none absolute -right-16 top-8 h-56 w-56 opacity-30" fill="none" aria-hidden="true">
        <circle cx="80" cy="90" r="62" fill="#FF8A00" fillOpacity="0.35" />
        <circle cx="150" cy="70" r="54" fill="#12A05A" fillOpacity="0.3" />
        <circle cx="186" cy="116" r="40" fill="#F4AFCB" fillOpacity="0.35" />
      </svg>
      <Link to="/" className="group relative flex items-center gap-2.5">
        <LumaMark size={38} tile={false} />
        <span className="font-display text-2xl font-extrabold tracking-[-0.03em]">Luma</span>
      </Link>
      <div className="relative">
        <p className="font-display text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] xl:text-4xl">
          “Every branch now shows its live wait time — publicly. Accountability you can see from the door.”
        </p>
        <p className="mt-5 text-sm font-medium text-white/55">
          Operations lead · 6-branch pilot · Lagos
        </p>
        <div className="mt-8 flex items-center gap-6 text-[12px] font-semibold text-white/50">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-400" /> Bank-grade security</span>
          <span className="flex items-center gap-1.5"><Ticket size={14} className="text-pink-400" /> Timed tickets</span>
          <span className="flex items-center gap-1.5"><KeyRound size={14} className="text-orange-400" /> SOC2-style controls</span>
        </div>
      </div>
    </div>
  );
}

function Shell({ children, title, sub }: { children: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="min-h-screen bg-cream-50 pt-24 sm:pt-28">
      <div className="container-x flex gap-8 pb-20">
        <BrandPanel />
        <div className="flex flex-1 items-start justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="card w-full max-w-md !rounded-[30px] p-7 sm:p-9"
            style={{ boxShadow: 'var(--shadow-lift)' }}
          >
            <Link to="/" className="mb-7 inline-flex lg:hidden">
              <LumaMark size={34} />
            </Link>
            <h1 className="font-display text-[26px] font-extrabold tracking-[-0.025em] text-ink-900">{title}</h1>
            <p className="mt-1.5 text-[14px] text-ink-500">{sub}</p>
            <div className="mt-7">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ErrorNote({ msg }: { msg: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 flex items-center gap-2 overflow-hidden rounded-2xl bg-pink-100 px-4 py-3 text-[13.5px] font-semibold text-pink-600"
        >
          <CircleAlert size={15} className="shrink-0" /> {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function GoogleButton() {
  return (
    <>
      <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-300">
        <span className="h-px flex-1 bg-ink-900/[0.08]" /> or <span className="h-px flex-1 bg-ink-900/[0.08]" />
      </div>
      <button onClick={() => signInWithGoogle('Luma')} className="btn btn-outline btn-md w-full">
        <GoogleIcon /> Continue with Google
      </button>
    </>
  );
}

/* ---------- LOGIN ---------- */
export function Login() {
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setErr('Incorrect email or password.'); return; }
    nav(loc.state?.from || '/console');
  };

  return (
    <Shell title="Welcome back" sub="Log in to your institution console.">
      <ErrorNote msg={err} />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="li-email">Work email</label>
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
            <input id="li-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input !pl-10" placeholder="you@institution.ng" autoComplete="email" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="li-pass">Password</label>
            <Link to="/forgot-password" className="mb-1.5 text-xs font-bold text-orange-600 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
            <input id="li-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input !pl-10" placeholder="••••••••" autoComplete="current-password" />
          </div>
        </div>
        <button disabled={busy} className="btn btn-primary btn-lg w-full">
          {busy ? <LumaSpinner size={18} /> : <ArrowRight size={17} />}
          {busy ? 'Checking…' : 'Log in'}
        </button>
      </form>
      <GoogleButton />
      <p className="mt-6 rounded-2xl bg-cream-100 px-4 py-3 text-center text-[12.5px] font-medium text-ink-500">
        Demo login: <b className="text-navy-900">demo@luma.app</b> / <b className="text-navy-900">password123</b>
      </p>
      <p className="mt-5 text-center text-[13.5px] text-ink-500">
        New to Luma?{' '}
        <Link to="/signup" className="font-bold text-orange-600 hover:underline">Create an account</Link>
      </p>
    </Shell>
  );
}

/* ---------- SIGNUP ---------- */
export function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setNote('');
    if (password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setErr('Passwords do not match'); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setBusy(false);
    if (error) { setErr(error.message || "Couldn't create your account"); return; }
    if (data.session) { nav('/console'); return; }
    setNote('Account created. Once confirmed, you can log in and access your institution console.');
  };

  return (
    <Shell title="Create your account" sub="Set up timed tickets and live queues for your institution.">
      <ErrorNote msg={err} />
      <AnimatePresence>
        {note && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center gap-2 overflow-hidden rounded-2xl bg-green-100 px-4 py-3 text-[13.5px] font-semibold text-green-700"
          >
            <MailCheck size={15} className="shrink-0" /> {note}
          </motion.p>
        )}
      </AnimatePresence>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="su-name">Full name</label>
          <div className="relative">
            <User size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
            <input id="su-name" required value={name} onChange={(e) => setName(e.target.value)} className="input !pl-10" placeholder="Adaeze Nwosu" autoComplete="name" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="su-email">Work email</label>
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
            <input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input !pl-10" placeholder="you@institution.ng" autoComplete="email" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="su-pass">Password</label>
            <div className="relative">
              <Lock size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
              <input id="su-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input !pl-10" placeholder="6+ characters" autoComplete="new-password" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="su-pass2">Confirm password</label>
            <div className="relative">
              <Lock size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
              <input id="su-pass2" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input !pl-10" placeholder="Repeat your password" autoComplete="new-password" />
            </div>
          </div>
        </div>
        <button disabled={busy} className="btn btn-primary btn-lg w-full">
          {busy ? <LumaSpinner size={18} /> : <ArrowRight size={17} />}
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <GoogleButton />
      <p className="mt-6 text-center text-[13.5px] text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-orange-600 hover:underline">Log in</Link>
      </p>
    </Shell>
  );
}

/* ---------- FORGOT ---------- */
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    setSent(true);
  };

  return (
    <Shell title="Reset your password" sub="We'll email you a secure reset link.">
      {sent ? (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <MailCheck size={22} />
          </span>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-500">
            If an account exists for <b className="text-ink-900">{email}</b>, a reset link is on its way.
          </p>
          <Link to="/login" className="btn btn-outline btn-md mt-6 w-full">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="fp-email">Work email</label>
            <div className="relative">
              <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
              <input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input !pl-10" placeholder="you@institution.ng" />
            </div>
          </div>
          <button disabled={busy} className="btn btn-primary btn-lg w-full">
            {busy ? <LumaSpinner size={18} /> : <Send size={16} />}
            {busy ? 'Sending link…' : 'Send reset link'}
          </button>
          <Link to="/login" className="btn btn-ghost btn-md w-full">Back to login</Link>
        </form>
      )}
    </Shell>
  );
}

/* ---------- RESET ---------- */
export function ResetPassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setErr('Passwords do not match'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setErr("Couldn't reset password — the link may have expired."); return; }
    setDone(true);
    setTimeout(() => nav('/login'), 1800);
  };

  return (
    <Shell title="Choose a new password" sub="Make it strong — your branch boards depend on it.">
      {done ? (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <ShieldCheck size={22} />
          </span>
          <p className="mt-4 text-[14.5px] text-ink-500">Password updated. Redirecting you to login…</p>
        </div>
      ) : (
        <>
          <ErrorNote msg={err} />
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label" htmlFor="rp-pass">New password</label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                <input id="rp-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input !pl-10" placeholder="6+ characters" autoComplete="new-password" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="rp-pass2">Confirm new password</label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                <input id="rp-pass2" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input !pl-10" placeholder="Repeat your password" autoComplete="new-password" />
              </div>
            </div>
            <button disabled={busy} className="btn btn-primary btn-lg w-full">
              {busy ? <LumaSpinner size={18} /> : <KeyRound size={16} />}
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </>
      )}
    </Shell>
  );
}
