import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Animated, Image, TextInput, Keyboard } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Portal } from 'react-native-portalize';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import firestore  from '@react-native-firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

export default function LocaisScreen() {

  type Hospital = {
    id: string;
    name: string;
    address: string;
    plantaoIdsH?: string[];
  };

  const [hospitais, setHospitais] = useState<Hospital[]>([]);
  const [filteredHospitais, setFilteredHospitais] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [nomeHospital, setNomeHospital] = useState('');
  const [enderecoHospital, setEnderecoHospital] = useState('');
  const [isNomeFocused, setIsNomeFocused] = useState(false);
  const [isEnderecoFocused, setIsEnderecoFocused] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const labelNomeAnimation = useRef(new Animated.Value(0)).current;
  const labelEnderecoAnimation = useRef(new Animated.Value(0)).current;
  const rotationRefresh = useState(new Animated.Value(0))[0];

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const navigation = useNavigation();

  // Animação da largura da barra de pesquisa
  const searchBarWidth = useRef(new Animated.Value(100)).current;

  // Função chamada quando a barra de pesquisa recebe foco
  const handleFocusSearchBar = () => {
    setIsSearchFocused(true);
    Animated.timing(searchBarWidth, {
      toValue: 80, // Diminui a largura para 80%
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlurSearchbar = () => {
    if (!searchQuery) {
      Animated.timing(searchBarWidth, {
        toValue: 100,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setIsSearchFocused(false);
    }
  };

  const handleCancel = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setFilteredHospitais(hospitais);
    Keyboard.dismiss();
    Animated.timing(searchBarWidth, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isBottomSheetVisible) {
      navigation.setOptions({
        headerTintColor: '#081e27',
      });
    } else {
      navigation.setOptions({
      headerTintColor: '#fff',
    });
    }
  }, [isBottomSheetVisible, navigation]);

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

  const sheetRef = useRef<BottomSheetMethods>(null);

  // Buscar Hospitais no FireStore
  const fetchHospitals = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('hospitais')
        .orderBy('createdAt', 'desc')
        .get();
  
      const hospitaisList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          address: data.address,
          plantaoIdsH: data.plantaoIdsH || [],
        };
      });
  
      setHospitais(hospitaisList);
      setFilteredHospitais(hospitaisList);
    } catch (error) {
      console.error('Erro ao buscar hospitais:', error);
      setRefreshing(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Chama a função de buscar médicos assim que o componente é montado
  useEffect(() => {
    fetchHospitals();
  }, []);

  const onRefresh = async () => {
    rotationRefresh.setValue(0);
    setRefreshing(true);
    Animated.timing(rotationRefresh, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    await fetchHospitals();
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text); // Atualiza a query de pesquisa
  
    const filtered = hospitais.filter((hospital) =>
      hospital.name.toLowerCase().includes(text.toLowerCase())
    );
  
    if (filtered.length === 0) {
      setFilteredHospitais([]); // Define a lista filtrada como vazia
    } else {
      setFilteredHospitais(filtered); // Atualiza os médicos filtrados
      setErrorMessage(""); // Remove a mensagem de erro
    }
  };

  // Handler pra cadastrar o Hospital
  const handleRegisterHospital = async (
    name: string,
    address: string,
  ) => {
    try {
      // Verificar se o hospital já está cadastrado
      const querySnapshot = await firestore()
        .collection('hospitais')
        .where('name', '==', nomeHospital.toLowerCase()) // Usar `toLowerCase()` para padronizar a busca
        .get();
  
      if (!querySnapshot.empty) {
        alert('Hospital já cadastrado.');
        return;
      }
  
      // Criar documento de hospital
      const hospitalDocRef = firestore().collection('hospitais').doc(); // Gerar referência de documento com id auto gerado
    
      await hospitalDocRef.set({
        name: nomeHospital,
        address: enderecoHospital,
        createdAt: firestore.Timestamp.now(), // Usando Timestamp.now() para a data de criação
      });
  
      alert('Hospital cadastrado com sucesso!');
      resetModal();
    } catch (error) {
      console.error('Erro ao cadastrar hospital:', error);
      alert('Por favor, tente novamente.');
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
  
  const handleFocus = (animatedValue: Animated.Value, setIsFocused: React.Dispatch<React.SetStateAction<boolean>>) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsFocused(true);
  };

  const handleBlur = (animatedValue: Animated.Value, text: string, setIsFocused: React.Dispatch<React.SetStateAction<boolean>>) => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    setIsFocused(false);
  };

  const resetModal = () => {
    sheetRef.current?.close();
    setIsBottomSheetVisible(false);
    handleBlur(labelNomeAnimation, nomeHospital, setIsNomeFocused);
    handleBlur(labelEnderecoAnimation, enderecoHospital, setIsEnderecoFocused);
    setIsButtonEnabled(false)
    setNomeHospital('')
    setEnderecoHospital('')
    clearInputNome();
    clearInputEndereco();
  };


  //JEITINHO BRASILEIRO PRA LIMPAR INPUT
  const nomeInputRef = useRef<TextInput>(null);
  const enderecoInputRef = useRef<TextInput>(null);

  const clearInputNome = () => {
    if (nomeInputRef.current) {
      nomeInputRef.current.clear();
    }
  };

  const clearInputEndereco = () => {
    if (enderecoInputRef.current) {
      enderecoInputRef.current.clear();
    }
  };

  const renderHospitalItem = ({ item }: { item: Hospital }) => (
    <View style={styles.hospitalItem}>
      <View style={styles.nomeEnderecoContainer}>
        <Text style={styles.hospitalNome}>{item.name}</Text>
        <Text style={styles.hospitalEndereco}>{item.address}</Text>
      </View>
      <View style={styles.quantosPlantoes}>
        <Entypo name="chevron-right" size={20} color="#012E40" />
        <Text style={styles.permissaoMedico}>
        {
          Array.isArray(item.plantaoIdsH)
            ? item.plantaoIdsH.length === 1
              ? "1 Plantão"
              : `${item.plantaoIdsH.length} Plantões`
            : "Nenhum plantão cadastrado"
        }
        </Text>
      </View>
    </View>
  );

  return (
    
    <View style={styles.containerPai}>
      
      <View style={styles.medicosContainer}>
        <View style={styles.header}>
          <Text style={styles.medicosTitle}>Hospitais</Text>
          <TouchableOpacity 
              onPress={onRefresh}
              disabled={refreshing}>
            <Animated.View style={animatedStyle}>
              <FontAwesome name="refresh" size={22} style={styles.refreshIcon} />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Campo de pesquisa */}
          <View style={styles.searchContainerPai}>
            <Animated.View
                  style={[
                    styles.searchBarContainer,
                    { width: searchBarWidth.interpolate({
                        inputRange: [80, 100],
                        outputRange: ['80%', '100%'],
                      }),
                    },
                  ]}
                >
                <FontAwesome5 name="search" size={18} color="white" style={styles.iconSearch} />
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Pesquisar por nome"
                    placeholderTextColor={'#ccc'}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    onFocus={handleFocusSearchBar}
                    onBlur={handleBlurSearchbar}
                  />
              </Animated.View>
                <View style={styles.cancelarContainer}>
                {isSearchFocused && (
                  <TouchableOpacity onPress={handleCancel}><Text style={styles.cancelButton}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
          </View>
            {filteredHospitais.length > 0 ? (
                <FlatList
                  style={styles.flatListContainer}
                  data={filteredHospitais}
                  renderItem={renderHospitalItem}
                  keyExtractor={(item) => item.id}
                  numColumns={1}
                  refreshing={refreshing}
                />
                  ) : searchQuery.trim() ? ( 
                    <Text style={styles.errorMessage}>Nenhum hospital encontrado com esse nome</Text>
                  ) : (
                <FlatList
                  style={styles.flatListContainer}
                  data={hospitais}
                  renderItem={renderHospitalItem}
                  keyExtractor={(item) => item.id}
                  numColumns={1}
                  refreshing={refreshing}
                />
              )}
        </View>
        

      {/* Botão para abrir o modal */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          sheetRef.current?.open(); 
          setIsBottomSheetVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Portal>
        <BottomSheet ref={sheetRef} style={styles.bottomSheetContainer}
          containerHeight = '88.95%'
          animationType = 'fade'
          disableBodyPanning = {true}
          closeOnDragDown = {false}
          hideDragHandle ={true}
        >
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>Cadastrar novo hospital</Text>
                <TouchableOpacity
                        onPress={() => {
                          resetModal();
                        }}>
                          <Ionicons name="close-circle" size={33} color={'#bf3d3d'}/>
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
                                outputRange: ['400', '600'],
                              }),
                            },
                          ]}
                        >
                        Nome
                         </Animated.Text>
                  <TextInput
                      style={[
                        styles.inputBox,
                        !nomeHospital ? styles.placeholderStyleNome : styles.textStyle
                      ]}
                    placeholder={!isNomeFocused ? "Nome do hospital" : ""}
                    onChangeText={setNomeHospital}
                    placeholderTextColor="#191a1c"
                    ref={nomeInputRef}
                    autoCapitalize='words'
                    onFocus={() => handleFocus(labelNomeAnimation, setIsNomeFocused)}
                    >
                  </TextInput>
                  <FontAwesome6 name="edit" size={20} color="black" style={styles.iconEdit}/>
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
                                outputRange: ['400', '600'],
                              }),
                            },
                          ]}
                        >
                        Endereço
                         </Animated.Text>
                          <TextInput
                                style={[
                                  styles.inputBox,
                                  !enderecoHospital ? styles.placeholderStyleEndereco : styles.textStyle
                                ]}
                              ref={enderecoInputRef}
                              placeholder={!isEnderecoFocused ? "Endereço" : ""}
                              placeholderTextColor="#191a1c"
                              onChangeText={setEnderecoHospital}
                              autoCapitalize='words'
                              onFocus={() => handleFocus(labelEnderecoAnimation, setIsEnderecoFocused)}
                              >
                            </TextInput>
                          <FontAwesome6 name="edit" size={20} color="black" style={styles.iconEdit}/>
              </View>
                    <TouchableOpacity
                        style={[styles.confirmarPlantaoButton, !isButtonEnabled && styles.buttonDisabled]}
                        disabled={!isButtonEnabled}
                        onPress={() => {
                          handleRegisterHospital(nomeHospital, enderecoHospital);
                        }}
                        >
                      <Text style={[styles.confirmarPlantaoText, !isButtonEnabled && styles.buttonTextDisabled]}>Confirmar</Text>
                    </TouchableOpacity>
          </View>
          </BottomSheet>
          </Portal>    
    </View>
  );
}

const styles = StyleSheet.create({
  containerPai: {
    flex: 1,
    backgroundColor: '#012E40',
  },
  medicosContainer: {
    marginTop: 20,
    flex: 1
  },
  flatListContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  medicosTitle: {
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
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  errorMessage: {
    color: "#bf3d3d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  searchContainerPai:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  searchBarContainer: {
    display: 'flex',
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 40,
    marginBottom: 10,
    color: 'white'
  },
  cancelarContainer: {
    marginBottom: 11,
  },
  cancelButton: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  iconSearch: {
    position: 'absolute',
    left: 25,
    top: 11
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
    height: '100%'
  },
  bottomSheetContainer: {
    color: '#012E40', // Cor de fundo personalizada
    backgroundColor: '#012E40',
    flex: 1
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
  containerNome: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  inputBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
  },
  textStyle: {
    fontSize: 17,
  },
  placeholderStyleNome: {
    color: '#191a1c',
    fontSize: 13,
  },
  placeholderStyleEndereco: {
    color: '#191a1c',
    fontSize: 13,
  },
  inputLabel: {
    position: 'absolute',
    left: 10,
    color: '#ccc',
  },
  iconEdit: {
    position: 'absolute',
    right: 10,
    top: '25%',
  },
  containerEndereço: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
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
    marginTop: 30,
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
  hospitalItem: {
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
  nomeEnderecoContainer: {
    display: 'flex',
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    flex: 1.5,
  },
  hospitalNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  hospitalEndereco: {
    fontSize: 12,
    color: '#bfb9a6',
  },
  permissaoMedico: {
    fontSize: 12,
    color: '#bfb9a6',
  },
  quantosPlantoes: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'row',
    fontSize: 12,
    color: '#bfb9a6',
    alignItems: 'center',
  },
  betweenInput: {
    marginTop: 15,
    marginBottom: 15,
  },
});

