import { Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { dayLabel, timeLabel } from '@/lib/format';
import { routes } from '@/lib/routes';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useChatStore, useThreadMessages } from '@/lib/store/useChatStore';

export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { palette } = useTownTheme();
  const threadId = id ?? '';
  const thread = useChatStore((s) => s.threads.find((t) => t.id === threadId));
  const sendMessage = useChatStore((s) => s.sendMessage);
  const markRead = useChatStore((s) => s.markRead);
  const user = useAuthStore((s) => s.user);
  const messages = useThreadMessages(threadId);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (thread) markRead(threadId);
  }, [thread, threadId, markRead]);

  if (!thread) {
    return (
      <ScreenScaffold title="Conversation" subtitle="Marketplace">
        <EmptyState emoji="💬" title="This conversation is gone" />
      </ScreenScaffold>
    );
  }

  const counterpart = user?.id === thread.sellerId ? thread.buyerName : thread.sellerName;

  const send = () => {
    if (!draft.trim() || !user) return;
    sendMessage(threadId, user.id, draft);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <ScreenScaffold
      title={counterpart}
      emoji={thread.listingEmoji}
      subtitle={thread.listingTitle}
      scroll={false}
      headerAccessory={
        <Pressable
          onPress={() => router.push(routes.listing(thread.listingId))}
          accessibilityRole="button"
          className="flex-row items-center rounded-2xl bg-white/15 px-3 py-2.5 active:opacity-80"
        >
          <Text className="mr-2 text-base">{thread.listingEmoji}</Text>
          <Text className="flex-1 text-[12px] font-semibold text-white" numberOfLines={1}>
            View listing: {thread.listingTitle}
          </Text>
        </Pressable>
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View className="border-border bg-surface rounded-3xl border p-4">
              <Text className="text-foreground text-[13px] font-semibold">
                Say hello to {counterpart.split(' ')[0]}
              </Text>
              <Text className="text-muted mt-1 text-[12px]">
                Ask if it is still available, agree on a time, and arrange a public meeting spot.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const mine = item.senderId === user?.id;
            return (
              <View className={mine ? 'items-end' : 'items-start'}>
                <View
                  className="max-w-[80%] rounded-2xl px-3.5 py-2.5"
                  style={{ backgroundColor: mine ? palette.primary : '#F1F3F7' }}
                >
                  <Text
                    className="text-[14px] leading-5"
                    style={{ color: mine ? '#FFFFFF' : '#111827' }}
                  >
                    {item.text}
                  </Text>
                </View>
                <Text className="text-muted mt-1 text-[10px]">
                  {dayLabel(item.sentAt)} · {timeLabel(item.sentAt)}
                </Text>
              </View>
            );
          }}
        />

        <View className="border-border flex-row items-end gap-2 border-t px-4 py-3 pb-6">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={`Message ${counterpart.split(' ')[0]}…`}
            placeholderTextColor="#9CA3AF"
            multiline
            accessibilityLabel="Message text"
            className="border-border bg-surface text-foreground max-h-24 min-h-11 flex-1 rounded-2xl border px-3 py-2.5 text-[14px]"
          />
          <Pressable
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            className="h-11 w-11 items-center justify-center rounded-full active:opacity-80"
            style={{ backgroundColor: draft.trim() ? palette.primary : '#D1D5DB' }}
          >
            <Send size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenScaffold>
  );
}
