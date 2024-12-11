import { Stack } from "expo-router";

export default function MainLayoutUser() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
