import { ArrowRight } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BrandLogo } from '@/components/BrandLogo';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { TOWNS, TOWN_IDS } from '@/lib/data/towns';
import { useAppStore } from '@/lib/store/useAppStore';

/** First-run (and after 3 days away) "Choose your community" overlay. */
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const chooseTown = useAppStore((s) => s.chooseTown);

  return (
    <View className="bg-background flex-1">
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BrandLogo size={30} />
        <Text className="text-foreground mt-5 text-[27px] leading-8 font-bold">
          Choose your community
        </Text>
        <Text className="text-muted mt-2 text-[14px] leading-5">
          Pick where you live and the whole app — news, events, deals, marketplace — tunes to that
          town. You can switch any time from the home screen.
        </Text>

        <View className="mt-6 gap-3">
          {TOWN_IDS.map((id, i) => {
            const town = TOWNS[id];
            return (
              <Animated.View key={id} entering={FadeInDown.delay(80 * i).duration(380)}>
                <Pressable
                  onPress={() => chooseTown(id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${town.name}`}
                  className="active:opacity-90"
                >
                  <LinearGradient
                    colors={town.palette.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-3xl p-5"
                  >
                    <View className="flex-row items-center">
                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                        <Text className="text-2xl">{town.emoji}</Text>
                      </View>
                      <View className="ml-4 flex-1">
                        <Text className="text-[19px] font-bold text-white">{town.name}</Text>
                        <Text className="text-[12px] font-semibold text-white/85">
                          {town.tagline}
                        </Text>
                      </View>
                      <ArrowRight size={20} color="#FFFFFF" />
                    </View>
                    <Text className="mt-3 text-[12px] leading-4 text-white/85">{town.blurb}</Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            );
          })}

          <Animated.View entering={FadeInDown.delay(320).duration(380)}>
            <Pressable
              onPress={() => chooseTown('all')}
              accessibilityRole="button"
              accessibilityLabel="View all towns"
              className="border-border bg-surface flex-row items-center rounded-3xl border p-5 active:opacity-80"
            >
              <View className="bg-default h-12 w-12 items-center justify-center rounded-2xl">
                <Text className="text-2xl">🗺️</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-foreground text-[17px] font-bold">View all towns</Text>
                <Text className="text-muted text-[12px]">
                  Everything from all three communities in one feed.
                </Text>
              </View>
              <ArrowRight size={20} color="#6B7280" />
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
