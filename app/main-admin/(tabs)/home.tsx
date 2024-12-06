import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import {CalendarList, InnerDayProps, toLocaleDateString} from "@fowusu/calendar-kit";
import dayjs from 'dayjs';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const today = new Date();
  const todayDateString = toLocaleDateString(today);
  const [selectedDate, setSelectedDate] = useState<string>(todayDateString);
  const [filteredPlantao, setFilteredPlantao] = useState<Plantao[]>([]);
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [plantaoDates, setPlantaoDates] = useState<string[]>([]);

  type Plantao = {
    id: string;
    plantonista: string;
    data: string;
    horario: string;
    local: string;
    funcao: string;
  };


  // Buscar Plantões no Firestore
const fetchPlantoes = async () => {
  try {
    // Consulta no Firestore
    const querySnapshot = await firestore()
      .collection("plantoes")
      .orderBy("createdAt", "desc")
      .get();

    // Mapeando os resultados
    const plantoesList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        plantonista: data.plantonista,
        data: data.data,
        horario: data.horario,
        local: data.local,
        funcao: data.funcao
      };
    });

    // Atualizando o estado com os dados
    setPlantoes(plantoesList);
  } catch (error) {
    console.error("Erro ao buscar plantoes:", error);
  }
};

  useEffect(() => {
    fetchPlantoes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlantoes();
    }, [])
  );

  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = dayjs(selectedDate).format('DD/MM/YYYY');
      const filtered = plantoes.filter((plantao) => plantao.data === formattedSelectedDate);
      setFilteredPlantao(filtered);
    }
  }, [selectedDate, plantoes]);


  // Função para renderizar o item da lista de plantões
  const renderPlantaoItem = ({ item }: { item: Plantao}) => (
    <View style={styles.plantaoItem}>
      <View style={styles.dataHoraContainer}>
        <View style={styles.containerIcons}>
          <FontAwesome6 name="calendar" size={13.5} color="white" />
          <Ionicons name="time" size={15} color="white"/>
          <MaterialIcons name="location-on" size={15.5} color="white"/>
        </View>
        <View style={styles.containerInfos}>
          <Text style={styles.plantaoDate}> {item.data}</Text>
          <Text style={styles.plantaoTurno}> {item.horario}</Text>
          <Text style={styles.plantaoLocal}> {item.local}</Text>
        </View>
      </View>
      <View style={styles.medicoContainer}>
          <Text style={styles.plantaoFuncao}>{item.funcao}</Text>
          <Text style={styles.plantaoMedico}>{item.plantonista}</Text>
      </View>
    </View>
  );

   // Renderizar texto e ícone quando nenhuma data está selecionada
   const renderEmptyState = () => (
        <View style={styles.noPlantaoContainer}>
          <MaterialIcons name="error" size={40} color="white" />
          <Text style={styles.noPlantaoText}>Selecione uma data!</Text>
        </View>
  );

  const onDayPress = useCallback((dateString: string) => {
    setSelectedDate(dateString);
}, []);

// Arrumar string do Mês no calendário
interface CustomMonthNameProps {
  month: Date;
  locale?: string;
}

const CustomMonthName: React.FC<CustomMonthNameProps> = ({ month, locale = 'pt-BR' }) => {
  const monthYear = month.toLocaleString(locale, { month: 'long', year: 'numeric' });
  return (
      <Text style={styles.textMonthCalendar}>
        {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
      </Text>
  );
};

// Customizar o Calendário (Dias)
interface CustomDayComponentProps {
  isSelected?: boolean;
}

const CustomDayComponent: React.FC<
  InnerDayProps<CustomDayComponentProps>
> = ({ day, locale = "pt-BR", state, isToday, isSelected }) => {
  const dayStyle = useMemo(() => {
    if (state !== "inactive") {
      if (isSelected) {
        return {
          textStyle: styles.selectedText,
          containerStyle: styles.selectedContainer,
        };
      }
    }
    if (isToday) {
      return {
        textStyle: styles.todayText,
        containerStyle: styles.todayContainer,
      };
    }
    return {};
  }, [state, isSelected, isToday]);
  

  return (
    <View style={[styles.defaultContainer, dayStyle.containerStyle]}>
      <Text style={[styles.defaultText, styles[state], dayStyle.textStyle]}>
        {day.toLocaleDateString(locale, { day: "numeric" })}
      </Text>
    </View>
  );
};

  return (
    <View style={styles.containerPapai}>
        <View style={styles.containerPai}>
            <CalendarList
            locale= 'pt-BR'
            MonthNameComponent={CustomMonthName}
            weekdaysFormat={'narrow'}
            showExtraDays={true}
            currentDate={todayDateString}
            estimatedCalendarSize={{
                fiveWeekCalendarSize: 100
            }}
            markedDates={[selectedDate]}
            futureMonthsCount={6}
            pastMonthsCount={1}
            onDayPress={onDayPress}
            horizontal={true}
            DayComponent={CustomDayComponent}
          />
        </View>

          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.plantaoTitle}>Plantões nesse dia</Text>
            </View>
        
            {/* Condicional: nenhuma data, estado vazio ou plantões */}
            {selectedDate === null ? (
              <View style={styles.noPlantaoContainer}>
                <View style={styles.noPlantaoContainerItems}>
                  <MaterialIcons name="error" size={40} color="white" />
                  <Text style={styles.noPlantaoText}>Selecione uma data!</Text>
                </View>
              </View>

            ) : filteredPlantao.length === 0 ? (
              <View style={styles.noPlantaoContainer}>
                <View style={styles.noPlantaoContainerItems}>
                  <MaterialIcons name="error" size={40} color="white" />
                  <Text style={styles.noPlantaoText}>Nada por aqui!</Text>
                </View>
              </View>

            ) : (
              <View style={styles.plantaoContainer}>
                <FlatList
                  style={styles.flatlistContainer}
                  data={filteredPlantao}
                  renderItem={renderPlantaoItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
            )}
        </View>
      </View>
  );
  
}

const styles = StyleSheet.create({
  containerPapai: {
    flex: 1,
    backgroundColor: '#012E40',
    paddingTop: 30
  },
  containerPai: {
    flex: 1.5,
    backgroundColor: '#012E40',
  },
  container: {
    backgroundColor: '#012E40',
    flex: 1
  },
  textMonthCalendar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginBottom: 15
  },
  plantaoContainer: {
    flexDirection: 'row',
    flex: 1
  },
  flatlistContainer:{
    width: '100%',
    paddingHorizontal: 10,
  },
  header: {
    paddingHorizontal: 10
  },
  plantaoTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10
  },
  plantaoItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#1A4D5C',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  dataHoraContainer:{
    flexDirection: 'row',
    display: 'flex',
    flex: 1,
    marginRight: 10,
    paddingRight: 18,
    borderRightWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  medicoContainer:{
    display: 'flex',
    alignItems: 'center',
    flex: 2
  },
  plantaoDate: {
    fontSize: 13,
    color: '#59994e',
  },
  plantaoTurno: {
    fontSize: 13,
    color: '#ffffff',
  },
  plantaoLocal: {
    fontSize: 13,
    color: '#ffffff',
  },
  plantaoMedico: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  plantaoFuncao: {
    fontSize: 13,
    color: '#bfb9a6'
  },
  noPlantaoContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  noPlantaoContainerItems: {
    marginTop: 30,
    flexDirection: 'row'
  },
  noPlantaoText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
  containerIcons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3
  },
  containerInfos: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1.5
  },
  defaultContainer: {
    paddingVertical: 10,
  },
  selectedContainer: {
    backgroundColor: "#081e27",
    borderRadius: 25,
    paddingVertical: 10,
  },
  todayContainer: {
    borderColor: "#787de7",
  },
  defaultText: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todayText: {
    color: "#59994e",
    fontWeight: "bold",
  },
  active: {
    color: "white",
  },
  inactive: {
    color: "#363534",
  },
});
