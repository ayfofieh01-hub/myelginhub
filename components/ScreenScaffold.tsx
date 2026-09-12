import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useTownTheme } from '@/hooks/useTownTheme';
import { goBackOrReplace } from '@/lib/navigation';
import { routes } from '@/lib/routes';

type Props = {
  title: string;
  subtitle?: string;
  emoji?: string;
  children: ReactNode;
  /** Rendered inside the coloured header, under the title. */
  headerAccessory?: ReactNode;
  scroll?: boolean;
  contentClassName?: string;
};

/**
 * Shared shell for stack (non-tab) routes: town-coloured gradient header with a
 * back control that still works when the route is opened directly.
 */
export function ScreenScaffold({
  title,
  subtitle,
  emoji,
  children,
  headerAccessory,
  scroll = true,
  contentClassName = 'px-5 pb-16 pt-4',
}: Props) {
  const insets = useSafeAreaInsets();
  const { palette } = useTownTheme();

  return (
    <View className="bg-background flex-1">
      {/* oxlint-disable-next-line react/style-prop-object -- expo-status-bar's style prop is a string enum, not a style object */}
      <StatusBar style="light" />
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: insets.top + 8 }}
        className="rounded-b-3xl px-5 pb-5"
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => goBackOrReplace(routes.home)}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
            className="mr-2 h-9 w-9 items-center justify-center rounded-full active:opacity-70"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            <ChevronLeft size={20} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-[19px] font-bold text-white" numberOfLines={1}>
              {emoji ? `${emoji}  ` : ''}
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-0.5 text-xs text-white/80" numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {headerAccessory ? <View className="mt-4">{headerAccessory}</View> : null}
      </LinearGradient>

      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClassName}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </View>
  );
}
