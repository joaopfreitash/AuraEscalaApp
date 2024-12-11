import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Dimensions, Modal } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '@/src/styles/configuracoesScreenStyle';
import stylesModal from '@/src/styles/notificationModalStyle';
import { MaterialIcons } from '@expo/vector-icons';
import homeUserHooks from '@/src/hooks/homeUserHooks';

export default function ConfiguracoesUserScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("Carregando...");
  const { hasNewNotification, isTherePlantaoNovo, updatePlantaoIdsArray, checkNewPlantao } = homeUserHooks();
  const [modalNotifVisible, setModalNotifVisible] = useState(false);

    const handleNotificationPress = () => {
      setModalNotifVisible(true);
    };

    const handleCloseModal = () => {
      setModalNotifVisible(false);
      updatePlantaoIdsArray();
    }

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

  useEffect(() => {
    checkNewPlantao();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrapperHeader}>
      <SafeAreaView style={styles.headerMain}>
          <Image
            source={require('@/assets/images/iconHeaderAura.png')}
              style={{
                width: Dimensions.get('window').width * 0.15,
                height: (Dimensions.get('window').width * 0.15) * 0.5,
              }}
            />
            <SafeAreaView>
            <TouchableOpacity onPress={() => handleNotificationPress()}>
              {hasNewNotification ? (
                <MaterialIcons name="notification-important" size={24} color="red" />
              ) : (
                <MaterialIcons name="notifications" size={24} color="white" />
              )}
            </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaView>
        </View>
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
      <View style={styles.settingsContainer}>
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
      <Modal
      visible={modalNotifVisible}
      transparent
      animationType="fade"
      >
      <View style={stylesModal.overlay}>
        <View style={stylesModal.modalContent}>
          <Text style={stylesModal.title}>Notificações</Text>
          <Text style={stylesModal.message}>
            {isTherePlantaoNovo
              ? <Text style={stylesModal.simNotificacao}>Você tem novos plantões cadastrados. Verifique a aba Plantões.</Text>
              : "Nenhuma notificação no momento"
            }
          </Text>
          <TouchableOpacity onPress={() => handleCloseModal()} style={stylesModal.closeButton}>
            <Text style={stylesModal.closeButtonText}>Ok, entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </View>
  );
}
