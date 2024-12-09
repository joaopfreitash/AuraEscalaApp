import { useRef, useState } from 'react';
import { getFirestore, doc, setDoc, getDocs, collection, Timestamp, query, orderBy, where, updateDoc, arrayUnion } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Medico } from '../types';
import { Animated, TextInput } from 'react-native';

const medicosHooks = () => {
    const auth = getAuth();
    const db = getFirestore();

    const labelNomeAnimation = useRef(new Animated.Value(0)).current;
    const labelEmailAnimation = useRef(new Animated.Value(0)).current;
    const labelRoleAnimation = useRef(new Animated.Value(0)).current;
    const [isRoleFocused, setRoleFocused] = useState(false)
    const [isNomeFocused, setIsNomeFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [nomeMedico, setNomeMedico] = useState('');
    const [emailMedico, setEmailMedico] = useState('');
    
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [filterType, setFilterType] = useState<string>('todos');
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Padrão", value: "padrao"},
        { label: "Administrador", value: "administrador"},
    ]);

    const resetModal = () => {
        setModalVisible(false);
        handleBlur(labelNomeAnimation, nomeMedico, setIsNomeFocused);
        handleBlur(labelEmailAnimation, emailMedico, setIsEmailFocused);
        setValue(null);
        setOpen(false);
        handleBlurRole();
        setIsButtonEnabled(false);
        setNomeMedico('');
        setEmailMedico('');
        clearInputNome();
        clearInputEmail();
      };

    // Buscar médicos no FireStore
    const fetchMedicos = async () => {
        try {
          const querySnapshot = await getDocs(
            query(collection(db, "users"), orderBy("createdAt", "desc"))
          );
          const medicosList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              nome: data.name,
              isAdmin: data.isAdmin,
              avatar: require("@/assets/images/hipocrates.png"),
              plantaoIds: data.plantaoIds || []
            };
          });
          setMedicos(medicosList);
          setFilteredMedicos(medicosList);
        } catch (error) {
          console.error("Erro ao buscar médicos:", error);
        }
      };

    // Handler pra cadastrar o médico
  const handleRegisterDoctor = async (
    email: string,
    name: string,
  ) => {
    try {

      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(query(usersCollection, where("email", "==", emailMedico)));

      if (!querySnapshot.empty) {
        alert("Este e-mail já está cadastrado. Por favor, use outro e-mail.");
        return;
      }

      const randomPassword = Math.random().toString(36).slice(-8);
      const userCredential = await createUserWithEmailAndPassword(auth, emailMedico, randomPassword);
      const user = userCredential.user; //`user.uid` é gerado automaticamente
      const isAdmin = value === "administrador";
  
      const doctorDocRef = doc(db, "users", user.uid);
  
      await setDoc(doctorDocRef, {
        name: nomeMedico,
        email: emailMedico,
        isAdmin: isAdmin,
        createdAt: Timestamp.now(),
      });

      alert("Médico cadastrado com sucesso!");
      resetModal();
      fetchMedicos();
    } catch (error) {
      alert("Por favor, digite um E-mail válido.");
    }
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

  return { filteredMedicos, setFilteredMedicos, filterType, nomeMedico, setIsButtonEnabled,
    emailMedico, value, setModalVisible, modalVisible, toggleFilter,
    resetModal, fetchMedicos, medicos, handleFocus, handleFocusRole,
    isNomeFocused, setNomeMedico, nomeInputRef, handleRegisterDoctor,
    setIsNomeFocused, emailInputRef, setEmailMedico, open, items, setOpen,
    isEmailFocused, setIsEmailFocused, isButtonEnabled, labelRoleAnimation,
    setValue, setItems, labelNomeAnimation, labelEmailAnimation};
};

export default medicosHooks;
