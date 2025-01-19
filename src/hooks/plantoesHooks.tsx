import { useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import FlashMessage from "react-native-flash-message";
import { Plantao } from "../types";
import searchBar from "../utils/searchBar";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const plantoesHooks = () => {
  const alertPlantao = useRef<FlashMessage | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHora, setSelectedHora] = useState("");
  const [selectedPlantao, setSelectedPlantao] = useState<Plantao | null>(null);
  const [isModalObsVisible, setIsModalObsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openModalObs = (plantao: Plantao) => {
    setSelectedPlantao(plantao); // Armazena o plantão selecionado
    setIsModalObsVisible(true); // Abre o modal
  };

  const closeModal = () => {
    setIsModalObsVisible(false);
  };

  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [itemsMedico, setItemsMedico] = useState<{ value: string }[]>([]);
  const [itemsLocal, setItemsLocal] = useState<{ value: string }[]>([]);
  const [valueMedico, setValueMedico] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [valueLocal, setValueLocal] = useState<string>("");
  const [valueFuncao, setValueFuncao] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isConcluido, setIsConcluido] = useState(false);
  const [filteredPlantoes, setFilteredPlantoes] = useState<Plantao[]>([]);
  const [selectedDatePicker, setSelectedDatePicker] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [itemsFuncao, setItemsFuncao] = useState([
    { label: "Cirurgião", value: "Cirurgião" },
    { label: "Auxílio Cirúrgico", value: "Auxílio Cirúrgico" },
    { label: "Anestesista", value: "Anestesista" },
    { label: "Auxílio Anestesia", value: "Auxílio Anestesia" },
    { label: "Ambulatório", value: "Ambulatório" },
  ]);

  const { setSearchQuery } = searchBar();

  const resetModal = () => {
    setModalVisible(false);
    setValueMedico("");
    setValueLocal("");
    setValueFuncao("");
    setIsButtonEnabled(false);
    setSelectedDate("");
    setSelectedHora("");
    setSelectedDatePicker("");
  };

  const fetchPlantoes = async (isConcluido: boolean) => {
    setLoading(true);
    try {
      let plantoesQuery = firestore()
        .collection("plantoes")
        .where("concluido", "==", isConcluido);
      if (isConcluido) {
        plantoesQuery = plantoesQuery.orderBy("data", "desc").limit(30);
      } else {
        plantoesQuery = plantoesQuery.orderBy("data", "desc");
      }

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
          concluidoEm: data.concluidoEm,
        };
      });

      setPlantoes(plantoesList);
    } catch (error) {
      console.error("Erro ao buscar plantões:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckmarkClick = () => {
    setSearchQuery("");
    setFilteredPlantoes([]);
    setIsConcluido(!isConcluido);
    fetchPlantoes(!isConcluido);
  };

  const fetchMedicos = async () => {
    try {
      const querySnapshot = await firestore().collection("users").get();
      const medicosList = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (data.isDev) {
            return null;
          }
          return {
            value: data.name,
          };
        })
        .filter((medico) => medico !== null);
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
    setSubmitting(true);
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
          floating: false,
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
          floating: false,
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTempDate = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const formattedDatePicker = dayjs(date).format("DD/MM/YYYY");
      setSelectedDatePicker(formattedDatePicker);
      setSelectedDate(formattedDate);
    }
  };

  const handleTempTime = (event: DateTimePickerEvent, time?: Date) => {
    if (time) {
      const formattedTime = time.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSelectedHora(formattedTime);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(true);
  };

  const toggleDatePickerFalse = () => {
    setShowDatePicker(false);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(true);
  };

  const toggleTimePickerFalse = () => {
    setShowTimePicker(false);
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
    itemsMedico,
    setValueMedico,
    setItemsMedico,
    itemsFuncao,
    setValueFuncao,
    setItemsFuncao,
    itemsLocal,
    alertPlantao,
    setValueLocal,
    setItemsLocal,
    isButtonEnabled,
    handleRegisterShift,
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
    filteredPlantoes,
    setFilteredPlantoes,
    loading,
    submitting,
    selectedDatePicker,
    showDatePicker,
    showTimePicker,
    toggleDatePicker,
    toggleTimePicker,
    toggleDatePickerFalse,
    handleTempDate,
    toggleTimePickerFalse,
    handleTempTime,
  };
};

export default plantoesHooks;
