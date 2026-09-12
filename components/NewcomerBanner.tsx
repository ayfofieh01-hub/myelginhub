import { ArrowRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { newcomerSteps } from '@/lib/data/guides';
import { routes } from '@/lib/routes';
import { useAppStore } from '@/lib/store/useAppStore';

/**
 * Standalone gold CTA banner for the Newcomers & Relocation Hub — deliberately
 * heavier than the category tiles because it is a one-time checklist.
 */
export function NewcomerBanner() {
  const router = useRouter();
  const { scope, town } = useTownTheme();
  const doneSteps = useAppStore((s) => s.doneSteps);
  const steps = newcomerSteps(scope);
  const done = steps.filter((step) => doneSteps.includes(step.id)).length;
  const place = scope === 'all' ? 'Elgin County' : town.name;

  return (
    <Pressable
      onPress={() => router.push(routes.newcomers)}
      accessibilityRole="button"
      accessibilityLabel={`Newcomers and Relocation Hub for ${place}`}
      className="active:opacity-90"
    >
      <LinearGradient
        colors={['#FFC000', '#EFA400']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-4"
      >
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
            <Text className="text-2xl">🧭</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[10px] font-bold tracking-widest" style={{ color: '#4A3400' }}>
              NEW IN TOWN?
            </Text>
            <Text className="text-[16px] font-bold" style={{ color: '#221900' }}>
              Newcomers & Relocation Hub
            </Text>
            <Text className="text-[12px]" style={{ color: '#4A3400' }} numberOfLines={2}>
              Everything to sort out when moving to {place} — {done} of {steps.length} done.
            </Text>
          </View>
          <ArrowRight size={20} color="#4A3400" />
        </View>
        <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/50">
          <View
            style={{
              width: `${Math.max(4, Math.round((done / steps.length) * 100))}%`,
              height: '100%',
              backgroundColor: '#548235',
            }}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
}
