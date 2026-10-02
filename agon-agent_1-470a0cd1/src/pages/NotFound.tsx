import { Link } from 'react-router-dom';
import { Home, SearchX, Ticket } from 'lucide-react';
import { LumaMotif } from '../components/LumaMark';
import { Reveal } from '../components/ui';

export default function NotFound() {
  return (
    <div className="grad-hero relative flex min-h-screen items-center overflow-hidden pt-24">
      <LumaMotif className="pointer-events-none absolute -left-16 top-24 h-72 w-72 opacity-60" />
      <LumaMotif variant="b" className="pointer-events-none absolute -right-20 bottom-16 h-64 w-64 opacity-60" />
      <div className="container-x relative pb-24 text-center">
        <Reveal>
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-white text-orange-600 shadow-[var(--shadow-lift)]">
            <SearchX size={34} />
          </span>
          <p className="mt-8 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600">
            Error 404 · Ticket void
          </p>
          <h1 className="mx-auto mt-4 max-w-xl font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-ink-900 sm:text-5xl">
            This ticket doesn't exist.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-ink-500">
            Whatever brought you here, you shouldn't have to wait around. Let's get you back on track.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-primary btn-lg"><Home size={17} /> Back to home</Link>
            <Link to="/track" className="btn btn-outline btn-lg"><Ticket size={17} /> Track a real ticket</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
