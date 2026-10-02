export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(path);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return data as T;
    }
  } catch {
    /* fallback to mock */
  }

  // Fallbacks for dev mode when serverless function backend is not attached
  if (path.includes('/api/institutions')) return MOCK_INSTITUTIONS as unknown as T;
  if (path.includes('/api/testimonials')) return MOCK_TESTIMONIALS as unknown as T;
  if (path.includes('/api/stats')) return MOCK_STATS as unknown as T;
  if (path.includes('/api/documents')) return [] as unknown as T;
  if (path.includes('/api/messages')) return [] as unknown as T;
  if (path.includes('/api/social-posts')) return [] as unknown as T;
  if (path.includes('/api/resources')) return [] as unknown as T;
  if (path.includes('/api/services')) return [] as unknown as T;
  if (path.includes('/api/tickets')) return [] as unknown as T;

  throw new Error('API request failed');
}

export async function apiSend<T>(path: string, method: string, body?: unknown, token?: string): Promise<T> {
  try {
    const res = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return data as T;
    }
  } catch {
    /* fallback to mock */
  }

  return { success: true } as unknown as T;
}

const MOCK_INSTITUTIONS = [
  {
    id: 'union-bank',
    name: 'Union Bank of Nigeria',
    category: 'bank',
    tagline: 'Smart branch banking & SME solutions',
    city: 'Lagos',
    area: 'Lekki Phase 1',
    rating: 4.8,
    review_count: 342,
    tint: 'navy',
    branches: [
      { id: 1, institution_id: 'union-bank', name: 'Lekki Admiralty Branch', address: 'Admiralty Way, Lekki', live_load: 'low', wait_min: 8, open_until: '16:00' },
      { id: 2, institution_id: 'union-bank', name: 'Victoria Island Main', address: 'Ahmadu Bello Way, VI', live_load: 'moderate', wait_min: 14, open_until: '16:00' }
    ]
  },
  {
    id: 'makerere-uni',
    name: 'Makerere University Academic Registry',
    category: 'school',
    tagline: 'Transcripts, clearance & degree verification',
    city: 'Kampala',
    area: 'University Hill',
    rating: 4.9,
    review_count: 512,
    tint: 'green',
    branches: [
      { id: 3, institution_id: 'makerere-uni', name: 'Senate Building Registry', address: 'Makerere Hill Rd, Kampala', live_load: 'low', wait_min: 5, open_until: '17:00' }
    ]
  },
  {
    id: 'lagoon-hospitals',
    name: 'Lagoon Hospitals VI',
    category: 'hospital',
    tagline: 'Outpatient consultation & lab diagnostic queues',
    city: 'Lagos',
    area: 'Victoria Island',
    rating: 4.7,
    review_count: 289,
    tint: 'pink',
    branches: [
      { id: 4, institution_id: 'lagoon-hospitals', name: 'Victoria Island Hospital', address: '174B Corporation Dr, VI', live_load: 'low', wait_min: 9, open_until: '20:00' }
    ]
  },
  {
    id: 'national-id-abuja',
    name: 'National Civic Enrollment Center',
    category: 'civic',
    tagline: 'Identity enrollment, passport & civic clearances',
    city: 'Abuja',
    area: 'Central Business District',
    rating: 4.6,
    review_count: 620,
    tint: 'orange',
    branches: [
      { id: 5, institution_id: 'national-id-abuja', name: 'CBD Civic Hub', address: 'Constitution Ave, Abuja', live_load: 'moderate', wait_min: 12, open_until: '16:30' }
    ]
  }
];

const MOCK_TESTIMONIALS = [
  { id: 1, quote: 'Queue wait times dropped by 78% in our first month across 12 pilot branches.', name: 'Dr. Temitope Adebayo', role: 'Head of Operations', org: 'Union Bank', rating: 5 },
  { id: 2, quote: 'Students pre-verify transcripts online and walk straight into their designated counter window.', name: 'Prof. Florence Nakato', role: 'Academic Registrar', org: 'Makerere University', rating: 5 }
];

const MOCK_STATS = {
  tickets_issued: '148,200+',
  avg_wait: '9.4 mins',
  institutions_live: '42',
  on_time: '98.6%'
};

/** Deterministic gradient pair for institution tiles */
export const TINTS: Record<string, { from: string; to: string; ring: string }> = {
  orange: { from: '#FF8A00', to: '#F45B16', ring: 'rgba(244,91,22,0.15)' },
  green: { from: '#17B568', to: '#12A05A', ring: 'rgba(18,160,90,0.15)' },
  pink: { from: '#F4AFCB', to: '#EC8FB8', ring: 'rgba(236,143,184,0.18)' },
  navy: { from: '#39448C', to: '#202957', ring: 'rgba(32,41,87,0.14)' },
};

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function niceDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function makeWindows(startHour = 8, endHour = 16, stepMin = 30) {
  const out: { start: string; end: string }[] = [];
  const to = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  for (let t = startHour * 60; t < endHour * 60; t += stepMin) {
    out.push({ start: to(Math.floor(t / 60), t % 60), end: to(Math.floor((t + stepMin) / 60), (t + stepMin) % 60) });
  }
  return out;
}
