import { Check, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTownTheme } from '@/hooks/useTownTheme';
import { useAppStore } from '@/lib/store/useAppStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Weekly newsletter signup — delivered straight to the subscriber's mailbox. */
export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const { palette, town, scope } = useTownTheme();
  const email = useAppStore((s) => s.newsletterEmail);
  const subscribe = useAppStore((s) => s.subscribeNewsletter);
  const unsubscribe = useAppStore((s) => s.unsubscribeNewsletter);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubscribe = () => {
    if (!EMAIL_RE.test(value.trim())) {
      setError('Enter a valid email address so we can reach your mailbox.');
      return;
    }
    setError(null);
    subscribe(value);
    setValue('');
  };

  if (email) {
    return (
      <View className="border-border bg-surface rounded-3xl border p-4">
        <View className="flex-row items-center">
          <View
            className="h-10 w-10 items-center justify-center rounded-2xl"
            style={{ backgroundColor: '#E7F3DE' }}
          >
            <Check size={20} color="#548235" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-foreground text-[14px] font-bold">You’re on the list</Text>
            <Text className="text-muted text-[12px]" numberOfLines={1}>
              Friday roundup goes to {email}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={unsubscribe}
          accessibilityRole="button"
          className="mt-3 self-start active:opacity-60"
        >
          <Text className="text-muted text-[12px] font-semibold">Unsubscribe</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="border-border bg-surface rounded-3xl border p-4">
      <View className="flex-row items-center">
        <View
          className="h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: palette.soft }}
        >
          <Mail size={20} color={palette.primary} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-foreground text-[15px] font-bold">Weekly newsletter</Text>
          <Text className="text-muted text-[12px]">
            {compact
              ? 'One email, every Friday.'
              : `Events, deals and news from ${scope === 'all' ? 'Elgin County' : town.name}, every Friday.`}
          </Text>
        </View>
      </View>
      <View className="mt-3 flex-row items-center gap-2">
        <TextInput
          value={value}
          onChangeText={(text) => {
            setValue(text);
            if (error) setError(null);
          }}
          placeholder="you@example.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address for the weekly newsletter"
          className="border-border bg-background text-foreground h-11 flex-1 rounded-2xl border px-3 text-[14px]"
        />
        <Pressable
          onPress={onSubscribe}
          accessibilityRole="button"
          className="h-11 items-center justify-center rounded-2xl px-4 active:opacity-80"
          style={{ backgroundColor: palette.primary }}
        >
          <Text className="text-[13px] font-bold text-white">Sign up</Text>
        </Pressable>
      </View>
      {error ? <Text className="text-danger mt-2 text-[11px]">{error}</Text> : null}
    </View>
  );
}
