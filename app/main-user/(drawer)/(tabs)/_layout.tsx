import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#081e27', // Cor da barra inferior
          borderTopWidth: 0, // Remove a linha superior branca
        },
        tabBarActiveTintColor: '#ffffff', // Cor do ícone ativo
        tabBarInactiveTintColor: '#aaaaaa', // Cor do ícone inativo
        tabBarIconStyle: {
          fontSize: 24, // Tamanho do ícone
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
        name="configuracoes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog" size={30} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
