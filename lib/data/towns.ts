import type { ExploreCategory, Town, TownId, TownScope } from '@/lib/types';

export const TOWN_IDS: TownId[] = ['st-thomas', 'port-stanley', 'aylmer'];

export const TOWNS: Record<TownScope, Town> = {
  'st-thomas': {
    id: 'st-thomas',
    name: 'St. Thomas',
    shortName: 'St. Thomas',
    emoji: '🚂',
    tagline: 'The Railway City',
    splashTagline: 'Where the rails meet the community',
    blurb: 'Elgin County’s railway city — heritage, industry and a growing downtown.',
    palette: {
      primary: '#1D4E89',
      primaryDark: '#123A6B',
      primaryLight: '#3D77B8',
      accent: '#F2A93B',
      onPrimary: '#FFFFFF',
      gradient: ['#123A6B', '#2A6DB0'],
      soft: '#EAF1F9',
    },
  },
  'port-stanley': {
    id: 'port-stanley',
    name: 'Port Stanley',
    shortName: 'Port Stanley',
    emoji: '⚓',
    tagline: 'Lakeside Living',
    splashTagline: 'Blue water, main street charm',
    blurb: 'A Lake Erie harbour village of beaches, patios and the King George VI lift bridge.',
    palette: {
      primary: '#0E7C8B',
      primaryDark: '#075A66',
      primaryLight: '#2FA8B6',
      accent: '#F4C77B',
      onPrimary: '#FFFFFF',
      gradient: ['#075A66', '#1AA2B4'],
      soft: '#E6F4F6',
    },
  },
  aylmer: {
    id: 'aylmer',
    name: 'Aylmer',
    shortName: 'Aylmer',
    emoji: '🌾',
    tagline: 'Heartland Heritage',
    splashTagline: 'Rooted in the heart of Elgin',
    blurb: 'A farming heartland town known for its market gardens, trades and tight-knit streets.',
    palette: {
      primary: '#3F7A34',
      primaryDark: '#2E5C26',
      primaryLight: '#65A155',
      accent: '#E3B23C',
      onPrimary: '#FFFFFF',
      gradient: ['#2E5C26', '#5B9B4A'],
      soft: '#EDF5E9',
    },
  },
  all: {
    id: 'all',
    name: 'All Towns',
    shortName: 'All Towns',
    emoji: '🗺️',
    tagline: 'Elgin County — Connected Communities',
    splashTagline: 'One county, three communities',
    blurb: 'Everything from St. Thomas, Port Stanley and Aylmer in one feed.',
    palette: {
      primary: '#21599E',
      primaryDark: '#17406F',
      primaryLight: '#4A82C4',
      accent: '#FFC000',
      onPrimary: '#FFFFFF',
      gradient: ['#17406F', '#2A6DB0'],
      soft: '#EAF1F9',
    },
  },
};

export const TOWN_ORDER: TownScope[] = ['all', 'st-thomas', 'port-stanley', 'aylmer'];

export function getTown(scope: TownScope): Town {
  return TOWNS[scope];
}

export function townLabel(scope: TownScope): string {
  return TOWNS[scope].name;
}

/** Towns a given scope resolves to. "all" resolves to every town. */
export function townsInScope(scope: TownScope): TownId[] {
  return scope === 'all' ? TOWN_IDS : [scope];
}

export function inScope(scope: TownScope, town: TownScope): boolean {
  if (scope === 'all') return true;
  return town === scope || town === 'all';
}

const POINTS_OF_INTEREST: ExploreCategory = {
  slug: 'points-of-interest',
  name: 'Points of Interest',
  emoji: '📍',
  children: [
    { slug: 'poi-golf', name: 'Golf', emoji: '⛳' },
    { slug: 'poi-parks', name: 'Parks', emoji: '🌳' },
  ],
};

const SHARED_EXPLORE: ExploreCategory[] = [
  { slug: 'child-care', name: 'Child Care Services', emoji: '🧸' },
  { slug: 'education', name: 'Education', emoji: '🎓' },
  { slug: 'financial', name: 'Financial Institutions', emoji: '🏦' },
  { slug: 'food-beverage', name: 'Food & Beverage', emoji: '🍽️' },
  { slug: 'gas-stations', name: 'Gas Stations', emoji: '⛽' },
  { slug: 'healthcare', name: 'Healthcare', emoji: '🩺' },
  { slug: 'industries', name: 'Industries', emoji: '🏭' },
  { slug: 'lodging', name: 'Lodging & Hotels', emoji: '🛏️' },
  POINTS_OF_INTEREST,
  { slug: 'real-estate', name: 'Real Estate', emoji: '🏡' },
  { slug: 'retail', name: 'Retail', emoji: '🛍️' },
  { slug: 'transit', name: 'Transit', emoji: '🚌' },
  { slug: 'utilities', name: 'Utility/Service Providers', emoji: '💡' },
];

/**
 * Explore sub-categories per town. St. Thomas additionally carries a
 * top-level Golf category as specified in the requirements.
 */
export const EXPLORE_CATEGORIES: Record<TownId, ExploreCategory[]> = {
  'st-thomas': [
    { slug: 'child-care', name: 'Child Care Services', emoji: '🧸' },
    { slug: 'financial', name: 'Financial Institutions', emoji: '🏦' },
    { slug: 'food-beverage', name: 'Food & Beverage', emoji: '🍽️' },
    { slug: 'gas-stations', name: 'Gas Stations', emoji: '⛽' },
    { slug: 'golf', name: 'Golf', emoji: '⛳' },
    { slug: 'healthcare', name: 'Healthcare', emoji: '🩺' },
    { slug: 'industries', name: 'Industries', emoji: '🏭' },
    { slug: 'lodging', name: 'Lodging & Hotels', emoji: '🛏️' },
    { slug: 'education', name: 'Education', emoji: '🎓' },
    POINTS_OF_INTEREST,
    { slug: 'real-estate', name: 'Real Estate', emoji: '🏡' },
    { slug: 'retail', name: 'Retail', emoji: '🛍️' },
    { slug: 'transit', name: 'Transit', emoji: '🚌' },
    { slug: 'utilities', name: 'Utility/Service Providers', emoji: '💡' },
  ],
  'port-stanley': SHARED_EXPLORE,
  aylmer: SHARED_EXPLORE,
};

/** Flat list of every explore category (including nested children) for a scope. */
export function exploreCategoriesForScope(scope: TownScope): ExploreCategory[] {
  if (scope !== 'all') return EXPLORE_CATEGORIES[scope];
  const seen = new Map<string, ExploreCategory>();
  for (const town of TOWN_IDS) {
    for (const category of EXPLORE_CATEGORIES[town]) {
      if (!seen.has(category.slug)) seen.set(category.slug, category);
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function findExploreCategory(
  scope: TownScope,
  slug: string,
): { category: ExploreCategory; parent?: ExploreCategory } | undefined {
  for (const category of exploreCategoriesForScope(scope)) {
    if (category.slug === slug) return { category };
    const child = category.children?.find((c) => c.slug === slug);
    if (child) return { category: child, parent: category };
  }
  return undefined;
}

export const LIVE_WELL_CATEGORIES = [
  { slug: 'food-dining', name: 'Food & Dining', emoji: '🍲' },
  { slug: 'healthcare-services', name: 'Healthcare Services', emoji: '⚕️' },
  { slug: 'bars', name: 'Bars', emoji: '🍻' },
  { slug: 'gym-fitness', name: 'Gym & Fitness', emoji: '🏋️' },
] as const;
