import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function generateTicketCode(prefix: string = 'LM'): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${letter}${num}`;
}
