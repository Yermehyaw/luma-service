export type Category = 'bank' | 'school' | 'hospital' | 'civic' | 'microfinance';

export interface Institution {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  city: string;
  area: string;
  rating: number;
  review_count: number;
  tint: string; // tailwind-safe accent key: orange | green | pink | navy
  branches?: Branch[];
}

export interface Branch {
  id: number;
  institution_id: string;
  name: string;
  address: string;
  live_load: 'low' | 'moderate' | 'busy';
  wait_min: number;
  open_until: string;
}

export interface Service {
  id: number;
  institution_id: string;
  name: string;
  minutes: number;
}

export type TicketStatus = 'waiting' | 'called' | 'serving' | 'completed' | 'noshow' | 'cancelled';

export interface Ticket {
  id: number;
  code: string;
  institution_id: string;
  institution_name: string;
  branch_id: number;
  branch_name: string;
  service_id: number;
  service_name: string;
  user_name: string;
  phone: string;
  email: string;
  visit_date: string;
  window_start: string;
  window_end: string;
  position: number;
  eta_min: number;
  counter: number | null;
  status: TicketStatus;
  created_at: string;
}

export type DocStatus = 'queued' | 'awaiting' | 'verified' | 'flagged';

export interface Document {
  id: number;
  person: string;
  doc_type: string;
  file_name: string;
  file_url: string;
  ticket_code: string | null;
  status: DocStatus;
  confidence: number;
  notes: string | null;
  created_at: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  org: string;
  rating: number;
}

export type MessageKind = 'contact' | 'dm' | 'comment';

export interface Message {
  id: number;
  kind: MessageKind;
  author: string;
  handle: string | null;
  email: string | null;
  org_type: string | null;
  body: string;
  status: 'new' | 'resolved';
  reply: string | null;
  created_at: string;
}

export interface SocialPost {
  id: number;
  content: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_for: string | null;
  created_at: string;
}

export interface Resource {
  id: number;
  title: string;
  rtype: 'template' | 'playbook' | 'guide';
  blurb: string;
  downloads: number;
  created_at: string;
}

export interface Stats {
  tickets_issued: string;
  avg_wait: string;
  institutions_live: string;
  on_time: string;
}
