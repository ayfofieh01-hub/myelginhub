import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthProvider, User } from '@/lib/types';
import { asyncStorage } from './storage';

const DEMO_PROFILES: Record<AuthProvider, Omit<User, 'provider'>> = {
  google: {
    id: 'me-google',
    name: 'Jordan Bell',
    email: 'jordan.bell@gmail.com',
    initials: 'JB',
  },
  apple: {
    id: 'me-apple',
    name: 'Jordan Bell',
    email: 'jordan.bell@icloud.com',
    initials: 'JB',
  },
};

type AuthState = {
  user: User | null;
  hydrated: boolean;
  setHydrated: () => void;
  signIn: (provider: AuthProvider) => User;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      signIn: (provider) => {
        const user: User = { ...DEMO_PROFILES[provider], provider };
        set({ user });
        return user;
      },
      signOut: () => set({ user: null }),
    }),
    {
      name: 'myelginhub.auth',
      storage: asyncStorage,
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
