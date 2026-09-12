import { MessageCircle, Plus, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EmptyState } from '@/components/EmptyState';
import { ListingCard } from '@/components/ContentCards';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { MARKETPLACE_CATEGORIES } from '@/lib/data/listings';
import { routes } from '@/lib/routes';
import { inTownScope } from '@/lib/selectors';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useListings } from '@/lib/store/useContentStore';
import { useUnreadThreadCount } from '@/lib/store/useChatStore';
import type { ListingKind } from '@/lib/types';

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const listings = useListings();
  const user = useAuthStore((s) => s.user);
  const unread = useUnreadThreadCount(user?.id);

  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<ListingKind | 'all'>('all');
  const [category, setCategory] = useState<string>('all');

  const scoped = useMemo(() => inTownScope(listings, scope), [listings, scope]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter((listing) => {
      if (kind !== 'all' && listing.kind !== kind) return false;
      if (category !== 'all' && listing.category !== category) return false;
      if (!q) return true;
      return `${listing.title} ${listing.description} ${listing.category}`
        .toLowerCase()
        .includes(q);
    });
  }, [scoped, kind, category, query]);

  return (
    <View className="bg-background flex-1">
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="light" />
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: insets.top + 10 }}
        className="rounded-b-3xl px-5 pb-4"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-[22px] font-bold text-white">Marketplace</Text>
            <Text className="text-[12px] text-white/80">
              Goods & services in {scope === 'all' ? 'Elgin County' : town.name}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push(routes.inbox)}
            accessibilityRole="button"
            accessibilityLabel="Marketplace inbox"
            className="h-10 flex-row items-center rounded-full px-3 active:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <MessageCircle size={16} color="#FFFFFF" />
            <Text className="ml-1.5 text-[12px] font-bold text-white">Inbox</Text>
            {unread > 0 ? (
              <View
                className="ml-1.5 h-5 min-w-5 items-center justify-center rounded-full px-1"
                style={{ backgroundColor: '#FFC000' }}
              >
                <Text className="text-[10px] font-bold" style={{ color: '#3A2A00' }}>
                  {unread}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View className="mt-3 h-11 flex-row items-center rounded-2xl bg-white px-3">
          <Search size={17} color="#6B7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search items and services"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            accessibilityLabel="Search the marketplace"
            className="text-foreground ml-2 flex-1 text-[14px]"
          />
        </View>

        <View className="mt-3 flex-row gap-2">
          {(['all', 'goods', 'services'] as const).map((option) => {
            const active = kind === option;
            return (
              <Pressable
                key={option}
                onPress={() => setKind(option)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className="rounded-full px-3 py-1.5 active:opacity-80"
                style={{ backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.2)' }}
              >
                <Text
                  className="text-[12px] font-bold"
                  style={{ color: active ? palette.primaryDark : '#FFFFFF' }}
                >
                  {option === 'all' ? 'Everything' : option === 'goods' ? 'Items' : 'Services'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
      >
        {(['all', ...MARKETPLACE_CATEGORIES] as const).map((option) => {
          const active = category === option;
          return (
            <Pressable
              key={option}
              onPress={() => setCategory(option)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className="rounded-full border px-3 py-2 active:opacity-70"
              style={{
                borderColor: active ? palette.primary : '#E5E7EB',
                backgroundColor: active ? palette.soft : 'transparent',
              }}
            >
              <Text
                className="text-[12px] font-semibold"
                style={{ color: active ? palette.primaryDark : '#374151' }}
              >
                {option === 'all' ? 'All categories' : option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="🛒"
            title="Nothing listed here yet"
            body="Be first — tap the + tab to list an item or offer a service."
          />
        }
        renderItem={({ item }) => <ListingCard item={item} showTown={scope === 'all'} />}
      />

      <Pressable
        onPress={() => router.push(routes.post)}
        accessibilityRole="button"
        accessibilityLabel="Post a listing"
        className="absolute right-5 bottom-5 h-14 w-14 items-center justify-center rounded-full active:opacity-85"
        style={{
          backgroundColor: palette.primary,
          shadowColor: '#000000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }}
      >
        <Plus size={26} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
