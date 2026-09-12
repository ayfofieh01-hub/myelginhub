import { Home, Plus, Search, Store, User } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useDealAlerts } from '@/hooks/useDealAlerts';
import { useTownTheme } from '@/hooks/useTownTheme';

export default function TabLayout() {
  const { palette } = useTownTheme();
  useDealAlerts();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#FFFFFF' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: '#8A94A6',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: 'Post',
          tabBarIcon: () => (
            <View
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.primary }}
            >
              <Plus color="#FFFFFF" size={22} />
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text className="text-[11px] font-semibold" style={{ color }}>
              Post
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size ?? 22} />,
        }}
      />
    </Tabs>
  );
}
