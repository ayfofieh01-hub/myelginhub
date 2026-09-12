import { Bell, BellOff } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { DealCard } from '@/components/ContentCards';
import { EmptyState } from '@/components/EmptyState';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { cancelDailyDealDigest, scheduleDailyDealDigest } from '@/lib/notifications';
import { routes } from '@/lib/routes';
import { inTownScope } from '@/lib/selectors';
import { useAppStore } from '@/lib/store/useAppStore';
import { useDeals } from '@/lib/store/useContentStore';
import { useRouter } from 'expo-router';

/** Commerce · Hot Community Deals with daily push alerts. */
export default function DealsScreen() {
  const router = useRouter();
  const { scope, town } = useTownTheme();
  const deals = useDeals();
  const dealAlerts = useAppStore((s) => s.dealAlerts);
  const setDealAlerts = useAppStore((s) => s.setDealAlerts);

  const scoped = useMemo(() => inTownScope(deals, scope), [deals, scope]);
  const [now] = useState(() => Date.now());
  const { live, expired } = useMemo(() => {
    return {
      live: scoped.filter((d) => new Date(d.expiresAt).getTime() > now),
      expired: scoped.filter((d) => new Date(d.expiresAt).getTime() <= now),
    };
  }, [scoped, now]);

  const onToggle = (value: boolean) => {
    setDealAlerts(value);
    if (value) void scheduleDailyDealDigest(9);
    else void cancelDailyDealDigest();
  };

  return (
    <ScreenScaffold
      title="Hot Community Deals"
      emoji="🔥"
      subtitle={`${live.length} live in ${scope === 'all' ? 'Elgin County' : town.name}`}
      headerAccessory={
        <View className="flex-row items-center rounded-2xl bg-white/15 px-3 py-2.5">
          {dealAlerts ? <Bell size={16} color="#FFFFFF" /> : <BellOff size={16} color="#FFFFFF" />}
          <View className="ml-2 flex-1">
            <Text className="text-[13px] font-bold text-white">Daily deal push alerts</Text>
            <Text className="text-[11px] text-white/80">
              {dealAlerts
                ? 'On — you get a push when deals drop'
                : 'Off — you’ll miss the daily drop'}
            </Text>
          </View>
          <Switch
            value={dealAlerts}
            onValueChange={onToggle}
            trackColor={{ true: '#FFC000', false: 'rgba(255,255,255,0.35)' }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Daily deal push alerts"
          />
        </View>
      }
    >
      {live.length === 0 ? (
        <EmptyState
          emoji="🔥"
          title="No live deals right now"
          body="Businesses can post one from the Post tab — subscribers get pushed straight away."
        />
      ) : (
        <View className="gap-3">
          {live.map((deal) => (
            <DealCard key={deal.id} item={deal} showTown={scope === 'all'} />
          ))}
        </View>
      )}

      {expired.length > 0 ? (
        <View className="mt-6">
          <Text className="text-muted mb-2 text-[12px] font-bold tracking-wider uppercase">
            Recently ended
          </Text>
          <View className="gap-3 opacity-60">
            {expired.slice(0, 4).map((deal) => (
              <DealCard key={deal.id} item={deal} showTown={scope === 'all'} />
            ))}
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={() => router.push(routes.post)}
        accessibilityRole="button"
        className="mt-5 items-center rounded-2xl py-3.5 active:opacity-85"
        style={{ backgroundColor: '#FFC000' }}
      >
        <Text className="text-[14px] font-bold" style={{ color: '#3A2A00' }}>
          Post a deal for your business
        </Text>
      </Pressable>
    </ScreenScaffold>
  );
}
