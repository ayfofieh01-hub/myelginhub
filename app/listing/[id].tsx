import { MessageCircle, Trash2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { TOWNS } from '@/lib/data/towns';
import { dayLabel, timeLabel } from '@/lib/format';
import { routes } from '@/lib/routes';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useChatStore } from '@/lib/store/useChatStore';
import { useContentStore, useListings } from '@/lib/store/useContentStore';

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { palette } = useTownTheme();
  const listings = useListings();
  const user = useAuthStore((s) => s.user);
  const openThread = useChatStore((s) => s.openThread);
  const removeListing = useContentStore((s) => s.removeListing);
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <ScreenScaffold title="Listing" subtitle="Marketplace">
        <EmptyState emoji="🛒" title="This listing is no longer available" />
      </ScreenScaffold>
    );
  }

  const town = TOWNS[listing.town];
  const isMine = user?.id === listing.sellerId;

  const message = () => {
    if (!user) return;
    const threadId = openThread(listing, user);
    router.push(routes.thread(threadId));
  };

  return (
    <ScreenScaffold
      title={listing.kind === 'goods' ? 'Item for sale' : 'Service offered'}
      emoji={listing.emoji}
      subtitle={town.name}
    >
      <View className="border-border bg-surface rounded-3xl border p-4">
        <View className="flex-row items-start justify-between">
          <Text className="text-foreground flex-1 pr-3 text-[20px] leading-7 font-bold">
            {listing.title}
          </Text>
          <Text className="text-[20px] font-bold" style={{ color: '#548235' }}>
            {listing.price}
          </Text>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          <Pill label={listing.category} color={palette.soft} textColor={palette.primaryDark} />
          {listing.condition ? (
            <Pill label={listing.condition} color="#F3F4F6" textColor="#374151" />
          ) : null}
          <Pill
            label={town.shortName}
            emoji={town.emoji}
            color={town.palette.soft}
            textColor={town.palette.primaryDark}
          />
        </View>

        <Text className="text-foreground mt-4 text-[14px] leading-6">{listing.description}</Text>

        <View className="border-border mt-4 flex-row items-center border-t pt-4">
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.soft }}
          >
            <Text className="text-[13px] font-bold" style={{ color: palette.primaryDark }}>
              {listing.sellerName.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-foreground text-[13px] font-bold">{listing.sellerName}</Text>
            <Text className="text-muted text-[11px]">
              Posted {dayLabel(listing.postedAt)} at {timeLabel(listing.postedAt)}
            </Text>
          </View>
        </View>
      </View>

      {isMine ? (
        <View className="mt-4 gap-3">
          <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: palette.soft }}>
            <Text className="text-[12px] font-semibold" style={{ color: palette.primaryDark }}>
              This is your listing. Buyers who message you show up in your inbox.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push(routes.inbox)}
            accessibilityRole="button"
            className="items-center rounded-2xl py-3.5 active:opacity-85"
            style={{ backgroundColor: palette.primary }}
          >
            <Text className="text-[14px] font-bold text-white">Open inbox</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              removeListing(listing.id);
              router.replace(routes.marketplace);
            }}
            accessibilityRole="button"
            className="border-border flex-row items-center justify-center rounded-2xl border py-3.5 active:opacity-80"
          >
            <Trash2 size={15} color="#B91C1C" />
            <Text className="ml-2 text-[14px] font-bold" style={{ color: '#B91C1C' }}>
              Remove listing
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={message}
          accessibilityRole="button"
          className="mt-4 flex-row items-center justify-center rounded-2xl py-4 active:opacity-85"
          style={{ backgroundColor: palette.primary }}
        >
          <MessageCircle size={17} color="#FFFFFF" />
          <Text className="ml-2 text-[15px] font-bold text-white">
            Message {listing.sellerName.split(' ')[0]}
          </Text>
        </Pressable>
      )}

      <Text className="text-muted mt-4 text-[11px] leading-4">
        Meet in a public place, inspect before you pay, and keep the conversation in the app.
      </Text>
    </ScreenScaffold>
  );
}
