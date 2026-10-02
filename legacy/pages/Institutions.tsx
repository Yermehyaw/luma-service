import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/ui';
import { SectionHeader } from '../components/LumaMark';
import { Search, MapPin, Clock, ArrowRight, Activity, Landmark, GraduationCap, Building2, HelpCircle } from 'lucide-react';

interface Branch {
  id: number;
  institution_id: number;
  name: string;
  city: string;
  area: string;
  wait_min: number;
  load_status: string;
}

interface Institution {
  id: number;
  name: string;
  category: string;
  logo_url: string;
  branches?: Branch[];
}

const categoryMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  all: { label: "All Sectors", icon: <HelpCircle size={16} /> },
  bank: { label: "Banks", icon: <Landmark size={16} /> },
  school: { label: "Schools", icon: <GraduationCap size={16} /> },
  hospital: { label: "Hospitals", icon: <Activity size={16} /> },
  civic: { label: "Civic Offices", icon: <Building2 size={16} /> },
  microfinance: { label: "Microfinance", icon: <Landmark size={16} /> }
};

export const Institutions: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch('/api/institutions?embed=1')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInstitutions(data);
        }
      })
      .catch(err => console.error('Fetch institutions error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter & Search Logic
  const filteredBranches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result: { branch: Branch; inst: Institution }[] = [];

    institutions.forEach(inst => {
      if (selectedCategory !== 'all' && inst.category !== selectedCategory) return;

      const branches = inst.branches || [];
      branches.forEach(branch => {
        const matchesQuery = 
          !query ||
          inst.name.toLowerCase().includes(query) ||
          branch.name.toLowerCase().includes(query) ||
          branch.city.toLowerCase().includes(query) ||
          branch.area.toLowerCase().includes(query);

        if (matchesQuery) {
          result.push({ branch, inst });
        }
      });
    });

    return result;
  }, [institutions, searchQuery, selectedCategory]);

  return (
    <div className="grad-hero min-h-screen pt-28 pb-24">
      <div className="container-x space-y-10">
        <SectionHeader
          eyebrow="Institution Network"
          title="Find a branch that respects your time"
          sub="Browse every bank, school, hospital, and civic office live on LUNA — and book a timed slot in seconds."
        />

        {/* Search & Category Filter */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by institution name, city, or neighborhood..."
              className="input !pl-12 !h-[54px] shadow-sm"
              aria-label="Search branches"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(categoryMeta).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`chip ${selectedCategory === key ? "chip-active" : ""}`}
              >
                {meta.icon}
                <span>{meta.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-lg font-bold text-ink-900">No branches found</p>
            <p className="text-xs text-ink-500">Try adjusting your search query or choosing another category.</p>
          </div>
        ) : (
          /* Grid of Branches */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {filteredBranches.map(({ branch, inst }, idx) => (
              <FadeIn key={branch.id} delay={idx * 0.03} className="card p-6 card-hover flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="pill bg-cream-100 text-ink-700 font-bold text-[11px] uppercase tracking-wider capitalize">
                      {inst.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                      <span className="dot bg-green-500" />
                      <span className="capitalize">{branch.load_status} Load</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-extrabold text-ink-900">{inst.name}</h3>
                    <p className="text-sm font-semibold text-ink-700">{branch.name}</p>
                    <p className="text-xs text-ink-500 flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{branch.area}, {branch.city}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-ink-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Live Wait</p>
                    <p className="font-display text-lg font-extrabold text-orange-500">{branch.wait_min} mins</p>
                  </div>
                  <Link to={`/book?institution=${inst.id}&branch=${branch.id}`} className="btn btn-navy btn-sm">
                    Book slot
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
