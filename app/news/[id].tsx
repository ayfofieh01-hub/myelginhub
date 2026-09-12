import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { TOWNS } from '@/lib/data/towns';
import { dayLabel, timeLabel } from '@/lib/format';
import { useNews } from '@/lib/store/useContentStore';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const news = useNews();
  const item = news.find((n) => n.id === id);

  if (!item) {
    return (
      <ScreenScaffold title="Story" subtitle="News">
        <EmptyState emoji="📰" title="That story is no longer available" />
      </ScreenScaffold>
    );
  }

  const town = TOWNS[item.town];

  return (
    <ScreenScaffold title={item.emoji ? `${item.emoji} News` : 'News'} subtitle={item.source}>
      <Text className="text-foreground text-[22px] leading-7 font-bold">{item.title}</Text>
      <View className="mt-3 flex-row items-center gap-2">
        <Pill
          label={town.shortName}
          emoji={town.emoji}
          color={town.palette.soft}
          textColor={town.palette.primaryDark}
        />
        <Text className="text-muted text-[12px]">
          {dayLabel(item.publishedAt)} · {timeLabel(item.publishedAt)}
        </Text>
      </View>
      <Text className="text-foreground mt-4 text-[15px] leading-6 font-semibold">
        {item.summary}
      </Text>
      <Text className="text-muted mt-3 text-[14px] leading-6">{item.body}</Text>
      <Text className="text-muted mt-6 text-[11px]">Source: {item.source}</Text>
    </ScreenScaffold>
  );
}
