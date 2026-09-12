import { ChevronRight } from 'lucide-react-native';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  href?: Href;
  accent?: string;
};

export function SectionHeader({ title, subtitle, actionLabel, href, accent = '#21599E' }: Props) {
  const router = useRouter();
  return (
    <View className="mb-3 flex-row items-end justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-foreground text-[17px] font-bold">{title}</Text>
        {subtitle ? <Text className="text-muted mt-0.5 text-xs">{subtitle}</Text> : null}
      </View>
      {href && actionLabel ? (
        <Pressable
          className="flex-row items-center active:opacity-60"
          onPress={() => router.push(href)}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text className="text-xs font-semibold" style={{ color: accent }}>
            {actionLabel}
          </Text>
          <ChevronRight size={14} color={accent} />
        </Pressable>
      ) : null}
    </View>
  );
}
