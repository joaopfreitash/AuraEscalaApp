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
    handleDateConfirm,
    handleTimeConfirm,
    toggleDatePicker,
    toggleTimePicker,
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

  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());

  const [isFocusMedico, setIsFocusMedico] = useState(false);
  const [isFocusFuncao, setIsFocusFuncao] = useState(false);
  const [isFocusHospital, setIsFocusedHospital] = useState(false);
  const dropdownMedicoRef = useRef<any>(null);
  const dropdownLocalRef = useRef<any>(null);
  const dropdownFuncaoRef = useRef<any>(null);
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
          <ActivityIndicator style={{ flex: 1 }} size="large" color="white" />
        ) : (
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
        )}
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

          <View style={styles.containerDataHora}>
            {/* Seletor de Data */}
            <TouchableOpacity
              style={[
                styles.buttonSeletor,
                (showDatePicker || selectedDate) && { borderColor: "#59994e" },
              ]}
              onPress={toggleDatePicker}
            >
              <Text style={styles.textDateTimePicker}>
                {selectedDate ? selectedDatePicker : "Data"}
              </Text>
            </TouchableOpacity>
            {renderLabelData()}
            {showDatePicker && (
              <DateTimePicker
                value={date.toDate()}
                mode="date"
                display="default"
                onChange={handleDateConfirm}
              />
            )}

            {/* Seletor de Hora */}
            <TouchableOpacity
              style={[
                styles.buttonSeletor,
                (showTimePicker || selectedHora) && { borderColor: "#59994e" },
              ]}
              onPress={toggleTimePicker}
            >
              <Text style={styles.textDateTimePicker}>
                {selectedHora ? selectedHora : "Hora"}
              </Text>
            </TouchableOpacity>
            {renderLabelHora()}
            {showTimePicker && (
              <DateTimePicker
                value={time.toDate()}
                mode="time"
                display="default"
                onChange={handleTimeConfirm}
              />
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
                (isFocusMedico || valueMedico) && { borderColor: "#59994e" },
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
                (isFocusHospital || valueLocal) && { borderColor: "#59994e" },
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
                (isFocusFuncao || valueFuncao) && { borderColor: "#59994e" },
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
