import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Host } from 'react-native-portalize';
import { Dimensions, Image, SafeAreaView, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  return (
    <Host>
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
        headerShown: true,
          headerStyle: {
            backgroundColor: '#012E40',
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitle: '',
          headerLeft: () => (
            <Image
            source={require('@/assets/images/iconHeaderAura.png')}
              style={{
                width: Dimensions.get('window').width * 0.15,
                height: (Dimensions.get('window').width * 0.15) * 0.5,
                marginHorizontal: 20,
              }}
            />
          ),
          headerRight: () => (
            <SafeAreaView style={{ marginRight: 20 }}>
              <TouchableOpacity
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
                <Ionicons name="notifications" size={24} color="white" />
              </TouchableOpacity>
            </SafeAreaView>
          ),
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
        name="medicos"
        options={{
          title: 'Médicos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="relatorios"
        options={{
          title: 'Relatório',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
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
    </Host>
  );
}
