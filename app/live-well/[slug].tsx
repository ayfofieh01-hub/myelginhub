import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { PlaceRow } from '@/components/ContentCards';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { LIVE_WELL_CATEGORIES } from '@/lib/data/towns';
import { liveWellPlaces } from '@/lib/selectors';

/** Daily Life · Live Well categories: Food & Dining, Healthcare, Bars, Gym & Fitness. */
export default function LiveWellScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { scope, town } = useTownTheme();
  const category = LIVE_WELL_CATEGORIES.find((c) => c.slug === slug);
  const places = category ? liveWellPlaces(scope, category.slug) : [];

  if (!category) {
    return (
      <ScreenScaffold title="Live Well" subtitle="Daily Life">
        <EmptyState emoji="🍲" title="Category not found" />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold
      title={category.name}
      emoji={category.emoji}
      subtitle={`Live Well · ${scope === 'all' ? 'Elgin County' : town.name} · ${places.length} spots`}
    >
      {places.length === 0 ? (
        <EmptyState emoji={category.emoji} title="Nothing here yet" />
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
