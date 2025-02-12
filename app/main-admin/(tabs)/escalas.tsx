import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
  Dimensions,
  Keyboard,
  TextInput,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import FlashMessage from "react-native-flash-message";

import styles from "@/src/styles/plantoesScreenStyle";
import PlantaoItem from "@/src/components/plantaoItem";
import plantoesHooks from "@/src/hooks/plantoesHooks";
import stylesModal from "@/src/styles/notificationModalStyle";
import {
  Entypo,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import searchBar from "@/src/utils/searchBar";

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
    setModalVisible,
    modalVisible,
    itemsMedico,
    setValueMedico,
    itemsFuncao,
    setValueFuncao,
    itemsLocal,
    alertPlantao,
    setValueLocal,
    isButtonEnabled,
    handleRegisterShift,
    handleCheckmarkClick,
    isConcluido,
    selectedPlantao,
    isModalObsVisible,
    openModalObs,
    closeModal,
    selectedDate,
    selectedHora,
    filteredPlantoes,
    setFilteredPlantoes,
    loading,
    submitting,
    selectedDatePicker,
    showDatePicker,
    showTimePicker,
    toggleDatePicker,
    toggleTimePicker,
    toggleDatePickerFalse,
    handleTempDate,
    toggleTimePickerFalse,
    handleTempTime,
    setModalFixaVisible,
    modalFixaVisible,
    escalas,
    toggleEscala,
    adicionarEscala,
    deletarEscala,
    setModalCalendarioVisible,
    modalCalendarioVisible,
    handleConfirmRangeCalendario,
    atualizarEscala,
    handleTempTimeFixa,
    selectedHoraFixa,
    escalaAbertaId,
    setEscalaAbertaId,
    escalasComDataSelecionada,
    escalasComMedico,
    escalasComFuncao,
    escalasComAuxilio,
    escalasComHora,
    escalasComLocal,
    handleRegisterFixedShift,
    showModalAtencao,
    modalAtencaoTitle,
    modalAtencaoMessage,
    setShowModalAtencao,
    selectedMonth,
    setSelectedMonth,
    setSelectedYear,
    monthNames,
    selectedYear,
    selectedWeekdays,
    toggleWeekday,
    weekdays,
    setEscalas,
    setLoading,
    showSelectedDatesView,
    setShowSelectedDatesView,
    removeDate,
    handleConfirmRangeProximo,
    openModalDelete,
    closeModalDelete,
    isModalDeleteVisible,
    handleDeleteShift,
    resetDates,
    handleConfirmRangeReset,
    auxilioCirurgico,
    setAuxilioCirurgico,
    filteredAuxilioCirurgico,
    auxilioCirurgicoAtivo,
    setAuxilioCirurgicoAtivo,
    setEscalasComAuxilio,
    atualizarSwitch,
    filteredAuxilioCirurgicoFixa,
  } = plantoesHooks();

  const {
    handleFocusSearchBar,
    handleBlurSearchbar,
    searchBarWidth,
    isSearchFocused,
    searchQuery,
    setSearchQuery,
    setIsSearchFocused,
  } = searchBar();

  const [date, setDate] = useState(dayjs().subtract(1, "day"));
  const [time, setTime] = useState(dayjs().subtract(1, "hour"));

  const [isFocusMedico, setIsFocusMedico] = useState(false);
  const [isFocusFuncao, setIsFocusFuncao] = useState(false);
  const [isFocusAuxilio, setIsFocusAuxilio] = useState(false);
  const [isFocusHospital, setIsFocusedHospital] = useState(false);
  const dropdownMedicoRef = useRef<any>(null);
  const dropdownLocalRef = useRef<any>(null);
  const dropdownFuncaoRef = useRef<any>(null);
  const dropdownAuxilioRef = useRef<any>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const [popupVisible, setPopupVisible] = useState(false);
  const renderLabelMedico = () => {
    if (isFocusMedico) {
      return (
        <Text style={[styles.label, isFocusMedico && { color: "#59994e" }]}>
          Médico
        </Text>
      );
    }
    if (valueMedico) {
      return (
        <Text style={[styles.label, !isFocusMedico && { color: "#59994e" }]}>
          Médico
        </Text>
      );
    }
    return null;
  };
  const renderLabelLocal = () => {
    if (isFocusHospital) {
      return (
        <Text style={[styles.label, isFocusHospital && { color: "#59994e" }]}>
          Hospital
        </Text>
      );
    }
    if (valueLocal) {
      return (
        <Text style={[styles.label, !isFocusHospital && { color: "#59994e" }]}>
          Hospital
        </Text>
      );
    }
    return null;
  };
  const renderLabelFuncao = () => {
    if (isFocusFuncao) {
      return (
        <Text style={[styles.label, isFocusFuncao && { color: "#59994e" }]}>
          Função
        </Text>
      );
    }
    if (valueFuncao) {
      return (
        <Text style={[styles.label, !isFocusFuncao && { color: "#59994e" }]}>
          Função
        </Text>
      );
    }
    return null;
  };
  const renderLabelAuxilio = () => {
    if (isFocusAuxilio) {
      return (
        <Text style={[styles.label, isFocusAuxilio && { color: "#59994e" }]}>
          Auxílio Cirúrgico
        </Text>
      );
    }
    if (auxilioCirurgico) {
      return (
        <Text style={[styles.label, !isFocusAuxilio && { color: "#59994e" }]}>
          Auxílio Cirúrgico
        </Text>
      );
    }
    return null;
  };
  const renderLabelData = () => {
    if (showDatePicker) {
      return (
        <Text
          style={[styles.labelData, showDatePicker && { color: "#59994e" }]}
        >
          Data
        </Text>
      );
    }
    if (selectedDatePicker !== "") {
      return (
        <Text
          style={[styles.labelData, selectedDatePicker && { color: "#59994e" }]}
        >
          Data
        </Text>
      );
    }
    return null;
  };
  const renderLabelDataFixa = (escalaId: number) => {
    if (
      escalaAbertaId === escalaId ||
      escalasComDataSelecionada.includes(escalaId)
    ) {
      return <Text style={[styles.labelDataFixa]}>Data</Text>;
    }
    return null;
  };
  const renderLabelHora = () => {
    if (showTimePicker) {
      return (
        <Text
          style={[styles.labelHora, showTimePicker && { color: "#59994e" }]}
        >
          Hora
        </Text>
      );
    }
    if (selectedHora !== "") {
      return (
        <Text style={[styles.labelHora, selectedHora && { color: "#59994e" }]}>
          Hora
        </Text>
      );
    }
    return null;
  };
  const renderLabelFixaMisc = (
    escalaId: number,
    campo: "medico" | "local" | "funcao" | "hora" | "auxiliocirurgico"
  ) => {
    switch (campo) {
      case "medico":
        if (isFocusMedico || escalasComMedico.includes(escalaId)) {
          return <Text style={[styles.labelFixa]}>Médico</Text>;
        }
        break;
      case "local":
        if (isFocusHospital || escalasComLocal.includes(escalaId)) {
          return <Text style={[styles.labelFixa]}>Local</Text>;
        }
        break;
      case "funcao":
        if (isFocusFuncao || escalasComFuncao.includes(escalaId)) {
          return <Text style={[styles.labelFixa]}>Função</Text>;
        }
        break;
      case "auxiliocirurgico":
        if (isFocusAuxilio || escalasComAuxilio.includes(escalaId)) {
          return <Text style={[styles.labelFixa]}>Auxílio Cirúrgico</Text>;
        }
        break;
      case "hora":
        if (showTimePicker || escalasComHora.includes(escalaId)) {
          return <Text style={[styles.labelHoraFixa]}>Hora</Text>;
        }
        break;
      default:
        return null;
    }
    return null;
  };

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
    const isCirurgiao = valueFuncao === "Cirurgião";
    const isAuxilioValido =
      !isCirurgiao || !auxilioCirurgicoAtivo || auxilioCirurgico;

    if (
      valueMedico &&
      selectedDate &&
      selectedHora &&
      valueLocal &&
      valueFuncao &&
      isAuxilioValido
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  useEffect(() => {
    checkFields();
  }, [
    valueMedico,
    selectedDate,
    selectedHora,
    valueLocal,
    valueFuncao,
    auxilioCirurgicoAtivo,
    auxilioCirurgico,
  ]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = plantoes.filter((plantao) =>
      plantao.plantonista.toLowerCase().includes(text.toLowerCase())
    );

    if (filtered.length === 0) {
      setFilteredPlantoes([]);
    } else {
      setFilteredPlantoes(filtered);
    }
  };

  const handleCancel = () => {
    setIsSearchFocused(false);
    setSearchQuery("");
    setFilteredPlantoes(plantoes);
    Keyboard.dismiss();
    Animated.timing(searchBarWidth, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);

    Animated.timing(rotation, {
      toValue: popupVisible ? 0 : 1, // Alterna entre 0 (botão +) e 1 (botão X)
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeAll = () => {
    setPopupVisible(false);
    setModalVisible(false);
    setModalFixaVisible(false);
    backToNormalX();
  };

  const backToNormalX = () => {
    Animated.timing(rotation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"], // Rotaciona de + para X
  });

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
        </View>
      </View>
      <View style={styles.headerFilhoContainer}>
        <View style={styles.headerTitle}>
          {!isConcluido && <Text style={styles.plantaoTitle}>Escalas</Text>}
          {isConcluido && (
            <>
              <Text style={styles.plantaoTitle}>Escalas concluídas</Text>
              <Text style={styles.plantaoSubTitle}>30 últimas</Text>
            </>
          )}
        </View>
        <View style={styles.containerConcluidas}>
          {!isSearchFocused && !searchQuery.trim() && (
            <TouchableOpacity onPress={handleCheckmarkClick}>
              {isConcluido ? (
                <Ionicons name="return-up-back" size={28} color="white" />
              ) : (
                <FontAwesome6 name="check" size={24} color="white" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.searchContainerPai}>
        <Animated.View
          style={[
            styles.searchBarContainer,
            {
              width: searchBarWidth.interpolate({
                inputRange: [80, 100],
                outputRange: ["80%", "100%"],
              }),
            },
          ]}
        >
          <FontAwesome5
            name="search"
            size={18}
            color="white"
            style={styles.iconSearch}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Pesquisar por médico"
            placeholderTextColor={"#ccc"}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={handleFocusSearchBar}
            onBlur={handleBlurSearchbar}
          />
        </Animated.View>
        <View style={styles.cancelarContainer}>
          {isSearchFocused && (
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.plantaoContainer}>
        {filteredPlantoes.length > 0 ? (
          <FlatList
            style={styles.flatListContainer}
            data={filteredPlantoes}
            renderItem={({ item }) => (
              <PlantaoItem
                plantao={item}
                onPress={() => {
                  if (item.concluido) {
                    openModalObs(item);
                  } else if (!item.concluido) {
                    openModalDelete(item);
                  }
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={1}
          />
        ) : searchQuery.trim() ? (
          <Text style={styles.errorMessage}>
            Nenhum médico encontrado com esse nome
          </Text>
        ) : loading ? (
          <ActivityIndicator style={{ flex: 1 }} size="small" color="white" />
        ) : plantoes.length > 0 ? (
          <FlatList
            style={styles.flatListContainer}
            data={plantoes}
            renderItem={({ item }) => (
              <PlantaoItem
                plantao={item}
                onPress={() => {
                  if (item.concluido) {
                    openModalObs(item);
                  } else if (!item.concluido) {
                    openModalDelete(item);
                  }
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={1}
          />
        ) : (
          <Text style={styles.errorMessage}>Nenhuma escala cadastrada</Text>
        )}
      </View>

      {/* Botão para abrir o modal */}
      <TouchableOpacity style={styles.addButton} onPress={togglePopup}>
        <Animated.View style={{ transform: [{ rotate: rotationInterpolate }] }}>
          <FontAwesome6 name="add" size={20} color="black" />
        </Animated.View>
      </TouchableOpacity>

      {/* Popup de opções */}
      {popupVisible && (
        <TouchableWithoutFeedback onPress={closeAll}>
          <View style={styles.overlay}>
            <View style={styles.popup}>
              <TouchableOpacity
                style={styles.popupButton}
                onPress={() => {
                  setPopupVisible(false);
                  resetModal();
                  setModalVisible(true);
                  backToNormalX();
                }}
              >
                <Text style={styles.popupText}>Escala diária</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popupButton}
                onPress={() => {
                  setModalFixaVisible(true);
                  setPopupVisible(false);
                  backToNormalX();
                }}
              >
                <Text style={styles.popupText}>Escala fixa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Modal Escala Fixa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFixaVisible}
      >
        <View style={styles.modalContentFixa}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Cadastrar repetição</Text>
            <TouchableOpacity
              onPress={() => {
                setModalFixaVisible(false);
              }}
            >
              <Ionicons name="close-circle" size={33} color={"#bf3d3d"} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 500 }}
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {escalas.map((escala) => (
              <View key={escala.id}>
                {/* Botão expansível */}
                <View style={styles.viewCard}>
                  <TouchableOpacity
                    style={styles.escalaButton}
                    onPress={() => toggleEscala(escala.id)}
                  >
                    <Text style={styles.escalaText}>Nova escala fixa</Text>
                    <Ionicons
                      name={
                        // Verificando se todos os campos estão preenchidos e a validação do auxilio
                        escala.dias.length > 0 &&
                        escala.hora &&
                        escala.medico &&
                        escala.local &&
                        escala.funcao &&
                        (!escala.auxiliocirurgicoativo ||
                          escala.auxiliocirurgico) // Verificação do estado de auxilia cirúrgico
                          ? "checkmark-circle" // Se todos os valores estão preenchidos e validado
                          : escala.aberta
                          ? "chevron-up" // Se a escala está aberta
                          : "chevron-down" // Caso contrário
                      }
                      size={24}
                      color={
                        escala.dias.length > 0 &&
                        escala.hora &&
                        escala.medico &&
                        escala.local &&
                        escala.funcao &&
                        (!escala.auxiliocirurgicoativo ||
                          escala.auxiliocirurgico) // Verificação extra
                          ? "#59994e" // Cor verde se completa e validado
                          : "white" // Cor branca caso contrário
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.trashButton}
                    onPress={() => deletarEscala(escala.id)}
                  >
                    <FontAwesome6 name="trash-alt" size={15} color="#bf3d3d" />
                  </TouchableOpacity>
                </View>
                {escala.aberta && (
                  <View style={styles.escalaContent}>
                    {/* Botão para abrir o calendário */}
                    <View style={styles.containerDataHora}>
                      {renderLabelDataFixa(escala.id)}
                      <TouchableOpacity
                        style={[
                          styles.dropdownEscalaFixa,
                          escala.dias.length > 0 && { borderColor: "#59994e" },
                        ]}
                        onPress={() => {
                          setEscalaAbertaId(escala.id); // Define a escala ativa ao clicar
                          resetDates();
                          handleConfirmRangeReset(escala.id);
                          setModalCalendarioVisible(true);
                        }}
                      >
                        <Text style={styles.textDropDownCalendario}>
                          {escala.dias.length > 0
                            ? `${escala.dias.length} dias`
                            : "Dias"}
                        </Text>
                      </TouchableOpacity>

                      {/* Seletor de Hora */}
                      {renderLabelFixaMisc(escala.id, "hora")}
                      <TouchableOpacity
                        style={[
                          styles.buttonSeletor,
                          (showTimePicker || escala.hora) && {
                            borderColor: "#59994e",
                          },
                        ]}
                        onPress={toggleTimePicker}
                      >
                        <Text style={styles.textDateTimePicker}>
                          {escala.hora ? escala.hora : "Hora"}
                        </Text>
                      </TouchableOpacity>
                      {Platform.OS === "ios" && showTimePicker && (
                        <Modal
                          transparent={true}
                          animationType="fade"
                          onRequestClose={() => toggleTimePickerFalse()}
                        >
                          <View style={styles.modalContainer}>
                            <View style={styles.modalContentSpinner}>
                              <DateTimePicker
                                themeVariant="light"
                                locale="pt-BR"
                                value={time.toDate()}
                                mode="time"
                                display="spinner"
                                onChange={handleTempTimeFixa}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  toggleTimePickerFalse();
                                  atualizarEscala(
                                    escala.id,
                                    "hora",
                                    selectedHoraFixa
                                  );
                                }}
                                style={styles.confirmButton}
                              >
                                <Text style={styles.confirmButtonText}>
                                  Confirmar
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>
                      )}
                    </View>

                    <Modal
                      animationType="fade"
                      transparent
                      visible={modalCalendarioVisible}
                      onRequestClose={() => {
                        setModalCalendarioVisible(false);
                      }}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContentCalendario}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                if (selectedMonth === 0) {
                                  setSelectedMonth(11);
                                  setSelectedYear((prev) => prev - 1);
                                } else {
                                  setSelectedMonth((prev) => prev - 1);
                                }
                              }}
                            >
                              <FontAwesome6
                                name="circle-chevron-left"
                                size={26}
                                color="white"
                              />
                            </TouchableOpacity>

                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              {`${monthNames[selectedMonth]} ${selectedYear}`}
                            </Text>

                            <TouchableOpacity
                              onPress={() => {
                                if (selectedMonth === 11) {
                                  setSelectedMonth(0);
                                  setSelectedYear((prev) => prev + 1);
                                } else {
                                  setSelectedMonth((prev) => prev + 1);
                                }
                              }}
                            >
                              <FontAwesome6
                                name="circle-chevron-right"
                                size={26}
                                color="white"
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={{ marginTop: 20 }}>
                            {weekdays.map((day, index) => (
                              <View
                                key={index}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: 10,
                                }}
                              >
                                <Text style={{ color: "white" }}>{day}</Text>
                                <Switch
                                  value={selectedWeekdays.includes(index)}
                                  onValueChange={() => toggleWeekday(index)}
                                />
                              </View>
                            ))}
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              handleConfirmRangeProximo(escala.id);
                            }}
                            style={[
                              styles.confirmButton,
                              selectedWeekdays.length === 0 &&
                                styles.buttonDisabled,
                            ]}
                            disabled={selectedWeekdays.length === 0}
                          >
                            <Text
                              style={[
                                {
                                  textAlign: "center",
                                  lineHeight: 24,
                                  color: "#FFFFFF",
                                  fontSize: 15,
                                  fontWeight: "600",
                                },
                                selectedWeekdays.length === 0 &&
                                  styles.textConfirmButtonDisabled,
                              ]}
                            >
                              Próximo
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                    <Modal
                      animationType="fade"
                      transparent
                      visible={showSelectedDatesView}
                      onRequestClose={() => {
                        setModalCalendarioVisible(false);
                        setShowSelectedDatesView(false);
                      }}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContentCalendario}>
                          <View>
                            <ScrollView
                              style={{ maxHeight: 400 }} // Limita a altura e adiciona scroll quando necessário
                              contentContainerStyle={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-around",
                                paddingBottom: 10,
                              }}
                            >
                              {escala.dias.length > 0 ? (
                                escala.dias.map((date, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                      removeDate(
                                        dayjs(date, "DD/MM/YYYY").toDate(),
                                        escala.id
                                      )
                                    }
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      backgroundColor: "#081e27",
                                      padding: 10,
                                      borderRadius: 8,
                                      marginVertical: 5,
                                    }}
                                  >
                                    <Text style={{ color: "white" }}>
                                      {dayjs(date).format("DD/MM/YYYY")}
                                    </Text>
                                    <FontAwesome6
                                      name="trash-alt"
                                      size={20}
                                      color="#bf3d3d"
                                      style={{ marginLeft: 10 }}
                                    />
                                  </TouchableOpacity>
                                ))
                              ) : (
                                <Text style={{ color: "gray" }}>
                                  Nenhum dia selecionado.
                                </Text>
                              )}
                            </ScrollView>

                            <TouchableOpacity
                              onPress={() =>
                                handleConfirmRangeCalendario(escala.id)
                              }
                              style={styles.confirmButton}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  lineHeight: 24,
                                  color: "#FFFFFF",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                Confirmar
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>

                    <View style={styles.betweenInput}>
                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={20}
                        color="black"
                      />
                    </View>

                    {/* Seletor de Médico */}
                    <TouchableOpacity
                      onPress={() => {
                        dropdownMedicoRef.current.open();
                      }}
                      style={styles.containerMedico}
                    >
                      {/* Usando onLayout no contêiner */}
                      {renderLabelFixaMisc(escala.id, "medico")}
                      <Dropdown
                        ref={dropdownMedicoRef}
                        style={[
                          styles.dropdown,
                          (escala.medico || isFocusMedico) && {
                            borderColor: "#59994e",
                          },
                        ]}
                        containerStyle={[styles.dropdownList]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemContainerStyle={styles.selectedItemStyle}
                        onFocus={() => {
                          setIsFocusMedico(true); // Marca o dropdown como em foco
                        }}
                        onBlur={() => {
                          setIsFocusMedico(false);
                        }}
                        labelField="value"
                        valueField="value"
                        maxHeight={300}
                        value={escala.medico}
                        onChange={(item) => {
                          setValueMedico(item.value);
                          atualizarEscala(escala.id, "medico", item.value);
                          setIsFocusMedico(false);
                        }}
                        data={itemsMedico}
                        search
                        placeholder={
                          isFocusMedico ? "..." : "Selecione o médico"
                        }
                        searchPlaceholder="Busque..."
                      />
                    </TouchableOpacity>

                    <View style={styles.betweenInput}>
                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={20}
                        color="black"
                      />
                    </View>

                    {/* Seletor de Local */}
                    <TouchableOpacity
                      onPress={() => {
                        dropdownLocalRef.current.open();
                      }}
                      style={styles.containerLocal}
                    >
                      {renderLabelFixaMisc(escala.id, "local")}
                      <Dropdown
                        ref={dropdownLocalRef}
                        style={[
                          styles.dropdown,
                          (escala.local || isFocusHospital) && {
                            borderColor: "#59994e",
                          },
                        ]}
                        containerStyle={[styles.dropdownList]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemContainerStyle={styles.selectedItemStyle}
                        onFocus={() => setIsFocusedHospital(true)}
                        onBlur={() => setIsFocusedHospital(false)}
                        labelField="value"
                        valueField="value"
                        maxHeight={350}
                        value={escala.local}
                        onChange={(item) => {
                          atualizarEscala(escala.id, "local", item.value);
                          setIsFocusedHospital(false);
                        }}
                        data={itemsLocal}
                        search
                        placeholder={
                          isFocusHospital ? "..." : "Selecione o hospital"
                        }
                        searchPlaceholder="Busque..."
                      />
                    </TouchableOpacity>

                    <View style={styles.betweenInput}>
                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={20}
                        color="black"
                      />
                    </View>

                    {/* Seletor de Função */}
                    <TouchableOpacity
                      onPress={() => {
                        dropdownFuncaoRef.current.open();
                      }}
                      style={styles.containerFuncao}
                    >
                      {renderLabelFixaMisc(escala.id, "funcao")}
                      <Dropdown
                        ref={dropdownFuncaoRef}
                        style={[
                          styles.dropdown,
                          (escala.funcao || isFocusFuncao) && {
                            borderColor: "#59994e",
                          },
                        ]}
                        containerStyle={[styles.dropdownList]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        itemContainerStyle={styles.selectedItemStyle}
                        onFocus={() => setIsFocusFuncao(true)}
                        onBlur={() => setIsFocusFuncao(false)}
                        labelField="label"
                        valueField="value"
                        maxHeight={300}
                        value={escala.funcao}
                        onChange={(item) => {
                          atualizarEscala(escala.id, "funcao", item.value);
                          setIsFocusFuncao(false);
                          if (item.value !== "Cirurgião") {
                            atualizarEscala(escala.id, "auxiliocirurgico", "");
                            atualizarSwitch(
                              escala.id,
                              "auxiliocirurgicoativo",
                              false
                            );
                          }
                        }}
                        data={itemsFuncao}
                        placeholder={
                          isFocusFuncao ? "..." : "Selecione a função"
                        }
                      />
                    </TouchableOpacity>

                    {/* Seletor de Auxílio Cirúgico */}
                    {escala.funcao === "Cirurgião" && (
                      <View
                        style={{
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        {/* Linha com o texto e o Switch */}
                        <View style={styles.betweenInput}>
                          <MaterialCommunityIcons
                            name="dots-horizontal"
                            size={20}
                            color="black"
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            marginBottom: 30,
                          }}
                        >
                          <Text style={{ fontSize: 16, color: "white" }}>
                            Auxílio Cirúrgico?
                          </Text>
                          <Switch
                            value={escala.auxiliocirurgicoativo}
                            onValueChange={(value) => {
                              if (!value) {
                                atualizarSwitch(
                                  escala.id,
                                  "auxiliocirurgicoativo",
                                  false
                                );
                                atualizarEscala(
                                  escala.id,
                                  "auxiliocirurgico",
                                  ""
                                );
                                setIsFocusAuxilio(false);
                              }
                              if (value) {
                                atualizarSwitch(
                                  escala.id,
                                  "auxiliocirurgicoativo",
                                  true
                                );
                              }
                            }}
                          />
                        </View>

                        {/* Dropdown aparece apenas se o switch estiver ativado */}
                        {escala.auxiliocirurgicoativo && (
                          <View style={{ width: "100%", alignItems: "center" }}>
                            <TouchableOpacity
                              onPress={() => {
                                dropdownAuxilioRef.current.open();
                              }}
                              style={styles.containerFuncao}
                            >
                              {renderLabelFixaMisc(
                                escala.id,
                                "auxiliocirurgico"
                              )}
                              <Dropdown
                                ref={dropdownAuxilioRef}
                                style={[
                                  styles.dropdown,
                                  (isFocusAuxilio ||
                                    escala.auxiliocirurgico) && {
                                    borderColor: "#59994e",
                                  },
                                ]}
                                containerStyle={styles.dropdownList}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemContainerStyle={styles.selectedItemStyle}
                                onFocus={() => setIsFocusAuxilio(true)}
                                onBlur={() => setIsFocusAuxilio(false)}
                                labelField="value"
                                valueField="value"
                                maxHeight={300}
                                value={escala.auxiliocirurgico}
                                onChange={(item) => {
                                  atualizarEscala(
                                    escala.id,
                                    "auxiliocirurgico",
                                    item.value
                                  );
                                  setIsFocusAuxilio(false);
                                }}
                                data={filteredAuxilioCirurgicoFixa(
                                  escala.medico
                                )}
                                placeholder={
                                  isFocusAuxilio
                                    ? "..."
                                    : "Selecione o auxílio cirúrgico"
                                }
                                search
                                searchPlaceholder="Busque..."
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}

            {/* Botão para adicionar mais escalas */}
            {escalas.length < 5 && (
              <TouchableOpacity
                style={styles.addButtonFixa}
                onPress={adicionarEscala}
              >
                <Entypo name="add-to-list" size={24} color="white" />
              </TouchableOpacity>
            )}

            {/* Botão "Confirmar" */}
            <TouchableOpacity
              style={[
                styles.confirmButtonFixa,
                (loading ||
                  !escalas.every(
                    (escala) =>
                      escala.dias.length > 0 &&
                      escala.hora &&
                      escala.medico &&
                      escala.local &&
                      escala.funcao &&
                      (!escala.auxiliocirurgicoativo || escala.auxiliocirurgico) // Adiciona a nova regra
                  )) &&
                  styles.buttonDisabled,
              ]}
              onPress={async () => {
                const escalasCompletas = escalas.filter(
                  (escala) =>
                    escala.dias.length > 0 &&
                    escala.hora &&
                    escala.medico &&
                    escala.local &&
                    escala.funcao &&
                    (!escala.auxiliocirurgicoativo || escala.auxiliocirurgico) // Validação extra
                );

                if (escalasCompletas.length === escalas.length) {
                  setLoading(true);
                  await handleRegisterFixedShift();
                  setModalFixaVisible(false);
                  setEscalas([]);
                  setLoading(false);
                } else {
                  console.error("Nenhuma escala completa encontrada.");
                }
              }}
              disabled={
                !escalas.every(
                  (escala) =>
                    escala.dias.length > 0 &&
                    escala.hora &&
                    escala.medico &&
                    escala.local &&
                    escala.funcao &&
                    (!escala.auxiliocirurgicoativo || escala.auxiliocirurgico) // Validação extra
                ) || loading
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    loading ||
                    !escalas.every(
                      (escala) =>
                        escala.dias.length > 0 &&
                        escala.hora &&
                        escala.medico &&
                        escala.local &&
                        escala.funcao &&
                        (!escala.auxiliocirurgicoativo ||
                          escala.auxiliocirurgico) // Validação extra
                    )
                      ? styles.textConfirmButtonDisabled
                      : styles.textConfirmButtonEnabled,
                  ]}
                >
                  Confirmar
                </Text>

                {loading && (
                  <ActivityIndicator
                    style={{ marginLeft: 10 }}
                    size="small"
                    color="black"
                  />
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Escala Diária */}
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
          <ScrollView
            contentContainerStyle={{ paddingBottom: 500, alignItems: "center" }}
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.containerDataHora}>
              {/* Seletor de Data */}
              <TouchableOpacity
                style={[
                  styles.buttonSeletor,
                  (showDatePicker || selectedDate) && {
                    borderColor: "#59994e",
                  },
                ]}
                onPress={toggleDatePicker}
              >
                <Text style={styles.textDateTimePicker}>
                  {selectedDate ? selectedDatePicker : "Data"}
                </Text>
              </TouchableOpacity>
              {renderLabelData()}
              {Platform.OS === "ios" && showDatePicker && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => toggleDatePickerFalse()}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContentSpinner}>
                      <DateTimePicker
                        themeVariant="light"
                        locale="pt-BR"
                        value={date.toDate()}
                        mode="date"
                        display="spinner"
                        onChange={handleTempDate}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          toggleDatePickerFalse();
                        }}
                        style={styles.confirmButton}
                      >
                        <Text style={styles.confirmButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

              {/* Seletor de Hora */}
              <TouchableOpacity
                style={[
                  styles.buttonSeletor,
                  (showTimePicker || selectedHora) && {
                    borderColor: "#59994e",
                  },
                ]}
                onPress={toggleTimePicker}
              >
                <Text style={styles.textDateTimePicker}>
                  {selectedHora ? selectedHora : "Hora"}
                </Text>
              </TouchableOpacity>
              {renderLabelHora()}
              {Platform.OS === "ios" && showTimePicker && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => toggleTimePickerFalse()}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContentSpinner}>
                      <DateTimePicker
                        themeVariant="light"
                        locale="pt-BR"
                        value={time.toDate()}
                        mode="time"
                        display="spinner"
                        onChange={handleTempTime}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          toggleTimePickerFalse();
                        }}
                        style={styles.confirmButton}
                      >
                        <Text style={styles.confirmButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </View>

            <View style={styles.betweenInput}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color="black"
              />
            </View>

            {/* Seletor de Médico */}
            <TouchableOpacity
              onPress={() => {
                dropdownMedicoRef.current.open();
              }}
              style={styles.containerMedico}
            >
              {renderLabelMedico()}
              <Dropdown
                ref={dropdownMedicoRef}
                style={[
                  styles.dropdown,
                  (isFocusMedico || valueMedico) && {
                    borderColor: "#59994e",
                  },
                ]}
                containerStyle={[styles.dropdownList]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemContainerStyle={styles.selectedItemStyle}
                onFocus={() => {
                  setIsFocusMedico(true);
                }}
                onBlur={() => {
                  setIsFocusMedico(false);
                }}
                labelField="value"
                valueField="value"
                maxHeight={300}
                value={valueMedico}
                onChange={(item) => {
                  setValueMedico(item.value);
                  setIsFocusMedico(false);
                }}
                data={itemsMedico}
                search
                placeholder={isFocusMedico ? "..." : "Selecione o médico"}
                searchPlaceholder="Busque..."
              />
            </TouchableOpacity>

            <View style={styles.betweenInput}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color="black"
              />
            </View>

            {/* Seletor de Local */}
            <TouchableOpacity
              onPress={() => {
                dropdownLocalRef.current.open();
              }}
              style={styles.containerLocal}
            >
              {renderLabelLocal()}
              <Dropdown
                ref={dropdownLocalRef}
                style={[
                  styles.dropdown,
                  (isFocusHospital || valueLocal) && {
                    borderColor: "#59994e",
                  },
                ]}
                containerStyle={[styles.dropdownList]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemContainerStyle={styles.selectedItemStyle}
                onFocus={() => setIsFocusedHospital(true)}
                onBlur={() => setIsFocusedHospital(false)}
                labelField="value"
                valueField="value"
                maxHeight={350}
                value={valueLocal}
                onChange={(item) => {
                  setValueLocal(item.value);
                  setIsFocusedHospital(false);
                }}
                data={itemsLocal}
                search
                placeholder={isFocusHospital ? "..." : "Selecione o hospital"}
                searchPlaceholder="Busque..."
              />
            </TouchableOpacity>

            <View style={styles.betweenInput}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color="black"
              />
            </View>

            {/* Seletor de Função */}
            <TouchableOpacity
              onPress={() => {
                dropdownFuncaoRef.current.open();
              }}
              style={styles.containerFuncao}
            >
              {renderLabelFuncao()}
              <Dropdown
                ref={dropdownFuncaoRef}
                style={[
                  styles.dropdown,
                  (isFocusFuncao || valueFuncao) && {
                    borderColor: "#59994e",
                  },
                ]}
                containerStyle={[styles.dropdownList]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemContainerStyle={styles.selectedItemStyle}
                onFocus={() => setIsFocusFuncao(true)}
                onBlur={() => setIsFocusFuncao(false)}
                labelField="label"
                valueField="value"
                maxHeight={300}
                value={valueFuncao}
                onChange={(item) => {
                  setValueFuncao(item.value);
                  setIsFocusFuncao(false);
                  if (item.value !== "Cirurgião") {
                    setAuxilioCirurgico("");
                  }
                }}
                data={itemsFuncao}
                placeholder={isFocusFuncao ? "..." : "Selecione a função"}
              />
            </TouchableOpacity>

            {/* Seletor de Auxílio Cirúgico */}
            {valueFuncao === "Cirurgião" && (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                {/* Linha com o texto e o Switch */}
                <View style={styles.betweenInput}>
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={20}
                    color="black"
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    marginBottom: 30,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>
                    Auxílio Cirúrgico?
                  </Text>
                  <Switch
                    value={auxilioCirurgicoAtivo}
                    onValueChange={(value) => {
                      setAuxilioCirurgicoAtivo(value);
                      if (!value) {
                        setAuxilioCirurgico(""); // Limpa o valor ao desativar
                      }
                    }}
                  />
                </View>

                {/* Dropdown aparece apenas se o switch estiver ativado */}
                {auxilioCirurgicoAtivo && (
                  <View style={{ width: "100%", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                        dropdownAuxilioRef.current.open();
                      }}
                      style={styles.containerFuncao}
                    >
                      {renderLabelAuxilio()}
                      <Dropdown
                        ref={dropdownAuxilioRef}
                        style={[
                          styles.dropdown,
                          (isFocusAuxilio || auxilioCirurgico) && {
                            borderColor: "#59994e",
                          },
                        ]}
                        containerStyle={styles.dropdownList}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemContainerStyle={styles.selectedItemStyle}
                        onFocus={() => setIsFocusAuxilio(true)}
                        onBlur={() => setIsFocusAuxilio(false)}
                        labelField="value"
                        valueField="value"
                        maxHeight={300}
                        value={auxilioCirurgico}
                        onChange={(item) => {
                          setAuxilioCirurgico(item.value);
                          setIsFocusAuxilio(false);
                        }}
                        data={filteredAuxilioCirurgico}
                        placeholder={
                          isFocusAuxilio
                            ? "..."
                            : "Selecione o auxílio cirúrgico"
                        }
                        search
                        searchPlaceholder="Busque..."
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.confirmarPlantaoText,
                    !isButtonEnabled && styles.buttonTextDisabled,
                  ]}
                >
                  Confirmar
                </Text>
                {submitting && (
                  <ActivityIndicator
                    style={{ marginLeft: 10 }}
                    size="small"
                    color="white"
                  />
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
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
      <Modal visible={isModalDeleteVisible} transparent animationType="fade">
        {selectedPlantao && (
          <View style={stylesModal.overlayDelete}>
            <View style={stylesModal.modalContentDelete}>
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
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => closeModalDelete()}
                  style={stylesModal.closeButtonDelete}
                >
                  <Text style={stylesModal.closeButtonTextDelete}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteShift(selectedPlantao.id)}
                  style={[
                    stylesModal.deleteButton,
                    { opacity: submitting ? 0.6 : 1 },
                  ]}
                  disabled={submitting}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={stylesModal.titleDelete}>Excluir escala</Text>
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
            </View>
          </View>
        )}
      </Modal>
      <Modal visible={showModalAtencao} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalAtencaoContent}>
            <Text style={styles.modalAtencaoTitle}>{modalAtencaoTitle}</Text>

            <ScrollView>
              <Text style={styles.modalAtencaoMessage}>
                {modalAtencaoMessage}
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowModalAtencao(false)}
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
