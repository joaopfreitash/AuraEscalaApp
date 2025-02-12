import { useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Medico, Plantao } from "../types";
import FlashMessage from "react-native-flash-message";

const medicosHooks = () => {
  const [filterType, setFilterType] = useState<string>("todos");
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([]);
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [selectedPlantao, setSelectedPlantao] = useState<Plantao | null>(null);
  const [isModalObsVisible, setIsModalObsVisible] = useState(false);
  const alertPlantao = useRef<FlashMessage | null>(null);

  // Buscar médicos no FireStore
  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await firestore()
        .collection("users")
        .orderBy("createdAt", "desc")
        .get();

      const medicosList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const plantaoIdsAntigos = data.plantaoIdsAntigos || [];
        const plantaoIdsNovos = data.plantaoIdsNovos || [];

        return {
          id: doc.id,
          nome: data.name,
          isAdmin: data.isAdmin,
          avatar: require("@/assets/images/hipocrates.png"),
          plantaoIdsAntigos, // Adiciona separadamente para facilitar o controle
          plantaoIdsNovos,
          totalPlantoes: plantaoIdsAntigos.length + plantaoIdsNovos.length, // Soma o total
        };
      });

      setMedicos(medicosList);
      setFilteredMedicos(medicosList);
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Alternar entre os estados do filtro
  const toggleFilter = () => {
    if (filterType === "todos") {
      setFilterType("adm");
    } else if (filterType === "adm") {
      setFilterType("med");
    } else {
      setFilterType("todos");
    }
  };

  const fetchPlantoes = async (medicoId: string) => {
    setLoading(true);
    try {
      const naoConcluidosQuery = firestore()
        .collection("plantoes")
        .where("medicoUid", "==", medicoId)
        .where("concluido", "==", false)
        .orderBy("data", "desc");

      const concluidosQuery = firestore()
        .collection("plantoes")
        .where("medicoUid", "==", medicoId)
        .where("concluido", "==", true)
        .orderBy("concluidoEm", "desc")
        .limit(10);

      const [naoConcluidosSnapshot, concluidosSnapshot] = await Promise.all([
        naoConcluidosQuery.get(),
        concluidosQuery.get(),
      ]);

      const naoConcluidos = naoConcluidosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Plantao[];

      const concluidos = concluidosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Plantao[];

      const plantoesList = [...naoConcluidos, ...concluidos];

      setPlantoes(plantoesList);
    } catch (error) {
      console.error("Erro ao buscar plantões:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (plantaoId: string) => {
    try {
      setSubmitting(true);

      const shiftDoc = await firestore()
        .collection("plantoes")
        .doc(plantaoId)
        .get();
      if (!shiftDoc.exists) {
        throw new Error("Escala não encontrada.");
      }

      const shiftData = shiftDoc.data();
      const medicoUid = shiftData?.medicoUid;
      const localUid = shiftData?.localUid;

      // Remover plantão do usuário e hospital
      if (medicoUid) {
        await firestore()
          .collection("users")
          .doc(medicoUid)
          .update({
            plantaoIdsNovos: firestore.FieldValue.arrayRemove(plantaoId),
            plantaoIdsAntigos: firestore.FieldValue.arrayRemove(plantaoId),
          });
      }
      if (localUid) {
        await firestore()
          .collection("hospitais")
          .doc(localUid)
          .update({
            plantaoIdsH: firestore.FieldValue.arrayRemove(plantaoId),
          });
      }

      // Deletar plantão
      await firestore().collection("plantoes").doc(plantaoId).delete();

      // Atualizar listas localmente
      setPlantoes((prev) => prev.filter((p) => p.id !== plantaoId));
      setFilteredMedicos((prev) => prev.filter((p) => p.id !== plantaoId));

      // Buscar plantoes novamente para manter sincronizado
      fetchPlantoes(medicoUid);

      // Notificação de sucesso
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Escala excluída com sucesso!",
          type: "success",
          floating: false,
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    } catch (error) {
      console.error("Erro ao deletar escala:", error);
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Erro ao excluir escala. Tente novamente.",
          type: "danger",
          floating: false,
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    } finally {
      setSubmitting(false);
      setIsModalDeleteVisible(false);
    }
  };

  const openModalDelete = (plantao: Plantao) => {
    setSelectedPlantao(plantao); // Armazena o plantão selecionado
    setIsModalDeleteVisible(true); // Abre o modal
  };

  const closeModalDelete = () => {
    setIsModalDeleteVisible(false);
  };

  const openModalObs = (plantao: Plantao) => {
    setSelectedPlantao(plantao); // Armazena o plantão selecionado
    setIsModalObsVisible(true); // Abre o modal
  };

  const closeModal = () => {
    setIsModalObsVisible(false);
  };

  return {
    filteredMedicos,
    setFilteredMedicos,
    filterType,
    toggleFilter,
    fetchMedicos,
    medicos,
    fetchPlantoes,
    plantoes,
    loading,
    handleDeleteShift,
    openModalDelete,
    closeModalDelete,
    isModalDeleteVisible,
    submitting,
    openModalObs,
    closeModal,
    isModalObsVisible,
    selectedPlantao,
  };
};

export default medicosHooks;
