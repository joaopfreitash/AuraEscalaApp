import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  Keyboard,
  Image,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "@/src/styles/medicosScreenStyle";
import stylesModal from "@/src/styles/notificationModalStyle";
import MedicoItem from "@/src/components/medicoItem";
import medicosHooks from "@/src/hooks/medicosHooks";
import searchBar from "@/src/utils/searchBar";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Medico } from "@/src/types";
import PlantaoItem from "@/src/components/plantaoItem";
import plantoesHooks from "@/src/hooks/plantoesHooks";

export default function MedicosScreen() {
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
    fetchMedicos,
    medicos,
    filteredMedicos,
    setFilteredMedicos,
    filterType,
    toggleFilter,
    fetchPlantoes,
    plantoes,
    loading,
    handleDeleteShift,
    openModalDelete,
    closeModalDelete,
    isModalDeleteVisible,
    submitting,
    openModalObs,
    closeModal,
    isModalObsVisible,
    selectedPlantao,
  } = medicosHooks();

  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);

  // Chama a função de buscar médicos assim que o componente é montado
  useEffect(() => {
    fetchMedicos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMedicos();
    }, [])
  );

  // Filtra a lista com base no tipo selecionado
  useEffect(() => {
    if (filterType === "todos") {
      setFilteredMedicos(medicos);
    } else if (filterType === "adm") {
      setFilteredMedicos(medicos.filter((medico) => medico.isAdmin));
    } else if (filterType === "med") {
      setFilteredMedicos(medicos.filter((medico) => !medico.isAdmin));
    }
  }, [filterType, medicos]);

  const handleSearch = (text: string) => {
    setSearchQuery(text); // Atualiza a query de pesquisa

    const filtered = medicos.filter((medico) =>
      medico.nome.toLowerCase().includes(text.toLowerCase())
    );

    if (filtered.length === 0) {
      setFilteredMedicos([]);
    } else {
      setFilteredMedicos(filtered);
    }
  };

  const handleCancel = () => {
    setIsSearchFocused(false);
    setSearchQuery("");
    setFilteredMedicos(medicos);
    Keyboard.dismiss();
    Animated.timing(searchBarWidth, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSelectMedico = (medico: Medico) => {
    setSelectedMedico(medico);
    fetchPlantoes(medico.id);
  };

  const handleGoBack = () => {
    setSelectedMedico(null);
    setSearchQuery("");
    setFilteredMedicos(medicos);
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
      <View style={styles.medicosContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.medicosTitle}>
              {selectedMedico ? selectedMedico.nome : "Médicos"}
            </Text>
          </View>
          <View style={styles.containerPaiFiltros}>
            <TouchableOpacity
              onPress={selectedMedico ? handleGoBack : toggleFilter}
            >
              {selectedMedico ? (
                <Ionicons name="return-up-back" size={28} color="white" />
              ) : (
                <>
                  {filterType === "todos" && (
                    <Foundation name="torsos-all" size={24} color="white" />
                  )}
                  {filterType === "adm" && (
                    <MaterialIcons name="security" size={24} color="white" />
                  )}
                  {filterType === "med" && (
                    <Ionicons name="medkit" size={24} color="white" />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo de pesquisa */}
        {!selectedMedico && (
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
        )}

        {selectedMedico ? (
          loading ? (
            <ActivityIndicator style={{ flex: 1 }} size="small" color="white" />
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
                    } else if (!item.concluido) {
                      openModalDelete(item);
                    }
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={1}
              ListEmptyComponent={() => {
                if (plantoes.length === 0) {
                  return (
                    <Text style={styles.errorMessage}>
                      Nenhuma escala cadastrada
                    </Text>
                  );
                }

                const hasActivePlantoes = plantoes.some(
                  (plantao) => !plantao.concluido
                );
                if (!hasActivePlantoes) {
                  return (
                    <Text style={styles.errorMessage}>
                      Nenhuma escala ativa no momento
                    </Text>
                  );
                }
                return null;
              }}
            />
          )
        ) : filteredMedicos.length > 0 ? (
          <FlatList
            style={styles.flatListContainer}
            data={filteredMedicos}
            renderItem={({ item }) => (
              <MedicoItem
                medico={item}
                onPress={() => handleSelectMedico(item)}
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
        ) : (
          <FlatList
            style={styles.flatListContainer}
            data={medicos}
            renderItem={({ item }) => (
              <MedicoItem
                medico={item}
                onPress={() => handleSelectMedico(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={1}
          />
        )}
      </View>
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
    </View>
  );
}
