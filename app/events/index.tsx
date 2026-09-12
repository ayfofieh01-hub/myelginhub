import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { EventCard } from '@/components/ContentCards';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { inTownScope } from '@/lib/selectors';
import { useEvents } from '@/lib/store/useContentStore';

export default function EventsListScreen() {
  const { scope, town } = useTownTheme();
  const events = useEvents();
  const scoped = useMemo(() => inTownScope(events, scope), [events, scope]);
  const [now] = useState(() => Date.now());
  const { upcoming, past } = useMemo(() => {
    return {
      upcoming: scoped.filter((e) => new Date(e.startsAt).getTime() >= now),
      past: scoped.filter((e) => new Date(e.startsAt).getTime() < now),
    };
  }, [scoped, now]);

  return (
    <ScreenScaffold
      title="Events"
      emoji="📅"
      subtitle={`${upcoming.length} upcoming in ${scope === 'all' ? 'Elgin County' : town.name}`}
    >
      {upcoming.length === 0 ? (
        <EmptyState
          emoji="📅"
          title="Nothing on the calendar"
          body="Add an event from the Post tab."
        />
      ) : (
        <View className="gap-3">
          {upcoming.map((item) => (
            <EventCard key={item.id} item={item} showTown={scope === 'all'} />
          ))}
        </View>
      )}

      {past.length > 0 ? (
        <View className="mt-6">
          <Text className="text-muted mb-2 text-[12px] font-bold tracking-wider uppercase">
            Just happened
          </Text>
          <View className="gap-3 opacity-60">
            {past.slice(-3).map((item) => (
              <EventCard key={item.id} item={item} showTown={scope === 'all'} />
            ))}
          </View>
        </View>
      ) : null}
    </ScreenScaffold>
  );
}
