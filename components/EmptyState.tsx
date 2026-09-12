import { Text, View } from 'react-native';

type Props = {
  emoji?: string;
  title: string;
  body?: string;
};

export function EmptyState({ emoji = '🗒️', title, body }: Props) {
  return (
    <View className="border-border bg-surface items-center rounded-3xl border px-6 py-10">
      <Text className="mb-2 text-3xl">{emoji}</Text>
      <Text className="text-foreground text-center text-base font-semibold">{title}</Text>
      {body ? <Text className="text-muted mt-1 text-center text-sm">{body}</Text> : null}
    </View>
  );
}
