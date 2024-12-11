import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '@/src/styles/configuracoesScreenStyle';

export default function ConfiguracoesUserScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("Carregando...");

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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.role}>Médico</Text>
        <TouchableOpacity style={styles.imagePicker}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("@/assets/images/hipocrates.png")
              }
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </TouchableOpacity>
      </View>

      {/* Botões para navegação */}
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Configuração 1</Text>
        <Entypo name="chevron-right" size={25} color="#081e27" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Configuração 2</Text>
        <Entypo name="chevron-right" size={25} color="#081e27" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Configuração 3</Text>
        <Entypo name="chevron-right" size={25} color="#081e27" />
      </TouchableOpacity>
    </View>
  );
}
