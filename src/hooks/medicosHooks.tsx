import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Medico, Plantao } from "../types";

const medicosHooks = () => {
  const [filterType, setFilterType] = useState<string>("todos");
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([]);
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);

  // Buscar médicos no FireStore
  const fetchMedicos = async () => {
    try {
      const querySnapshot = await firestore()
        .collection("users")
        .orderBy("createdAt", "desc")
        .get();
      const medicosList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const plantaoIds = [
          ...(data.plantaoIdsAntigos || []),
          ...(data.plantaoIdsNovos || []),
        ];
        return {
          id: doc.id,
          nome: data.name,
          isAdmin: data.isAdmin,
          avatar: require("@/assets/images/hipocrates.png"),
          plantaoIds: plantaoIds || [],
        };
      });
      setMedicos(medicosList);
      setFilteredMedicos(medicosList);
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
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
    }
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
  };
};

export default medicosHooks;
