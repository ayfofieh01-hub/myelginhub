import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  items: string[];
  background: string;
  textColor?: string;
};

/** Continuously scrolling headline banner ("moving banner") for the hero area. */
export function Ticker({ items, background, textColor = '#FFFFFF' }: Props) {
  const [width, setWidth] = useState(0);
  const offset = useSharedValue(0);
  const label = `${items.join('     •     ')}     •     `;

  useEffect(() => {
    if (width <= 0) return undefined;
    cancelAnimation(offset);
    // Mutating .value directly is the standard Reanimated shared-value update pattern.
    // oxlint-disable-next-line react/immutability -- Reanimated SharedValue is intentionally mutable via `.value`
    offset.value = 0;
    offset.value = withRepeat(
      withTiming(-width, { duration: Math.max(8000, width * 26), easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(offset);
  }, [width, offset]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <View className="overflow-hidden rounded-full py-2" style={{ backgroundColor: background }}>
      <Animated.View style={[style, { flexDirection: 'row' }]}>
        <Text
          numberOfLines={1}
          className="text-[12px] font-semibold"
          style={{ color: textColor }}
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          {label}
        </Text>
        <Text numberOfLines={1} className="text-[12px] font-semibold" style={{ color: textColor }}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}
