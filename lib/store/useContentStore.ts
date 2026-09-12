import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ADS, DEALS, EVENTS, JOBS, NEWS } from '@/lib/data/feed';
import { SEED_LISTINGS } from '@/lib/data/listings';
import type { Deal, EventItem, Job, Listing, NewsItem, SponsoredAd } from '@/lib/types';
import { asyncStorage } from './storage';

type ContentState = {
  userListings: Listing[];
  userDeals: Deal[];
  userNews: NewsItem[];
  userEvents: EventItem[];
  userJobs: Job[];
  hydrated: boolean;
  setHydrated: () => void;
  addListing: (listing: Listing) => void;
  addDeal: (deal: Deal) => void;
  addNews: (item: NewsItem) => void;
  addEvent: (item: EventItem) => void;
  addJob: (job: Job) => void;
  removeListing: (id: string) => void;
};

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      userListings: [],
      userDeals: [],
      userNews: [],
      userEvents: [],
      userJobs: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      addListing: (listing) => set((s) => ({ userListings: [listing, ...s.userListings] })),
      addDeal: (deal) => set((s) => ({ userDeals: [deal, ...s.userDeals] })),
      addNews: (item) => set((s) => ({ userNews: [item, ...s.userNews] })),
      addEvent: (item) => set((s) => ({ userEvents: [item, ...s.userEvents] })),
      addJob: (job) => set((s) => ({ userJobs: [job, ...s.userJobs] })),
      removeListing: (id) =>
        set((s) => ({ userListings: s.userListings.filter((l) => l.id !== id) })),
    }),
    {
      name: 'myelginhub.content',
      storage: asyncStorage,
      partialize: (state) => ({
        userListings: state.userListings,
        userDeals: state.userDeals,
        userNews: state.userNews,
        userEvents: state.userEvents,
        userJobs: state.userJobs,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export function useListings(): Listing[] {
  const userListings = useContentStore((s) => s.userListings);
  return useMemo(() => [...userListings, ...SEED_LISTINGS], [userListings]);
}

export function useNews(): NewsItem[] {
  const userNews = useContentStore((s) => s.userNews);
  return useMemo(
    () =>
      [...userNews, ...NEWS].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [userNews],
  );
}

export function useEvents(): EventItem[] {
  const userEvents = useContentStore((s) => s.userEvents);
  return useMemo(
    () =>
      [...userEvents, ...EVENTS].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      ),
    [userEvents],
  );
}

export function useDeals(): Deal[] {
  const userDeals = useContentStore((s) => s.userDeals);
  return useMemo(() => [...userDeals, ...DEALS], [userDeals]);
}

export function useJobs(): Job[] {
  const userJobs = useContentStore((s) => s.userJobs);
  return useMemo(
    () =>
      [...userJobs, ...JOBS].sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      ),
    [userJobs],
  );
}

export function useAds(): SponsoredAd[] {
  return ADS;
}
