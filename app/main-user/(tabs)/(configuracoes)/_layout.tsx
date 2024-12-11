import { Stack } from 'expo-router';

export default function LayoutConfiguracoesUser() {
  return (
    <Stack>
      <Stack.Screen name="configuracoes"
      options={{
        headerShown: false,
        title: 'Ajustes',
        headerShadowVisible: false,
      }}
      />
    </Stack>
  );
}
