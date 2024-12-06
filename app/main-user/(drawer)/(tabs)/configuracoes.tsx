import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList, Text, TouchableOpacity } from 'react-native';

export default function PlantoesScreen() {
  const [profileImage, setProfileImage] = useState(null); // Estado para armazenar a imagem mockada
  const mockUserName = "Edd Stark"; // Nome do usuário mockado
  const mockSettings = ["Configuração 1", "Configuração 2", "Configuração 3"]; // Mock da lista de configurações

  const handleSelectImage = () => {
  };

  return (
    <FlatList style={styles.flatList}
      ListHeaderComponent={
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>{mockUserName}</Text>
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
      }
      data={mockSettings}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>{item}</Text>
        </View>
      )}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
    flatList: {
      backgroundColor: '#012E40',
    },
    contentContainer: {
      backgroundColor: '#012E40',
      paddingHorizontal: 20, // Mantém o espaçamento nas laterais
    },
    profileContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    userName: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
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
        width: '100%', // Garante que a imagem ocupe todo o espaço do contêiner
        height: '100%',
        borderRadius: 60, // Define a imagem como circular
  },
    changePhotoText: {
      color: '#00BFFF',
      fontSize: 14,
    },
    settingItem: {
      padding: 15,
      backgroundColor: '#01354A',
      marginVertical: 5,
      borderRadius: 25,
      width: '100%', // Ocupa toda a largura disponível
    },
    settingText: {
      color: '#fff',
      fontSize: 16,
    },
  });