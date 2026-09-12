import { Text, View } from 'react-native';

type Props = {
  label: string;
  color?: string;
  textColor?: string;
  emoji?: string;
  size?: 'sm' | 'md';
};

/** Small rounded status/label pill used across cards and headers. */
export function Pill({
  label,
  color = '#EEF2F7',
  textColor = '#1F2937',
  emoji,
  size = 'sm',
}: Props) {
  return (
    <View
      className={
        size === 'sm'
          ? 'flex-row items-center rounded-full px-2.5 py-1'
          : 'flex-row items-center rounded-full px-3 py-1.5'
      }
      style={{ backgroundColor: color }}
    >
      {emoji ? <Text className="mr-1 text-[11px]">{emoji}</Text> : null}
      <Text
        className={size === 'sm' ? 'text-[11px] font-semibold' : 'text-xs font-semibold'}
        style={{ color: textColor }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}
