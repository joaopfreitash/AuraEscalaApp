import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { Plantao, MarkedDays } from "../types";
import * as Notifications from "expo-notifications";

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

      for (const plantaoId of plantaoIds) {
        const plantaoDocRef = firestore().doc(`plantoes/${plantaoId}`);
        const plantaoDoc = await plantaoDocRef.get();

        if (plantaoDoc.exists) {
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

    const unsubscribe = userDocRef.onSnapshot(async (docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        const data = docSnapshot.data();
        if (data?.plantaoIdsNovos && data.plantaoIdsNovos.length > 0) {
          setHasNewNotification(true);
          setIsTherePlantaoNovo(true);
          try {
            const expoPushToken = await AsyncStorage.getItem("@expoPushToken");
            if (!expoPushToken) {
              console.error("Expo Push Token não encontrado no AsyncStorage");
              return;
            }

            // Envia a notificação
            await sendPushNotification(expoPushToken);
          } catch (error) {
            console.error("Erro ao enviar push notification:", error);
          }
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

  async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Nova escala cadastrada",
      body: "Entre no aplicativo para saber a data e local",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

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
