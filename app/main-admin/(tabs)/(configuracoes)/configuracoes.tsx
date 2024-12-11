import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import styles from '@/src/styles/configuracoesScreenStyle';
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracoesScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const mockUserName = "Edd Stark";

  const handleSelectImage = () => {
    // Lógica para selecionar imagem usando um seletor de arquivos
  };

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapperHeader}>
      <View style={styles.headerMain}>
          <Image
            source={require('@/assets/images/iconHeaderAura.png')}
              style={{
                width: Dimensions.get('window').width * 0.15,
                height: (Dimensions.get('window').width * 0.15) * 0.5,
              }}
            />
            <View>
              <TouchableOpacity>
                <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
            </View>
        </View>
        </View>
      <View style={styles.profileContainer}>
        <Text style={styles.userName}>{mockUserName}</Text>
        <Text style={styles.role}>Administrador</Text>
        <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
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
       <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('../locais')}>
          <Text style={styles.settingText}>Hospitais cadastrados</Text>
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

    </SafeAreaView>
  );
}
