import { CustomerMessage, SocialPost, Testimonial } from '../types/social';

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post_1',
    tenantId: 'tenant_001',
    content: '🚀 Lekki Admiralty branch wait times are currently under 8 minutes! Book your priority arrival window on Luma before heading out.',
    platform: 'twitter',
    status: 'published',
    createdAt: '2026-10-02T08:00:00Z',
    authorName: 'Acme Social Team',
  },
  {
    id: 'post_2',
    tenantId: 'tenant_001',
    content: 'Pre-clear your SME business account documentation from home and bypass the main branch lobby line entirely.',
    platform: 'linkedin',
    status: 'scheduled',
    scheduledFor: '2026-10-02T15:00:00Z',
    createdAt: '2026-10-02T09:15:00Z',
    authorName: 'Acme Comms',
  },
  {
    id: 'post_3',
    tenantId: 'tenant_003',
    content: 'Upgrade to 5G fiber broadband at our Westlands Flagship. Average store visit takes less than 6 minutes!',
    platform: 'facebook',
    status: 'published',
    createdAt: '2026-10-02T07:30:00Z',
    authorName: 'Luma Care',
  }
];

export const MOCK_MESSAGES: CustomerMessage[] = [
  {
    id: 'msg_501',
    tenantId: 'tenant_001',
    kind: 'dm',
    authorName: 'Oluwaseun T.',
    handle: '@Oluwaseun_T',
    email: 'seun@twitter.com',
    body: 'Why was the queue line at Lekki Admiralty stalled around 10am? Need urgent cash clearance.',
    sentimentScore: -0.65,
    status: 'new',
    createdAt: '2026-10-02T10:10:00Z',
  },
  {
    id: 'msg_502',
    tenantId: 'tenant_001',
    kind: 'contact',
    authorName: 'Dr. Fatima Bello',
    email: 'fatima@bello-consult.com',
    body: 'Impressive pre-verification service! Was in and out of Victoria Island branch in 7 minutes.',
    sentimentScore: 0.92,
    status: 'resolved',
    reply: 'Thank you Dr. Fatima! We are glad Luma made your visit seamless.',
    createdAt: '2026-10-01T16:20:00Z',
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_1',
    quote: 'Queue wait times dropped by 78% in our first month across 12 pilot branches. Our customers love pre-booking their windows.',
    name: 'Dr. Temitope Adebayo',
    role: 'Head of Operations',
    org: 'Acme Bank',
    rating: 5,
  },
  {
    id: 'test_2',
    quote: 'Students pre-verify transcripts online and walk straight into their designated counter window. Zero walk-in queues.',
    name: 'Prof. Florence Nakato',
    role: 'Academic Registrar',
    org: 'Makerere University',
    rating: 5,
  },
  {
    id: 'test_3',
    quote: 'Patient satisfaction scores rose to 96% after adopting Luma digital triage and lab queue notifications.',
    name: 'Nurse Amara Okafor',
    role: 'Chief Nursing Officer',
    org: 'City General Hospital',
    rating: 5,
  }
];
