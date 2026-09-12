import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/ContentCards';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { routes } from '@/lib/routes';
import { inTownScope } from '@/lib/selectors';
import { useJobs } from '@/lib/store/useContentStore';
import type { Job } from '@/lib/types';

const FILTERS: (Job['type'] | 'All')[] = [
  'All',
  'Full-time',
  'Part-time',
  'Seasonal',
  'Contract',
  'Casual',
];

/** Commerce · Jobs & Employment board. */
export default function JobsScreen() {
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const jobs = useJobs();
  const [filter, setFilter] = useState<Job['type'] | 'All'>('All');

  const scoped = useMemo(() => inTownScope(jobs, scope), [jobs, scope]);
  const visible = useMemo(
    () => (filter === 'All' ? scoped : scoped.filter((job) => job.type === filter)),
    [scoped, filter],
  );

  return (
    <ScreenScaffold
      title="Jobs & Employment"
      emoji="💼"
      subtitle={`${scoped.length} openings in ${scope === 'all' ? 'Elgin County' : town.name}`}
    >
      <View className="mb-4 flex-row flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = filter === option;
          return (
            <Pressable
              key={option}
              onPress={() => setFilter(option)}
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
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {visible.length === 0 ? (
        <EmptyState
          emoji="💼"
          title="No openings match that"
          body="Employers can post a role from the Post tab."
        />
      ) : (
        <View className="gap-3">
          {visible.map((job) => (
            <JobCard key={job.id} item={job} showTown={scope === 'all'} />
          ))}
        </View>
      )}

      <Pressable
        onPress={() => router.push(routes.post)}
        accessibilityRole="button"
        className="mt-5 items-center rounded-2xl py-3.5 active:opacity-85"
        style={{ backgroundColor: palette.primary }}
      >
        <Text className="text-[14px] font-bold text-white">Post a job opening</Text>
      </Pressable>
    </ScreenScaffold>
  );
}
