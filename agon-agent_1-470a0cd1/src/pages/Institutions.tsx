import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Building2, GraduationCap, HeartPulse, Landmark, MapPin, PiggyBank, Search, Ticket } from 'lucide-react';
import { Avatar, Empty, LoadBadge, Reveal, SectionHead, Skeleton, Stars } from '../components/ui';
import { LumaMotif } from '../components/LumaMark';
import { apiGet } from '../lib/api';
import type { Category, Institution } from '../lib/types';

const CAT_META: Record<string, { icon: typeof Landmark; label: string }> = {
  all: { icon: Search, label: 'All' },
  bank: { icon: Landmark, label: 'Banks' },
  school: { icon: GraduationCap, label: 'Schools' },
  hospital: { icon: HeartPulse, label: 'Hospitals' },
  civic: { icon: Building2, label: 'Civic offices' },
  microfinance: { icon: PiggyBank, label: 'Microfinance' },
};

export default function Institutions() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [inst, setInst] = useState<Institution[] | null>(null);
  const category = params.get('category') ?? 'all';

  useEffect(() => {
    apiGet<Institution[]>('/api/institutions?embed=1')
      .then(setInst)
      .catch(() => setInst([]));
  }, []);

  const filtered = useMemo(() => {
    if (!inst) return null;
    const needle = q.trim().toLowerCase();
    return inst.filter(
      (i) =>
        (category === 'all' || i.category === (category as Category)) &&
        (!needle ||
          i.name.toLowerCase().includes(needle) ||
          i.city.toLowerCase().includes(needle) ||
          i.area.toLowerCase().includes(needle) ||
          i.tagline.toLowerCase().includes(needle)),
    );
  }, [inst, q, category]);

  return (
    <div className="grad-hero min-h-screen pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <Reveal>
          <SectionHead
            eyebrow="Institution network"
            dot="#12A05A"
            title="Find a branch that respects your time"
            sub="Browse every bank, school, hospital and civic office live on Luma — and book a timed ticket in seconds."
          />
        </Reveal>

        {/* controls */}
        <Reveal delay={0.06} className="mx-auto mt-10 max-w-3xl">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 text-ink-300" style={{ left: 18 }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search institutions, cities, services…"
              className="input !h-[52px] !rounded-full !pl-11 shadow-[var(--shadow-card)]"
              aria-label="Search institutions"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Object.entries(CAT_META).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'all') setParams({});
                  else setParams({ category: key });
                }}
                className={`chip ${category === key ? 'chip-active' : ''}`}
              >
                <meta.icon size={14} /> {meta.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered === null ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)
          ) : filtered.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <Empty icon={<Search size={22} />} title="No institutions found" body="Try a different search or category." />
            </div>
          ) : (
            filtered.map((ins, i) => {
              const branches = ins.branches ?? [];
              const calmest = [...branches].sort((a, b) => a.wait_min - b.wait_min)[0];
              const Meta = CAT_META[ins.category] ?? CAT_META.all;
              return (
                <Reveal key={ins.id} delay={0.04 * (i % 3)}>
                  <div className="card card-hover relative flex h-full flex-col overflow-hidden p-6">
                    <LumaMotif variant="c" className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <Avatar name={ins.name} size={46} />
                        <span>
                          <span className="block font-display text-[16px] font-bold tracking-tight text-ink-900">{ins.name}</span>
                          <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-ink-500">
                            <MapPin size={12} className="text-orange-600" />
                            {ins.area}, {ins.city}
                          </span>
                        </span>
                      </span>
                      <span className="pill bg-cream-100 text-ink-500">
                        <Meta.icon size={12} /> {Meta.label.replace(/s$/, '')}
                      </span>
                    </div>
                    <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-ink-500">{ins.tagline}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {calmest ? <LoadBadge load={calmest.live_load} wait={calmest.wait_min} /> : <span className="pill bg-cream-100 text-ink-500">Opening soon</span>}
                      <Stars n={Math.round(ins.rating)} />
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-ink-900/[0.06] pt-4">
                      <span className="text-xs font-semibold text-ink-500">
                        {branches.length} branch{branches.length === 1 ? '' : 'es'} live
                      </span>
                      <Link to={`/book?institution=${ins.id}`} className="btn btn-primary btn-sm">
                        <Ticket size={14} /> Book a slot <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
