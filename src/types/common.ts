export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  feature?: string;
  permission?: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  city: string;
  liveLoad: 'low' | 'moderate' | 'busy';
  waitMin: number;
  openUntil: string;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  minutes: number;
  description?: string;
  active: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  lastVisit: string;
  status: 'active' | 'vip' | 'blocked';
}
