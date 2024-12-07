import Entypo from '@expo/vector-icons/Entypo';
import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

export default function ConfiguracoesScreen() {
  const [profileImage, setProfileImage] = useState(null); // Estado para armazenar a imagem mockada
  const mockUserName = "Edd Stark"; // Nome do usuário mockado

  const handleSelectImage = () => {
    // Lógica para selecionar imagem, por exemplo, usando um seletor de arquivos
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.userName}>{mockUserName}</Text>
        <Text style={styles.role}>Administrador</Text>
        <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("@/assets/images/hipocrates.png") // Imagem padrão se nenhuma for selecionada
              }
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </TouchableOpacity>
      </View>

       {/* Botões para navegação */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012E40',
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  role: {
    fontSize: 10,
    color: '#fff',
    marginBottom: 25,
  },
  imagePicker: {
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100, // Largura do círculo
    height: 100, // Altura do círculo
    borderRadius: 60, // Define a imagem como circular
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  changePhotoText: {
    color: '#00BFFF',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#01354A',
    marginVertical: 5,
    borderRadius: 25,
    width: '100%',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
});
