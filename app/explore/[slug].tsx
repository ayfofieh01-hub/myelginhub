import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { PlaceRow } from '@/components/ContentCards';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { findExploreCategory } from '@/lib/data/towns';
import { routes } from '@/lib/routes';
import { placesForCategory } from '@/lib/selectors';

export default function ExploreCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const found = findExploreCategory(scope, slug ?? '');
  const category = found?.category;
  const places = placesForCategory(scope, slug ?? '');

  if (!category) {
    return (
      <ScreenScaffold title="Category" subtitle="Explore">
        <EmptyState emoji="🧭" title="Category not found" body="Head back and pick another one." />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold
      title={category.name}
      emoji={category.emoji}
      subtitle={`${scope === 'all' ? 'Elgin County' : town.name} · ${places.length} listed`}
    >
      {category.children ? (
        <View className="mb-4 flex-row flex-wrap gap-2">
          {category.children.map((child) => (
            <Pressable
              key={child.slug}
              onPress={() => router.push(routes.exploreCategory(child.slug))}
              accessibilityRole="button"
              className="flex-row items-center rounded-full border px-3 py-2 active:opacity-70"
              style={{ borderColor: palette.primary, backgroundColor: palette.soft }}
            >
              <Text className="mr-1.5 text-sm">{child.emoji}</Text>
              <Text className="text-[12px] font-semibold" style={{ color: palette.primaryDark }}>
                {child.name}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {places.length === 0 ? (
        <EmptyState
          emoji={category.emoji}
          title="Nothing listed yet"
          body="Businesses can add themselves from the Post tab."
        />
      ) : (
        <View className="gap-3">
          {places.map((place) => (
            <PlaceRow key={place.id} place={place} showTown={scope === 'all'} />
          ))}
        </View>
      )}
    </ScreenScaffold>
  );
}
