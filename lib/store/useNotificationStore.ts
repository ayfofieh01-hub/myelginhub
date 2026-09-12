import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppNotification } from '@/lib/types';
import { asyncStorage, makeId } from './storage';

const MAX_ITEMS = 40;

type NotificationState = {
  items: AppNotification[];
  hydrated: boolean;
  setHydrated: () => void;
  push: (item: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clear: () => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      push: (item) =>
        set((s) => ({
          items: [
            { ...item, id: makeId('ntf'), createdAt: new Date().toISOString(), read: false },
            ...s.items,
          ].slice(0, MAX_ITEMS),
        })),
      markAllRead: () => set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),
      markRead: (id) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'myelginhub.notifications',
      storage: asyncStorage,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export function useUnreadNotificationCount(): number {
  return useNotificationStore((s) => s.items.filter((i) => !i.read).length);
}
