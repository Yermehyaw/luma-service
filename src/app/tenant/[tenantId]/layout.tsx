import { getTenantBySlug } from '../../../lib/tenant';
import { notFound } from 'next/navigation';

export default async function TenantLayout({
  params,
  children,
}: {
  params: Promise<{ tenantId: string }>;
  children: React.ReactNode;
}) {
  const resolvedParams = await params;
  const tenant = await getTenantBySlug(resolvedParams.tenantId);

  if (!tenant) {
    notFound();
  }

  return <>{children}</>;
}
