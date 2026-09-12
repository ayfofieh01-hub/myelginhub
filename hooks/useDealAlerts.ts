import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { cancelDailyDealDigest, scheduleDailyDealDigest } from '@/lib/notifications';
import { routes } from '@/lib/routes';
import { inTownScope } from '@/lib/selectors';
import { useAppStore } from '@/lib/store/useAppStore';
import { useDeals } from '@/lib/store/useContentStore';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

/**
 * Keeps Hot Community Deals alerts in sync: schedules the daily local push and
 * mirrors live deals into the in-app notification centre (deduplicated).
 */
export function useDealAlerts() {
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hydrated);
  const dealAlerts = useAppStore((s) => s.dealAlerts);
  const scope = useAppStore((s) => s.scope);
  const deals = useDeals();
  const notificationsHydrated = useNotificationStore((s) => s.hydrated);
  const items = useNotificationStore((s) => s.items);
  const push = useNotificationStore((s) => s.push);

  useEffect(() => {
    if (!hydrated) return;
    if (dealAlerts) void scheduleDailyDealDigest(9);
    else void cancelDailyDealDigest();
  }, [hydrated, dealAlerts]);

  useEffect(() => {
    if (!hydrated || !notificationsHydrated || !dealAlerts) return;
    const live = inTownScope(deals, scope).filter(
      (deal) => new Date(deal.expiresAt).getTime() > Date.now(),
    );
    for (const deal of live.slice(0, 3)) {
      const sourceKey = `deal:${deal.id}`;
      if (items.some((item) => item.sourceKey === sourceKey)) continue;
      push({
        kind: 'deal',
        title: `🔥 ${deal.business}`,
        body: `${deal.title} — ${deal.discount}`,
        town: deal.town,
        sourceKey,
      });
    }
  }, [hydrated, notificationsHydrated, dealAlerts, deals, scope, items, push]);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const kind = response.notification.request.content.data?.kind;
      if (kind === 'deal' || kind === 'deal-digest') router.push(routes.deals);
    });
    return () => subscription.remove();
  }, [router]);
}
