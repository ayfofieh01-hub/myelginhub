import { Text, View } from 'react-native';

const BRAND_BLUE = '#21599E';
const BRAND_GOLD = '#FFC000';
const BRAND_GREEN = '#548235';

type Props = {
  size?: number;
  /** Render the wordmark in white/gold for use on coloured surfaces. */
  inverted?: boolean;
};

/**
 * MyElginHub wordmark.
 * "My"/"Elgin" stem in brand blue, the "i" dot in gold, "Hub" in green.
 */
export function BrandLogo({ size = 26, inverted = false }: Props) {
  const stem = inverted ? '#FFFFFF' : BRAND_BLUE;
  const hub = inverted ? '#DCF0C6' : BRAND_GREEN;
  const dotSize = Math.max(3, Math.round(size * 0.17));
  const lineHeight = Math.round(size * 1.2);

  const base = {
    fontFamily: 'Inter_700Bold',
    fontSize: size,
    lineHeight,
    letterSpacing: -size * 0.02,
  } as const;

  return (
    <View className="flex-row items-end" accessibilityLabel="MyElginHub">
      <Text style={[base, { color: stem }]}>MyElg</Text>
      <View className="items-center">
        <View
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize,
            backgroundColor: BRAND_GOLD,
            marginBottom: -dotSize * 0.25,
          }}
        />
        <Text style={[base, { color: stem }]}>ı</Text>
      </View>
      <Text style={[base, { color: stem }]}>n</Text>
      <Text style={[base, { color: hub }]}>Hub</Text>
    </View>
  );
}

export const brandColors = {
  blue: BRAND_BLUE,
  gold: BRAND_GOLD,
  green: BRAND_GREEN,
};
