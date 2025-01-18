import React, { useState, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendario";
import { useFocusEffect } from "expo-router";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

import homeHooks from "@/src/hooks/homeHooks";
import PlantaoItem from "@/src/components/plantaoItem";
import styles from "@/src/styles/homeScreenStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const { markedDays, filteredPlantao, fetchPlantoes, loading } =
    homeHooks(selectedDate);

  useFocusEffect(
    useCallback(() => {
      fetchPlantoes();
      setSelectedDate(new Date());
    }, [])
  );

  const onDayPress = (date: Date) => setSelectedDate(date);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

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
              <MaterialIcons name="error" size={40} color="white" />
              <Text style={styles.noPlantaoText}>Nada por aqui</Text>
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
      </View>
    </>
  );
}
