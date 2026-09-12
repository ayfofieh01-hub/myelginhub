import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { MARKETPLACE_CATEGORIES } from '@/lib/data/listings';
import { TOWNS, TOWN_IDS } from '@/lib/data/towns';
import { pushDealNotification } from '@/lib/notifications';
import { routes } from '@/lib/routes';
import { useAppStore } from '@/lib/store/useAppStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useContentStore } from '@/lib/store/useContentStore';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import { makeId } from '@/lib/store/storage';
import type { Deal, EventItem, Job, Listing, NewsItem, TownId } from '@/lib/types';

type PostType = 'listing' | 'deal' | 'event' | 'news' | 'job';

const POST_TYPES: { type: PostType; label: string; emoji: string; blurb: string }[] = [
  { type: 'listing', label: 'Marketplace', emoji: '🛒', blurb: 'Sell an item or offer a service' },
  { type: 'deal', label: 'Hot Deal', emoji: '🔥', blurb: 'Promote a deal — neighbours get pushed' },
  { type: 'event', label: 'Event', emoji: '📅', blurb: 'Add something happening in town' },
  { type: 'news', label: 'News', emoji: '📰', blurb: 'Share a community update' },
  { type: 'job', label: 'Job', emoji: '💼', blurb: 'Post an opening for local workers' },
];

const JOB_TYPES: Job['type'][] = ['Full-time', 'Part-time', 'Contract', 'Seasonal', 'Casual'];
const DEAL_WINDOWS = [
  { label: '24 hours', days: 1 },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
];
const EVENT_WHEN = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'This weekend', days: 3 },
  { label: 'Next week', days: 7 },
];

function inDays(days: number, hour = 18): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export default function PostScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scope, palette } = useTownTheme();
  const user = useAuthStore((s) => s.user);
  const dealAlerts = useAppStore((s) => s.dealAlerts);
  const notify = useNotificationStore((s) => s.push);
  const addListing = useContentStore((s) => s.addListing);
  const addDeal = useContentStore((s) => s.addDeal);
  const addEvent = useContentStore((s) => s.addEvent);
  const addNews = useContentStore((s) => s.addNews);
  const addJob = useContentStore((s) => s.addJob);

  const [type, setType] = useState<PostType>('listing');
  const [town, setTown] = useState<TownId>(scope === 'all' ? 'st-thomas' : scope);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [price, setPrice] = useState('');
  const [org, setOrg] = useState('');
  const [category, setCategory] = useState<string>(MARKETPLACE_CATEGORIES[0]);
  const [kind, setKind] = useState<'goods' | 'services'>('goods');
  const [jobType, setJobType] = useState<Job['type']>('Full-time');
  const [windowDays, setWindowDays] = useState(3);
  const [whenDays, setWhenDays] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState<string | null>(null);

  const reset = () => {
    setTitle('');
    setDetail('');
    setPrice('');
    setOrg('');
    setError(null);
  };

  const submit = () => {
    if (!title.trim()) {
      setError('Give your post a title.');
      return;
    }
    if (!detail.trim()) {
      setError('Add a few details so people know what this is.');
      return;
    }
    setError(null);

    if (type === 'listing') {
      const listing: Listing = {
        id: makeId('l'),
        town,
        kind,
        title: title.trim(),
        price: price.trim() || (kind === 'goods' ? 'Make an offer' : 'Contact for quote'),
        category,
        description: detail.trim(),
        condition: kind === 'goods' ? 'Used — good' : undefined,
        sellerId: user?.id ?? 'me',
        sellerName: user?.name ?? 'You',
        postedAt: new Date().toISOString(),
        emoji: kind === 'goods' ? '📦' : '🧰',
      };
      addListing(listing);
      setPosted('Listing published to the Marketplace.');
      reset();
      router.push(routes.listing(listing.id));
      return;
    }

    if (type === 'deal') {
      if (!org.trim()) {
        setError('Add the business name running the deal.');
        return;
      }
      const deal: Deal = {
        id: makeId('d'),
        town,
        business: org.trim(),
        title: title.trim(),
        detail: detail.trim(),
        discount: price.trim() || 'Special',
        expiresAt: inDays(windowDays, 21),
        emoji: '🔥',
        authorId: user?.id,
      };
      addDeal(deal);
      notify({
        kind: 'deal',
        title: `🔥 Hot Deal: ${deal.business}`,
        body: `${deal.title} — ${deal.discount}`,
        town,
      });
      if (dealAlerts) void pushDealNotification(deal);
      setPosted('Deal is live. Neighbours with deal alerts on get a push.');
      reset();
      router.push(routes.deals);
      return;
    }

    if (type === 'event') {
      const event: EventItem = {
        id: makeId('e'),
        town,
        title: title.trim(),
        summary: detail.trim().slice(0, 120),
        body: detail.trim(),
        venue: org.trim() || 'To be announced',
        startsAt: inDays(whenDays),
        price: price.trim() || 'Free',
        emoji: '📅',
        authorId: user?.id,
      };
      addEvent(event);
      setPosted('Event added to the community calendar.');
      reset();
      router.push(routes.event(event.id));
      return;
    }

    if (type === 'news') {
      const item: NewsItem = {
        id: makeId('n'),
        town,
        title: title.trim(),
        summary: detail.trim().slice(0, 140),
        body: detail.trim(),
        source: org.trim() || (user?.name ?? 'Community member'),
        publishedAt: new Date().toISOString(),
        emoji: '📰',
        authorId: user?.id,
      };
      addNews(item);
      setPosted('Update published to the newsroom.');
      reset();
      router.push(routes.newsItem(item.id));
      return;
    }

    const job: Job = {
      id: makeId('j'),
      town,
      title: title.trim(),
      employer: org.trim() || (user?.name ?? 'Local employer'),
      type: jobType,
      pay: price.trim() || 'Pay discussed at interview',
      summary: detail.trim(),
      postedAt: new Date().toISOString(),
      emoji: '💼',
      authorId: user?.id,
    };
    addJob(job);
    setPosted('Job posted to the employment board.');
    reset();
    router.push(routes.jobs);
  };

  const activeType = POST_TYPES.find((t) => t.type === type) ?? POST_TYPES[0];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-background flex-1"
    >
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="light" />
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: insets.top + 10 }}
        className="rounded-b-3xl px-5 pb-5"
      >
        <Text className="text-[22px] font-bold text-white">Post something</Text>
        <Text className="text-[12px] text-white/80">
          Residents and businesses keep MyElginHub full — add yours.
        </Text>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-muted mb-2 text-[12px] font-bold tracking-wider uppercase">
          What are you posting?
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {POST_TYPES.map((item) => {
            const active = item.type === type;
            return (
              <Pressable
                key={item.type}
                onPress={() => {
                  setType(item.type);
                  setPosted(null);
                  setError(null);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className="flex-row items-center rounded-2xl border px-3 py-2 active:opacity-70"
                style={{
                  borderColor: active ? palette.primary : '#E5E7EB',
                  backgroundColor: active ? palette.soft : 'transparent',
                }}
              >
                <Text className="mr-1.5 text-sm">{item.emoji}</Text>
                <Text
                  className="text-[12px] font-semibold"
                  style={{ color: active ? palette.primaryDark : '#374151' }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text className="text-muted mt-2 text-[11px]">{activeType.blurb}</Text>

        <Text className="text-muted mt-5 mb-2 text-[12px] font-bold tracking-wider uppercase">
          Which town?
        </Text>
        <View className="flex-row gap-2">
          {TOWN_IDS.map((id) => {
            const active = town === id;
            return (
              <Pressable
                key={id}
                onPress={() => setTown(id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className="flex-1 items-center rounded-2xl border px-2 py-2.5 active:opacity-70"
                style={{
                  borderColor: active ? TOWNS[id].palette.primary : '#E5E7EB',
                  backgroundColor: active ? TOWNS[id].palette.soft : 'transparent',
                }}
              >
                <Text className="text-base">{TOWNS[id].emoji}</Text>
                <Text
                  className="text-foreground mt-0.5 text-[11px] font-semibold"
                  numberOfLines={1}
                >
                  {TOWNS[id].shortName}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Field label="Title">
          <Input value={title} onChangeText={setTitle} placeholder="Keep it short and clear" />
        </Field>

        {type === 'listing' ? (
          <>
            <Field label="Item or service?">
              <View className="flex-row gap-2">
                {(['goods', 'services'] as const).map((k) => (
                  <Chip
                    key={k}
                    label={k === 'goods' ? 'Item for sale' : 'Service offered'}
                    active={kind === k}
                    color={palette.primary}
                    soft={palette.soft}
                    onPress={() => setKind(k)}
                  />
                ))}
              </View>
            </Field>
            <Field label="Category">
              <View className="flex-row flex-wrap gap-2">
                {MARKETPLACE_CATEGORIES.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    active={category === c}
                    color={palette.primary}
                    soft={palette.soft}
                    onPress={() => setCategory(c)}
                  />
                ))}
              </View>
            </Field>
            <Field label="Price">
              <Input value={price} onChangeText={setPrice} placeholder="$120, $30/hr, or free" />
            </Field>
          </>
        ) : null}

        {type === 'deal' ? (
          <>
            <Field label="Business name">
              <Input value={org} onChangeText={setOrg} placeholder="Who is offering the deal?" />
            </Field>
            <Field label="Discount">
              <Input value={price} onChangeText={setPrice} placeholder="20% off, BOGO, $16" />
            </Field>
            <Field label="Runs for">
              <View className="flex-row gap-2">
                {DEAL_WINDOWS.map((w) => (
                  <Chip
                    key={w.days}
                    label={w.label}
                    active={windowDays === w.days}
                    color={palette.primary}
                    soft={palette.soft}
                    onPress={() => setWindowDays(w.days)}
                  />
                ))}
              </View>
            </Field>
          </>
        ) : null}

        {type === 'event' ? (
          <>
            <Field label="Venue">
              <Input value={org} onChangeText={setOrg} placeholder="Where is it happening?" />
            </Field>
            <Field label="When">
              <View className="flex-row flex-wrap gap-2">
                {EVENT_WHEN.map((w) => (
                  <Chip
                    key={w.days}
                    label={w.label}
                    active={whenDays === w.days}
                    color={palette.primary}
                    soft={palette.soft}
                    onPress={() => setWhenDays(w.days)}
                  />
                ))}
              </View>
            </Field>
            <Field label="Admission">
              <Input value={price} onChangeText={setPrice} placeholder="Free, $10, by donation" />
            </Field>
          </>
        ) : null}

        {type === 'news' ? (
          <Field label="Source">
            <Input value={org} onChangeText={setOrg} placeholder="Who is sharing this?" />
          </Field>
        ) : null}

        {type === 'job' ? (
          <>
            <Field label="Employer">
              <Input value={org} onChangeText={setOrg} placeholder="Business name" />
            </Field>
            <Field label="Employment type">
              <View className="flex-row flex-wrap gap-2">
                {JOB_TYPES.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    active={jobType === t}
                    color={palette.primary}
                    soft={palette.soft}
                    onPress={() => setJobType(t)}
                  />
                ))}
              </View>
            </Field>
            <Field label="Pay">
              <Input
                value={price}
                onChangeText={setPrice}
                placeholder="$22/hr, salary, commission"
              />
            </Field>
          </>
        ) : null}

        <Field label="Details">
          <TextInput
            value={detail}
            onChangeText={setDetail}
            placeholder="Describe it the way you would tell a neighbour."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            accessibilityLabel="Details"
            className="border-border bg-surface text-foreground min-h-[110px] rounded-2xl border p-3 text-[14px]"
          />
        </Field>

        {error ? <Text className="text-danger mb-2 text-[12px]">{error}</Text> : null}
        {posted ? (
          <View className="mb-3 rounded-2xl px-3 py-2" style={{ backgroundColor: '#E7F3DE' }}>
            <Text className="text-[12px] font-semibold" style={{ color: '#3D6127' }}>
              {posted}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={submit}
          accessibilityRole="button"
          className="mt-1 items-center justify-center rounded-2xl py-4 active:opacity-85"
          style={{ backgroundColor: palette.primary }}
        >
          <Text className="text-[15px] font-bold text-white">Publish {activeType.label}</Text>
        </Pressable>
        <Text className="text-muted mt-3 text-center text-[11px]">
          Posts stay on this device in the preview build and appear instantly in the app.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mt-5">
      <Text className="text-muted mb-2 text-[12px] font-bold tracking-wider uppercase">
        {label}
      </Text>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#9CA3AF"
      accessibilityLabel={typeof props.placeholder === 'string' ? props.placeholder : undefined}
      className="border-border bg-surface text-foreground h-12 rounded-2xl border px-3 text-[14px]"
    />
  );
}

function Chip({
  label,
  active,
  color,
  soft,
  onPress,
}: {
  label: string;
  active: boolean;
  color: string;
  soft: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className="rounded-full border px-3 py-2 active:opacity-70"
      style={{
        borderColor: active ? color : '#E5E7EB',
        backgroundColor: active ? soft : 'transparent',
      }}
    >
      <Text className="text-[12px] font-semibold" style={{ color: active ? color : '#374151' }}>
        {label}
      </Text>
    </Pressable>
  );
}
