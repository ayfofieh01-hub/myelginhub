import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { BrandLogo } from '@/components/BrandLogo';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { getTown } from '@/lib/data/towns';
import { useAppStore } from '@/lib/store/useAppStore';

const SPLASH_MS = 2000;

/** Town-branded splash that plays right after a community is chosen. */
export default function TownSplashScreen() {
  const splashTown = useAppStore((s) => s.splashTown);
  const scope = useAppStore((s) => s.scope);
  const clearSplash = useAppStore((s) => s.clearSplash);
  const town = getTown(splashTown ?? scope);

  useEffect(() => {
    const timer = setTimeout(clearSplash, SPLASH_MS);
    return () => clearTimeout(timer);
  }, [clearSplash]);

  return (
    <LinearGradient
      colors={town.palette.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center px-8"
    >
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="light" />
      <Animated.View entering={ZoomIn.duration(500)} className="items-center">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-white/20">
          <Text className="text-4xl">{town.emoji}</Text>
        </View>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} className="mt-6 items-center">
        <Text className="text-[32px] font-bold text-white">{town.name}</Text>
        <Text className="mt-1 text-[14px] font-semibold text-white/85">{town.splashTagline}</Text>
      </Animated.View>
      <Animated.View
        entering={FadeIn.delay(520).duration(600)}
        className="absolute bottom-16 items-center"
      >
        <View className="rounded-2xl bg-white/90 px-4 py-2">
          <BrandLogo size={22} />
        </View>
        <Text className="mt-3 text-[11px] font-semibold tracking-widest text-white/70">
          LOADING YOUR COMMUNITY
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}
