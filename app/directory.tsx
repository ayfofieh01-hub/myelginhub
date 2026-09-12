import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { PlaceRow } from '@/components/ContentCards';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { directorySections } from '@/lib/selectors';

/** Commerce · Local Business & Trade Directory, grouped by trade. */
export default function DirectoryScreen() {
  const { scope, town, palette } = useTownTheme();
  const sections = useMemo(() => directorySections(scope), [scope]);
  const [trade, setTrade] = useState<string>('all');

  const visible = trade === 'all' ? sections : sections.filter((s) => s.trade === trade);
  const total = sections.reduce((sum, s) => sum + s.places.length, 0);

  return (
    <ScreenScaffold
      title="Business & Trade Directory"
      emoji="🏪"
      subtitle={`${scope === 'all' ? 'Elgin County' : town.name} · ${total} businesses across ${sections.length} trades`}
    >
      <View className="mb-4 flex-row flex-wrap gap-2">
        <Chip
          label="All trades"
          active={trade === 'all'}
          onPress={() => setTrade('all')}
          palette={palette}
        />
        {sections.map((section) => (
          <Chip
            key={section.trade}
            label={section.trade}
            active={trade === section.trade}
            onPress={() => setTrade(section.trade)}
            palette={palette}
          />
        ))}
      </View>

      {visible.length === 0 ? (
        <EmptyState emoji="🏪" title="No businesses listed yet" />
      ) : (
        <View className="gap-5">
          {visible.map((section) => (
            <View key={section.trade}>
              <Text
                className="mb-2 text-[13px] font-bold tracking-wider uppercase"
                style={{ color: palette.primary }}
              >
                {section.trade}
              </Text>
              <View className="gap-3">
                {section.places.map((place) => (
                  <PlaceRow key={place.id} place={place} showTown={scope === 'all'} />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScreenScaffold>
  );
}

function Chip({
  label,
  active,
  onPress,
  palette,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  palette: { primary: string; primaryDark: string; soft: string };
}) {
  return (
    <Pressable
      onPress={onPress}
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
        {label}
      </Text>
    </Pressable>
  );
}
