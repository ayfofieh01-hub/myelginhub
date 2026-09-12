import { MapPin, Star } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Pill } from '@/components/Pill';
import { TOWNS } from '@/lib/data/towns';
import { dayLabel, eventWhen, expiresLabel, timeAgo } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Deal, EventItem, Job, Listing, NewsItem, Place, TownScope } from '@/lib/types';

function townPill(town: TownScope, showTown: boolean) {
  if (!showTown) return null;
  const t = TOWNS[town];
  return (
    <Pill
      label={t.shortName}
      emoji={t.emoji}
      color={t.palette.soft}
      textColor={t.palette.primaryDark}
    />
  );
}

type Common = { showTown?: boolean };

export function NewsCard({ item, showTown = false }: { item: NewsItem } & Common) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(routes.newsItem(item.id))}
      accessibilityRole="button"
      className="border-border bg-surface rounded-3xl border p-4 active:opacity-80"
    >
      <View className="flex-row">
        <Text className="mr-3 text-2xl">{item.emoji}</Text>
        <View className="flex-1">
          <Text className="text-foreground text-[15px] leading-5 font-bold">{item.title}</Text>
          <Text className="text-muted mt-1 text-[12px] leading-4" numberOfLines={2}>
            {item.summary}
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            {townPill(item.town, showTown)}
            <Text className="text-muted text-[11px]">
              {item.source} · {timeAgo(item.publishedAt)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function EventCard({ item, showTown = false }: { item: EventItem } & Common) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(routes.event(item.id))}
      accessibilityRole="button"
      className="border-border bg-surface rounded-3xl border p-4 active:opacity-80"
    >
      <View className="flex-row">
        <View className="bg-default mr-3 h-12 w-12 items-center justify-center rounded-2xl">
          <Text className="text-xl">{item.emoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-foreground text-[15px] font-bold" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-muted mt-0.5 text-[12px]" numberOfLines={1}>
            {eventWhen(item)}
          </Text>
          <Text className="text-muted text-[12px]" numberOfLines={1}>
            {item.venue}
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Pill label={item.price} color="#EEF2F7" textColor="#1F2937" />
            {townPill(item.town, showTown)}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function DealCard({ item, showTown = false }: { item: Deal } & Common) {
  const [now] = useState(() => Date.now());
  const expired = useMemo(() => new Date(item.expiresAt).getTime() < now, [item.expiresAt, now]);
  return (
    <View className="border-border bg-surface rounded-3xl border p-4">
      <View className="flex-row items-start">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: '#FFF3D1' }}
        >
          <Text className="text-xl">{item.emoji}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted text-[12px] font-semibold" numberOfLines={1}>
              {item.business}
            </Text>
            <Pill label={item.discount} color="#FFC000" textColor="#3A2A00" />
          </View>
          <Text className="text-foreground mt-0.5 text-[15px] font-bold" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-muted mt-1 text-[12px] leading-4" numberOfLines={2}>
            {item.detail}
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Pill
              label={expired ? 'Expired' : expiresLabel(item.expiresAt)}
              color={expired ? '#F3F4F6' : '#E7F3DE'}
              textColor={expired ? '#6B7280' : '#3D6127'}
            />
            {townPill(item.town, showTown)}
          </View>
        </View>
      </View>
    </View>
  );
}

export function JobCard({ item, showTown = false }: { item: Job } & Common) {
  return (
    <View className="border-border bg-surface rounded-3xl border p-4">
      <View className="flex-row">
        <View className="bg-default mr-3 h-12 w-12 items-center justify-center rounded-2xl">
          <Text className="text-xl">{item.emoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-foreground text-[15px] font-bold" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-muted text-[12px] font-semibold">{item.employer}</Text>
          <Text className="text-muted mt-1 text-[12px] leading-4" numberOfLines={2}>
            {item.summary}
          </Text>
          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <Pill label={item.type} color="#EEF2F7" textColor="#1F2937" />
            <Pill label={item.pay} color="#E7F3DE" textColor="#3D6127" />
            {townPill(item.town, showTown)}
            <Text className="text-muted text-[11px]">{timeAgo(item.postedAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function ListingCard({ item, showTown = false }: { item: Listing } & Common) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(routes.listing(item.id))}
      accessibilityRole="button"
      className="border-border bg-surface rounded-3xl border p-4 active:opacity-80"
    >
      <View className="flex-row">
        <View className="bg-default mr-3 h-14 w-14 items-center justify-center rounded-2xl">
          <Text className="text-2xl">{item.emoji}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="text-foreground flex-1 pr-2 text-[15px] font-bold" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="text-[15px] font-bold" style={{ color: '#548235' }}>
              {item.price}
            </Text>
          </View>
          <Text className="text-muted mt-1 text-[12px] leading-4" numberOfLines={2}>
            {item.description}
          </Text>
          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <Pill
              label={item.kind === 'goods' ? 'Item' : 'Service'}
              color={item.kind === 'goods' ? '#EEF2F7' : '#EDE9FE'}
              textColor={item.kind === 'goods' ? '#1F2937' : '#4C1D95'}
            />
            <Pill label={item.category} color="#F3F4F6" textColor="#374151" />
            {townPill(item.town, showTown)}
            <Text className="text-muted text-[11px]">{dayLabel(item.postedAt)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function PlaceRow({ place, showTown = false }: { place: Place } & Common) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(routes.place(place.id))}
      accessibilityRole="button"
      className="border-border bg-surface rounded-3xl border p-4 active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-foreground text-[15px] font-bold" numberOfLines={1}>
            {place.name}
          </Text>
          <Text className="text-muted mt-0.5 text-[12px] leading-4" numberOfLines={2}>
            {place.blurb}
          </Text>
          <View className="mt-2 flex-row items-center">
            <MapPin size={12} color="#6B7280" />
            <Text className="text-muted ml-1 flex-1 text-[11px]" numberOfLines={1}>
              {place.address}
            </Text>
          </View>
          {place.tags.length > 0 || showTown ? (
            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              {townPill(place.town, showTown)}
              {place.tags.slice(0, 2).map((tag) => (
                <Pill key={tag} label={tag} color="#F3F4F6" textColor="#374151" />
              ))}
            </View>
          ) : null}
        </View>
        <View className="bg-default flex-row items-center rounded-full px-2 py-1">
          <Star size={12} color="#F59E0B" />
          <Text className="text-foreground ml-1 text-[11px] font-bold">
            {place.rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
