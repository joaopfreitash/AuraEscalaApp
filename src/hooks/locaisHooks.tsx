import { useRef, useState } from 'react';
import { getFirestore, doc, setDoc, getDocs, collection, Timestamp, query, orderBy } from "firebase/firestore";
import { showMessage } from 'react-native-flash-message';
import { Animated, TextInput } from 'react-native';
import { Hospital } from '../types';

const locaisHooks = () => {
    const db = getFirestore();

    const [hospitais, setHospitais] = useState<Hospital[]>([]);
    const [filteredHospitais, setFilteredHospitais] = useState<Hospital[]>([]);
    const [modalVisible, setModalVisible] = useState(false); 

    const [nomeHospital, setNomeHospital] = useState('');
    const [enderecoHospital, setEnderecoHospital] = useState('');
    const [isNomeFocused, setIsNomeFocused] = useState(false);
    const [isEnderecoFocused, setIsEnderecoFocused] = useState(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const labelNomeAnimation = useRef(new Animated.Value(0)).current;
    const labelEnderecoAnimation = useRef(new Animated.Value(0)).current;

    const resetModal = () => {
        setModalVisible(false);
        handleBlur(labelNomeAnimation, nomeHospital, setIsNomeFocused);
        handleBlur(labelEnderecoAnimation, enderecoHospital, setIsEnderecoFocused);
        setIsButtonEnabled(false)
        setNomeHospital('')
        setEnderecoHospital('')
        clearInputNome();
        clearInputEndereco();
      };

    // Buscar Hospitais no FireStore
    const fetchHospitals = async () => {
        try {
          const querySnapshot = await getDocs(
            query(collection(db, "hospitais"), orderBy("createdAt", "desc"))
          );
          const hospitaisList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              address: data.address,
              plantaoIdsH: data.plantaoIdsH || []
            };
          });
          setHospitais(hospitaisList);
          setFilteredHospitais(hospitaisList);
        } catch (error) {
          console.error("Erro ao buscar hospitais:", error);
        }
      };

// Handler pra cadastrar o Hospital
  const handleRegisterHospital = async (
    name: string,
    address: string,
  ) => {
    try {
      setIsButtonEnabled(false);
      const hospitalDocRef = doc(collection(db, "hospitais"));
  
      await setDoc(hospitalDocRef, {
        name: nomeHospital,
        address: enderecoHospital,
        createdAt: Timestamp.now(),
      });

      resetModal();
      fetchHospitals();
      showMessage({
        message: "Hospital cadastrado com sucesso!",
        type: "success",
        floating: true,
        duration: 4000,
        statusBarHeight: -5,
        style: {alignItems: 'center'}
      });
    } catch (error) {
      resetModal();
      showMessage({
        message: "Ocorreu um erro, tente novamente.",
        type: "danger",
        floating: true,
        duration: 4000,
        statusBarHeight: -5,
        style: {alignItems: 'center'}
      });
    }
  };

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


  return { filteredHospitais, setFilteredHospitais, enderecoHospital, setIsButtonEnabled,
    nomeHospital, hospitais, setModalVisible, modalVisible, handleRegisterHospital,
    resetModal, fetchHospitals, handleFocus, setEnderecoHospital,
    isNomeFocused, setNomeHospital, nomeInputRef,
    setIsNomeFocused, enderecoInputRef,
    isEnderecoFocused, setIsEnderecoFocused, isButtonEnabled,
    labelNomeAnimation, labelEnderecoAnimation};
};

export default locaisHooks;
