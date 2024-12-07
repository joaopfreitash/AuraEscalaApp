import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Animated, Modal } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getFirestore, doc, setDoc, getDocs, collection, Timestamp, query, orderBy, where, updateDoc, arrayUnion } from "firebase/firestore";
import { useFocusEffect } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

export default function PlantoesScreen() {

  type Plantao = {
    id: string;
    plantonista: string;
    data: string;
    horario: string;
    local: string;
    funcao: string;
  };


  const [modalVisible, setModalVisible] = useState(false);
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [date, setDate] = useState(dayjs().subtract(1, 'day'));
  const [selectedHora, setSelectedHora] = useState('');
  const [time, setTime] = useState(dayjs());
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const labelDataAnimation = useRef(new Animated.Value(0)).current;
  const labelFuncaoAnimation = useRef(new Animated.Value(0)).current;
  const labelHoraAnimation = useRef(new Animated.Value(0)).current;
  const labelMedicoAnimation = useRef(new Animated.Value(0)).current;
  const labelLocalAnimation = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const rotationRefresh = useState(new Animated.Value(0))[0];

  const [openMedico, setOpenMedico] = useState(false);
  const [valueMedico, setValueMedico] = useState<string | null>(null);
  const [itemsMedico, setItemsMedico] = useState<{value: string }[]>([]);

  const [openLocal, setOpenLocal] = useState(false);
  const [valueLocal, setValueLocal] = useState<string | null>(null);
  const [itemsLocal, setItemsLocal] = useState<{value: string }[]>([]);

  const [openFuncao, setOpenFuncao] = useState(false);
  const [valueFuncao, setValueFuncao] = useState(null);
  const [itemsFuncao, setItemsFuncao] = useState([
    { label: "Cirurgião", value: "Cirurgião"},
    { label: "Auxílio Cirúrgico", value: "Auxílio Cirúrgico"},
    { label: "Anestesista", value: "Anestesista"},
    { label: "Auxílio Anestesia", value: "Auxílio Anestesia"},
    { label: "Ambulatório", value: "Ambulatório"},
  ]);

  const db = getFirestore();

   //Calcular rotação
   const rotate = rotationRefresh.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  //Ajustar rotação
  const animatedStyle = {
    transform: [
      { rotate },
      { translateY: -5 },
    ],
  };

  const onRefresh = async () => {
    rotationRefresh.setValue(0);
    setRefreshing(true);
    Animated.timing(rotationRefresh, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    await fetchPlantoes();
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
          funcao: data.funcao
        };
      });
      setPlantoes(plantoesList);
    } catch (error) {
      console.error("Erro ao buscar hospitais:", error);
      setRefreshing(false);
    } finally {
      setRefreshing(false);
    }
  };

// Chama a função de buscar médicos assim que o componente é montado
useEffect(() => {
  fetchPlantoes();
}, []);

useFocusEffect(() => {
  fetchPlantoes();
},);

  // Buscar médicos no firestore para o Dropdown em Add plantão
  const fetchMedicos = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users")));

      const medicosList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          value: data.name,
          label: data.name,
        };
      });
      setItemsMedico(medicosList);
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
    }
  };

  // Buscar Hospitais no firestore para o Dropdown em Add plantão
  const fetchHospitals = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "hospitais"))
      );

      const hospitaisList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          label: data.name,
          value: data.name,
        };
      });
      setItemsLocal(hospitaisList);
    } catch (error) {
      console.error("Erro ao buscar hospitais:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedicos();
      fetchHospitals();
    }, [])
  );

  //Verificar se campos preenchidos para habilitar botão Confirmar
  const checkFields = () => {
    if (valueMedico && selectedDate && selectedHora && valueLocal && valueFuncao) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  useEffect(() => {
    checkFields();
  }, [valueMedico, selectedDate, selectedHora, valueLocal, valueFuncao]);

  const handleFocusDate = () => {
      Animated.timing(labelDataAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
};

  const handleFocusHora = () => {
      Animated.timing(labelHoraAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
};

  const handleFocusMedico = () => {
    Animated.timing(labelMedicoAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
};

const handleFocusLocal = () => {
  Animated.timing(labelLocalAnimation, {
    toValue: 1,
    duration: 200,
    useNativeDriver: false,
  }).start();
};

  const handleBlurDate = () => {
      Animated.timing(labelDataAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
};

  const handleBlurHora = () => {
    Animated.timing(labelHoraAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
};

const handleBlurMedico = () => {
  Animated.timing(labelMedicoAnimation, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
  }).start();
};

const handleBlurLocal = () => {
  Animated.timing(labelLocalAnimation, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
  }).start();
};

const handleFocusFuncao = () => {
  Animated.timing(labelFuncaoAnimation, {
    toValue: 1,
    duration: 200,
    useNativeDriver: false,
  }).start();
};

  const handleBlurFuncao = () => {
      Animated.timing(labelFuncaoAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
};

const handleDateConfirm = (event: DateTimePickerEvent, date?: Date) => {
  if (date) {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    setDate(dayjs(date));
  }
};

const handleTimeConfirm = (event: DateTimePickerEvent, time?: Date) => {
  if (time) {
    const formattedTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setSelectedHora(formattedTime);
    setTime(dayjs(time));
  }
};

  const handleRegisterShift = async (
    plantonista: string,
    local: string,
    data: string,
    horario: string,
    funcao: string
  ) => {
    try {
      // Buscar médico pelo nome
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(query(usersCollection, where("name", "==", valueMedico)));
      const medicoDoc = querySnapshot.docs[0];
      const medicoUid = medicoDoc.id;
  
      const localCollection = collection(db, "hospitais");
      const querySnapshotLocal = await getDocs(query(localCollection, where("name", "==", valueLocal)));
      const localDoc = querySnapshotLocal.docs[0];
      const localUid = localDoc.id;
  
      // Criar documento de plantão
      const shiftsDocRef = doc(collection(db, "plantoes"));
      const shiftId = shiftsDocRef.id;
  
      await setDoc(shiftsDocRef, {
        plantonista: plantonista,
        local: local,
        data: data,
        horario: horario,
        funcao: funcao,
        createdAt: Timestamp.now(),
        medicoUid: medicoUid,
        localUid: localUid,
      });
  
      const medicoRef = doc(db, "users", medicoUid);
      await updateDoc(medicoRef, {
        plantaoIds: arrayUnion(shiftId),
      });

      const localRef = doc(db, "hospitais", localUid);
      await updateDoc(localRef, {
        plantaoIdsH: arrayUnion(shiftId),
      });
  
      resetModal();
      alert("Plantão cadastrado com sucesso!");
    } catch (error) {
      alert("Ocorreu um erro ao tentar cadastrar o plantão. Tente novamente.");
    }
  };  

  const resetModal = () => {
    setModalVisible(false);
    setDate(dayjs().subtract(1, 'day'));
    setTime(dayjs());
    setValueMedico(null);
    setOpenMedico(false);
    setValueLocal(null);
    setOpenLocal(false);
    setValueFuncao(null);
    setOpenFuncao(false);
    setIsButtonEnabled(false)
    handleBlurDate();
    handleBlurHora();
    handleBlurMedico();
    handleBlurLocal();
    handleBlurFuncao();
  };

  const renderPlantaoItem = ({ item }: { item: Plantao }) => (
    <View style={styles.plantaoItem}>
      <View style={styles.mainContainer}>
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

  return (
    <View style={styles.containerPai}>
        <View style={styles.header}>
          <Text style={styles.plantaoTitle}>Plantões</Text>
          <TouchableOpacity 
              onPress={onRefresh}
              disabled={refreshing}>
            <Animated.View style={animatedStyle}>
              <FontAwesome name="refresh" size={22} style={styles.refreshIcon} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      <View style={styles.plantaoContainer}>
        <FlatList
          style={styles.flatListContainer}
          data={plantoes}
          renderItem={renderPlantaoItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
        />
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
              <Text style={styles.modalTitle}>Designar Plantão</Text>
                    <TouchableOpacity
                      onPress={() => {
                        resetModal();
                      }}>
                        <Ionicons name="close-circle" size={33} color={'#bf3d3d'}/>
                    </TouchableOpacity>
              </View>

              {/* Seletor de Data */}
              <View style={styles.containerDataHora}>
                <DateTimePicker
                  value={date.toDate()}
                  mode="date"
                  display="default"
                  onChange={handleDateConfirm}
                />
                <DateTimePicker
                  value={time.toDate()}
                  mode="time"
                  display="default"
                  onChange={handleTimeConfirm}
                />
              </View>

              <View style={styles.betweenInput}>
                <FontAwesome name="level-down" size={30} color="black" />
              </View>

            {/* Seletor de Médico */}
            <View style={styles.containerMedico}>
            <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelMedicoAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -26], // Move o rótulo para cima
                              }),
                              fontSize: labelMedicoAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelMedicoAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        Médico
                         </Animated.Text>
                <DropDownPicker style={styles.inputBoxPickerMedico} onPress={() => { handleFocusMedico();}}
                    open={openMedico}
                    value={valueMedico}
                    searchable={true}
                    items={itemsMedico}
                    setOpen={setOpenMedico}
                    setValue={setValueMedico}
                    setItems={setItemsMedico}
                    placeholder={'Selecione o plantonista'}
                    placeholderStyle={styles.placeholderText}
                    textStyle={styles.inputText}
                    multiple={false}
                    language="PT"
                    dropDownContainerStyle={styles.dropDownListContainerMedico} // Estilo da lista suspensa
                />
              </View>

              <View style={styles.betweenInput}>
              <FontAwesome name="level-down" size={30} color="black" />
              </View>

              {/* Seletor de Função */}
            <View style={styles.containerFuncao}>
            <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelFuncaoAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -26], // Move o rótulo para cima
                              }),
                              fontSize: labelFuncaoAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelFuncaoAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        Função
                         </Animated.Text>
                <DropDownPicker style={styles.inputBoxPickerFuncao} onPress={() => { handleFocusFuncao();}}
                    open={openFuncao}
                    value={valueFuncao}
                    items={itemsFuncao}
                    setOpen={setOpenFuncao}
                    setValue={setValueFuncao}
                    setItems={setItemsFuncao}
                    placeholder={'Selecione a função do médico'}
                    placeholderStyle={styles.placeholderText}
                    textStyle={styles.inputText}
                    multiple={false}
                    language="PT"
                    dropDownContainerStyle={styles.dropDownListContainerFuncao} // Estilo da lista suspensa
                />
              </View>

              <View style={styles.betweenInput}>
              <FontAwesome name="level-down" size={30} color="black" />
              </View>

              {/* Seletor de Local */}
            <View style={styles.containerLocal}>
            <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelLocalAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -26], // Move o rótulo para cima
                              }),
                              fontSize: labelLocalAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelLocalAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        Hospital
                         </Animated.Text>
                <DropDownPicker style={styles.inputBoxPickerLocal} onPress={() => { handleFocusLocal();}}
                    open={openLocal}
                    value={valueLocal}
                    searchable={true}
                    items={itemsLocal}
                    setOpen={setOpenLocal}
                    setValue={setValueLocal}
                    setItems={setItemsLocal}
                    placeholder={'Selecione o local do plantão'}
                    placeholderStyle={styles.placeholderText}
                    textStyle={styles.inputText}
                    multiple={false}
                    language="PT"
                    dropDownContainerStyle={styles.dropDownListContainerLocal} // Estilo da lista suspensa
                />
              </View>
                    <TouchableOpacity
                        style={[styles.confirmarPlantaoButton, !isButtonEnabled && styles.buttonDisabled]}
                        disabled={!isButtonEnabled}
                        onPress={() => {
                          if (!valueMedico || !valueLocal || !selectedDate || !selectedHora || !valueFuncao) {
                            alert("Por favor, preencha todos os campos.");
                            return;
                          }
                          handleRegisterShift(valueMedico, valueLocal, selectedDate, selectedHora, valueFuncao);
                        }}
                      >
                      <Text style={[styles.confirmarPlantaoText, !isButtonEnabled && styles.buttonTextDisabled]}>Confirmar</Text>
                    </TouchableOpacity>
            </View>
          </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPai: {
    flex: 1,
    backgroundColor: '#012E40',
  },
  plantaoContainer: {
    flex: 1,
  },
  header: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  flatListContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  plantaoTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  refreshIcon: {
    paddingTop: 10,
    color: '#458fa3'
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
  mainContainer:{
    flexDirection: 'row',
    display: 'flex',
    flex: 1,
    marginRight: 10,
    paddingRight: 18,
    borderRightWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
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
  plantaoMedico: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  plantaoFuncao: {
    alignSelf: 'center',
    fontSize: 13,
    color: '#bfb9a6'
  },
  plantaoLocal: {
    fontSize: 13,
    color: '#ffffff',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#59994e',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  addButtonText: {
    fontSize: 25,
    color: '#030302',
    fontWeight: 'bold',
    paddingBottom: 5
  },
  modalContent: {
    backgroundColor: '#012E40',
    padding: 20,
    alignItems: 'center',
    height: '88.55%',
    position: 'absolute',
    bottom: 0
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 35,
    width: '100%',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dropDownListContainerMedico: {
    maxHeight: 355
  },
  dropDownListContainerFuncao: {
    height: 210,
    maxHeight: 210
  },
  dropDownListContainerLocal: {
    height: 250,
    maxHeight: 240
  },
  containerDataHora: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingRight: 30
  },
  inputBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
    justifyContent: 'center',
  },
  inputBoxPickerMedico: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
    justifyContent: 'center',
  },
  inputBoxPickerFuncao: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
    justifyContent: 'center',
  },
  inputBoxPickerLocal: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 17,
  },
  placeholderText: {
    color: '#191a1c',
    fontSize: 13,
  },
  inputLabel: {
    position: 'absolute',
    left: 10,
    color: '#ccc',
  },
  filledText: {
    color: '#000',
  },

  iconEdit: {
    position: 'absolute',
    right: 10,
    top: '25%',
  },
  containerHora: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  containerMedico: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    zIndex: 300,
  },
  containerFuncao: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    zIndex: 200,
  },
  containerLocal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    zIndex: 100,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
  confirmarPlantaoButton: {
    backgroundColor: '#111827',
    display: 'flex',
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
    opacity: 0.2
  },
  buttonTextDisabled: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  confirmarPlantaoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  betweenInput: {
    marginTop: 15,
    marginBottom: 15,
  },
});

