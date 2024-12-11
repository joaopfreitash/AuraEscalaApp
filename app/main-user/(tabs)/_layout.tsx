import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions, Image, SafeAreaView, TouchableOpacity } from 'react-native';

export default function TabLayoutUser() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#081e27',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#aaaaaa',
        tabBarIconStyle: {
          fontSize: 24,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="plantoes"
        options={{
          title: 'Plantões',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(configuracoes)"
        options={{
          headerShown: false,
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cog" size={30} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
