import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
      <Stack.Screen name="main-admin" options={{ headerShown: false }} />
      <Stack.Screen name="main-user" options={{ headerShown: false }} />
    </Stack>
  );
}
