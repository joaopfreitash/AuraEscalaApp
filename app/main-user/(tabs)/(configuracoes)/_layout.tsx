import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { Dimensions, Image, SafeAreaView, TouchableOpacity } from 'react-native';

export default function LayoutConfiguracoesUser() {
  return (
    <Stack>
      <Stack.Screen name="configuracoes"
      options={{
        headerShown: true,
        title: 'Ajustes',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#012E40',
        },
        headerTintColor: '#012E40',
        headerLeft: () => (
          <Image
          source={require('@/assets/images/iconHeaderAura.png')}
            style={{
              width: Dimensions.get('window').width * 0.15,
              height: (Dimensions.get('window').width * 0.15) * 0.5,
              marginHorizontal: 4,
              marginVertical: 10
            }}
          />
        ),
        headerRight: () => (
          <SafeAreaView style={{ marginRight: 3.8, marginTop: 5 }}>
            <TouchableOpacity
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        ),
      }}
      />
    </Stack>
  );
}
