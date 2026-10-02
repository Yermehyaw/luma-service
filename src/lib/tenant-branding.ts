import { TenantBranding } from '../types/tenant';

export function getTenantCssVariables(branding?: TenantBranding): Record<string, string> {
  if (!branding) {
    return {
      '--tenant-primary': '#0057B8',
      '--tenant-secondary': '#002F6C',
      '--tenant-accent': '#00A3E0',
      '--tenant-bg': '#F4F8FC',
      '--tenant-text': '#0B1D3A',
    };
  }

  return {
    '--tenant-primary': branding.primaryColor,
    '--tenant-secondary': branding.secondaryColor,
    '--tenant-accent': branding.accentColor,
    '--tenant-bg': branding.backgroundColor,
    '--tenant-text': branding.textColor,
  };
}

export function applyTenantBrandingToDom(branding: TenantBranding): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const vars = getTenantCssVariables(branding);
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
