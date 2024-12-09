import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendario';
import dayjs from 'dayjs';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredPlantao, setFilteredPlantao] = useState<Plantao[]>([]);
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [markedDays, setMarkedDays] = useState<MarkedDays>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const db = getFirestore();

  type Plantao = {
    id: string;
    plantonista: string;
    data: string;
    horario: string;
    local: string;
    funcao: string;
  };

  type MarkedDays = {
    [date: string]: {
      dots?: { color: string; selectedColor: string }[];
      selectedColor?: string;
      textStyle?: { color: string; fontWeight?: string };
      theme?: {
        dayContainerStyle?: { backgroundColor: string };
      };
    };
  };

  // Buscar Plantões no FireStore
  const fetchPlantoes = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "plantoes"), orderBy("createdAt", "desc"))
      );
      const plantoesList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          plantonista: data.plantonista,
          data: data.data,
          horario: data.horario,
          local: data.local,
          funcao: data.funcao,
        };
      });

      const updatedMarkedDays: MarkedDays = {};

      plantoesList.forEach((plantao) => {
        updatedMarkedDays[plantao.data] = {
          dots: [
            {
              color: 'red',
              selectedColor: 'green',
            },
          ],
        };
      });

      setPlantoes(plantoesList);
      setMarkedDays(updatedMarkedDays);

    } catch (error) {
      console.error("Erro ao buscar plantoes:", error);
    }
  };

  useEffect(() => {
    fetchPlantoes();
  },[]);

  useFocusEffect(
    useCallback(() => {
      fetchPlantoes();
      setSelectedDate(new Date());
    }, [])
  );

  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD');
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
          <Text style={styles.plantaoDate}> {dayjs(item.data).format('DD/MM/YYYY')}</Text>
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

  const onDayPress = (date: Date) => {
    if (date) {
      setSelectedDate(date); // Armazena o objeto Date
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded); // Alternar entre expandido e retraído
  };

  return (
    <View style={styles.containerPapai}>
      {!isExpanded && (
        <View style={styles.containerPai}>
        <Calendar
            locale={'br'}
            key={JSON.stringify(markedDays)}
            markedDays={markedDays}
            onPress={onDayPress}
            startDate={selectedDate || undefined}
            theme={{
              activeDayColor: 'red',
              monthTitleTextStyle: {
                color: 'white',
                fontWeight: 'bold',
                fontSize: 25,
              },
              emptyMonthContainerStyle: {},
              emptyMonthTextStyle: {
                fontWeight: '200',
              },
              weekColumnsContainerStyle: {},
              weekColumnStyle: {
                paddingVertical: 10,
              },
              weekColumnTextStyle: {
                color: '#b6c1cd',
                fontSize: 13,
              },
              nonTouchableDayContainerStyle: {},
              nonTouchableDayTextStyle: {
                color: '#2d4150'
              },
              startDateContainerStyle: {},
              endDateContainerStyle: {},
              dayContainerStyle: {
                backgroundColor: '#012E40',
              },
              dayTextStyle: {
                color: 'white',
                fontSize: 15,
              },
              dayOutOfRangeContainerStyle: {},
              dayOutOfRangeTextStyle: {},
              todayContainerStyle: {},
              todayTextStyle: {
                color: '#6d95da',
                fontWeight: 'bold'
              },
              activeDayContainerStyle: {
                backgroundColor: '#1A4D5C',
                borderRadius: 30,
              },
              activeDayTextStyle: {
                color: 'white',
                fontWeight: 'bold',
              },
              nonTouchableLastMonthDayTextStyle: {},
            }}
          />
        </View>
      )}

          <View style={styles.container}>
            <TouchableOpacity onPress={handleToggleExpand}>
              <View style={styles.header}>
                  <Text style={styles.plantaoTitle}>Plantões nesse dia</Text>
                  <Entypo
                  name={isExpanded ? 'chevron-down' : 'chevron-up'}
                  size={24}
                  color="white"
                  marginTop={5}
                  marginLeft={10}
                />
              </View>
            </TouchableOpacity>
        
            {/* Condicional: nenhuma data, estado vazio ou plantões */}
              {filteredPlantao.length === 0 ? (
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
  },
  containerPai: {
    marginTop: 15,
    flex: 2.5,
    backgroundColor: '#012E40',
  },
  container: {
    backgroundColor: '#012E40',
    flex: 1
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
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 10
  },
  plantaoTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    paddingLeft: 10
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
