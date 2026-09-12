import { Apple } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BrandLogo, brandColors } from '@/components/BrandLogo';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { TOWN_IDS, TOWNS } from '@/lib/data/towns';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const signIn = useAuthStore((s) => s.signIn);

  return (
    <View className="bg-background flex-1">
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="dark" />
      <View
        className="flex-1 px-6"
        style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <BrandLogo size={38} />
          <Text className="text-foreground mt-4 text-[26px] leading-8 font-bold">
            Everything local,{'\n'}in one place.
          </Text>
          <Text className="text-muted mt-2 text-[14px] leading-5">
            News, events, hot deals, jobs and a neighbourhood marketplace for St. Thomas, Port
            Stanley and Aylmer.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(450)} className="mt-8 gap-3">
          {TOWN_IDS.map((id) => {
            const town = TOWNS[id];
            return (
              <LinearGradient
                key={id}
                colors={town.palette.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center rounded-2xl px-4 py-3"
              >
                <Text className="mr-3 text-lg">{town.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-[14px] font-bold text-white">{town.name}</Text>
                  <Text className="text-[11px] text-white/80">{town.tagline}</Text>
                </View>
              </LinearGradient>
            );
          })}
        </Animated.View>

        <View className="flex-1" />

        <Animated.View entering={FadeInUp.delay(220).duration(450)} className="gap-3">
          <Pressable
            onPress={() => signIn('google')}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            className="border-border bg-surface h-14 flex-row items-center justify-center rounded-2xl border active:opacity-80"
          >
            <View className="bg-background mr-3 h-7 w-7 items-center justify-center rounded-full">
              <Text className="text-[16px] font-bold" style={{ color: '#4285F4' }}>
                G
              </Text>
            </View>
            <Text className="text-foreground text-[15px] font-bold">Continue with Google</Text>
          </Pressable>

          <Pressable
            onPress={() => signIn('apple')}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
            className="h-14 flex-row items-center justify-center rounded-2xl active:opacity-80"
            style={{ backgroundColor: '#111111' }}
          >
            <Apple size={20} color="#FFFFFF" />
            <Text className="ml-3 text-[15px] font-bold text-white">Continue with Apple ID</Text>
          </Pressable>

          <Text className="text-muted mt-1 text-center text-[11px] leading-4">
            By continuing you agree to the MyElginHub community guidelines. Accounts are stored on
            this device in this preview build.
          </Text>
          <View className="mt-1 flex-row justify-center gap-1">
            <View
              className="h-1.5 w-6 rounded-full"
              style={{ backgroundColor: brandColors.blue }}
            />
            <View
              className="h-1.5 w-3 rounded-full"
              style={{ backgroundColor: brandColors.gold }}
            />
            <View
              className="h-1.5 w-3 rounded-full"
              style={{ backgroundColor: brandColors.green }}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
