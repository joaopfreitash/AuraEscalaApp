import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Corrigido: importação correta
import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import LoginScreen from "./(login)";
import HomeScreen from "./main-admin/(tabs)/home";
import HomeUserScreen from "./main-user/(tabs)/home";

// Configuração da integração de navegação do Sentry
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

// Inicializa o Sentry
Sentry.init({
  dsn: "https://7ada95f6ad46aa28ed1eb000c4313c9e@o4508659255869440.ingest.us.sentry.io/4508659257901056", // Substitua pelo seu DSN
  debug: true, // Altere para false em produção
  tracesSampleRate: 1.0, // Ajuste conforme necessário
  integrations: [
    navigationIntegration, // Adiciona a integração de navegação
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Monitora frames lentos/congelados
});

// Criação do Stack Navigator
const Stack = createNativeStackNavigator();

function RootLayout() {
  const navigationRef = useRef(null); // Cria a referência de navegação

  useEffect(() => {
    if (navigationRef.current) {
      navigationIntegration.registerNavigationContainer(navigationRef.current);
    }
  }, [navigationRef]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="(login)"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="main-admin"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="main-user"
        component={HomeUserScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Envolve o RootLayout com o Sentry
export default Sentry.wrap(RootLayout);
