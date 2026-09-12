import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { exploreCategoriesForScope } from '@/lib/data/towns';
import { routes } from '@/lib/routes';
import { placesForCategory } from '@/lib/selectors';

/** Explore <Town> — the sub-category grid behind the Heritage & Culture tile. */
export default function ExploreScreen() {
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const categories = exploreCategoriesForScope(scope);
  const place = scope === 'all' ? 'Elgin County' : town.name;

  return (
    <ScreenScaffold
      title={`Explore ${place}`}
      subtitle="Discover & Connect · Heritage & Culture"
      emoji="🧭"
    >
      <View className="flex-row flex-wrap" style={{ marginHorizontal: -5 }}>
        {categories.map((category) => {
          const count = placesForCategory(scope, category.slug).length;
          return (
            <View
              key={category.slug}
              style={{ width: '50%', paddingHorizontal: 5, paddingBottom: 10 }}
            >
              <Pressable
                onPress={() => router.push(routes.exploreCategory(category.slug))}
                accessibilityRole="button"
                accessibilityLabel={category.name}
                className="border-border bg-surface h-[112px] justify-between rounded-3xl border p-3 active:opacity-80"
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: palette.soft }}
                >
                  <Text className="text-lg">{category.emoji}</Text>
                </View>
                <View>
                  <Text className="text-foreground text-[13px] font-bold" numberOfLines={2}>
                    {category.name}
                  </Text>
                  <Text className="text-muted text-[11px]">
                    {count} {count === 1 ? 'listing' : 'listings'}
                    {category.children ? ` · ${category.children.length} sub` : ''}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScreenScaffold>
  );
}
