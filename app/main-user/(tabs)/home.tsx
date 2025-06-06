import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendario";
import { useFocusEffect } from "expo-router";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

import homeUserHooks from "@/src/hooks/homeUserHooks";
import PlantaoItem from "@/src/components/plantaoItem";
import styles from "@/src/styles/homeScreenStyle";
import stylesModal from "@/src/styles/notificationModalStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeUserScreen() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    markedDays,
    filteredPlantao,
    fetchPlantoes,
    setSelectedDate,
    selectedDate,
    checkNewPlantao,
    hasNewNotification,
    isTherePlantaoNovo,
    updatePlantaoIdsArray,
    loading,
  } = homeUserHooks();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkNewPlantao();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlantoes();
      setSelectedDate(new Date());
    }, [])
  );

  const onDayPress = (date: Date) => setSelectedDate(date);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const handleNotificationPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    updatePlantaoIdsArray();
  };

  return (
    <>
      <StatusBar
        backgroundColor="#012E40" // Cor de fundo da Status Bar
        barStyle="light-content" // Define o texto da Status Bar como claro (ícones/branco)
        translucent={false} // Faz com que a Status Bar não seja transparente
      />
      <View
        style={[styles.container, { paddingTop: useSafeAreaInsets().top + 10 }]}
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
        {!isExpanded && (
          <View style={styles.calendarContainer}>
            <Calendar
              locale="br"
              key={JSON.stringify(markedDays)}
              markedDays={markedDays}
              onPress={onDayPress}
              startDate={selectedDate}
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
          </View>
        )}
        <View style={styles.listContainer}>
          <TouchableOpacity onPress={handleToggleExpand} style={styles.header}>
            <Text style={styles.plantaoTitle}>Escalas nesse dia</Text>
            <Entypo
              name={isExpanded ? "chevron-down" : "chevron-up"}
              size={24}
              color="white"
              style={styles.expandIcon}
            />
          </TouchableOpacity>

          {filteredPlantao.length === 0 ? (
            <View style={styles.noPlantaoContainer}>
              <Text style={styles.noPlantaoText}>
                Nenhuma escala cadastrada
              </Text>
            </View>
          ) : loading ? (
            <ActivityIndicator style={{ flex: 1 }} size="small" color="white" />
          ) : (
            <FlatList
              data={filteredPlantao}
              renderItem={({ item }) => (
                <PlantaoItem plantao={item} onPress={() => {}} />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatlistContainer}
            />
          )}
        </View>
        <Modal visible={modalVisible} transparent animationType="fade">
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
      </View>
    </>
  );
}
