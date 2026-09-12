import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Deal } from '@/lib/types';

const DAILY_DEAL_ID = 'daily-hot-deals';
const supported = Platform.OS !== 'web';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestDealPermission(): Promise<boolean> {
  if (!supported) return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

/** Fires a local push shortly after a Hot Community Deal is posted. */
export async function pushDealNotification(deal: Deal): Promise<void> {
  if (!supported) return;
  const granted = await requestDealPermission();
  if (!granted) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔥 Hot Deal: ${deal.business}`,
        body: `${deal.title} — ${deal.discount}`,
        data: { kind: 'deal', dealId: deal.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
  } catch {
    // Local notifications are best-effort in the demo build.
  }
}

/** Daily reminder that new Hot Community Deals are live. */
export async function scheduleDailyDealDigest(hour = 9): Promise<void> {
  if (!supported) return;
  const granted = await requestDealPermission();
  if (!granted) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_DEAL_ID).catch(() => undefined);
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_DEAL_ID,
      content: {
        title: '🔥 Today’s Hot Community Deals',
        body: 'New deals from local businesses are live in MyElginHub.',
        data: { kind: 'deal-digest' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  } catch {
    // ignore
  }
}

export async function cancelDailyDealDigest(): Promise<void> {
  if (!supported) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_DEAL_ID);
  } catch {
    // ignore
  }
}
