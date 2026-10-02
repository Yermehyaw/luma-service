export type MessageKind = 'contact' | 'dm' | 'comment';

export interface SocialPost {
  id: string;
  tenantId: string;
  content: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: string;
  createdAt: string;
  authorName?: string;
}

export interface CustomerMessage {
  id: string;
  tenantId: string;
  kind: MessageKind;
  authorName: string;
  handle?: string;
  email?: string;
  body: string;
  sentimentScore?: number; // e.g. -1.0 to 1.0
  status: 'new' | 'pending' | 'resolved';
  reply?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  org: string;
  rating: number;
}

export interface PlatformResource {
  id: string;
  title: string;
  resourceType: 'template' | 'playbook' | 'guide';
  blurb: string;
  downloads: number;
  createdAt: string;
}

export interface PlatformStats {
  ticketsIssued: string;
  avgWait: string;
  institutionsLive: string;
  onTimeRate: string;
}
