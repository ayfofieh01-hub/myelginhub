import { Bell, CheckCheck, Trash2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { TOWNS } from '@/lib/data/towns';
import { timeAgo } from '@/lib/format';
import { routes } from '@/lib/routes';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

const KIND_HREF = {
  deal: routes.deals,
  message: routes.inbox,
  news: routes.news,
  event: routes.events,
  job: routes.jobs,
} as const;

export default function NotificationsScreen() {
  const router = useRouter();
  const { palette } = useTownTheme();
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const clear = useNotificationStore((s) => s.clear);

  return (
    <ScreenScaffold
      title="Notifications"
      emoji="🔔"
      subtitle="Deals, messages and community updates"
      headerAccessory={
        items.length > 0 ? (
          <View className="flex-row gap-2">
            <Pressable
              onPress={markAllRead}
              accessibilityRole="button"
              className="flex-1 flex-row items-center justify-center rounded-2xl bg-white/15 py-2.5 active:opacity-80"
            >
              <CheckCheck size={15} color="#FFFFFF" />
              <Text className="ml-2 text-[12px] font-bold text-white">Mark all read</Text>
            </Pressable>
            <Pressable
              onPress={clear}
              accessibilityRole="button"
              className="flex-row items-center justify-center rounded-2xl bg-white/15 px-4 py-2.5 active:opacity-80"
            >
              <Trash2 size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          emoji="🔔"
          title="No notifications yet"
          body="Hot Community Deals, marketplace replies and community updates land here."
        />
      ) : (
        <View className="gap-3">
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                markRead(item.id);
                router.push(KIND_HREF[item.kind]);
              }}
              accessibilityRole="button"
              className="bg-surface flex-row rounded-3xl border p-4 active:opacity-80"
              style={{ borderColor: item.read ? '#E5E7EB' : palette.primary }}
            >
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-2xl"
                style={{ backgroundColor: item.read ? '#F3F4F6' : palette.soft }}
              >
                <Bell size={17} color={item.read ? '#9CA3AF' : palette.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-[14px] font-bold" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-muted mt-0.5 text-[12px] leading-4" numberOfLines={2}>
                  {item.body}
                </Text>
                <Text className="text-muted mt-1 text-[11px]">
                  {TOWNS[item.town].shortName} · {timeAgo(item.createdAt)}
                </Text>
              </View>
              {!item.read ? (
                <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#FFC000' }} />
              ) : null}
            </Pressable>
          ))}
        </View>
      )}
    </ScreenScaffold>
  );
}
