import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { dayLabel, fullDateLabel, isToday, timeLabel } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Deal, EventItem, NewsItem, SponsoredAd } from '@/lib/types';
import { todayWeather } from '@/lib/weather';

type Props = {
  news: NewsItem[];
  events: EventItem[];
  deals: Deal[];
  ad?: SponsoredAd;
};

const GAP = 12;
const AUTO_ADVANCE_MS = 5200;

/**
 * TRENDING AROUND YOU — the horizontal, auto-advancing hero carousel:
 * Today → Upcoming Events → Community News → Deals of the Day → Sponsored Ad.
 */
export function TodayCarousel({ news, events, deals, ad }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { scope, town, palette } = useTownTheme();
  const cardWidth = Math.min(width - 40, 460);
  const step = cardWidth + GAP;
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const weather = todayWeather(scope);
  const todaysEvent = events.find((e) => isToday(e.startsAt));
  const [now] = useState(() => Date.now());
  const upcoming = events.filter((e) => new Date(e.startsAt).getTime() >= now).slice(0, 3);
  const headlines = news.slice(0, 2);
  const featuredDeal = deals.find((d) => d.featured) ?? deals[0];

  const slides: { key: string; href: Href; node: ReactNode }[] = [];

  slides.push({
    key: 'today',
    href: routes.events,
    node: (
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-between rounded-3xl p-4"
      >
        <View>
          <Text className="text-[10px] font-bold tracking-widest text-white/75">TODAY</Text>
          <Text className="mt-1 text-[19px] font-bold text-white">{fullDateLabel()}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-3xl">{weather.emoji}</Text>
          <View className="ml-3">
            <Text className="text-2xl font-bold text-white">{weather.tempC}°C</Text>
            <Text className="text-[11px] text-white/80">
              {weather.condition} · H {weather.high}° L {weather.low}° · {weather.wind}
            </Text>
          </View>
        </View>
        <View className="rounded-2xl bg-white/15 px-3 py-2">
          <Text className="text-[10px] font-bold tracking-wider text-white/75">TODAY’S EVENT</Text>
          <Text className="text-[13px] font-semibold text-white" numberOfLines={1}>
            {todaysEvent
              ? `${todaysEvent.emoji} ${todaysEvent.title}`
              : 'No events scheduled today'}
          </Text>
          {todaysEvent ? (
            <Text className="text-[11px] text-white/80" numberOfLines={1}>
              {timeLabel(todaysEvent.startsAt)} · {todaysEvent.venue}
            </Text>
          ) : null}
        </View>
      </LinearGradient>
    ),
  });

  slides.push({
    key: 'events',
    href: routes.events,
    node: (
      <View className="border-border bg-surface flex-1 rounded-3xl border p-4">
        <Text className="text-[10px] font-bold tracking-widest" style={{ color: palette.primary }}>
          UPCOMING EVENTS
        </Text>
        <View className="mt-2 flex-1 justify-center gap-2.5">
          {upcoming.map((event) => (
            <View key={event.id} className="flex-row items-center">
              <View
                className="mr-3 h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: palette.soft }}
              >
                <Text className="text-base">{event.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-[13px] font-semibold" numberOfLines={1}>
                  {event.title}
                </Text>
                <Text className="text-muted text-[11px]" numberOfLines={1}>
                  {dayLabel(event.startsAt)} · {event.venue}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <Text className="text-[11px] font-semibold" style={{ color: palette.primary }}>
          See the full calendar →
        </Text>
      </View>
    ),
  });

  slides.push({
    key: 'news',
    href: routes.news,
    node: (
      <View className="border-border bg-surface flex-1 rounded-3xl border p-4">
        <Text className="text-[10px] font-bold tracking-widest" style={{ color: palette.primary }}>
          {scope === 'all' ? 'ELGIN COUNTY NEWS' : `${town.name.toUpperCase()} COMMUNITY NEWS`}
        </Text>
        <View className="mt-2 flex-1 justify-center gap-3">
          {headlines.map((item) => (
            <View key={item.id}>
              <Text className="text-foreground text-[14px] font-semibold" numberOfLines={2}>
                {item.emoji} {item.title}
              </Text>
              <Text className="text-muted text-[11px]" numberOfLines={1}>
                {item.source} · {dayLabel(item.publishedAt)}
              </Text>
            </View>
          ))}
        </View>
        <Text className="text-[11px] font-semibold" style={{ color: palette.primary }}>
          Read the newsroom →
        </Text>
      </View>
    ),
  });

  if (featuredDeal) {
    slides.push({
      key: 'deal',
      href: routes.deals,
      node: (
        <LinearGradient
          colors={['#FFC000', '#F0A500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 justify-between rounded-3xl p-4"
        >
          <Text className="text-[10px] font-bold tracking-widest" style={{ color: '#4A3400' }}>
            🔥 DEAL OF THE DAY
          </Text>
          <View>
            <Text className="text-[13px] font-semibold" style={{ color: '#4A3400' }}>
              {featuredDeal.business}
            </Text>
            <Text className="text-[19px] font-bold" style={{ color: '#221900' }} numberOfLines={2}>
              {featuredDeal.title}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="rounded-full bg-white/70 px-3 py-1">
              <Text className="text-[12px] font-bold" style={{ color: '#4A3400' }}>
                {featuredDeal.discount}
              </Text>
            </View>
            <Text className="text-[11px] font-semibold" style={{ color: '#4A3400' }}>
              All hot deals →
            </Text>
          </View>
        </LinearGradient>
      ),
    });
  }

  if (ad) {
    slides.push({
      key: 'ad',
      href: routes.directory,
      node: (
        <View
          className="flex-1 justify-between rounded-3xl p-4"
          style={{ backgroundColor: '#111827' }}
        >
          <Text className="text-[10px] font-bold tracking-widest text-white/60">SPONSORED</Text>
          <View>
            <Text className="text-[11px] font-semibold text-white/70">{ad.advertiser}</Text>
            <Text className="mt-1 text-[18px] font-bold text-white" numberOfLines={2}>
              {ad.emoji} {ad.headline}
            </Text>
            <Text className="mt-1 text-[12px] text-white/70" numberOfLines={2}>
              {ad.body}
            </Text>
          </View>
          <View
            className="self-start rounded-full px-3 py-1.5"
            style={{ backgroundColor: '#FFC000' }}
          >
            <Text className="text-[12px] font-bold" style={{ color: '#3A2A00' }}>
              {ad.cta}
            </Text>
          </View>
        </View>
      ),
    });
  }

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({ x: next * step, animated: true });
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length, step]);

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToOffsets={slides.map((_, i) => i * step)}
        contentContainerStyle={{ paddingHorizontal: 20, gap: GAP }}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / step))}
      >
        {slides.map((slide) => (
          <Pressable
            key={slide.key}
            onPress={() => router.push(slide.href)}
            accessibilityRole="button"
            style={{ width: cardWidth, height: 188 }}
            className="active:opacity-90"
          >
            {slide.node}
          </Pressable>
        ))}
      </ScrollView>
      <View className="mt-3 flex-row justify-center gap-1.5">
        {slides.map((slide, i) => (
          <View
            key={slide.key}
            style={{
              width: i === index ? 18 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === index ? palette.primary : '#D1D5DB',
            }}
          />
        ))}
      </View>
    </View>
  );
}
