import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import { Plantao, MarkedDays } from "../types";

const homeHooks = (selectedDate: Date) => {
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [markedDays, setMarkedDays] = useState<MarkedDays>({});
  const [filteredPlantao, setFilteredPlantao] = useState<Plantao[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlantoes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await firestore()
        .collection("plantoes")
        .orderBy("createdAt", "desc")
        .get();

      const plantoesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Plantao[];

      const updatedMarkedDays: MarkedDays = {};

      plantoesList.forEach((plantao) => {
        if (!plantao.data) return;

        if (!updatedMarkedDays[plantao.data]) {
          updatedMarkedDays[plantao.data] = {
            dots: [],
          };
        }

        const existingDots = updatedMarkedDays[plantao.data].dots ?? [];

        const color = plantao.concluido ? "green" : "red";
        const colorExists = existingDots.some((dot) => dot.color === color);

        if (!colorExists && existingDots.length < 2) {
          existingDots.push({
            color: color,
            selectedColor: color,
          });
        }

        updatedMarkedDays[plantao.data].dots = existingDots;
      });

      setPlantoes(plantoesList);
      setMarkedDays(updatedMarkedDays);
    } catch (error) {
      console.error("Erro ao buscar plantões:", error);
    } finally {
      setLoading(false);
    }
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

  return { plantoes, markedDays, filteredPlantao, fetchPlantoes, loading };
};

export default homeHooks;
