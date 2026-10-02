'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/user';
import { MOCK_USERS } from '../mock/users';

export interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  login(email: string, role?: Role): Promise<User>;
  logout(): Promise<void>;
  switchUserRole(role: Role): Promise<User>;
}

export class MockAuthRepository implements AuthRepository {
  private activeUser: User | null = MOCK_USERS[1]; // Default to Acme Bank Owner

  async getCurrentUser(): Promise<User | null> {
    return Promise.resolve(this.activeUser);
  }

  async login(email: string, role?: Role): Promise<User> {
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.activeUser = found;
      return Promise.resolve(found);
    }
    const mockUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: role || 'STAFF',
      permissions: ['queue.view', 'queue.call', 'tickets.verify'],
      createdAt: new Date().toISOString(),
    };
    this.activeUser = mockUser;
    return Promise.resolve(mockUser);
  }

  async logout(): Promise<void> {
    this.activeUser = null;
    return Promise.resolve();
  }

  async switchUserRole(role: Role): Promise<User> {
    const matching = MOCK_USERS.find((u) => u.role === role);
    if (matching) {
      this.activeUser = matching;
      return Promise.resolve(matching);
    }
    if (this.activeUser) {
      this.activeUser = { ...this.activeUser, role };
    }
    return Promise.resolve(this.activeUser!);
  }
}

export const authRepository: AuthRepository = new MockAuthRepository();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role?: Role) => Promise<User>;
  logout: () => Promise<void>;
  switchUserRole: (role: Role) => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({
  user: MOCK_USERS[1],
  loading: false,
  login: async () => MOCK_USERS[1],
  logout: async () => {},
  switchUserRole: async () => MOCK_USERS[1],
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USERS[1]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authRepository.getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, role?: Role): Promise<User> => {
    setLoading(true);
    const u = await authRepository.login(email, role);
    setUser(u);
    setLoading(false);
    return u;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await authRepository.logout();
    setUser(null);
    setLoading(false);
  };

  const switchUserRole = async (role: Role): Promise<User> => {
    setLoading(true);
    const u = await authRepository.switchUserRole(role);
    setUser(u);
    setLoading(false);
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
