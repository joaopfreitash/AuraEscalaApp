import Entypo from "@expo/vector-icons/Entypo";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import styles from "@/src/styles/configuracoesScreenStyle";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import configuracoesHooks from "@/src/hooks/configuracoesHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ConfiguracoesScreen() {
  const [userName, setUserName] = useState("Carregando...");
  const { handleLogout } = configuracoesHooks();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await AsyncStorage.getItem("@user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserName(parsedUser.name || "Usuário sem nome");
        }
      } catch (error) {
        console.error("Erro ao buscar o nome do usuário:", error);
      }
    };
    fetchUserName();
  }, []);

  const router = useRouter();

  return (
    <View
      style={[styles.container, { paddingTop: useSafeAreaInsets().top + 10 }]}
    >
      <View style={styles.wrapperHeader}>
        <View style={styles.headerMain}>
          <Image
            source={require("@/assets/images/iconHeaderAura.png")}
            style={{
              width: Dimensions.get("window").width * 0.15,
              height: Dimensions.get("window").width * 0.15 * 0.5,
            }}
          />
        </View>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.role}>Administrador</Text>
        <View style={styles.profileImageContainer}>
          <MaterialIcons
            name="admin-panel-settings"
            size={100}
            color="#081e27"
          />
        </View>
      </View>

      {/* Botões para navegação */}
      <View style={styles.settingsContainer}>
        <Link href={"../locais"} asChild>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Hospitais cadastrados</Text>
            <Entypo name="chevron-right" size={25} color="#081e27" />
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.sairContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.sairButton}>
          <Text style={styles.settingText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
