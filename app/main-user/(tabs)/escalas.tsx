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
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import styles from "@/src/styles/plantoesUserScreenStyle";
import stylesModal from "@/src/styles/notificationModalStyle";
import PlantaoItem from "@/src/components/plantaoItem";
import plantoesUserHooks from "@/src/hooks/plantoesUserHooks";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
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
    submitting,
    loading,
    isConcluido,
    handleCheckmarkClick,
    openModalObs,
    closeModal,
    isModalObsVisible,
    selectedPlantaoObs,
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
      style={[
        styles.containerPai,
        { paddingTop: useSafeAreaInsets().top + 10 },
      ]}
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
                  color="#bf3d3d"
                />
              ) : (
                <MaterialIcons name="notifications" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          {!isConcluido && (
            <Text style={styles.plantaoTitle}>Minhas escalas</Text>
          )}
          {isConcluido && (
            <>
              <Text style={styles.plantaoTitle}>Escalas concluídas</Text>
              <Text style={styles.plantaoSubTitle}>30 últimas</Text>
            </>
          )}
        </View>
        <View style={styles.containerConcluidas}>
          <TouchableOpacity onPress={handleCheckmarkClick}>
            {isConcluido ? (
              <Ionicons name="return-up-back" size={28} color="white" />
            ) : (
              <FontAwesome6 name="check" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.plantaoContainer}>
        {plantoes.length === 0 ? (
          <View style={styles.noPlantaoContainer}>
            <Text style={styles.noPlantaoText}>Nenhuma escala cadastrada</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator style={{ flex: 1 }} size="small" color="white" />
        ) : (
          <FlatList
            style={styles.flatListContainer}
            data={plantoes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  selectedPlantaoId === item.id && styles.selectedPlantaoItem,
                ]}
              >
                <PlantaoItem
                  plantao={item}
                  onPress={() => {
                    if (item.concluido) {
                      openModalObs(item);
                    } else if (!item.concluido) {
                      handleSelectPlantao(item.id);
                    }
                  }}
                />
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
        )}
      </View>

      {!isConcluido && (
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
      )}

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
                  renderItem={({ item }) => (
                    <PlantaoItem plantao={item} onPress={() => {}} />
                  )}
                  keyExtractor={(item) => item.id}
                  numColumns={1}
                />
              ) : (
                <Text>Nenhuma escala selecionada</Text>
              )}
            </View>
            <View style={styles.observacoesContainer}>
              <Text style={styles.obsTitle}>Observações</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputText, { maxHeight: 100 }]}
                multiline
                placeholder="Digite algo..."
                placeholderTextColor="#a5a8ad"
                value={text}
                onChangeText={setText}
                scrollEnabled={true}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.confirmarButton,
                { opacity: submitting ? 0.6 : 1 },
              ]}
              disabled={submitting}
              onPress={() => handleConcluirPlantao()}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.confirmarButtonText]}>Confirmar</Text>
                {submitting && (
                  <ActivityIndicator
                    style={{ marginLeft: 10 }}
                    size="small"
                    color="white"
                  />
                )}
              </View>
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
                  Você tem novas escalas cadastradas. Verifique a aba Escalas.
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
      <Modal visible={isModalObsVisible} transparent animationType="fade">
        {selectedPlantaoObs && (
          <View style={stylesModal.overlay}>
            <View style={stylesModal.modalContent}>
              <Text style={stylesModal.title}>Observações do médico</Text>
              <Text style={stylesModal.message}>
                {selectedPlantaoObs.observacoes ? (
                  selectedPlantaoObs.observacoes
                ) : (
                  <Text style={{ color: "#bf3d3d" }}>
                    Médico não fez observações
                  </Text>
                )}
              </Text>
              <TouchableOpacity
                onPress={() => closeModal()}
                style={stylesModal.closeButton}
              >
                <Text style={stylesModal.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      <FlashMessage ref={alertPlantao} />
    </View>
  );
}
