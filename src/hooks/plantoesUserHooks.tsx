import { useEffect, useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";
import { Plantao } from "../types";

const homeUserHooks = () => {
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [selectedPlantaoId, setSelectedPlantaoId] = useState<string | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const alertPlantao = useRef<FlashMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isConcluido, setIsConcluido] = useState(false);
  const [isModalObsVisible, setIsModalObsVisible] = useState(false);
  const [selectedPlantaoObs, setSelectedPlantaoObs] = useState<Plantao | null>(
    null
  );

  const openModalObs = (plantao: Plantao) => {
    setSelectedPlantaoObs(plantao); // Armazena o plantão selecionado
    setIsModalObsVisible(true); // Abre o modal
  };

  const closeModal = () => {
    setIsModalObsVisible(false);
  };

  const fetchPlantoes = async (isConcluido: boolean) => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("@user");
      if (!storedUser) {
        console.error("Usuário não encontrado no AsyncStorage");
        return;
      }

      const user = JSON.parse(storedUser);
      const userUid = user.uid;

      let plantoesQuery = firestore()
        .collection("plantoes")
        .where("medicoUid", "==", userUid)
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

  const handleConcluirPlantao = async () => {
    if (!selectedPlantaoId) {
      console.error("Nenhum plantão selecionado.");
      return;
    }
    setSubmitting(true);
    try {
      const plantaoDocRef = firestore()
        .collection("plantoes")
        .doc(selectedPlantaoId);
      const plantaoDoc = await plantaoDocRef.get();

      if (!plantaoDoc.exists) {
        console.error("Plantão não encontrado.");
        return;
      }

      const plantaoData = plantaoDoc.data();

      await plantaoDocRef.update({
        concluido: true,
        concluidoEm: firestore.FieldValue.serverTimestamp(),
        observacoes: text,
      });

      // 5. Atualizar a coleção 'hospitais' para remover o plantão de plantaoIdsH
      const hospitalDocRef = firestore()
        .collection("hospitais")
        .doc(plantaoData?.localUid);
      const hospitalDoc = await hospitalDocRef.get();

      if (hospitalDoc.exists) {
        await hospitalDocRef.update({
          plantaoIdsH: firestore.FieldValue.arrayRemove(selectedPlantaoId),
        });
      }
      resetModal();
      fetchPlantoes(isConcluido);
      setSelectedPlantaoId(null);
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Escala concluída com sucesso!",
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

  const resetModal = () => {
    setModalVisible(false);
    setText("");
  };

  useEffect(() => {
    fetchPlantoes(isConcluido);
  }, []);

  const handleSelectPlantao = (id: string) => {
    if (selectedPlantaoId === id) {
      setSelectedPlantaoId(null);
    } else {
      setSelectedPlantaoId(id);
    }
  };

  const selectedPlantao = plantoes.find(
    (plantao) => plantao.id === selectedPlantaoId
  );

  const handleCheckmarkClick = () => {
    setIsConcluido(!isConcluido);
    fetchPlantoes(!isConcluido);
  };

  return {
    plantoes,
    fetchPlantoes,
    resetModal,
    handleSelectPlantao,
    selectedPlantao,
    selectedPlantaoId,
    setModalVisible,
    modalVisible,
    text,
    setText,
    handleConcluirPlantao,
    alertPlantao,
    submitting,
    loading,
    isConcluido,
    handleCheckmarkClick,
    openModalObs,
    closeModal,
    isModalObsVisible,
    selectedPlantaoObs,
  };
};

export default homeUserHooks;
