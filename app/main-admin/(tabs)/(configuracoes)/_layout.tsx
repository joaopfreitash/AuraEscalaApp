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
      <Stack.Screen
        name="locais"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#081e27",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
