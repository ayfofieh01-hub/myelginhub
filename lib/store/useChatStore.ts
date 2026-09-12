import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ChatThread, Listing, User } from '@/lib/types';
import { asyncStorage } from './storage';

/** Canned seller replies so the demo conversation goes both ways. */
const SELLER_REPLIES = [
  'Hi! Yes, it is still available. When were you thinking of coming by?',
  'That works for me. I am usually around after 5pm on weekdays.',
  'Sounds good — I will hold it for you. Text when you are on the way.',
];

type ChatState = {
  threads: ChatThread[];
  messages: ChatMessage[];
  lastReadAt: Record<string, string>;
  hydrated: boolean;
  setHydrated: () => void;
  openThread: (listing: Listing, me: User) => string;
  sendMessage: (threadId: string, senderId: string, text: string) => void;
  markRead: (threadId: string) => void;
};

function nowIso() {
  return new Date().toISOString();
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threads: [],
      messages: [],
      lastReadAt: {},
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      openThread: (listing, me) => {
        const existing = get().threads.find(
          (t) => t.listingId === listing.id && t.buyerId === me.id,
        );
        if (existing) return existing.id;
        const id = `t-${listing.id}-${me.id}`;
        const thread: ChatThread = {
          id,
          listingId: listing.id,
          listingTitle: listing.title,
          listingEmoji: listing.emoji,
          buyerId: me.id,
          buyerName: me.name,
          sellerId: listing.sellerId,
          sellerName: listing.sellerName,
          updatedAt: nowIso(),
        };
        set((s) => ({ threads: [thread, ...s.threads] }));
        return id;
      },
      sendMessage: (threadId, senderId, text) => {
        const body = text.trim();
        if (!body) return;
        const message: ChatMessage = {
          id: `m-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          threadId,
          senderId,
          text: body,
          sentAt: nowIso(),
        };
        set((s) => ({
          messages: [...s.messages, message],
          threads: s.threads.map((t) =>
            t.id === threadId ? { ...t, updatedAt: message.sentAt } : t,
          ),
          lastReadAt: { ...s.lastReadAt, [threadId]: message.sentAt },
        }));

        const thread = get().threads.find((t) => t.id === threadId);
        if (!thread || senderId !== thread.buyerId) return;
        // Seeded sellers answer so the buyer↔seller thread is demonstrably two-way.
        if (!thread.sellerId.startsWith('seed-')) return;
        const replyIndex = get().messages.filter(
          (m) => m.threadId === threadId && m.senderId === thread.sellerId,
        ).length;
        if (replyIndex >= SELLER_REPLIES.length) return;
        setTimeout(() => {
          const reply: ChatMessage = {
            id: `m-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
            threadId,
            senderId: thread.sellerId,
            text: SELLER_REPLIES[replyIndex],
            sentAt: nowIso(),
          };
          set((s) => ({
            messages: [...s.messages, reply],
            threads: s.threads.map((t) =>
              t.id === threadId ? { ...t, updatedAt: reply.sentAt } : t,
            ),
          }));
        }, 1400);
      },
      markRead: (threadId) =>
        set((s) => ({ lastReadAt: { ...s.lastReadAt, [threadId]: nowIso() } })),
    }),
    {
      name: 'myelginhub.chat',
      storage: asyncStorage,
      partialize: (state) => ({
        threads: state.threads,
        messages: state.messages,
        lastReadAt: state.lastReadAt,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export function useThreadMessages(threadId: string): ChatMessage[] {
  const messages = useChatStore((s) => s.messages);
  return useMemo(() => messages.filter((m) => m.threadId === threadId), [messages, threadId]);
}

export function useSortedThreads(): ChatThread[] {
  const threads = useChatStore((s) => s.threads);
  return useMemo(
    () =>
      [...threads].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [threads],
  );
}

export function useUnreadThreadCount(myId: string | undefined): number {
  const threads = useChatStore((s) => s.threads);
  const messages = useChatStore((s) => s.messages);
  const lastReadAt = useChatStore((s) => s.lastReadAt);
  return useMemo(() => {
    if (!myId) return 0;
    return threads.filter((thread) => {
      const read = lastReadAt[thread.id] ? new Date(lastReadAt[thread.id]).getTime() : 0;
      return messages.some(
        (m) =>
          m.threadId === thread.id && m.senderId !== myId && new Date(m.sentAt).getTime() > read,
      );
    }).length;
  }, [threads, messages, lastReadAt, myId]);
}

export function threadPreview(messages: ChatMessage[], threadId: string): ChatMessage | undefined {
  let latest: ChatMessage | undefined;
  for (const m of messages) {
    if (m.threadId !== threadId) continue;
    if (!latest || new Date(m.sentAt).getTime() >= new Date(latest.sentAt).getTime()) latest = m;
  }
  return latest;
}
