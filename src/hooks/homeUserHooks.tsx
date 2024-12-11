import { useState, useEffect } from "react";
import {
  collection,
  deleteField,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
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

  const db = getFirestore();

  const fetchPlantoes = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@user");
      if (!storedUser) {
        console.error("Usuário não encontrado no AsyncStorage");
        return;
      }

      const user = JSON.parse(storedUser);
      const userUid = user.uid;

      const userDocRef = doc(db, "users", userUid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error("Documento do usuário não encontrado");
        return;
      }

      const userData = userDoc.data();
      const plantaoIds = [
        ...(userData.plantaoIdsAntigos || []),
        ...(userData.plantaoIdsNovos || []),
      ];

      if (plantaoIds.length === 0) {
        setPlantoes([]);
        setMarkedDays({});
        return;
      }

      const plantoesList: Plantao[] = [];

      for (const plantaoId of plantaoIds) {
        const plantaoDocRef = doc(collection(db, "plantoes"), plantaoId);
        const plantaoDoc = await getDoc(plantaoDocRef);

        if (plantaoDoc.exists()) {
          plantoesList.push({
            id: plantaoDoc.id,
            ...plantaoDoc.data(),
          } as Plantao);
        }
      }

      const updatedMarkedDays: MarkedDays = {};

      plantoesList.forEach((plantao) => {
        updatedMarkedDays[plantao.data] = {
          dots: [{ color: "red", selectedColor: "green" }],
        };
      });

      setPlantoes(plantoesList);
      setMarkedDays(updatedMarkedDays);
    } catch (error) {
      console.error("Erro ao buscar plantões:", error);
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
    const userDocRef = doc(db, "users", userUid);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data?.plantaoIdsNovos && data.plantaoIdsNovos.length > 0) {
          setHasNewNotification(true);
          setIsTherePlantaoNovo(true);
        } else {
          setHasNewNotification(false);
          setIsTherePlantaoNovo(false);
        }
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
    const medicoRef = doc(db, "users", userUid);
    const medicoDocSnapshot = await getDoc(medicoRef);
    const medicoData = medicoDocSnapshot.data();
    const plantaoIdsNovos = medicoData?.plantaoIdsNovos || [];
    const plantaoIdsAntigos = medicoData?.plantaoIdsAntigos || [];
    const updatedPlantaoIdsAntigos = [...plantaoIdsAntigos, ...plantaoIdsNovos];
    await updateDoc(medicoRef, {
      plantaoIdsNovos: deleteField(),
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
  };
};

export default homeUserHooks;
