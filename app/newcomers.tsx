import { Check, RotateCcw } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import { useTownTheme } from '@/hooks/useTownTheme';
import { newcomerSteps } from '@/lib/data/guides';
import { routes } from '@/lib/routes';
import { useAppStore } from '@/lib/store/useAppStore';

/** Newcomers & Relocation Hub — a run-once checklist, persisted per device. */
export default function NewcomersScreen() {
  const router = useRouter();
  const { scope, town, palette } = useTownTheme();
  const doneSteps = useAppStore((s) => s.doneSteps);
  const toggleStep = useAppStore((s) => s.toggleStep);
  const resetSteps = useAppStore((s) => s.resetSteps);

  const steps = newcomerSteps(scope);
  const done = steps.filter((step) => doneSteps.includes(step.id)).length;
  const place = scope === 'all' ? 'Elgin County' : town.name;
  const progress = Math.round((done / steps.length) * 100);

  return (
    <ScreenScaffold
      title="Newcomers & Relocation Hub"
      emoji="🧭"
      subtitle={`Moving to ${place}? Work through this once.`}
      headerAccessory={
        <View className="rounded-2xl bg-white/15 p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-bold text-white">
              {done} of {steps.length} steps done
            </Text>
            <Text className="text-[12px] font-semibold text-white/80">{progress}%</Text>
          </View>
          <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
            <View
              style={{
                width: `${Math.max(2, progress)}%`,
                height: '100%',
                backgroundColor: '#FFC000',
              }}
            />
          </View>
        </View>
      }
    >
      <View className="gap-3">
        {steps.map((step) => {
          const complete = doneSteps.includes(step.id);
          return (
            <Pressable
              key={step.id}
              onPress={() => toggleStep(step.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: complete }}
              accessibilityLabel={step.title}
              className="bg-surface flex-row rounded-3xl border p-4 active:opacity-80"
              style={{ borderColor: complete ? '#548235' : '#E5E7EB' }}
            >
              <View
                className="mr-3 h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: complete ? '#548235' : palette.soft }}
              >
                {complete ? (
                  <Check size={18} color="#FFFFFF" />
                ) : (
                  <Text className="text-base">{step.emoji}</Text>
                )}
              </View>
              <View className="flex-1">
                <Text
                  className="text-foreground text-[15px] font-bold"
                  style={
                    complete ? { textDecorationLine: 'line-through', opacity: 0.6 } : undefined
                  }
                >
                  {step.title}
                </Text>
                <Text className="text-muted mt-1 text-[13px] leading-5">{step.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-5 gap-3">
        <Pressable
          onPress={() => router.push(routes.jobs)}
          accessibilityRole="button"
          className="items-center rounded-2xl py-3.5 active:opacity-85"
          style={{ backgroundColor: palette.primary }}
        >
          <Text className="text-[14px] font-bold text-white">Browse local jobs</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(routes.directory)}
          accessibilityRole="button"
          className="items-center rounded-2xl border py-3.5 active:opacity-80"
          style={{ borderColor: palette.primary }}
        >
          <Text className="text-[14px] font-bold" style={{ color: palette.primary }}>
            Find trades & services
          </Text>
        </Pressable>
      </View>

      <View className="mt-6">
        <NewsletterSignup />
      </View>

      {done > 0 ? (
        <Pressable
          onPress={resetSteps}
          accessibilityRole="button"
          className="mt-5 flex-row items-center justify-center active:opacity-60"
        >
          <RotateCcw size={14} color="#6B7280" />
          <Text className="text-muted ml-2 text-[12px] font-semibold">Reset checklist</Text>
        </Pressable>
      ) : null}
    </ScreenScaffold>
  );
}
