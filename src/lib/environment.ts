export const environment = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  platformDomain: process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'luma.com',
  tenantDomain: process.env.NEXT_PUBLIC_TENANT_DOMAIN || 'luma.com',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};
