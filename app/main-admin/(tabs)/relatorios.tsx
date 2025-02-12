import firestore from "@react-native-firebase/firestore";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRef, useState } from "react";
import { montarRelatorio } from "@/src/components/relatorios";
import styles from "@/src/styles/relatoriosScreenStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { Dropdown } from "react-native-element-dropdown";

export default function RelatoriosScreen() {
  const [relatorio, setRelatorio] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [date, setDate] = useState(dayjs().subtract(1, "day"));
  const [tituloRelatorio, setTituloRelatorio] = useState("");
  const [isRelatorioMensal, setIsRelatorioMensal] = useState(false);
  const [valueMes, setValueMes] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDatePicker, setSelectedDatePicker] = useState("");
  const dropdownMesRef = useRef<any>(null);
  const [isFocusMes, setIsFocusMes] = useState(false);
  const [months, setMonths] = useState([
    { label: "Janeiro", value: "01" },
    { label: "Fevereiro", value: "02" },
    { label: "Março", value: "03" },
    { label: "Abril", value: "04" },
    { label: "Maio", value: "05" },
    { label: "Junho", value: "06" },
    { label: "Julho", value: "07" },
    { label: "Agosto", value: "08" },
    { label: "Setembro", value: "09" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ]);

  const gerarRelatorio = async (
    dataSelecionada: string,
    filtroPorMes: boolean
  ) => {
    try {
      let plantoesQuery;

      if (filtroPorMes) {
        const startOfMonth = `${dataSelecionada}-01`; // Exemplo: "2024-12-01"
        const endOfMonth = `${dataSelecionada}-31`; // Exemplo: "2024-12-31"
        plantoesQuery = firestore()
          .collection("plantoes")
          .orderBy("data")
          .startAt(startOfMonth)
          .endAt(endOfMonth);
      } else {
        plantoesQuery = firestore()
          .collection("plantoes")
          .where("data", "==", dataSelecionada); // Exemplo: "2024-12-31"
      }

      const querySnapshot = await plantoesQuery.get();
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
  const handleCloseModal = () => {
    setModalVisible(false);
    setRelatorio("");
    setValueMes(null);
    setSelectedDate("");
  };
  const handleDateConfirm = async (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const formattedDatePicker = dayjs(date).format("DD/MM/YYYY");
      setSelectedDatePicker(formattedDatePicker);
      setSelectedDate(formattedDate);
      setDate(dayjs(date));
      await gerarRelatorio(formattedDate, false);
    }
  };
  const handleMesConfirm = async (month: string) => {
    const dataSelecionada = `${new Date().getFullYear()}-${month}`;
    await gerarRelatorio(dataSelecionada, true);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View
      style={[styles.container, { paddingTop: useSafeAreaInsets().top + 10 }]}
    >
      <View style={styles.wrapperHeader}>
        <View style={styles.headerMain}>
          <Image
            source={require("@/assets/images/iconHeaderAura.png")}
            style={{
              width: Dimensions.get("window").width * 0.15,
              height: Dimensions.get("window").width * 0.15 * 0.5,
            }}
          />
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
          style={styles.buttonsItem}
          onPress={() => {
            setTituloRelatorio("Relatório diário");
            setIsRelatorioMensal(false);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonsText}>Relatório diário</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonsItem}
          onPress={() => {
            setTituloRelatorio("Relatório mensal");
            setIsRelatorioMensal(true);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonsText}>Relatório mensal</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para relatório */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.headerModal}>
              <Text style={styles.title}>{tituloRelatorio}</Text>
              {!isRelatorioMensal && (
                <View>
                  <TouchableOpacity
                    style={styles.buttonSeletor}
                    onPress={toggleDatePicker}
                  >
                    <Text style={styles.selectedTextStyle}>
                      {selectedDate ? selectedDatePicker : "Selecione uma data"}
                    </Text>
                  </TouchableOpacity>
                  {Platform.OS === "ios" && showDatePicker && (
                    <Modal
                      transparent={true}
                      animationType="fade"
                      onRequestClose={() => setShowDatePicker(false)}
                    >
                      <View style={styles.modalContainer}>
                        <View style={styles.modalContentSpinner}>
                          <DateTimePicker
                            themeVariant="light"
                            locale="pt-BR"
                            value={date.toDate()}
                            mode="date"
                            display="spinner"
                            onChange={handleDateConfirm}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              setShowDatePicker(false);
                            }}
                            style={styles.confirmButton}
                          >
                            <Text style={styles.confirmButtonText}>
                              Confirmar
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  )}
                </View>
              )}
              {isRelatorioMensal && (
                <TouchableOpacity
                  onPress={() => {
                    dropdownMesRef.current.open();
                  }}
                  style={styles.containerMes}
                >
                  <Dropdown
                    ref={dropdownMesRef}
                    style={[styles.dropdown]}
                    containerStyle={[styles.dropdownList]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemContainerStyle={styles.selectedItemStyle}
                    onFocus={() => {
                      setIsFocusMes(true);
                    }}
                    onBlur={() => {
                      setIsFocusMes(false);
                    }}
                    labelField="label"
                    valueField="value"
                    maxHeight={300}
                    value={valueMes}
                    onChange={(item) => {
                      if (item && item.value) {
                        handleMesConfirm(item.value);
                      }
                      setIsFocusMes(false);
                    }}
                    data={months}
                    placeholder={isFocusMes ? "..." : "Selecione o mês"}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Exibir relatório gerado */}
            <ScrollView>
              <View style={styles.message}>
                <Text selectable>{relatorio}</Text>
              </View>
            </ScrollView>

            {/* Botão para fechar o modal */}
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
