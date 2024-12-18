import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  Keyboard,
  Modal,
  SafeAreaView,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";

import styles from "@/src/styles/locaisScreenStyle";
import LocalItem from "@/src/components/localItem";
import locaisHooks from "@/src/hooks/locaisHooks";
import searchBar from "@/src/utils/searchBar";

export default function LocaisScreen() {
  const navigation = useNavigation();

  const {
    handleFocusSearchBar,
    handleBlurSearchbar,
    searchBarWidth,
    isSearchFocused,
    searchQuery,
    setSearchQuery,
    setIsSearchFocused,
  } = searchBar();

  const {
    filteredHospitais,
    setFilteredHospitais,
    enderecoHospital,
    setIsButtonEnabled,
    nomeHospital,
    hospitais,
    setModalVisible,
    modalVisible,
    handleRegisterHospital,
    resetModal,
    fetchHospitals,
    handleFocus,
    setEnderecoHospital,
    isNomeFocused,
    setNomeHospital,
    nomeInputRef,
    setIsNomeFocused,
    enderecoInputRef,
    alertLocal,
    isEnderecoFocused,
    setIsEnderecoFocused,
    isButtonEnabled,
    labelNomeAnimation,
    labelEnderecoAnimation,
  } = locaisHooks();

  const handleCancel = () => {
    setIsSearchFocused(false);
    setSearchQuery("");
    setFilteredHospitais(hospitais);
    Keyboard.dismiss();
    Animated.timing(searchBarWidth, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

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
        title: "Voltar",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#081e27",
        },
        headerTintColor: "#fff",
      });
    }
  }, [modalVisible, navigation]);

  // Chama a função de buscar médicos assim que o componente é montado
  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text); // Atualiza a query de pesquisa

    const filtered = hospitais.filter((hospital) =>
      hospital.name.toLowerCase().includes(text.toLowerCase())
    );
    if (filtered.length === 0) {
      setFilteredHospitais([]); // Define a lista filtrada como vazia
    } else {
      setFilteredHospitais(filtered); // Atualiza os médicos filtrados
    }
  };

  //Verificar se campos preenchidos para habilitar botão Confirmar
  const checkFields = () => {
    if (nomeHospital && enderecoHospital) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  useEffect(() => {
    checkFields();
  }, [nomeHospital, enderecoHospital]);

  return (
    <SafeAreaView style={styles.containerPai}>
      <View style={styles.medicosContainer}>
        <View style={styles.header}>
          <Text style={styles.medicosTitle}>Hospitais</Text>
        </View>

        {/* Campo de pesquisa */}
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
              placeholder="Pesquisar por nome"
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
        {filteredHospitais.length > 0 ? (
          <FlatList
            style={styles.flatListContainer}
            data={filteredHospitais}
            renderItem={({ item }) => <LocalItem hospital={item} />}
            keyExtractor={(item) => item.id}
            numColumns={1}
          />
        ) : searchQuery.trim() ? (
          <Text style={styles.errorMessage}>
            Nenhum hospital encontrado com esse nome
          </Text>
        ) : (
          <FlatList
            style={styles.flatListContainer}
            data={hospitais}
            renderItem={({ item }) => <LocalItem hospital={item} />}
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
            <Text style={styles.modalTitle}>Cadastrar hospital</Text>
            <TouchableOpacity
              onPress={() => {
                resetModal();
              }}
            >
              <Ionicons name="close-circle" size={33} color={"#bf3d3d"} />
            </TouchableOpacity>
          </View>

          {/* Input de Nome*/}
          <View style={styles.containerNome}>
            <Animated.Text
              style={[
                styles.inputLabel,
                {
                  top: labelNomeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, -20],
                  }),
                  fontSize: labelNomeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 12],
                  }),
                  fontWeight: labelNomeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["400", "600"],
                  }),
                },
              ]}
            >
              Nome
            </Animated.Text>
            <TextInput
              value={nomeHospital}
              style={[
                styles.inputBox,
                !nomeHospital ? styles.placeholderStyleNome : styles.textStyle,
              ]}
              placeholder={!isNomeFocused ? "Nome do hospital" : ""}
              onChangeText={setNomeHospital}
              placeholderTextColor="#191a1c"
              ref={nomeInputRef}
              autoCapitalize="words"
              onFocus={() => handleFocus(labelNomeAnimation, setIsNomeFocused)}
            ></TextInput>
            <FontAwesome6
              name="edit"
              size={20}
              color="black"
              style={styles.iconEdit}
            />
          </View>

          <View style={styles.betweenInput}>
            <FontAwesome name="level-down" size={30} color="black" />
          </View>

          {/* Input de Endereço */}
          <View style={styles.containerEndereço}>
            <Animated.Text
              style={[
                styles.inputLabel,
                {
                  top: labelEnderecoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, -20],
                  }),
                  fontSize: labelEnderecoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 12],
                  }),
                  fontWeight: labelEnderecoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["400", "600"],
                  }),
                },
              ]}
            >
              Endereço
            </Animated.Text>
            <TextInput
              value={enderecoHospital}
              style={[
                styles.inputBox,
                !enderecoHospital
                  ? styles.placeholderStyleEndereco
                  : styles.textStyle,
              ]}
              ref={enderecoInputRef}
              placeholder={!isEnderecoFocused ? "Endereço" : ""}
              placeholderTextColor="#191a1c"
              onChangeText={setEnderecoHospital}
              autoCapitalize="words"
              onFocus={() =>
                handleFocus(labelEnderecoAnimation, setIsEnderecoFocused)
              }
            ></TextInput>
            <FontAwesome6
              name="edit"
              size={20}
              color="black"
              style={styles.iconEdit}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.confirmarPlantaoButton,
              !isButtonEnabled && styles.buttonDisabled,
            ]}
            disabled={!isButtonEnabled}
            onPress={() => {
              handleRegisterHospital(nomeHospital, enderecoHospital);
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
      <FlashMessage ref={alertLocal} />
    </SafeAreaView>
  );
}
