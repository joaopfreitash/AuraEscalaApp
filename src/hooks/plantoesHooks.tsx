import { useRef, useState } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  Timestamp,
  query,
  orderBy,
  where,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import dayjs from "dayjs";
import FlashMessage from "react-native-flash-message";
import { Plantao } from "../types";
import { Animated } from "react-native";

const plantoesHooks = () => {
  const db = getFirestore();

  const alertPlantao = useRef<FlashMessage | null>(null);

  const [isFuncaoFocused, setFuncaoFocused] = useState(false);
  const [isMedicoFocused, setMedicoFocused] = useState(false);
  const [isLocalFocused, setLocalFocused] = useState(false);

  const [selectedPlantao, setSelectedPlantao] = useState<Plantao | null>(null);
  const [isModalObsVisible, setIsModalObsVisible] = useState(false);

  const openModalObs = (plantao: Plantao) => {
    setSelectedPlantao(plantao); // Armazena o plantão selecionado
    setIsModalObsVisible(true); // Abre o modal
  };

  const closeModal = () => {
    setIsModalObsVisible(false);
  };

  const labelFuncaoAnimation = useRef(new Animated.Value(0)).current;
  const labelMedicoAnimation = useRef(new Animated.Value(0)).current;
  const labelLocalAnimation = useRef(new Animated.Value(0)).current;

  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [itemsMedico, setItemsMedico] = useState<{ value: string }[]>([]);
  const [itemsLocal, setItemsLocal] = useState<{ value: string }[]>([]);
  const [openMedico, setOpenMedico] = useState(false);
  const [valueMedico, setValueMedico] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(dayjs().subtract(1, "day"));
  const [time, setTime] = useState(dayjs());
  const [openLocal, setOpenLocal] = useState(false);
  const [valueLocal, setValueLocal] = useState<string>("");
  const [openFuncao, setOpenFuncao] = useState(false);
  const [valueFuncao, setValueFuncao] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isConcluido, setIsConcluido] = useState(false);
  const [itemsFuncao, setItemsFuncao] = useState([
    { label: "Cirurgião", value: "Cirurgião" },
    { label: "Auxílio Cirúrgico", value: "Auxílio Cirúrgico" },
    { label: "Anestesista", value: "Anestesista" },
    { label: "Auxílio Anestesia", value: "Auxílio Anestesia" },
    { label: "Ambulatório", value: "Ambulatório" },
  ]);

  const resetModal = () => {
    setModalVisible(false);
    setDate(dayjs().subtract(1, "day"));
    setTime(dayjs());
    setValueMedico("");
    setOpenMedico(false);
    setValueLocal("");
    setOpenLocal(false);
    setValueFuncao("");
    setOpenFuncao(false);
    setIsButtonEnabled(false);
    handleBlurMedico();
    handleBlurLocal();
    handleBlurFuncao();
  };

  const fetchPlantoes = async (isConcluido: boolean) => {
    try {
      const plantoesQuery = isConcluido
        ? query(
            collection(db, "plantoes"),
            where("concluido", "==", true),
            orderBy("createdAt", "desc")
          )
        : query(
            collection(db, "plantoes"),
            where("concluido", "==", false),
            orderBy("createdAt", "desc")
          );

      const querySnapshot = await getDocs(plantoesQuery);

      const plantoesList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          plantonista: data.plantonista,
          data: data.data,
          horario: data.horario,
          local: data.local,
          funcao: data.funcao,
          concluido: data.concluido,
          observacoes: data.observacoes,
        };
      });

      setPlantoes(plantoesList);
    } catch (error) {
      console.error("Erro ao buscar plantões:", error);
    }
  };

  const handleCheckmarkClick = () => {
    setIsConcluido(!isConcluido);
    fetchPlantoes(!isConcluido);
  };

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

  const fetchHospitals = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "hospitais")));

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

  const handleRegisterShift = async (
    plantonista: string,
    local: string,
    data: string,
    horario: string,
    funcao: string
  ) => {
    try {
      setIsButtonEnabled(false);
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(
        query(usersCollection, where("name", "==", valueMedico))
      );
      const medicoDoc = querySnapshot.docs[0];
      const medicoUid = medicoDoc.id;

      const localCollection = collection(db, "hospitais");
      const querySnapshotLocal = await getDocs(
        query(localCollection, where("name", "==", valueLocal))
      );
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
        concluido: false,
      });

      const medicoRef = doc(db, "users", medicoUid);
      const medicoDocSnapshot = await getDoc(medicoRef);
      const medicoData = medicoDocSnapshot.data();
      const plantaoIdsNovos = medicoData?.plantaoIdsNovos || [];
      const plantaoIdsAntigos = medicoData?.plantaoIdsAntigos || [];

      const updatedPlantaoIdsAntigos = [
        ...plantaoIdsAntigos,
        ...plantaoIdsNovos,
      ];
      const updatedPlantaoIdsNovos = [shiftId];

      await updateDoc(medicoRef, {
        plantaoIdsNovos: updatedPlantaoIdsNovos,
        plantaoIdsAntigos: updatedPlantaoIdsAntigos,
      });

      const localRef = doc(db, "hospitais", localUid);
      await updateDoc(localRef, {
        plantaoIdsH: arrayUnion(shiftId),
      });

      resetModal();
      fetchPlantoes(isConcluido);
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Escala cadastrado com sucesso!",
          type: "success",
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    } catch (error) {
      resetModal();
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Ocorreu um erro, tente novamente.",
          type: "danger",
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    }
  };

  const handleFocusMedico = () => {
    Animated.timing(labelMedicoAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setMedicoFocused(true);
  };

  const handleBlurMedico = () => {
    Animated.timing(labelMedicoAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setMedicoFocused(false);
  };

  const handleFocusLocal = () => {
    Animated.timing(labelLocalAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setLocalFocused(true);
  };

  const handleBlurLocal = () => {
    Animated.timing(labelLocalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setLocalFocused(false);
  };

  const handleFocusFuncao = () => {
    Animated.timing(labelFuncaoAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setFuncaoFocused(true);
  };

  const handleBlurFuncao = () => {
    Animated.timing(labelFuncaoAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setFuncaoFocused(false);
  };

  return {
    resetModal,
    fetchPlantoes,
    fetchMedicos,
    fetchHospitals,
    plantoes,
    valueMedico,
    valueLocal,
    valueFuncao,
    setIsButtonEnabled,
    setDate,
    setTime,
    setModalVisible,
    modalVisible,
    date,
    time,
    openMedico,
    itemsMedico,
    setOpenMedico,
    setValueMedico,
    setItemsMedico,
    openFuncao,
    itemsFuncao,
    setOpenFuncao,
    setValueFuncao,
    setItemsFuncao,
    openLocal,
    itemsLocal,
    setOpenLocal,
    alertPlantao,
    setValueLocal,
    setItemsLocal,
    isButtonEnabled,
    handleRegisterShift,
    labelFuncaoAnimation,
    labelMedicoAnimation,
    labelLocalAnimation,
    handleFocusLocal,
    handleFocusFuncao,
    handleFocusMedico,
    setIsConcluido,
    handleCheckmarkClick,
    isConcluido,
    selectedPlantao,
    isModalObsVisible,
    openModalObs,
    closeModal,
  };
};

export default plantoesHooks;
