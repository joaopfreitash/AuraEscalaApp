import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";

import styles from "@/src/styles/plantoesUserScreenStyle";
import stylesModal from "@/src/styles/notificationModalStyle";
import PlantaoItem from "@/src/components/plantaoItem";
import plantoesUserHooks from "@/src/hooks/plantoesUserHooks";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import FlashMessage from "react-native-flash-message";
import homeUserHooks from "@/src/hooks/homeUserHooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlantoesUserScreen() {
  const {
    plantoes,
    resetModal,
    handleSelectPlantao,
    selectedPlantao,
    selectedPlantaoId,
    setModalVisible,
    modalVisible,
    text,
    setText,
    handleConcluirPlantao,
    alertPlantao,
  } = plantoesUserHooks();
  const {
    hasNewNotification,
    isTherePlantaoNovo,
    updatePlantaoIdsArray,
    checkNewPlantao,
  } = homeUserHooks();

  const [modalNotifVisible, setModalNotifVisible] = useState(false);

  const handleNotificationPress = () => {
    setModalNotifVisible(true);
  };

  const handleCloseModal = () => {
    setModalNotifVisible(false);
    updatePlantaoIdsArray();
  };

  useEffect(() => {
    checkNewPlantao();
  }, []);

  return (
    <View
      style={[styles.containerPai, { paddingTop: useSafeAreaInsets().top }]}
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
          <View>
            <TouchableOpacity onPress={() => handleNotificationPress()}>
              {hasNewNotification ? (
                <MaterialIcons
                  name="notification-important"
                  size={24}
                  color="red"
                />
              ) : (
                <MaterialIcons name="notifications" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.plantaoTitle}>Minhas escalas</Text>
      </View>
      <View style={styles.plantaoContainer}>
        <FlatList
          style={styles.flatListContainer}
          data={plantoes}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectPlantao(item.id)}
              style={[
                selectedPlantaoId === item.id && styles.selectedPlantaoItem,
              ]}
            >
              <PlantaoItem plantao={item} />
              {selectedPlantaoId === item.id && (
                <View style={styles.checkIconContainer}>
                  <Entypo name="check" size={24} color="green" />
                </View>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
        />
      </View>

      <View
        style={[
          styles.finalizarPlantaoContainer,
          { opacity: selectedPlantaoId ? 1 : 0.3 },
        ]}
      >
        <TouchableOpacity
          disabled={!selectedPlantaoId}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.plantaoTitle}>Concluir escala</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>Concluir escala</Text>
              <TouchableOpacity
                onPress={() => {
                  resetModal();
                }}
              >
                <Ionicons name="close-circle" size={33} color={"#bf3d3d"} />
              </TouchableOpacity>
            </View>
            <View style={styles.containerPlantaoSelected}>
              {/* Verifica se o plantão foi selecionado antes de renderizar */}
              {selectedPlantao ? (
                <FlatList
                  style={styles.flatListContainer}
                  data={[selectedPlantao]} // Passa um array com o plantão selecionado
                  renderItem={({ item }) => <PlantaoItem plantao={item} />}
                  keyExtractor={(item) => item.id}
                  numColumns={1}
                />
              ) : (
                <Text>Nenhum plantão selecionado</Text>
              )}
            </View>
            <View style={styles.observacoesContainer}>
              <Text style={styles.obsTitle}>Observações</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                multiline
                numberOfLines={4}
                placeholder="Digite algo..."
                placeholderTextColor="#a5a8ad"
                value={text}
                onChangeText={setText}
              />
            </View>
            <TouchableOpacity
              style={styles.confirmarButton}
              onPress={() => handleConcluirPlantao()}
            >
              <Text style={styles.confirmarButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={modalNotifVisible} transparent animationType="fade">
        <View style={stylesModal.overlay}>
          <View style={stylesModal.modalContent}>
            <Text style={stylesModal.title}>Notificações</Text>
            <Text style={stylesModal.message}>
              {isTherePlantaoNovo ? (
                <Text style={stylesModal.simNotificacao}>
                  Você tem novos plantões cadastrados. Verifique a aba Plantões.
                </Text>
              ) : (
                "Nenhuma notificação no momento"
              )}
            </Text>
            <TouchableOpacity
              onPress={() => handleCloseModal()}
              style={stylesModal.closeButton}
            >
              <Text style={stylesModal.closeButtonText}>Ok, entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlashMessage ref={alertPlantao} />
    </View>
  );
}
