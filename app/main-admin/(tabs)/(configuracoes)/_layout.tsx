import { Stack } from "expo-router";

export default function LayoutConfiguracoes() {
  return (
    <Stack>
      <Stack.Screen
        name="configuracoes"
        options={{
          headerShown: false,
          title: "Ajustes",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="locais" />
    </Stack>
  );
}
