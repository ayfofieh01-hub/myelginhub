import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { timeAgo } from '@/lib/format';
import { routes } from '@/lib/routes';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { threadPreview, useChatStore, useSortedThreads } from '@/lib/store/useChatStore';

/** Marketplace inbox: every buyer↔seller conversation on this device. */
export default function InboxScreen() {
  const router = useRouter();
  const { palette } = useTownTheme();
  const threads = useSortedThreads();
  const messages = useChatStore((s) => s.messages);
  const lastReadAt = useChatStore((s) => s.lastReadAt);
  const user = useAuthStore((s) => s.user);

  return (
    <ScreenScaffold
      title="Marketplace inbox"
      emoji="💬"
      subtitle="Messages about items and services"
    >
      {threads.length === 0 ? (
        <EmptyState
          emoji="💬"
          title="No conversations yet"
          body="Open a listing and tap Message to start talking to the seller."
        />
      ) : (
        <View className="gap-3">
          {threads.map((thread) => {
            const preview = threadPreview(messages, thread.id);
            const read = lastReadAt[thread.id] ? new Date(lastReadAt[thread.id]).getTime() : 0;
            const unread = messages.some(
              (m) =>
                m.threadId === thread.id &&
                m.senderId !== user?.id &&
                new Date(m.sentAt).getTime() > read,
            );
            const counterpart = user?.id === thread.sellerId ? thread.buyerName : thread.sellerName;
            return (
              <Pressable
                key={thread.id}
                onPress={() => router.push(routes.thread(thread.id))}
                accessibilityRole="button"
                className="bg-surface flex-row rounded-3xl border p-4 active:opacity-80"
                style={{ borderColor: unread ? palette.primary : '#E5E7EB' }}
              >
                <View
                  className="mr-3 h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: palette.soft }}
                >
                  <Text className="text-lg">{thread.listingEmoji}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-foreground flex-1 pr-2 text-[14px] font-bold"
                      numberOfLines={1}
                    >
                      {counterpart}
                    </Text>
                    <Text className="text-muted text-[11px]">
                      {preview ? timeAgo(preview.sentAt) : timeAgo(thread.updatedAt)}
                    </Text>
                  </View>
                  <Text className="text-muted text-[12px] font-semibold" numberOfLines={1}>
                    {thread.listingTitle}
                  </Text>
                  <Text className="text-muted mt-0.5 text-[12px]" numberOfLines={1}>
                    {preview ? preview.text : 'No messages yet — say hello.'}
                  </Text>
                </View>
                {unread ? (
                  <View
                    className="ml-2 h-2.5 w-2.5 self-center rounded-full"
                    style={{ backgroundColor: '#FFC000' }}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </ScreenScaffold>
  );
}
