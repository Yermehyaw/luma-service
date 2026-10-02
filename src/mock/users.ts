import { User } from '../types/user';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_super_admin',
    email: 'admin@luma.com',
    name: 'Sarah Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'SUPER_ADMIN',
    permissions: [
      'queue.view', 'queue.manage', 'queue.call',
      'tickets.create', 'tickets.verify',
      'customers.view', 'customers.manage',
      'social.view', 'social.create', 'social.publish',
      'messaging.view', 'messaging.send',
      'analytics.view', 'tenant.configure', 'tenant.branding'
    ],
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'usr_acme_owner',
    email: 'manager@acmebank.com',
    name: 'Dr. Temitope Adebayo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'TENANT_OWNER',
    tenantId: 'tenant_001',
    permissions: [
      'queue.view', 'queue.manage', 'queue.call',
      'tickets.create', 'tickets.verify',
      'customers.view', 'customers.manage',
      'social.view', 'social.create', 'social.publish',
      'messaging.view', 'messaging.send',
      'analytics.view', 'tenant.configure', 'tenant.branding'
    ],
    createdAt: '2025-01-16T10:00:00Z',
  },
  {
    id: 'usr_acme_teller',
    email: 'teller1@acmebank.com',
    name: 'Oluwaseun Bakare',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'STAFF',
    tenantId: 'tenant_001',
    permissions: [
      'queue.view', 'queue.call',
      'tickets.verify', 'customers.view',
      'messaging.view', 'messaging.send'
    ],
    createdAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'usr_hospital_manager',
    email: 'triage@cityhospital.org',
    name: 'Nurse Amara Okafor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    role: 'MANAGER',
    tenantId: 'tenant_002',
    permissions: [
      'queue.view', 'queue.manage', 'queue.call',
      'tickets.create', 'tickets.verify',
      'customers.view', 'messaging.view', 'messaging.send', 'analytics.view'
    ],
    createdAt: '2025-02-05T09:00:00Z',
  },
  {
    id: 'usr_customer_demo',
    email: 'customer@gmail.com',
    name: 'Chidi Nnamdi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'CUSTOMER',
    permissions: ['tickets.create'],
    createdAt: '2025-03-01T12:00:00Z',
  }
];
