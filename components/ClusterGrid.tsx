import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export type Tile = {
  key: string;
  emoji: string;
  title: string;
  caption: string;
  href: Href;
  badge?: string;
};

type ClusterProps = {
  cluster: string;
  label: string;
  tiles: Tile[];
  accent: string;
  soft: string;
};

/** One home cluster: cluster name, its label and a two-column tile grid. */
export function ClusterSection({ cluster, label, tiles, accent, soft }: ClusterProps) {
  return (
    <View>
      <View className="mb-3">
        <Text className="text-[10px] font-bold tracking-widest" style={{ color: accent }}>
          {cluster.toUpperCase()}
        </Text>
        <Text className="text-foreground text-[17px] font-bold">{label}</Text>
      </View>
      <View className="flex-row flex-wrap" style={{ marginHorizontal: -5 }}>
        {tiles.map((tile) => (
          <CategoryTile key={tile.key} tile={tile} accent={accent} soft={soft} />
        ))}
      </View>
    </View>
  );
}

function CategoryTile({ tile, accent, soft }: { tile: Tile; accent: string; soft: string }) {
  const router = useRouter();
  return (
    <View style={{ width: '50%', paddingHorizontal: 5, paddingBottom: 10 }}>
      <Pressable
        onPress={() => router.push(tile.href)}
        accessibilityRole="button"
        accessibilityLabel={tile.title}
        className="border-border bg-surface h-[124px] justify-between rounded-3xl border p-3 active:opacity-80"
      >
        <View className="flex-row items-start justify-between">
          <View
            className="h-10 w-10 items-center justify-center rounded-2xl"
            style={{ backgroundColor: soft }}
          >
            <Text className="text-lg">{tile.emoji}</Text>
          </View>
          {tile.badge ? (
            <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: accent }}>
              <Text className="text-[10px] font-bold text-white">{tile.badge}</Text>
            </View>
          ) : null}
        </View>
        <View>
          <Text className="text-foreground text-[13px] font-bold" numberOfLines={2}>
            {tile.title}
          </Text>
          <Text className="text-muted mt-0.5 text-[11px]" numberOfLines={2}>
            {tile.caption}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
