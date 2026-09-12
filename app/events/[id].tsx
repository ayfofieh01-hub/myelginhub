import { CalendarDays, MapPin, Ticket } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { TOWNS } from '@/lib/data/towns';
import { eventWhen, isLive } from '@/lib/format';
import { useEvents } from '@/lib/store/useContentStore';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { palette } = useTownTheme();
  const events = useEvents();
  const item = events.find((e) => e.id === id);

  if (!item) {
    return (
      <ScreenScaffold title="Event" subtitle="Events">
        <EmptyState emoji="📅" title="That event is no longer listed" />
      </ScreenScaffold>
    );
  }

  const town = TOWNS[item.town];

  return (
    <ScreenScaffold title="Event" emoji={item.emoji} subtitle={town.name}>
      <Text className="text-foreground text-[22px] leading-7 font-bold">{item.title}</Text>
      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        {isLive(item) ? <Pill label="Happening now" color="#FDE7E7" textColor="#B91C1C" /> : null}
        <Pill
          label={town.shortName}
          emoji={town.emoji}
          color={town.palette.soft}
          textColor={town.palette.primaryDark}
        />
      </View>

      <View className="border-border bg-surface mt-4 gap-2.5 rounded-3xl border p-4">
        <View className="flex-row items-center">
          <CalendarDays size={15} color={palette.primary} />
          <Text className="text-foreground ml-2 flex-1 text-[13px]">{eventWhen(item)}</Text>
        </View>
        <View className="flex-row items-center">
          <MapPin size={15} color={palette.primary} />
          <Text className="text-foreground ml-2 flex-1 text-[13px]">{item.venue}</Text>
        </View>
        <View className="flex-row items-center">
          <Ticket size={15} color={palette.primary} />
          <Text className="text-foreground ml-2 flex-1 text-[13px]">{item.price}</Text>
        </View>
      </View>

      <Text className="text-foreground mt-4 text-[15px] leading-6 font-semibold">
        {item.summary}
      </Text>
      <Text className="text-muted mt-2 text-[14px] leading-6">{item.body}</Text>
    </ScreenScaffold>
  );
}
