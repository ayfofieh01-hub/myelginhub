import type { TownScope } from '@/lib/types';

export type Weather = {
  tempC: number;
  high: number;
  low: number;
  condition: string;
  emoji: string;
  wind: string;
};

const CONDITIONS: { condition: string; emoji: string }[] = [
  { condition: 'Sunny', emoji: '☀️' },
  { condition: 'Partly cloudy', emoji: '⛅' },
  { condition: 'Cloudy', emoji: '☁️' },
  { condition: 'Light rain', emoji: '🌦️' },
  { condition: 'Breezy', emoji: '🌬️' },
  { condition: 'Clear', emoji: '🌤️' },
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) % 100_000;
  return h;
}

/**
 * Deterministic local-first forecast: stable for a given town and day, no
 * network call. Lakeshore towns run a couple of degrees cooler and windier.
 */
export function todayWeather(scope: TownScope, date: Date = new Date()): Weather {
  const key = `${scope}-${date.toDateString()}`;
  const h = hash(key);
  const month = date.getMonth();
  const seasonal = [-3, -2, 4, 11, 17, 22, 25, 24, 20, 13, 6, 0][month];
  const jitter = (h % 7) - 3;
  const lakeEffect = scope === 'port-stanley' ? -2 : 0;
  const tempC = seasonal + jitter + lakeEffect;
  const pick = CONDITIONS[h % CONDITIONS.length];
  return {
    tempC,
    high: tempC + 2 + (h % 3),
    low: tempC - 4 - (h % 3),
    condition: pick.condition,
    emoji: pick.emoji,
    wind: `${8 + (h % 18) + (scope === 'port-stanley' ? 6 : 0)} km/h`,
  };
}
