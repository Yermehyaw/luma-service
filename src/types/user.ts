export type Role = 
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'TENANT_OWNER'
  | 'TENANT_ADMIN'
  | 'MANAGER'
  | 'STAFF'
  | 'CUSTOMER';

export type Permission = 
  | 'queue.view'
  | 'queue.manage'
  | 'queue.call'
  | 'tickets.create'
  | 'tickets.verify'
  | 'customers.view'
  | 'customers.manage'
  | 'social.view'
  | 'social.create'
  | 'social.publish'
  | 'messaging.view'
  | 'messaging.send'
  | 'analytics.view'
  | 'tenant.configure'
  | 'tenant.branding';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  role: Role;
  tenantId?: string;
  permissions: Permission[];
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  token?: string;
  expiresAt?: string;
}
