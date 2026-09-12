import { useMemo } from 'react';
import { View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { NewsCard } from '@/components/ContentCards';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { inTownScope } from '@/lib/selectors';
import { useNews } from '@/lib/store/useContentStore';

export default function NewsListScreen() {
  const { scope, town } = useTownTheme();
  const news = useNews();
  const scoped = useMemo(() => inTownScope(news, scope), [news, scope]);

  return (
    <ScreenScaffold
      title={scope === 'all' ? 'Elgin County News' : `${town.name} News`}
      emoji="📰"
      subtitle={`${scoped.length} stories from the community`}
    >
      {scoped.length === 0 ? (
        <EmptyState emoji="📰" title="No stories yet" body="Share an update from the Post tab." />
      ) : (
        <View className="gap-3">
          {scoped.map((item) => (
            <NewsCard key={item.id} item={item} showTown={scope === 'all'} />
          ))}
        </View>
      )}
    </ScreenScaffold>
  );
}
