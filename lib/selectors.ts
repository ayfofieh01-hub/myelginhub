import { PLACES } from '@/lib/data/places';
import { findExploreCategory, townsInScope } from '@/lib/data/towns';
import type { LiveWellSlug, Place, TownScope } from '@/lib/types';

export function placesInScope(scope: TownScope): Place[] {
  const towns = townsInScope(scope);
  return PLACES.filter((p) => towns.includes(p.town));
}

/** Places for an explore category slug, matching parents and their children. */
export function placesForCategory(scope: TownScope, slug: string): Place[] {
  const found = findExploreCategory(scope, slug);
  const childSlugs = found?.category.children?.map((c) => c.slug) ?? [];
  return placesInScope(scope).filter(
    (p) =>
      p.category === slug || p.subCategory === slug || childSlugs.includes(p.subCategory ?? ''),
  );
}

export function liveWellPlaces(scope: TownScope, slug: LiveWellSlug): Place[] {
  return placesInScope(scope).filter((p) => p.liveWell === slug);
}

export function directoryPlaces(scope: TownScope): Place[] {
  return placesInScope(scope).filter((p) => !!p.directory);
}

export type DirectorySection = { trade: string; places: Place[] };

export function directorySections(scope: TownScope): DirectorySection[] {
  const grouped = new Map<string, Place[]>();
  for (const place of directoryPlaces(scope)) {
    const trade = place.directory ?? 'Other';
    const list = grouped.get(trade) ?? [];
    list.push(place);
    grouped.set(trade, list);
  }
  return [...grouped.entries()]
    .map(([trade, places]) => ({
      trade,
      places: places.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.trade.localeCompare(b.trade));
}

export function directoryTrades(scope: TownScope): string[] {
  return directorySections(scope).map((s) => s.trade);
}

/** Generic scope filter for any content tagged with a town. */
export function inTownScope<T extends { town: TownScope }>(items: T[], scope: TownScope): T[] {
  if (scope === 'all') return items;
  return items.filter((item) => item.town === scope || item.town === 'all');
}
