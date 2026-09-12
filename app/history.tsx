import { Text, View } from 'react-native';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { TOWN_HISTORY } from '@/lib/data/guides';

/** Heritage & Culture · <Town> History timeline. */
export default function HistoryScreen() {
  const { scope, town, palette } = useTownTheme();
  const sections = TOWN_HISTORY[scope];
  const place = scope === 'all' ? 'Elgin County' : town.name;

  return (
    <ScreenScaffold
      title={`${place} History`}
      emoji="🏛️"
      subtitle="Discover & Connect · Heritage & Culture"
    >
      <Text className="text-muted mb-5 text-[14px] leading-5">{town.blurb}</Text>
      <View>
        {sections.map((section, index) => (
          <View key={section.year} className="flex-row">
            <View className="w-16 items-center">
              <View
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.primary }}
              >
                <Text className="text-[10px] font-bold text-white">{section.year}</Text>
              </View>
              {index < sections.length - 1 ? (
                <View className="my-1 w-0.5 flex-1" style={{ backgroundColor: palette.soft }} />
              ) : null}
            </View>
            <View className="flex-1 pb-6">
              <Text className="text-foreground text-[16px] font-bold">{section.title}</Text>
              <Text className="text-muted mt-1 text-[13px] leading-5">{section.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenScaffold>
  );
}
