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

  const fetchPlantoes = async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("@user");
      if (!storedUser) {
        console.error("Usuário não encontrado no AsyncStorage");
        return;
      }

      const user = JSON.parse(storedUser);
      const userUid = user.uid;

      const userDocRef = firestore().collection("users").doc(userUid);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        console.error("Documento do usuário não encontrado");
        return;
      }

      const userData = userDoc.data();
      const plantaoIds = [
        ...(userData?.plantaoIdsAntigos || []),
        ...(userData?.plantaoIdsNovos || []),
      ];

      if (plantaoIds.length === 0) {
        setPlantoes([]);
        return;
      }

      const plantoesList: Plantao[] = [];

      for (const plantaoId of plantaoIds) {
        const plantaoDocRef = firestore().collection("plantoes").doc(plantaoId);
        const plantaoDoc = await plantaoDocRef.get();

        if (plantaoDoc.exists) {
          plantoesList.push({
            id: plantaoDoc.id,
            ...plantaoDoc.data(),
          } as Plantao);
        }
      }

      const sortedPlantoes = plantoesList.sort((a, b) => {
        const dateA = new Date(a.data).getTime(); // Converter para timestamp
        const dateB = new Date(b.data).getTime();
        return dateB - dateA; // Ordem decrescente
      });

      setPlantoes(sortedPlantoes);
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

      // 4. Atualizar a coleção 'users' para remover o plantão de plantaoIds
      const storedUser = await AsyncStorage.getItem("@user");
      if (!storedUser) {
        console.error("Usuário não encontrado no AsyncStorage");
        return;
      }
      const user = JSON.parse(storedUser);
      const userUid = user.uid;

      const userDocRef = firestore().collection("users").doc(userUid);
      const userDoc = await userDocRef.get();
      const userData = userDoc.data();
      const plantaoIdsNovos = userData?.plantaoIdsNovos || [];
      const plantaoIdsAntigos = userData?.plantaoIdsAntigos || [];
      const isInNovos = plantaoIdsNovos.includes(selectedPlantaoId);
      const isInAntigos = plantaoIdsAntigos.includes(selectedPlantaoId);

      if (isInNovos || isInAntigos) {
        if (isInNovos) {
          await userDocRef.update({
            plantaoIdsNovos:
              firestore.FieldValue.arrayRemove(selectedPlantaoId),
          });
        }
        if (isInAntigos) {
          await userDocRef.update({
            plantaoIdsAntigos:
              firestore.FieldValue.arrayRemove(selectedPlantaoId),
          });
        }
      } else {
        console.log("O plantão selecionado não está em nenhum dos arrays.");
      }

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
      fetchPlantoes();
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
    fetchPlantoes();
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
  };
};

export default homeUserHooks;
