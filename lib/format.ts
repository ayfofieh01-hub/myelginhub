import type { EventItem, TownScope } from '@/lib/types';

const DAY = 86_400_000;

function startOfDay(d: Date): number {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c.getTime();
}

/** "Today", "Tomorrow", "Yesterday" or "Sat, Sep 14". */
export function dayLabel(iso: string): string {
  const date = new Date(iso);
  const diff = Math.round((startOfDay(date) - startOfDay(new Date())) / DAY);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function timeLabel(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' })
    .replace(/\s?([ap])\.?m\.?/i, (_m, p: string) => ` ${p.toUpperCase()}M`);
}

export function fullDateLabel(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function eventWhen(event: EventItem): string {
  const start = `${dayLabel(event.startsAt)} · ${timeLabel(event.startsAt)}`;
  if (!event.endsAt) return start;
  const sameDay = startOfDay(new Date(event.startsAt)) === startOfDay(new Date(event.endsAt));
  return sameDay ? `${start}–${timeLabel(event.endsAt)}` : `${start} → ${dayLabel(event.endsAt)}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return dayLabel(iso);
}

export function expiresLabel(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `Ends in ${Math.max(1, Math.round(diff / 60_000))} min`;
  if (hours < 24) return `Ends in ${hours}h`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'Ends tomorrow' : `Ends in ${days} days`;
}

export function isLive(event: EventItem): boolean {
  const now = Date.now();
  const start = new Date(event.startsAt).getTime();
  const end = event.endsAt ? new Date(event.endsAt).getTime() : start + 3 * 3_600_000;
  return now >= start && now <= end;
}

export function isToday(iso: string): boolean {
  return startOfDay(new Date(iso)) === startOfDay(new Date());
}

export function scopeSuffix(scope: TownScope): string {
  return scope === 'all' ? 'Elgin County' : '';
}
