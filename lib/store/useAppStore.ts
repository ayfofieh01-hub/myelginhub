import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TownScope } from '@/lib/types';
import { asyncStorage } from './storage';

/** Re-show the welcome / town picker if the app has not been opened for this long. */
const REVISIT_DAYS = 3;

type AppState = {
  scope: TownScope;
  onboarded: boolean;
  lastVisitAt: string | null;
  welcomeRequired: boolean;
  splashTown: TownScope | null;
  newsletterEmail: string | null;
  newsletterAt: string | null;
  dealAlerts: boolean;
  eventAlerts: boolean;
  savedIds: string[];
  doneSteps: string[];
  hydrated: boolean;
  setHydrated: () => void;
  evaluateSession: () => void;
  chooseTown: (scope: TownScope) => void;
  setScope: (scope: TownScope) => void;
  clearSplash: () => void;
  requireWelcome: () => void;
  subscribeNewsletter: (email: string) => void;
  unsubscribeNewsletter: () => void;
  setDealAlerts: (enabled: boolean) => void;
  setEventAlerts: (enabled: boolean) => void;
  toggleSaved: (id: string) => void;
  toggleStep: (id: string) => void;
  resetSteps: () => void;
};

function daysSince(iso: string | null): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return Number.POSITIVE_INFINITY;
  return (Date.now() - then) / 86_400_000;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      scope: 'all',
      onboarded: false,
      lastVisitAt: null,
      welcomeRequired: false,
      splashTown: null,
      newsletterEmail: null,
      newsletterAt: null,
      dealAlerts: true,
      eventAlerts: true,
      savedIds: [],
      doneSteps: [],
      hydrated: false,
      setHydrated: () => {
        set({ hydrated: true });
        get().evaluateSession();
      },
      evaluateSession: () => {
        const { onboarded, lastVisitAt } = get();
        if (!onboarded || daysSince(lastVisitAt) >= REVISIT_DAYS) {
          set({ welcomeRequired: true });
        } else {
          set({ welcomeRequired: false, lastVisitAt: new Date().toISOString() });
        }
      },
      chooseTown: (scope) =>
        set({
          scope,
          onboarded: true,
          welcomeRequired: false,
          splashTown: scope,
          lastVisitAt: new Date().toISOString(),
        }),
      setScope: (scope) => set({ scope }),
      clearSplash: () => set({ splashTown: null }),
      requireWelcome: () => set({ welcomeRequired: true }),
      subscribeNewsletter: (email) =>
        set({ newsletterEmail: email.trim(), newsletterAt: new Date().toISOString() }),
      unsubscribeNewsletter: () => set({ newsletterEmail: null, newsletterAt: null }),
      setDealAlerts: (enabled) => set({ dealAlerts: enabled }),
      setEventAlerts: (enabled) => set({ eventAlerts: enabled }),
      toggleSaved: (id) => {
        const saved = get().savedIds;
        set({ savedIds: saved.includes(id) ? saved.filter((s) => s !== id) : [id, ...saved] });
      },
      toggleStep: (id) => {
        const done = get().doneSteps;
        set({ doneSteps: done.includes(id) ? done.filter((s) => s !== id) : [id, ...done] });
      },
      resetSteps: () => set({ doneSteps: [] }),
    }),
    {
      name: 'myelginhub.app',
      storage: asyncStorage,
      partialize: (state) => ({
        scope: state.scope,
        onboarded: state.onboarded,
        lastVisitAt: state.lastVisitAt,
        newsletterEmail: state.newsletterEmail,
        newsletterAt: state.newsletterAt,
        dealAlerts: state.dealAlerts,
        eventAlerts: state.eventAlerts,
        savedIds: state.savedIds,
        doneSteps: state.doneSteps,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export function useIsSaved(id: string): boolean {
  return useAppStore((s) => s.savedIds.includes(id));
}

export function useSavedIds(): string[] {
  const savedIds = useAppStore((s) => s.savedIds);
  return useMemo(() => savedIds, [savedIds]);
}
