import { Stack } from "expo-router";

export default function MainLayoutAdmin() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
