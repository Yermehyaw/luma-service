import { Tenant } from '../types/tenant';
import { MOCK_TENANTS } from '../mock/tenants';

export interface TenantRepository {
  getTenants(): Promise<Tenant[]>;
  getTenantBySlug(slug: string): Promise<Tenant | null>;
  getTenantByDomain(domain: string): Promise<Tenant | null>;
}

export class MockTenantRepository implements TenantRepository {
  async getTenants(): Promise<Tenant[]> {
    return Promise.resolve(MOCK_TENANTS);
  }

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const found = MOCK_TENANTS.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
    return Promise.resolve(found || null);
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const found = MOCK_TENANTS.find((t) => t.domain?.toLowerCase() === domain.toLowerCase());
    return Promise.resolve(found || MOCK_TENANTS[0]);
  }
}

export const tenantRepository: TenantRepository = new MockTenantRepository();

export async function getAllTenants(): Promise<Tenant[]> {
  return tenantRepository.getTenants();
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  return tenantRepository.getTenantBySlug(slug);
}

export function resolveTenant(host: string | null, pathname: string | null): string {
  if (!host) return 'acme-bank';

  // 1. Local path development resolution: /tenant/[slug]
  if (pathname && pathname.startsWith('/tenant/')) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return parts[1];
    }
  }

  // 2. Subdomain host resolution: acme-bank.luma.com
  const cleanHost = host.split(':')[0].toLowerCase();
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'luma.com';

  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1' || cleanHost === platformDomain || cleanHost === `app.${platformDomain}`) {
    return 'acme-bank';
  }

  if (cleanHost.endsWith(`.${platformDomain}`)) {
    const subdomain = cleanHost.replace(`.${platformDomain}`, '');
    if (subdomain !== 'app' && subdomain !== 'www') {
      return subdomain;
    }
  }

  // Fallback default demo tenant
  return 'acme-bank';
}
