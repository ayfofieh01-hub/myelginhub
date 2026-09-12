import { Bell } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BrandLogo } from '@/components/BrandLogo';
import { ClusterSection, type Tile } from '@/components/ClusterGrid';
import { DealCard } from '@/components/ContentCards';
import { NewcomerBanner } from '@/components/NewcomerBanner';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { SectionHeader } from '@/components/SectionHeader';
import { Ticker } from '@/components/Ticker';
import { TodayCarousel } from '@/components/TodayCarousel';
import { TownSwitcher } from '@/components/TownSwitcher';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { LIVE_WELL_CATEGORIES, exploreCategoriesForScope } from '@/lib/data/towns';
import { routes } from '@/lib/routes';
import { directoryTrades, inTownScope } from '@/lib/selectors';
import {
  useAds,
  useDeals,
  useEvents,
  useJobs,
  useListings,
  useNews,
} from '@/lib/store/useContentStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUnreadNotificationCount } from '@/lib/store/useNotificationStore';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const user = useAuthStore((s) => s.user);
  const unread = useUnreadNotificationCount();

  const news = useNews();
  const events = useEvents();
  const deals = useDeals();
  const jobs = useJobs();
  const listings = useListings();
  const ads = useAds();

  const scopedNews = useMemo(() => inTownScope(news, scope), [news, scope]);
  const scopedEvents = useMemo(() => inTownScope(events, scope), [events, scope]);
  const scopedDeals = useMemo(() => inTownScope(deals, scope), [deals, scope]);
  const scopedJobs = useMemo(() => inTownScope(jobs, scope), [jobs, scope]);
  const scopedListings = useMemo(() => inTownScope(listings, scope), [listings, scope]);
  const ad = useMemo(() => inTownScope(ads, scope)[0], [ads, scope]);

  const [now] = useState(() => Date.now());
  const upcoming = useMemo(() => {
    return scopedEvents.filter((e) => new Date(e.startsAt).getTime() >= now);
  }, [scopedEvents, now]);
  const liveDeals = useMemo(() => {
    return scopedDeals.filter((d) => new Date(d.expiresAt).getTime() > now);
  }, [scopedDeals, now]);

  const tickerItems = useMemo(() => {
    const items = [
      ...scopedNews.slice(0, 3).map((n) => `📰 ${n.title}`),
      ...upcoming.slice(0, 2).map((e) => `📅 ${e.title}`),
      ...liveDeals.slice(0, 2).map((d) => `🔥 ${d.business}: ${d.title}`),
    ];
    return items.length > 0 ? items : ['Welcome to MyElginHub'];
  }, [scopedNews, upcoming, liveDeals]);

  const placeName = scope === 'all' ? 'Elgin County' : town.name;
  const exploreCount = exploreCategoriesForScope(scope).length;
  const tradeCount = directoryTrades(scope).length;

  const heritageTiles: Tile[] = [
    {
      key: 'explore',
      emoji: '🧭',
      title: `Explore ${placeName}`,
      caption: `${exploreCount} categories to browse`,
      href: routes.explore,
    },
    {
      key: 'history',
      emoji: '🏛️',
      title: `${placeName} History`,
      caption: 'How this place came to be',
      href: routes.history,
    },
  ];

  const commerceTiles: Tile[] = [
    {
      key: 'marketplace',
      emoji: '🛒',
      title: 'Marketplace',
      caption: 'Goods, services & chat',
      href: routes.marketplace,
      badge: `${scopedListings.length}`,
    },
    {
      key: 'directory',
      emoji: '🏪',
      title: 'Business & Trade Directory',
      caption: `${tradeCount} trades listed`,
      href: routes.directory,
    },
    {
      key: 'jobs',
      emoji: '💼',
      title: 'Jobs & Employment',
      caption: `${scopedJobs.length} openings nearby`,
      href: routes.jobs,
    },
    {
      key: 'deals',
      emoji: '🔥',
      title: 'Hot Community Deals',
      caption: 'Daily deals + push alerts',
      href: routes.deals,
      badge: `${liveDeals.length}`,
    },
  ];

  const liveWellTiles: Tile[] = LIVE_WELL_CATEGORIES.map((category) => ({
    key: category.slug,
    emoji: category.emoji,
    title: category.name,
    caption: 'Local favourites',
    href: routes.liveWell(category.slug),
  }));

  return (
    <View className="bg-background flex-1">
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={palette.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + 10 }}
          className="rounded-b-3xl px-5 pb-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="rounded-2xl bg-white/95 px-3 py-1.5">
              <BrandLogo size={20} />
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => router.push(routes.notifications)}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
                hitSlop={8}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Bell size={17} color="#FFFFFF" />
                {unread > 0 ? (
                  <View
                    className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: '#FFC000' }}
                  />
                ) : null}
              </Pressable>
              <TownSwitcher />
            </View>
          </View>

          <Text className="mt-4 text-[13px] font-semibold text-white/80">
            {greeting()}
            {user ? `, ${user.name.split(' ')[0]}` : ''}
          </Text>
          <Text className="text-[22px] font-bold text-white">
            {scope === 'all' ? 'All of Elgin County' : town.name} today
          </Text>
          <View className="mt-3">
            <Ticker items={tickerItems} background="rgba(255,255,255,0.18)" />
          </View>
        </LinearGradient>

        <View className="mt-5">
          <View className="px-5">
            <SectionHeader
              title="Trending around you"
              subtitle="Today, events, news, deals and more"
              accent={palette.primary}
            />
          </View>
          <TodayCarousel news={scopedNews} events={scopedEvents} deals={liveDeals} ad={ad} />
        </View>

        <View className="mt-6 px-5">
          <NewcomerBanner />
        </View>

        <View className="mt-7 px-5">
          <ClusterSection
            cluster="Heritage & Culture"
            label="Discover & Connect"
            tiles={heritageTiles}
            accent={palette.primary}
            soft={palette.soft}
          />
        </View>

        <View className="mt-5 px-5">
          <ClusterSection
            cluster="Commerce"
            label="Buy, Sell & Work"
            tiles={commerceTiles}
            accent={palette.primary}
            soft={palette.soft}
          />
        </View>

        <View className="mt-5 px-5">
          <ClusterSection
            cluster="Daily Life"
            label="Live Well"
            tiles={liveWellTiles}
            accent={palette.primary}
            soft={palette.soft}
          />
        </View>

        {liveDeals.length > 0 ? (
          <View className="mt-4 px-5">
            <SectionHeader
              title="Hot Community Deals"
              subtitle="Fresh from local businesses"
              actionLabel="All deals"
              href={routes.deals}
              accent={palette.primary}
            />
            <View className="gap-3">
              {liveDeals.slice(0, 2).map((deal) => (
                <DealCard key={deal.id} item={deal} showTown={scope === 'all'} />
              ))}
            </View>
          </View>
        ) : null}

        <View className="mt-6 px-5">
          <NewsletterSignup />
        </View>

        <Text className="text-muted mt-6 px-5 text-center text-[11px]">
          MyElginHub · St. Thomas · Port Stanley · Aylmer
        </Text>
      </ScrollView>
    </View>
  );
}
