import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { Plantao, MarkedDays } from "../types";

const homeUserHooks = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [markedDays, setMarkedDays] = useState<MarkedDays>({});
  const [filteredPlantao, setFilteredPlantao] = useState<Plantao[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [isTherePlantaoNovo, setIsTherePlantaoNovo] = useState(false);
  const [loading, setLoading] = useState(false);

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

      const userDocRef = firestore().doc(`users/${userUid}`);
      const userDoc = await userDocRef.get();

      const userData = userDoc.data();
      const plantaoIds = [
        ...(userData?.plantaoIdsAntigos || []),
        ...(userData?.plantaoIdsNovos || []),
      ];

      if (plantaoIds.length === 0) {
        setPlantoes([]);
        setMarkedDays({});
        return;
      }

      const plantoesList: Plantao[] = [];
      const updatedMarkedDays: MarkedDays = {};

      for (const plantaoId of plantaoIds) {
        const plantaoDocRef = firestore().doc(`plantoes/${plantaoId}`);
        const plantaoDoc = await plantaoDocRef.get();

        if (plantaoDoc.exists) {
          const plantaoData = plantaoDoc.data() as Plantao;

          if (plantaoData && plantaoData.data) {
            // Verificação de segurança
            plantoesList.push({
              ...plantaoData,
              id: plantaoDoc.id, // Sobrescreve qualquer 'id' existente em plantaoData
            });

            // Verificar se o dia já está marcado
            if (!updatedMarkedDays[plantaoData.data]) {
              updatedMarkedDays[plantaoData.data] = {
                dots: [], // Inicializa o array de bolinhas
              };
            }

            const existingDots = updatedMarkedDays[plantaoData.data].dots ?? [];

            // Adicionar bolinha verde ou vermelha, sem duplicar
            const color = plantaoData.concluido ? "green" : "red";
            const colorExists = existingDots.some((dot) => dot.color === color);

            if (!colorExists && existingDots.length < 2) {
              existingDots.push({
                color: color,
                selectedColor: color,
              });
            }
          }
        }
      }

      setPlantoes(plantoesList);
      setMarkedDays(updatedMarkedDays);
    } catch (error) {
      console.error("Erro ao buscar plantões:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkNewPlantao = async () => {
    const storedUser = await AsyncStorage.getItem("@user");
    if (!storedUser) {
      console.error("Usuário não encontrado no AsyncStorage");
      return;
    }
    const user = JSON.parse(storedUser);
    const userUid = user.uid;
    const userDocRef = firestore().doc(`users/${userUid}`);
    const unsubscribe = userDocRef.onSnapshot((docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        const data = docSnapshot.data();
        if (data?.plantaoIdsNovos && data.plantaoIdsNovos.length > 0) {
          setHasNewNotification(true);
          setIsTherePlantaoNovo(true);
        } else {
          setHasNewNotification(false);
          setIsTherePlantaoNovo(false);
        }
      } else {
        setHasNewNotification(false);
        setIsTherePlantaoNovo(false);
      }
    });
    return () => unsubscribe();
  };

  const updatePlantaoIdsArray = async () => {
    const storedUser = await AsyncStorage.getItem("@user");
    if (!storedUser) {
      console.error("Usuário não encontrado no AsyncStorage");
      return;
    }
    const user = JSON.parse(storedUser);
    const userUid = user.uid;
    const medicoRef = firestore().doc(`users/${userUid}`);
    const medicoDocSnapshot = await medicoRef.get();
    const medicoData = medicoDocSnapshot.data();
    const plantaoIdsNovos = medicoData?.plantaoIdsNovos || [];
    const plantaoIdsAntigos = medicoData?.plantaoIdsAntigos || [];
    const updatedPlantaoIdsAntigos = [...plantaoIdsAntigos, ...plantaoIdsNovos];
    await medicoRef.update({
      plantaoIdsNovos: firestore.FieldValue.delete(),
      plantaoIdsAntigos: updatedPlantaoIdsAntigos,
    });
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const filtered = plantoes.filter(
        (plantao) => plantao.data === formattedDate
      );
      setFilteredPlantao(filtered);
    }
  }, [selectedDate, plantoes]);

  return {
    plantoes,
    markedDays,
    filteredPlantao,
    fetchPlantoes,
    setSelectedDate,
    selectedDate,
    checkNewPlantao,
    hasNewNotification,
    isTherePlantaoNovo,
    updatePlantaoIdsArray,
    loading,
  };
};

export default homeUserHooks;
