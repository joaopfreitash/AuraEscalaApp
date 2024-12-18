import { useEffect, useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import FlashMessage from "react-native-flash-message";
import { Plantao } from "../types";
import { Animated } from "react-native";

const plantoesHooks = () => {
  const alertPlantao = useRef<FlashMessage | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHora, setSelectedHora] = useState("");

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
    setValueMedico("");
    setOpenMedico(false);
    setValueLocal("");
    setOpenLocal(false);
    setValueFuncao("");
    setOpenFuncao(false);
    setIsButtonEnabled(false);
    setSelectedDate("");
    setSelectedHora("");
  };

  useEffect(() => {
    if (!modalVisible) {
      handleBlurMedico();
      handleBlurLocal();
      handleBlurFuncao();
    }
  }, [modalVisible]);

  const fetchPlantoes = async (isConcluido: boolean) => {
    try {
      const plantoesQuery = firestore()
        .collection("plantoes")
        .where("concluido", "==", isConcluido)
        .orderBy("data", "desc");

      const querySnapshot = await plantoesQuery.get();

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
      const querySnapshot = await firestore().collection("users").get();

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
      const querySnapshot = await firestore().collection("hospitais").get();

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
      // Buscar o médico pelo nome
      const medicoSnapshot = await firestore()
        .collection("users")
        .where("name", "==", valueMedico)
        .get();
      const medicoDoc = medicoSnapshot.docs[0];
      const medicoUid = medicoDoc.id;

      // Buscar o hospital pelo nome
      const localSnapshot = await firestore()
        .collection("hospitais")
        .where("name", "==", valueLocal)
        .get();
      const localDoc = localSnapshot.docs[0];
      const localUid = localDoc.id;

      // Criar documento de plantão
      const shiftsDocRef = firestore().collection("plantoes").doc();
      const shiftId = shiftsDocRef.id;

      await shiftsDocRef.set({
        plantonista,
        local,
        data,
        horario,
        funcao,
        createdAt: firestore.FieldValue.serverTimestamp(),
        medicoUid,
        localUid,
        concluido: false,
      });

      const medicoRef = firestore().collection("users").doc(medicoUid);
      const medicoDocSnapshot = await medicoRef.get();
      const medicoData = medicoDocSnapshot.data();
      const plantaoIdsNovos = medicoData?.plantaoIdsNovos || [];
      const plantaoIdsAntigos = medicoData?.plantaoIdsAntigos || [];

      const updatedPlantaoIdsAntigos = [
        ...plantaoIdsAntigos,
        ...plantaoIdsNovos,
      ];
      const updatedPlantaoIdsNovos = [shiftId];

      await medicoRef.update({
        plantaoIdsNovos: updatedPlantaoIdsNovos,
        plantaoIdsAntigos: updatedPlantaoIdsAntigos,
      });

      const localRef = firestore().collection("hospitais").doc(localUid);
      await localRef.update({
        plantaoIdsH: firestore.FieldValue.arrayUnion(shiftId),
      });

      resetModal();
      fetchPlantoes(isConcluido);
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Escala cadastrada com sucesso!",
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
    setModalVisible,
    modalVisible,
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
    selectedDate,
    setSelectedDate,
    selectedHora,
    setSelectedHora,
  };
};

export default plantoesHooks;
