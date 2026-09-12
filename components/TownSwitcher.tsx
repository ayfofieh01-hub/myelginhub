import { Check, ChevronDown, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { TOWNS, TOWN_ORDER } from '@/lib/data/towns';
import { useAppStore } from '@/lib/store/useAppStore';
import type { TownScope } from '@/lib/types';

/**
 * Town selector for the top-right of the home header. Switching scope re-filters
 * every feed; "All Towns" merges content from the three communities.
 */
export function TownSwitcher() {
  const [open, setOpen] = useState(false);
  const scope = useAppStore((s) => s.scope);
  const setScope = useAppStore((s) => s.setScope);
  const current = TOWNS[scope];

  const select = (next: TownScope) => {
    setScope(next);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Change town, currently ${current.name}`}
        className="flex-row items-center gap-1 rounded-full px-3 py-2 active:opacity-70"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
      >
        <MapPin size={14} color="#FFFFFF" />
        <Text className="max-w-[110px] text-xs font-semibold text-white" numberOfLines={1}>
          {current.shortName}
        </Text>
        <ChevronDown size={14} color="#FFFFFF" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 justify-center px-6"
          style={{ backgroundColor: 'rgba(15,23,42,0.55)' }}
          onPress={() => setOpen(false)}
          accessibilityRole="button"
          accessibilityLabel="Close town selector"
        >
          <Pressable className="bg-surface rounded-3xl p-5" onPress={() => undefined}>
            <Text className="text-foreground text-lg font-bold">Choose your view</Text>
            <Text className="text-muted mt-1 mb-4 text-xs">
              Pick one community or see everything across Elgin County.
            </Text>
            <View className="gap-2">
              {TOWN_ORDER.map((id) => {
                const town = TOWNS[id];
                const active = id === scope;
                return (
                  <Pressable
                    key={id}
                    onPress={() => select(id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className="flex-row items-center rounded-2xl border px-3 py-3 active:opacity-80"
                    style={{
                      borderColor: active ? town.palette.primary : '#E5E7EB',
                      backgroundColor: active ? town.palette.soft : 'transparent',
                    }}
                  >
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: town.palette.primary }}
                    >
                      <Text className="text-base">{town.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground text-sm font-semibold">{town.name}</Text>
                      <Text className="text-muted text-[11px]" numberOfLines={1}>
                        {town.tagline}
                      </Text>
                    </View>
                    {active ? <Check size={18} color={town.palette.primary} /> : null}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
