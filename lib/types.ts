export type TownId = 'st-thomas' | 'port-stanley' | 'aylmer';
export type TownScope = TownId | 'all';

export type ClusterId = 'heritage' | 'commerce' | 'daily-life';

export type AuthProvider = 'google' | 'apple';

export type User = {
  id: string;
  name: string;
  email: string;
  initials: string;
  provider: AuthProvider;
};

export type TownPalette = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  onPrimary: string;
  gradient: [string, string];
  soft: string;
};

export type Town = {
  id: TownScope;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  splashTagline: string;
  blurb: string;
  palette: TownPalette;
};

export type ExploreCategory = {
  slug: string;
  name: string;
  emoji: string;
  children?: ExploreCategory[];
};

export type Place = {
  id: string;
  town: TownId;
  name: string;
  category: string;
  subCategory?: string;
  blurb: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  tags: string[];
  /** Present when the place should also appear in the Live Well cluster. */
  liveWell?: LiveWellSlug;
  /** Present when the place belongs in the business & trade directory. */
  directory?: string;
};

export type LiveWellSlug = 'food-dining' | 'healthcare-services' | 'bars' | 'gym-fitness';

export type NewsItem = {
  id: string;
  town: TownScope;
  title: string;
  summary: string;
  body: string;
  source: string;
  publishedAt: string;
  emoji: string;
  authorId?: string;
};

export type EventItem = {
  id: string;
  town: TownScope;
  title: string;
  summary: string;
  body: string;
  venue: string;
  startsAt: string;
  endsAt?: string;
  price: string;
  emoji: string;
  authorId?: string;
};

export type Deal = {
  id: string;
  town: TownScope;
  business: string;
  title: string;
  detail: string;
  discount: string;
  expiresAt: string;
  emoji: string;
  featured?: boolean;
  authorId?: string;
};

export type SponsoredAd = {
  id: string;
  town: TownScope;
  advertiser: string;
  headline: string;
  body: string;
  cta: string;
  emoji: string;
};

export type Job = {
  id: string;
  town: TownScope;
  title: string;
  employer: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Seasonal' | 'Casual';
  pay: string;
  summary: string;
  postedAt: string;
  emoji: string;
  authorId?: string;
};

export type ListingKind = 'goods' | 'services';

export type Listing = {
  id: string;
  town: TownId;
  kind: ListingKind;
  title: string;
  price: string;
  category: string;
  description: string;
  condition?: string;
  sellerId: string;
  sellerName: string;
  postedAt: string;
  emoji: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  sentAt: string;
};

export type ChatThread = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingEmoji: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  updatedAt: string;
};

export type AppNotification = {
  id: string;
  kind: 'deal' | 'message' | 'news' | 'event' | 'job';
  title: string;
  body: string;
  town: TownScope;
  createdAt: string;
  read: boolean;
  href?: string;
  /** Stable key of the source item, used to avoid duplicate alerts. */
  sourceKey?: string;
};

export type ChecklistStep = {
  id: string;
  title: string;
  detail: string;
  emoji: string;
};

export type HistorySection = {
  year: string;
  title: string;
  body: string;
};
