import {
  collection,
  endAt,
  getDocs,
  getFirestore,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { useState } from "react";
import { montarRelatorio } from "@/src/components/relatorios";
import styles from "@/src/styles/relatoriosScreenStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function RelatoriosScreen() {
  const db = getFirestore();
  const [relatorio, setRelatorio] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  const gerarRelatorio = async (
    dataSelecionada: string,
    filtroPorMes: boolean
  ) => {
    try {
      let plantoesQuery;

      if (filtroPorMes) {
        // Filtra pelo mês
        const startOfMonth = `${dataSelecionada}-01`; // Exemplo: "2024-12-01"
        const endOfMonth = `${dataSelecionada}-31`; // Exemplo: "2024-12-31"
        plantoesQuery = query(
          collection(db, "plantoes"),
          orderBy("data"),
          startAt(startOfMonth),
          endAt(endOfMonth)
        );
      } else {
        // Filtra pelo dia
        plantoesQuery = query(
          collection(db, "plantoes"),
          where("data", "==", dataSelecionada) // Exemplo: "2024-12-31"
        );
      }

      const querySnapshot = await getDocs(plantoesQuery);
      const plantoesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Passo 2: Gerar o relatório
      const relatorioGerado = montarRelatorio(
        plantoesList,
        filtroPorMes,
        dataSelecionada
      );
      setRelatorio(relatorioGerado); // Armazena o relatório no estado
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
      <View style={styles.wrapperHeader}>
        <View style={styles.headerMain}>
          <Image
            source={require("@/assets/images/iconHeaderAura.png")}
            style={{
              width: Dimensions.get("window").width * 0.15,
              height: Dimensions.get("window").width * 0.15 * 0.5,
            }}
          />
          <View>
            <TouchableOpacity>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.relatorioTitle}>Relatórios</Text>
        </View>
      </View>

      {/* Botões para gerar relatório */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => gerarRelatorio("2024-12-31", false)}
          style={styles.buttonsItem}
        >
          <Text style={styles.buttonsText}>Relatório diário</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonsItem}>
          <Text style={styles.buttonsText}>Relatório mensal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
