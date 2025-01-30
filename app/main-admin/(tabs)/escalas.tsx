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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
import { Calendar } from "react-native-calendario";

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
    setSelectedRange,
    selectedRange,
    handleConfirmRangeCalendario,
    atualizarEscala,
    handleClearRangeCalendario,
    handleTempTimeFixa,
    selectedHoraFixa,
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
  const [isFocusHospital, setIsFocusedHospital] = useState(false);
  const dropdownMedicoRef = useRef<any>(null);
  const dropdownLocalRef = useRef<any>(null);
  const dropdownFuncaoRef = useRef<any>(null);
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
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Cadastrar repetição</Text>
            <TouchableOpacity
              onPress={() => {
                resetModal();
                setModalFixaVisible(false);
              }}
            >
              <Ionicons name="close-circle" size={33} color={"#bf3d3d"} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollContainer}>
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
                      name={escala.aberta ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="white"
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
                      <TouchableOpacity
                        style={styles.dropdownEscalaFixa}
                        onPress={() => setModalCalendarioVisible(true)}
                      >
                        <Text style={styles.textDropDownCalendario}>
                          Calendário
                        </Text>
                      </TouchableOpacity>

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

                    {/* Modal do calendário */}
                    <Modal
                      animationType="fade"
                      transparent
                      visible={modalCalendarioVisible}
                      onRequestClose={() => setModalCalendarioVisible(false)}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContentCalendario}>
                          <Text style={styles.modalTitleCalendario}>
                            Selecione os dias
                          </Text>
                          <Calendar
                            locale="br"
                            onPress={(date) => {
                              if (!selectedRange.startDate) {
                                setSelectedRange({ startDate: date });
                              } else if (
                                !selectedRange.endDate &&
                                date > selectedRange.startDate
                              ) {
                                setSelectedRange({
                                  ...selectedRange,
                                  endDate: date,
                                });
                              } else {
                                setSelectedRange({ startDate: date });
                              }
                            }}
                            minDate={new Date()}
                            startDate={selectedRange.startDate}
                            endDate={selectedRange.endDate}
                            theme={{
                              activeDayColor: "red",
                              monthTitleTextStyle: {
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 25,
                              },
                              emptyMonthContainerStyle: {},
                              emptyMonthTextStyle: {
                                fontWeight: "200",
                              },
                              weekColumnsContainerStyle: {},
                              weekColumnStyle: {
                                paddingVertical: 10,
                              },
                              weekColumnTextStyle: {
                                color: "#b6c1cd",
                                fontSize: 13,
                              },
                              nonTouchableDayContainerStyle: {},
                              nonTouchableDayTextStyle: {
                                color: "#2d4150",
                              },
                              startDateContainerStyle: {},
                              endDateContainerStyle: {},
                              dayContainerStyle: {
                                backgroundColor: "#012E40",
                              },
                              dayTextStyle: {
                                color: "white",
                                fontSize: 15,
                              },
                              dayOutOfRangeContainerStyle: {},
                              dayOutOfRangeTextStyle: {},
                              todayContainerStyle: {},
                              todayTextStyle: {
                                color: "#6d95da",
                                fontWeight: "bold",
                              },
                              activeDayContainerStyle: {
                                backgroundColor: "#1A4D5C",
                                borderRadius: 30,
                              },
                              activeDayTextStyle: {
                                color: "white",
                                fontWeight: "bold",
                              },
                              nonTouchableLastMonthDayTextStyle: {},
                            }}
                          />
                          {/* Botões de ação */}
                          <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => {
                              handleConfirmRangeCalendario(escala.id);
                              handleClearRangeCalendario();
                            }}
                          >
                            <Text style={styles.buttonText}>Confirmar</Text>
                          </TouchableOpacity>
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
                      {renderLabelMedico()}
                      {/* Usando onLayout no contêiner */}
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
                        onFocus={() => setIsFocusFuncao(true)}
                        onBlur={() => setIsFocusFuncao(false)}
                        labelField="label"
                        valueField="value"
                        maxHeight={300}
                        value={escala.funcao}
                        onChange={(item) => {
                          atualizarEscala(escala.id, "funcao", item.value);
                          setIsFocusFuncao(false);
                        }}
                        data={itemsFuncao}
                        placeholder={
                          isFocusFuncao ? "..." : "Selecione a função"
                        }
                        searchPlaceholder="Busque..."
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}

            {/* Botão para adicionar mais escalas */}
            <TouchableOpacity
              style={styles.addButtonFixa}
              onPress={adicionarEscala}
            >
              <Entypo name="add-to-list" size={24} color="white" />
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
              onFocus={() => setIsFocusFuncao(true)}
              onBlur={() => setIsFocusFuncao(false)}
              labelField="label"
              valueField="value"
              maxHeight={300}
              value={valueFuncao}
              onChange={(item) => {
                setValueFuncao(item.value);
                setIsFocusFuncao(false);
              }}
              data={itemsFuncao}
              placeholder={isFocusFuncao ? "..." : "Selecione a função"}
              searchPlaceholder="Busque..."
            />
          </TouchableOpacity>

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
