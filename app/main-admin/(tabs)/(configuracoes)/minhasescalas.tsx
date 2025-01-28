import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";

import styles from "@/src/styles/plantoesUserScreenStyle";
import PlantaoItem from "@/src/components/plantaoItem";
import plantoesUserHooks from "@/src/hooks/plantoesUserHooks";
import { Entypo, Ionicons } from "@expo/vector-icons";
import FlashMessage from "react-native-flash-message";
import { useNavigation } from "expo-router";

export default function MinhasEscalasScreen() {
  const navigation = useNavigation();
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
  } = plantoesUserHooks();

  useEffect(() => {
    if (modalVisible) {
      navigation.setOptions({
        headerTintColor: "#012E40",
        headerStyle: {
          backgroundColor: "#012E40",
        },
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        title: "Escalas",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#081e27",
        },
        headerTintColor: "#fff",
      });
    }
  }, [modalVisible, navigation]);

  return (
    <View style={[styles.containerPai]}>
      <View style={styles.header}>
        <Text style={styles.plantaoTitle}>Minhas escalas</Text>
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
                onPress={() => handleSelectPlantao(item.id)}
                style={[
                  selectedPlantaoId === item.id && styles.selectedPlantaoItem,
                ]}
              >
                <PlantaoItem plantao={item} onPress={() => {}} />
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
      <FlashMessage ref={alertPlantao} />
    </View>
  );
}
