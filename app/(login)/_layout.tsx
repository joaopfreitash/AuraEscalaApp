import { Stack } from "expo-router";

export default function LoginLayout() {
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
        name="index"
        options={{ headerShown: false, title: "Login" }}
      />
      <Stack.Screen name="cadastrar" options={{ title: "Cadastro" }} />
      <Stack.Screen
        name="esqueci-senha"
        options={{ title: "Recuperar senha" }}
      />
    </Stack>
  );
}
