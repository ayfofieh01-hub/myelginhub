import { useMemo } from 'react';
import { getTown } from '@/lib/data/towns';
import { useAppStore } from '@/lib/store/useAppStore';
import type { Town, TownPalette, TownScope } from '@/lib/types';

/** Current town scope plus its palette, used to theme every screen. */
export function useTownTheme(): { scope: TownScope; town: Town; palette: TownPalette } {
  const scope = useAppStore((s) => s.scope);
  return useMemo(() => {
    const town = getTown(scope);
    return { scope, town, palette: town.palette };
  }, [scope]);
}
