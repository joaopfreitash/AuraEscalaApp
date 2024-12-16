import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import FlashMessage from "react-native-flash-message";

import styles from "@/src/styles/plantoesScreenStyle";
import PlantaoItem from "@/src/components/plantaoItem";
import plantoesHooks from "@/src/hooks/plantoesHooks";
import { Plantao } from "@/src/types";
import stylesModal from "@/src/styles/notificationModalStyle";
import { Fontisto } from "@expo/vector-icons";

export default function PlantoesScreen() {
  const {
    resetModal,
    fetchPlantoes,
    fetchMedicos,
    fetchHospitals,
    plantoes,
    valueMedico,
    valueLocal,
    valueFuncao,
    setIsButtonEnabled,
    setDate,
    setTime,
    setModalVisible,
    modalVisible,
    date,
    time,
    openMedico,
    itemsMedico,
    setOpenMedico,
    setValueMedico,
    setItemsMedico,
    openFuncao,
    itemsFuncao,
    setOpenFuncao,
    setValueFuncao,
    setItemsFuncao,
    openLocal,
    itemsLocal,
    setOpenLocal,
    alertPlantao,
    setValueLocal,
    setItemsLocal,
    isButtonEnabled,
    handleRegisterShift,
    labelFuncaoAnimation,
    labelMedicoAnimation,
    labelLocalAnimation,
    handleFocusMedico,
    handleFocusFuncao,
    handleFocusLocal,
    handleCheckmarkClick,
    isConcluido,
    selectedPlantao,
    isModalObsVisible,
    openModalObs,
    closeModal,
  } = plantoesHooks();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHora, setSelectedHora] = useState("");

  // Chama a função de buscar médicos assim que o componente é montado
  useEffect(() => {
    fetchPlantoes(isConcluido);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMedicos();
      fetchHospitals();
    }, [])
  );

  //Verificar se campos preenchidos para habilitar botão Confirmar
  const checkFields = () => {
    if (
      valueMedico &&
      selectedDate &&
      selectedHora &&
      valueLocal &&
      valueFuncao
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  useEffect(() => {
    checkFields();
  }, [valueMedico, selectedDate, selectedHora, valueLocal, valueFuncao]);

  const handleDateConfirm = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      setDate(dayjs(date));
    }
  };

  const handleTimeConfirm = (event: DateTimePickerEvent, time?: Date) => {
    if (time) {
      const formattedTime = time.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSelectedHora(formattedTime);
      setTime(dayjs(time));
    }
  };

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
            <TouchableOpacity>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.headerFilhoContainer}>
        <View style={styles.headerTitle}>
          <Text style={styles.plantaoTitle}>
            {isConcluido ? "Escalas concluídas" : "Escalas"}
          </Text>
        </View>
        <View style={styles.containerConcluidas}>
          <TouchableOpacity onPress={handleCheckmarkClick}>
            {isConcluido ? (
              <Fontisto name="arrow-return-left" size={24} color={"white"} />
            ) : (
              <Ionicons name="checkmark-done" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.plantaoContainer}>
        <FlatList
          style={styles.flatListContainer}
          data={plantoes}
          renderItem={({ item }) => (
            <PlantaoItem
              plantao={item}
              onPress={() => {
                if (item.concluido) {
                  openModalObs(item); // Passa a função openModal se o plantão estiver concluído
                }
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
        />
      </View>

      {/* Botão para abrir o modal */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Cadastrar</Text>
            <TouchableOpacity
              onPress={() => {
                resetModal();
              }}
            >
              <Ionicons name="close-circle" size={33} color={"#bf3d3d"} />
            </TouchableOpacity>
          </View>

          {/* Seletor de Data */}
          <View style={styles.containerDataHora}>
            <DateTimePicker
              value={date.toDate()}
              mode="date"
              display="default"
              onChange={handleDateConfirm}
            />
            <DateTimePicker
              value={time.toDate()}
              mode="time"
              display="default"
              onChange={handleTimeConfirm}
            />
          </View>

          <View style={styles.betweenInput}>
            <FontAwesome name="level-down" size={30} color="black" />
          </View>

          {/* Seletor de Médico */}
          <View style={styles.containerMedico}>
            <Animated.Text
              style={[
                styles.inputLabel,
                {
                  top: labelMedicoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, -26], // Move o rótulo para cima
                  }),
                  fontSize: labelMedicoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 12], // Diminui o tamanho do rótulo
                  }),
                  fontWeight: labelMedicoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["400", "600"], // Tornar o rótulo em negrito
                  }),
                },
              ]}
            >
              Médico
            </Animated.Text>
            <DropDownPicker
              style={styles.inputBoxPickerMedico}
              onPress={() => {
                handleFocusMedico();
              }}
              open={openMedico}
              value={valueMedico}
              searchable={true}
              items={itemsMedico}
              setOpen={setOpenMedico}
              setValue={setValueMedico}
              setItems={setItemsMedico}
              placeholder={"Selecione o médico"}
              placeholderStyle={styles.placeholderText}
              textStyle={styles.inputText}
              multiple={false}
              language="PT"
              dropDownContainerStyle={styles.dropDownListContainerMedico} // Estilo da lista suspensa
            />
          </View>

          <View style={styles.betweenInput}>
            <FontAwesome name="level-down" size={30} color="black" />
          </View>

          {/* Seletor de Função */}
          <View style={styles.containerFuncao}>
            <Animated.Text
              style={[
                styles.inputLabel,
                {
                  top: labelFuncaoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, -26], // Move o rótulo para cima
                  }),
                  fontSize: labelFuncaoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 12], // Diminui o tamanho do rótulo
                  }),
                  fontWeight: labelFuncaoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["400", "600"], // Tornar o rótulo em negrito
                  }),
                },
              ]}
            >
              Função
            </Animated.Text>
            <DropDownPicker
              style={styles.inputBoxPickerFuncao}
              onPress={() => {
                handleFocusFuncao();
              }}
              open={openFuncao}
              value={valueFuncao}
              items={itemsFuncao}
              setOpen={setOpenFuncao}
              setValue={setValueFuncao}
              setItems={setItemsFuncao}
              placeholder={"Selecione a função do médico"}
              placeholderStyle={styles.placeholderText}
              textStyle={styles.inputText}
              multiple={false}
              language="PT"
              dropDownContainerStyle={styles.dropDownListContainerFuncao} // Estilo da lista suspensa
            />
          </View>

          <View style={styles.betweenInput}>
            <FontAwesome name="level-down" size={30} color="black" />
          </View>

          {/* Seletor de Local */}
          <View style={styles.containerLocal}>
            <Animated.Text
              style={[
                styles.inputLabel,
                {
                  top: labelLocalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, -26], // Move o rótulo para cima
                  }),
                  fontSize: labelLocalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 12], // Diminui o tamanho do rótulo
                  }),
                  fontWeight: labelLocalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["400", "600"], // Tornar o rótulo em negrito
                  }),
                },
              ]}
            >
              Hospital
            </Animated.Text>
            <DropDownPicker
              style={styles.inputBoxPickerLocal}
              onPress={() => {
                handleFocusLocal();
              }}
              open={openLocal}
              value={valueLocal}
              searchable={true}
              items={itemsLocal}
              setOpen={setOpenLocal}
              setValue={setValueLocal}
              setItems={setItemsLocal}
              placeholder={"Selecione o local da escala"}
              placeholderStyle={styles.placeholderText}
              textStyle={styles.inputText}
              multiple={false}
              language="PT"
              dropDownContainerStyle={styles.dropDownListContainerLocal} // Estilo da lista suspensa
            />
          </View>
          <TouchableOpacity
            style={[
              styles.confirmarPlantaoButton,
              !isButtonEnabled && styles.buttonDisabled,
            ]}
            disabled={!isButtonEnabled}
            onPress={() => {
              handleRegisterShift(
                valueMedico,
                valueLocal,
                selectedDate,
                selectedHora,
                valueFuncao
              );
            }}
          >
            <Text
              style={[
                styles.confirmarPlantaoText,
                !isButtonEnabled && styles.buttonTextDisabled,
              ]}
            >
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isModalObsVisible} transparent animationType="fade">
        {selectedPlantao && (
          <View style={stylesModal.overlay}>
            <View style={stylesModal.modalContent}>
              <Text style={stylesModal.title}>Observações do médico</Text>
              <Text style={stylesModal.message}>
                {selectedPlantao.observacoes ? (
                  selectedPlantao.observacoes
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
