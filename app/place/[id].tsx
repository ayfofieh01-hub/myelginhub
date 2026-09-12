import { Clock, Heart, MapPin, Phone, Star } from 'lucide-react-native';
import { Linking, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { placeById } from '@/lib/data/places';
import { TOWNS } from '@/lib/data/towns';
import { useAppStore, useIsSaved } from '@/lib/store/useAppStore';

export default function PlaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = placeById(id ?? '');
  const { palette } = useTownTheme();
  const saved = useIsSaved(id ?? '');
  const toggleSaved = useAppStore((s) => s.toggleSaved);

  if (!place) {
    return (
      <ScreenScaffold title="Place" subtitle="Directory">
        <EmptyState emoji="📍" title="We couldn’t find that place" />
      </ScreenScaffold>
    );
  }

  const town = TOWNS[place.town];

  return (
    <ScreenScaffold title={place.name} emoji="📍" subtitle={`${town.name} · ${place.address}`}>
      <View className="border-border bg-surface rounded-3xl border p-4">
        <View className="flex-row items-center justify-between">
          <View className="bg-default flex-row items-center rounded-full px-2.5 py-1">
            <Star size={13} color="#F59E0B" />
            <Text className="text-foreground ml-1 text-[12px] font-bold">
              {place.rating.toFixed(1)}
            </Text>
          </View>
          <Pressable
            onPress={() => toggleSaved(place.id)}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved' : 'Save this place'}
            className="flex-row items-center rounded-full px-3 py-1.5 active:opacity-70"
            style={{ backgroundColor: saved ? '#FDE7E7' : palette.soft }}
          >
            <Heart size={14} color={saved ? '#DC2626' : palette.primary} />
            <Text
              className="ml-1.5 text-[12px] font-semibold"
              style={{ color: saved ? '#DC2626' : palette.primaryDark }}
            >
              {saved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <Text className="text-foreground mt-3 text-[14px] leading-5">{place.blurb}</Text>

        <View className="mt-4 gap-2.5">
          <View className="flex-row items-center">
            <MapPin size={15} color={palette.primary} />
            <Text className="text-foreground ml-2 flex-1 text-[13px]">
              {place.address}, {town.name}, ON
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={15} color={palette.primary} />
            <Text className="text-foreground ml-2 flex-1 text-[13px]">{place.hours}</Text>
          </View>
          <View className="flex-row items-center">
            <Phone size={15} color={palette.primary} />
            <Text className="text-foreground ml-2 flex-1 text-[13px]">{place.phone}</Text>
          </View>
        </View>

        {place.tags.length > 0 ? (
          <View className="mt-4 flex-row flex-wrap gap-2">
            {place.tags.map((tag) => (
              <Pill key={tag} label={tag} color={palette.soft} textColor={palette.primaryDark} />
            ))}
          </View>
        ) : null}
      </View>

      <View className="mt-4 flex-row gap-3">
        <Pressable
          onPress={() => void Linking.openURL(`tel:${place.phone.replace(/[^\d+]/g, '')}`)}
          accessibilityRole="button"
          className="flex-1 items-center rounded-2xl py-3.5 active:opacity-85"
          style={{ backgroundColor: palette.primary }}
        >
          <Text className="text-[14px] font-bold text-white">Call</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            void Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address} ${town.name} Ontario`)}`,
            )
          }
          accessibilityRole="button"
          className="flex-1 items-center rounded-2xl border py-3.5 active:opacity-80"
          style={{ borderColor: palette.primary }}
        >
          <Text className="text-[14px] font-bold" style={{ color: palette.primary }}>
            Directions
          </Text>
        </Pressable>
      </View>

      <Text className="text-muted mt-4 text-[11px]">
        Listing details are community-maintained. Businesses can update theirs from the Post tab.
      </Text>
    </ScreenScaffold>
  );
}
