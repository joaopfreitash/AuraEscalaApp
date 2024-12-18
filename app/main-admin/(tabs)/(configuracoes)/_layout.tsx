import { Stack } from "expo-router";

export default function LayoutConfiguracoes() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#012E40",
        },
        headerStyle: {
          backgroundColor: "#081e27",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="configuracoes"
        options={{
          headerShown: false,
          title: "Ajustes",
        }}
      />
      <Stack.Screen
        name="locais"
        options={{
          headerShown: true,
          title: "Voltar",
        }}
      />
    </Stack>
  );
}
