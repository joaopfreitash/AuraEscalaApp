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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "@/src/styles/medicosScreenStyle";
import MedicoItem from "@/src/components/medicoItem";
import medicosHooks from "@/src/hooks/medicosHooks";
import searchBar from "@/src/utils/searchBar";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Medico } from "@/src/types";
import PlantaoItem from "@/src/components/plantaoItem";

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
          <FlatList
            style={styles.flatListContainer}
            data={plantoes}
            renderItem={({ item }) => (
              <PlantaoItem plantao={item} onPress={() => {}} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={1}
            ListEmptyComponent={() => {
              if (plantoes.length === 0) {
                return (
                  <Text style={styles.errorMessage}>
                    Nenhum plantão cadastrado
                  </Text>
                );
              }

              const hasActivePlantoes = plantoes.some(
                (plantao) => !plantao.concluido
              );
              if (!hasActivePlantoes) {
                return (
                  <Text style={styles.errorMessage}>
                    Nenhum plantão ativo no momento
                  </Text>
                );
              }
              return null;
            }}
          />
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
    </View>
  );
}
