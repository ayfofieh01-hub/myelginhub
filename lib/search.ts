import type { Href } from 'expo-router';
import { LIVE_WELL_CATEGORIES, exploreCategoriesForScope } from '@/lib/data/towns';
import { routes } from '@/lib/routes';
import { inTownScope, placesInScope } from '@/lib/selectors';
import type { Deal, EventItem, Job, Listing, NewsItem, TownScope } from '@/lib/types';

export type SearchType = 'place' | 'news' | 'event' | 'deal' | 'job' | 'listing' | 'category';

export type SearchEntry = {
  key: string;
  type: SearchType;
  title: string;
  subtitle: string;
  emoji: string;
  href: Href;
  haystack: string;
};

export const SEARCH_FILTERS: { type: SearchType | 'all'; label: string }[] = [
  { type: 'all', label: 'Everything' },
  { type: 'place', label: 'Places' },
  { type: 'listing', label: 'Marketplace' },
  { type: 'deal', label: 'Deals' },
  { type: 'event', label: 'Events' },
  { type: 'news', label: 'News' },
  { type: 'job', label: 'Jobs' },
  { type: 'category', label: 'Categories' },
];

type Sources = {
  news: NewsItem[];
  events: EventItem[];
  deals: Deal[];
  jobs: Job[];
  listings: Listing[];
};

export function buildSearchIndex(scope: TownScope, sources: Sources): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const place of placesInScope(scope)) {
    entries.push({
      key: `place-${place.id}`,
      type: 'place',
      title: place.name,
      subtitle: place.blurb,
      emoji: '📍',
      href: routes.place(place.id),
      haystack: `${place.name} ${place.blurb} ${place.category} ${place.subCategory ?? ''} ${place.tags.join(' ')} ${place.address}`,
    });
  }

  for (const item of inTownScope(sources.news, scope)) {
    entries.push({
      key: `news-${item.id}`,
      type: 'news',
      title: item.title,
      subtitle: item.summary,
      emoji: item.emoji,
      href: routes.newsItem(item.id),
      haystack: `${item.title} ${item.summary} ${item.body} ${item.source}`,
    });
  }

  for (const item of inTownScope(sources.events, scope)) {
    entries.push({
      key: `event-${item.id}`,
      type: 'event',
      title: item.title,
      subtitle: `${item.venue} · ${item.price}`,
      emoji: item.emoji,
      href: routes.event(item.id),
      haystack: `${item.title} ${item.summary} ${item.body} ${item.venue}`,
    });
  }

  for (const deal of inTownScope(sources.deals, scope)) {
    entries.push({
      key: `deal-${deal.id}`,
      type: 'deal',
      title: deal.title,
      subtitle: `${deal.business} · ${deal.discount}`,
      emoji: deal.emoji,
      href: routes.deals,
      haystack: `${deal.title} ${deal.detail} ${deal.business} ${deal.discount}`,
    });
  }

  for (const job of inTownScope(sources.jobs, scope)) {
    entries.push({
      key: `job-${job.id}`,
      type: 'job',
      title: job.title,
      subtitle: `${job.employer} · ${job.type}`,
      emoji: job.emoji,
      href: routes.jobs,
      haystack: `${job.title} ${job.employer} ${job.summary} ${job.type} ${job.pay}`,
    });
  }

  for (const listing of inTownScope(sources.listings, scope)) {
    entries.push({
      key: `listing-${listing.id}`,
      type: 'listing',
      title: listing.title,
      subtitle: `${listing.price} · ${listing.category}`,
      emoji: listing.emoji,
      href: routes.listing(listing.id),
      haystack: `${listing.title} ${listing.description} ${listing.category} ${listing.price} ${listing.sellerName}`,
    });
  }

  for (const category of exploreCategoriesForScope(scope)) {
    entries.push({
      key: `category-${category.slug}`,
      type: 'category',
      title: category.name,
      subtitle: 'Explore category',
      emoji: category.emoji,
      href: routes.exploreCategory(category.slug),
      haystack: `${category.name} explore`,
    });
    for (const child of category.children ?? []) {
      entries.push({
        key: `category-${child.slug}`,
        type: 'category',
        title: child.name,
        subtitle: `In ${category.name}`,
        emoji: child.emoji,
        href: routes.exploreCategory(child.slug),
        haystack: `${child.name} ${category.name}`,
      });
    }
  }

  for (const category of LIVE_WELL_CATEGORIES) {
    entries.push({
      key: `category-live-${category.slug}`,
      type: 'category',
      title: category.name,
      subtitle: 'Live Well',
      emoji: category.emoji,
      href: routes.liveWell(category.slug),
      haystack: `${category.name} live well daily life`,
    });
  }

  return entries;
}

export function runSearch(
  index: SearchEntry[],
  query: string,
  filter: SearchType | 'all',
): SearchEntry[] {
  const scoped = filter === 'all' ? index : index.filter((e) => e.type === filter);
  const q = query.trim().toLowerCase();
  if (!q) return scoped.slice(0, 40);
  const terms = q.split(/\s+/);
  return scoped
    .map((entry) => {
      const hay = entry.haystack.toLowerCase();
      const title = entry.title.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.startsWith(term)) score += 6;
        else if (title.includes(term)) score += 4;
        else if (hay.includes(term)) score += 1;
        else return { entry, score: -1 };
      }
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map((r) => r.entry);
}
