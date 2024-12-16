import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";

const configuracoesHooks = () => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem("@user");
      router.replace("/(login)");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return { handleLogout };
};

export default configuracoesHooks;
