import { Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EmptyState } from '@/components/EmptyState';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { SEARCH_FILTERS, type SearchType, buildSearchIndex, runSearch } from '@/lib/search';
import { useDeals, useEvents, useJobs, useListings, useNews } from '@/lib/store/useContentStore';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchType | 'all'>('all');

  const news = useNews();
  const events = useEvents();
  const deals = useDeals();
  const jobs = useJobs();
  const listings = useListings();

  const index = useMemo(
    () => buildSearchIndex(scope, { news, events, deals, jobs, listings }),
    [scope, news, events, deals, jobs, listings],
  );
  const results = useMemo(() => runSearch(index, query, filter), [index, query, filter]);

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
        <Text className="text-[22px] font-bold text-white">Discover</Text>
        <Text className="text-[12px] text-white/80">
          Search everything in {scope === 'all' ? 'Elgin County' : town.name}
        </Text>
        <View className="mt-3 h-12 flex-row items-center rounded-2xl bg-white px-3">
          <Search size={18} color="#6B7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Places, deals, events, jobs, listings…"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search MyElginHub"
            className="text-foreground ml-2 flex-1 text-[14px]"
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <X size={18} color="#6B7280" />
            </Pressable>
          ) : null}
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
      >
        {SEARCH_FILTERS.map((item) => {
          const active = filter === item.type;
          return (
            <Pressable
              key={item.type}
              onPress={() => setFilter(item.type)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className="rounded-full border px-3.5 py-2 active:opacity-70"
              style={{
                borderColor: active ? palette.primary : '#E5E7EB',
                backgroundColor: active ? palette.primary : 'transparent',
              }}
            >
              <Text
                className="text-[12px] font-semibold"
                style={{ color: active ? '#FFFFFF' : '#374151' }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={results}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 10 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Text className="text-muted mb-1 text-[12px] font-semibold">
            {query.trim()
              ? `${results.length} result${results.length === 1 ? '' : 's'} for “${query.trim()}”`
              : `Popular in ${scope === 'all' ? 'Elgin County' : town.name}`}
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🔍"
            title="Nothing matched that"
            body="Try a business name, a category like bars, or a marketplace item."
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(item.href)}
            accessibilityRole="button"
            className="border-border bg-surface flex-row items-center rounded-2xl border p-3 active:opacity-80"
          >
            <View
              className="mr-3 h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: palette.soft }}
            >
              <Text className="text-base">{item.emoji}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-[14px] font-semibold" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="text-muted text-[11px]" numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
            <Text className="text-muted text-[10px] font-bold uppercase">{item.type}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
