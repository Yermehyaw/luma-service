'use client';

import React from 'react';
import { Permission, User } from '../types/user';

export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN' || user.role === 'PLATFORM_ADMIN') return true;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN' || user.role === 'PLATFORM_ADMIN') return true;
  return permissions.some((p) => user.permissions.includes(p));
}

interface PermissionGateProps {
  user?: User | null;
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ user, permission, fallback = null, children }) => {
  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
