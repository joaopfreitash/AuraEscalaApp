import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Animated, Image, TextInput, Keyboard } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Portal } from 'react-native-portalize';
import DropDownPicker from 'react-native-dropdown-picker';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore  from '@react-native-firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function MedicosScreen() {

  type Medico = {
    id: string;
    nome: string;
    isAdmin: boolean;
    avatar: any;
    plantaoIds?: string[];
  };

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([]);

  const [nomeMedico, setNomeMedico] = useState('');
  const [emailMedico, setEmailMedico] = useState('');
  const [isNomeFocused, setIsNomeFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isRoleFocused, setRoleFocused] = useState(false)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const labelNomeAnimation = useRef(new Animated.Value(0)).current;
  const labelEmailAnimation = useRef(new Animated.Value(0)).current;
  const labelRoleAnimation = useRef(new Animated.Value(0)).current;
  const rotationRefresh = useState(new Animated.Value(0))[0];
  
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
      setFilteredMedicos(medicos);
      Keyboard.dismiss();
      Animated.timing(searchBarWidth, {
        toValue: 100,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Padrão", value: "padrao"}, // Cor personalizada para o badge
    { label: "Administrador", value: "administrador"},
  ]);

  const sheetRef = useRef<BottomSheetMethods>(null);

  // Buscar médicos no FireStore
  const fetchMedicos = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .get();
  
      const medicosList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.name,
          isAdmin: data.isAdmin,
          avatar: require('@/assets/images/hipocrates.png'),
          plantaoIds: data.plantaoIds || [],
        };
      });
  
      setMedicos(medicosList);
      setFilteredMedicos(medicosList);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      setRefreshing(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Chama a função de buscar médicos assim que o componente é montado
  useEffect(() => {
    fetchMedicos();
  }, []);

  const onRefresh = async () => {
    rotationRefresh.setValue(0);
    setRefreshing(true); // Ativa o estado de carregamento
    Animated.timing(rotationRefresh, {
      toValue: 1,
      duration: 500,  // Rotação completa a cada 800ms
      useNativeDriver: true,
    }).start();
    await fetchMedicos(); // Chama a função que pega os dados atualizados do Firestore
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text); // Atualiza a query de pesquisa
  
    const filtered = medicos.filter((medico) =>
      medico.nome.toLowerCase().includes(text.toLowerCase())
    );
  
    if (filtered.length === 0) {
      setFilteredMedicos([]); // Define a lista filtrada como vazia
    } else {
      setFilteredMedicos(filtered); // Atualiza os médicos filtrados
      setErrorMessage(""); // Remove a mensagem de erro
    }
  };

  // Alternar entre os estados do filtro
const toggleFilter = () => {
  if (filterType === 'todos') {
    setFilterType('adm');
  } else if (filterType === 'adm') {
    setFilterType('med');
  } else {
    setFilterType('todos');
  }
};

  // Filtra a lista com base no tipo selecionado
  useEffect(() => {
    if (filterType === 'todos') {
      setFilteredMedicos(medicos);
    } else if (filterType === 'adm') {
      setFilteredMedicos(medicos.filter((medico) => medico.isAdmin));
    } else if (filterType === 'med') {
      setFilteredMedicos(medicos.filter((medico) => !medico.isAdmin));
    }
  }, [filterType, medicos]);
  

  // Handler pra cadastrar o médico
  const handleRegisterDoctor = async (
    email: string,
    name: string,
  ) => {
    try {
      // Verificar se o e-mail já está registrado
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', emailMedico)
        .get();
  
      if (!querySnapshot.empty) {
        alert('Este e-mail já está cadastrado. Por favor, use outro e-mail.');
        return;
      }
  
      // Criar usuário com email e senha aleatória
      const randomPassword = Math.random().toString(36).slice(-8); // Senha gerada aleatoriamente
      const userCredential = await auth().createUserWithEmailAndPassword(emailMedico, randomPassword);
      const user = userCredential.user; // `user.uid` é gerado automaticamente
  
      const isAdmin = value === 'administrador'; // Determinar se o usuário é administrador
  
      // Adicionar o médico ao Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          name: nomeMedico,
          email: emailMedico,
          isAdmin: isAdmin,
          createdAt: firestore.Timestamp.now(),
        });
  
      alert('Médico cadastrado com sucesso!');
      resetModal();
    } catch (error) {
      console.error('Erro ao cadastrar médico:', error);
      alert('Por favor, digite um e-mail válido.');
    }
  };

  //Verificar se campos preenchidos para habilitar botão Confirmar
  const checkFields = () => {
    if (nomeMedico && emailMedico && value) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  useEffect(() => {
    checkFields();
  }, [value, nomeMedico, emailMedico]);
  
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

  const handleFocusRole = () => {
    Animated.timing(labelRoleAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setRoleFocused(true);
};

const handleBlurRole = () => {
  Animated.timing(labelRoleAnimation, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
  }).start();
  setRoleFocused(false);
};

  const resetModal = () => {
    sheetRef.current?.close();
    handleBlur(labelNomeAnimation, nomeMedico, setIsNomeFocused);
    handleBlur(labelEmailAnimation, emailMedico, setIsEmailFocused);
    setValue(null);
    setOpen(false);
    handleBlurRole();
    setIsButtonEnabled(false)
    setNomeMedico('')
    setEmailMedico('')
    clearInputNome();
    clearInputEmail();
  };


  //JEITINHO BRASILEIRO PRA LIMPAR INPUT
  const nomeInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);

  const clearInputNome = () => {
    if (nomeInputRef.current) {
      nomeInputRef.current.clear();
    }
  };

  const clearInputEmail = () => {
    if (emailInputRef.current) {
      emailInputRef.current.clear();
    }
  };

  const renderMedicoItem = ({ item }: { item: Medico }) => (
    <View style={styles.medicoItem}>
      <Image source={item.avatar} style={styles.medicoAvatar} />
      <View style={styles.nomePermContainer}>
        <Text style={styles.medicoNome}>{item.nome}</Text>
          <Text style={styles.permissaoMedico}>
              {item.isAdmin ? "Administrador" : "Médico"}
          </Text>
      </View>
      <View style={styles.quantosPlantoes}>
        <Entypo name="chevron-right" size={20} color="#012E40" />
        <Text style={styles.permissaoMedico}>
        {
          Array.isArray(item.plantaoIds)
            ? item.plantaoIds.length === 1
              ? "1 Plantão"
              : `${item.plantaoIds.length} Plantões`
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
          <View style={styles.headerLeft}>
            <Text style={styles.medicosTitle}>Médicos</Text>
            <TouchableOpacity 
                onPress={onRefresh}
                disabled={refreshing}>
              <Animated.View style={animatedStyle}>
                <FontAwesome name="refresh" size={22} style={styles.refreshIcon} />
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={styles.containerPaiFiltros}>
              <TouchableOpacity onPress={toggleFilter}>
                  {filterType === 'todos' && <Foundation name="torsos-all" size={24} color="white" />}
                  {filterType === 'adm' && <MaterialIcons name="security" size={24} color="white" />}
                  {filterType === 'med' && <Ionicons name="medkit" size={24} color="white" />}
              </TouchableOpacity>
          </View>
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

          {filteredMedicos.length > 0 ? (
            <FlatList
              style={styles.flatListContainer}
              data={filteredMedicos}
              renderItem={renderMedicoItem}
              keyExtractor={(item) => item.id}
              numColumns={1}
              refreshing={refreshing}
            />
              ) : searchQuery.trim() ? ( 
                <Text style={styles.errorMessage}>Nenhum médico encontrado com esse nome</Text>
              ) : (
            <FlatList
              style={styles.flatListContainer}
              data={medicos}
              renderItem={renderMedicoItem}
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
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Portal>
        <BottomSheet ref={sheetRef} style={styles.bottomSheetContainer}
          containerHeight = '88.55%'
          animationType = 'fade'
          disableBodyPanning = {true}
          closeOnDragDown = {false}
          hideDragHandle ={true}
        >
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>Cadastrar médico no APP</Text>
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
                                outputRange: [18, -20], // Move o rótulo para cima
                              }),
                              fontSize: labelNomeAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelNomeAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        Nome
                         </Animated.Text>
                  <TextInput
                      style={[
                        styles.inputBox,
                        !nomeMedico ? styles.placeholderStyleNome : styles.textStyle
                      ]}
                    placeholder={!isNomeFocused ? "Nome completo do médico" : ""}
                    placeholderTextColor="#191a1c"
                    onChangeText={setNomeMedico}
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

            {/* Imput de E-mail */}
            <View style={styles.containerEmail}>
                        <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelEmailAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -20], // Move o rótulo para cima
                              }),
                              fontSize: labelEmailAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelEmailAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        E-mail
                         </Animated.Text>
                          <TextInput
                                style={[
                                  styles.inputBox,
                                  !emailMedico ? styles.placeholderStyleEmail : styles.textStyle
                                ]}
                              ref={emailInputRef}
                              placeholder={!isEmailFocused ? "E-mail do médico" : ""}
                              placeholderTextColor="#191a1c"
                              onChangeText={setEmailMedico}
                              keyboardType="email-address"
                              autoCapitalize='none'
                              onFocus={() => handleFocus(labelEmailAnimation, setIsEmailFocused)}
                              >
                            </TextInput>
                          <FontAwesome6 name="edit" size={20} color="black" style={styles.iconEdit}/>
              </View>

              <View style={styles.betweenInput}>
                <FontAwesome name="level-down" size={30} color="black" />
              </View>

              {/* Role */}
              <View style={styles.containerRole}>
                        <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelRoleAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -26], // Move o rótulo para cima
                              }),
                              fontSize: labelRoleAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelRoleAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        Permissão
                         </Animated.Text>
                         <DropDownPicker style={styles.inputBoxPicker} onPress={() => {handleFocusRole(); Keyboard.dismiss();}}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder={'Selecione a permissão do usuário'}
                            placeholderStyle={styles.placeholderStylePermissao}
                            textStyle={styles.textStyle}
                            multiple={false}
                            language="PT"
                            dropDownContainerStyle={styles.dropDownListContainer}
                        />
              </View>
                    <TouchableOpacity
                        style={[styles.confirmarPlantaoButton, !isButtonEnabled && styles.buttonDisabled]}
                        disabled={!isButtonEnabled}
                        onPress={() => handleRegisterDoctor(emailMedico, nomeMedico)}
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
    flex: 1,
  },
  flatListContainer: {
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
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
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
    color: 'white',
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
  containerPaiFiltros:{
    paddingHorizontal: 10,
    marginTop: 5
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
  dropDownListContainer: {
    maxHeight: 300,
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
  inputBoxPicker: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 17,
  },
  placeholderStyleNome: {
    color: '#191a1c',
    fontSize: 13,
  },
  placeholderStyleEmail: {
    color: '#191a1c',
    fontSize: 13,
  },
  placeholderStylePermissao: {
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
  containerEmail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  containerRole: {
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
  medicoItem: {
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
  medicoAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 10
  },
  nomePermContainer: {
    display: 'flex',
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    flex: 1.5
  },
  medicoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  permissaoMedico: {
    fontSize: 12,
    color: '#bfb9a6',
  },
  quantosPlantoes: {
    flex: 0.6,
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

