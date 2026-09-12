import {
  Bell,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { TOWNS } from '@/lib/data/towns';
import { cancelDailyDealDigest, scheduleDailyDealDigest } from '@/lib/notifications';
import { routes } from '@/lib/routes';
import { useAppStore } from '@/lib/store/useAppStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useContentStore } from '@/lib/store/useContentStore';
import { useSortedThreads } from '@/lib/store/useChatStore';
import { useUnreadNotificationCount } from '@/lib/store/useNotificationStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const dealAlerts = useAppStore((s) => s.dealAlerts);
  const setDealAlerts = useAppStore((s) => s.setDealAlerts);
  const eventAlerts = useAppStore((s) => s.eventAlerts);
  const setEventAlerts = useAppStore((s) => s.setEventAlerts);
  const requireWelcome = useAppStore((s) => s.requireWelcome);
  const savedIds = useAppStore((s) => s.savedIds);

  const userListings = useContentStore((s) => s.userListings);
  const userDeals = useContentStore((s) => s.userDeals);
  const userEvents = useContentStore((s) => s.userEvents);
  const userNews = useContentStore((s) => s.userNews);
  const userJobs = useContentStore((s) => s.userJobs);
  const threads = useSortedThreads();
  const unread = useUnreadNotificationCount();

  const postCount =
    userListings.length + userDeals.length + userEvents.length + userNews.length + userJobs.length;

  const onToggleDeals = (value: boolean) => {
    setDealAlerts(value);
    if (value) void scheduleDailyDealDigest(9);
    else void cancelDailyDealDigest();
  };

  return (
    <View className="bg-background flex-1">
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="light" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient
          colors={palette.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + 12 }}
          className="rounded-b-3xl px-5 pb-6"
        >
          <View className="flex-row items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-white/25">
              <Text className="text-[20px] font-bold text-white">{user?.initials ?? '👤'}</Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-[20px] font-bold text-white">{user?.name ?? 'Guest'}</Text>
              <Text className="text-[12px] text-white/80">{user?.email ?? ''}</Text>
              <View className="mt-1 self-start rounded-full bg-white/20 px-2 py-0.5">
                <Text className="text-[10px] font-bold text-white uppercase">
                  {user?.provider === 'apple' ? 'Apple ID' : 'Google account'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View className="px-5 pt-5">
          <Text className="text-muted mb-2 text-[12px] font-bold tracking-wider uppercase">
            Your community
          </Text>
          <View className="border-border bg-surface rounded-3xl border p-4">
            <View className="flex-row items-center">
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: palette.soft }}
              >
                <Text className="text-lg">{town.emoji}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-foreground text-[15px] font-bold">{TOWNS[scope].name}</Text>
                <Text className="text-muted text-[12px]">{TOWNS[scope].tagline}</Text>
              </View>
              <MapPin size={16} color={palette.primary} />
            </View>
            <Pressable
              onPress={requireWelcome}
              accessibilityRole="button"
              className="mt-3 items-center rounded-2xl py-3 active:opacity-80"
              style={{ backgroundColor: palette.soft }}
            >
              <Text className="text-[13px] font-bold" style={{ color: palette.primaryDark }}>
                Change community
              </Text>
            </Pressable>
          </View>

          <Text className="text-muted mt-6 mb-2 text-[12px] font-bold tracking-wider uppercase">
            Your activity
          </Text>
          <View className="border-border bg-surface overflow-hidden rounded-3xl border">
            <Row
              icon={Package}
              label="Your posts"
              value={`${postCount}`}
              href={routes.marketplace}
              color={palette.primary}
            />
            <Row
              icon={MessageCircle}
              label="Marketplace inbox"
              value={`${threads.length}`}
              href={routes.inbox}
              color={palette.primary}
            />
            <Row
              icon={Bell}
              label="Notifications"
              value={unread > 0 ? `${unread} new` : 'All read'}
              href={routes.notifications}
              color={palette.primary}
            />
            <Row
              icon={Heart}
              label="Saved places"
              value={`${savedIds.length}`}
              href={routes.explore}
              color={palette.primary}
              last
            />
          </View>

          <Text className="text-muted mt-6 mb-2 text-[12px] font-bold tracking-wider uppercase">
            Notifications
          </Text>
          <View className="border-border bg-surface rounded-3xl border">
            <ToggleRow
              title="Hot Community Deals"
              body="Daily push when businesses post new deals."
              value={dealAlerts}
              onValueChange={onToggleDeals}
              color={palette.primary}
            />
            <View className="bg-border h-px" />
            <ToggleRow
              title="Events & news"
              body="A nudge when something is happening in town."
              value={eventAlerts}
              onValueChange={setEventAlerts}
              color={palette.primary}
            />
          </View>

          <Text className="text-muted mt-6 mb-2 text-[12px] font-bold tracking-wider uppercase">
            Weekly newsletter
          </Text>
          <NewsletterSignup compact />

          <Pressable
            onPress={() => {
              signOut();
              router.replace(routes.login);
            }}
            accessibilityRole="button"
            className="border-border mt-6 flex-row items-center justify-center rounded-2xl border py-3.5 active:opacity-80"
          >
            <LogOut size={16} color="#B91C1C" />
            <Text className="ml-2 text-[14px] font-bold" style={{ color: '#B91C1C' }}>
              Sign out
            </Text>
          </Pressable>

          <Text className="text-muted mt-5 text-center text-[11px]">
            MyElginHub preview · accounts, posts and chats are stored on this device.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  href,
  color,
  last = false,
}: {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  href: Href;
  color: string;
  last?: boolean;
}) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`flex-row items-center px-4 py-3.5 active:opacity-70 ${last ? '' : 'border-border border-b'}`}
    >
      <Icon size={17} color={color} />
      <Text className="text-foreground ml-3 flex-1 text-[14px] font-semibold">{label}</Text>
      <Text className="text-muted mr-1 text-[12px]">{value}</Text>
      <ChevronRight size={16} color="#9CA3AF" />
    </Pressable>
  );
}

function ToggleRow({
  title,
  body,
  value,
  onValueChange,
  color,
}: {
  title: string;
  body: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  color: string;
}) {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View className="flex-1 pr-3">
        <Text className="text-foreground text-[14px] font-semibold">{title}</Text>
        <Text className="text-muted mt-0.5 text-[11px]">{body}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: color, false: '#D1D5DB' }}
        thumbColor="#FFFFFF"
        accessibilityLabel={title}
      />
    </View>
  );
}
