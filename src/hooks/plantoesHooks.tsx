import { useEffect, useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import FlashMessage from "react-native-flash-message";
import { Plantao } from "../types";
import searchBar from "../utils/searchBar";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const plantoesHooks = () => {
  const alertPlantao = useRef<FlashMessage | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHora, setSelectedHora] = useState("");
  const [selectedPlantao, setSelectedPlantao] = useState<Plantao | null>(null);
  const [isModalObsVisible, setIsModalObsVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedHoraFixa, setSelectedHoraFixa] = useState("");
  const [escalaAbertaId, setEscalaAbertaId] = useState<number | null>(null);
  const [escalasComDataSelecionada, setEscalasComDataSelecionada] = useState<
    number[]
  >([]);
  const [escalasComMedico, setEscalasComMedico] = useState<number[]>([]);
  const [escalasComLocal, setEscalasComLocal] = useState<number[]>([]);
  const [escalasComFuncao, setEscalasComFuncao] = useState<number[]>([]);
  const [escalasComAuxilio, setEscalasComAuxilio] = useState<number[]>([]);
  const [escalasComAuxilioAtivo, setEscalasComAuxilioAtivo] = useState<
    number[]
  >([]);
  const [escalasComHora, setEscalasComHora] = useState<number[]>([]);

  const [escalas, setEscalas] = useState<
    {
      id: number;
      aberta: boolean;
      dias: string[];
      medico?: string;
      local?: string;
      funcao?: string;
      auxiliocirurgico?: string;
      auxiliocirurgicoativo: boolean;
      hora?: string;
    }[]
  >([
    {
      id: Date.now(),
      aberta: false,
      dias: [],
      medico: "",
      local: "",
      funcao: "",
      auxiliocirurgico: "",
      auxiliocirurgicoativo: true,
      hora: "",
    },
  ]);
  const [modalCalendarioVisible, setModalCalendarioVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  const openModalObs = (plantao: Plantao) => {
    setSelectedPlantao(plantao); // Armazena o plantão selecionado
    setIsModalObsVisible(true); // Abre o modal
  };

  const closeModal = () => {
    setIsModalObsVisible(false);
  };

  const openModalDelete = (plantao: Plantao) => {
    setSelectedPlantao(plantao); // Armazena o plantão selecionado
    setIsModalDeleteVisible(true); // Abre o modal
  };

  const closeModalDelete = () => {
    setIsModalDeleteVisible(false);
  };

  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [itemsMedico, setItemsMedico] = useState<{ value: string }[]>([]);
  const [itemsLocal, setItemsLocal] = useState<{ value: string }[]>([]);
  const [valueMedico, setValueMedico] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [valueLocal, setValueLocal] = useState<string>("");
  const [valueFuncao, setValueFuncao] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isConcluido, setIsConcluido] = useState(false);
  const [filteredPlantoes, setFilteredPlantoes] = useState<Plantao[]>([]);
  const [selectedDatePicker, setSelectedDatePicker] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [itemsFuncao, setItemsFuncao] = useState([
    { label: "Cirurgião", value: "Cirurgião" },
    { label: "Auxílio Cirúrgico", value: "Auxílio Cirúrgico" },
    { label: "Anestesista", value: "Anestesista" },
    { label: "Ambulatório", value: "Ambulatório" },
    { label: "Ambulatório Cirurgia", value: "Ambulatório Cirurgia" },
    { label: "Ambulatório Anestesia", value: "Ambulatório Anestesia" },
    { label: "Plantão Clínico", value: "Plantão Clínico" },
  ]);
  const [modalFixaVisible, setModalFixaVisible] = useState(false);
  const [auxilioCirurgico, setAuxilioCirurgico] = useState<string>("");
  const [auxilioCirurgicoAtivo, setAuxilioCirurgicoAtivo] = useState(true);

  const { setSearchQuery } = searchBar();

  const resetModal = () => {
    setModalVisible(false);
    setValueMedico("");
    setValueLocal("");
    setValueFuncao("");
    setAuxilioCirurgico("");
    setAuxilioCirurgicoAtivo(true);
    setIsButtonEnabled(false);
    setSelectedDate("");
    setSelectedHora("");
    setSelectedDatePicker("");
  };

  const fetchPlantoes = async (isConcluido: boolean) => {
    setLoading(true);
    try {
      let plantoesQuery = firestore()
        .collection("plantoes")
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

  const handleCheckmarkClick = () => {
    setSearchQuery("");
    setFilteredPlantoes([]);
    setIsConcluido(!isConcluido);
    fetchPlantoes(!isConcluido);
  };

  const fetchMedicos = async () => {
    try {
      const querySnapshot = await firestore().collection("users").get();
      const medicosList = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (data.isDev) {
            return null;
          }
          return {
            value: data.name,
          };
        })
        .filter((medico) => medico !== null);
      setItemsMedico(medicosList);
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const querySnapshot = await firestore().collection("hospitais").get();

      const hospitaisList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          value: data.name,
        };
      });
      setItemsLocal(hospitaisList);
    } catch (error) {
      console.error("Erro ao buscar hospitais:", error);
    }
  };

  const handleRegisterShift = async (
    plantonista: string,
    local: string,
    data: string,
    horario: string,
    funcao: string
  ) => {
    setSubmitting(true);
    try {
      setIsButtonEnabled(false);

      // Buscar o médico pelo nome
      const medicoUid = await getMedicoUid(plantonista);
      if (!medicoUid) throw new Error("Médico não encontrado.");

      // Verificar se já existe um plantão para o mesmo médico, data e horário
      const existingShiftSnapshot = await firestore()
        .collection("plantoes")
        .where("data", "==", data)
        .where("medicoUid", "==", medicoUid)
        .where("horario", "==", horario)
        .get();

      if (!existingShiftSnapshot.empty) {
        if (alertPlantao.current) {
          alertPlantao.current.showMessage({
            message:
              "Já existe uma escala cadastrada para este médico no mesmo dia e horário.",
            type: "danger",
            floating: false,
            duration: 5000,
            style: { alignItems: "center" },
          });
        }
        setIsButtonEnabled(true);
        setSubmitting(false);
        resetModal();
        return;
      }

      // Buscar o hospital pelo nome
      const localUid = await getLocalUid(local);
      if (!localUid) throw new Error("Hospital não encontrado.");

      // Criar o plantão principal
      const shiftId = await createShift(
        plantonista,
        local,
        data,
        horario,
        funcao,
        medicoUid,
        localUid
      );

      // Se houver médico de auxílio cirúrgico, cadastrar também
      if (auxilioCirurgico) {
        const auxilioUid = await getMedicoUid(auxilioCirurgico);
        if (auxilioUid) {
          await createShift(
            auxilioCirurgico,
            local,
            data,
            horario,
            "Auxílio Cirúrgico",
            auxilioUid,
            localUid
          );
        }
      }

      resetModal();
      fetchPlantoes(isConcluido);
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Escala cadastrada com sucesso!",
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

  // Função para buscar o UID do médico pelo nome
  const getMedicoUid = async (nomeMedico: string) => {
    const medicoSnapshot = await firestore()
      .collection("users")
      .where("name", "==", nomeMedico)
      .get();

    return medicoSnapshot.docs[0]?.id || null;
  };

  // Função para buscar o UID do hospital pelo nome
  const getLocalUid = async (nomeLocal: string) => {
    const localSnapshot = await firestore()
      .collection("hospitais")
      .where("name", "==", nomeLocal)
      .get();

    return localSnapshot.docs[0]?.id || null;
  };

  // Função para criar um plantão
  const createShift = async (
    plantonista: string,
    local: string,
    data: string,
    horario: string,
    funcao: string,
    medicoUid: string,
    localUid: string
  ) => {
    const shiftsDocRef = firestore().collection("plantoes").doc();
    const shiftId = shiftsDocRef.id;

    await shiftsDocRef.set({
      plantonista,
      local,
      data,
      horario,
      funcao,
      createdAt: firestore.FieldValue.serverTimestamp(),
      medicoUid,
      localUid,
      concluido: false,
    });

    // Atualizar os IDs dos plantões do médico
    const medicoRef = firestore().collection("users").doc(medicoUid);
    const medicoDocSnapshot = await medicoRef.get();
    const medicoData = medicoDocSnapshot.data();
    const plantaoIdsNovos = medicoData?.plantaoIdsNovos || [];
    const plantaoIdsAntigos = medicoData?.plantaoIdsAntigos || [];

    const updatedPlantaoIdsAntigos = [...plantaoIdsAntigos, ...plantaoIdsNovos];
    const updatedPlantaoIdsNovos = [shiftId];

    await medicoRef.update({
      plantaoIdsNovos: updatedPlantaoIdsNovos,
      plantaoIdsAntigos: updatedPlantaoIdsAntigos,
    });

    // Atualizar os plantões do hospital
    const localRef = firestore().collection("hospitais").doc(localUid);
    await localRef.update({
      plantaoIdsH: firestore.FieldValue.arrayUnion(shiftId),
    });

    return shiftId;
  };

  const [modalAtencaoTitle, setModalAtencaoTitle] = useState("");
  const [modalAtencaoMessage, setModalAtencaoMessage] = useState("");
  const [showModalAtencao, setShowModalAtencao] = useState(false);

  const abrirModalAtencao = (titulo: any, mensagem: any) => {
    setModalAtencaoTitle(titulo);
    setModalAtencaoMessage(mensagem);
    setShowModalAtencao(true);
  };

  const handleRegisterFixedShift = async () => {
    setSubmitting(true);
    let escalasNaoCadastradas = []; // Armazena as escalas já existentes
    try {
      setIsButtonEnabled(false);
      for (const escala of escalas) {
        const { medico, local, dias, funcao, hora, auxiliocirurgico } = escala;

        const medicoSnapshot = await firestore()
          .collection("users")
          .where("name", "==", medico)
          .get();

        if (medicoSnapshot.empty) {
          console.error("Médico não encontrado.");
          throw new Error("Médico não encontrado.");
        }
        const medicoDoc = medicoSnapshot.docs[0];
        const medicoUid = medicoDoc.id;

        // Buscar o hospital pelo nome
        const localSnapshot = await firestore()
          .collection("hospitais")
          .where("name", "==", local)
          .get();

        if (localSnapshot.empty) {
          console.error("Hospital não encontrado.");
          throw new Error("Hospital não encontrado.");
        }
        const localDoc = localSnapshot.docs[0];
        const localUid = localDoc.id;

        // Processa cada dia e cria uma escala separada
        for (const dia of dias) {
          // Verifica se a escala já existe
          const existingShiftSnapshot = await firestore()
            .collection("plantoes")
            .where("data", "==", dia)
            .where("medicoUid", "==", medicoUid)
            .where("horario", "==", hora)
            .get();

          if (!existingShiftSnapshot.empty) {
            const formattedDateFixa = dayjs(dia).format("DD/MM/YYYY");
            escalasNaoCadastradas.push(
              `${medico} no dia ${formattedDateFixa} às ${hora}\n`
            );
            continue;
          }

          // Cria nova escala
          const shiftsDocRef = firestore().collection("plantoes").doc();
          const shiftId = shiftsDocRef.id;

          try {
            // Cria o plantão principal
            await shiftsDocRef.set({
              plantonista: medico,
              local,
              data: dia,
              horario: hora,
              funcao,
              createdAt: firestore.FieldValue.serverTimestamp(),
              medicoUid, // Médico principal
              localUid,
              escalafixa: true,
              concluido: false,
            });

            // Caso exista auxiliar cirúrgico, cria o plantão para o auxiliar
            if (auxiliocirurgico && auxiliocirurgico !== "") {
              const auxilioCirurgicoSnapshot = await firestore()
                .collection("users")
                .where("name", "==", auxiliocirurgico)
                .get();

              if (auxilioCirurgicoSnapshot.empty) {
                console.error("Auxiliar Cirúrgico não encontrado.");
                throw new Error("Auxiliar Cirúrgico não encontrado.");
              }

              const auxilioCirurgicoDoc = auxilioCirurgicoSnapshot.docs[0];
              const auxiliocirurgicoUid = auxilioCirurgicoDoc.id;

              const auxilioCirurgicoShiftDocRef = firestore()
                .collection("plantoes")
                .doc();
              const auxilioCirurgicoShiftId = auxilioCirurgicoShiftDocRef.id;

              await auxilioCirurgicoShiftDocRef.set({
                plantonista: auxiliocirurgico,
                local,
                data: dia,
                horario: hora,
                funcao: "Auxílio Cirúrgico", // Função do plantão do auxiliar
                createdAt: firestore.FieldValue.serverTimestamp(),
                medicoUid: auxiliocirurgicoUid, // Usando o medicoUid do auxiliar
                localUid,
                escalafixa: true,
                concluido: false,
              });

              // Atualiza o auxiliar cirúrgico com a nova escala
              const auxiliarRef = firestore()
                .collection("users")
                .doc(auxiliocirurgicoUid);
              await auxiliarRef.update({
                plantaoIdsNovos: firestore.FieldValue.arrayUnion(
                  auxilioCirurgicoShiftId
                ),
              });

              // Atualiza o hospital com a nova escala do auxiliar
              const localRef = firestore()
                .collection("hospitais")
                .doc(localUid);
              await localRef.update({
                plantaoIdsH: firestore.FieldValue.arrayUnion(
                  auxilioCirurgicoShiftId
                ), // Adiciona o plantão do auxiliar no hospital
              });
            }

            // Atualiza o médico com a nova escala
            const medicoRef = firestore().collection("users").doc(medicoUid);
            await medicoRef.update({
              plantaoIdsNovos: firestore.FieldValue.arrayUnion(shiftId),
            });

            // Atualiza o hospital com a nova escala
            const localRef = firestore().collection("hospitais").doc(localUid);
            await localRef.update({
              plantaoIdsH: firestore.FieldValue.arrayUnion(shiftId),
            });
          } catch (error) {
            console.error(
              `Erro ao cadastrar a escala para o dia ${dia}:`,
              error
            );
            throw error;
          }
        }
      }
      fetchPlantoes(isConcluido);

      if (escalasNaoCadastradas.length > 0) {
        const mensagem = `As seguintes escalas não foram cadastradas, o(s) médico(s) já apresentam escalas nesse dia:\n\n${escalasNaoCadastradas.join(
          "\n"
        )}`;

        if (alertPlantao.current) {
          alertPlantao.current.showMessage({
            message:
              "Algumas escalas não foram cadastradas. Verifique as datas.",
            type: "warning", // Tipo de alerta alterado para "warning"
            floating: false,
            duration: 4000,
            style: { alignItems: "center", backgroundColor: "#FFC107" }, // Cor de fundo amarelo
          });
        }
        setModalFixaVisible(false);
        setTimeout(() => {
          abrirModalAtencao("Atenção", mensagem);
        }, 1000); // Atraso de 300ms
        return;
      }

      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Escala fixa cadastrada com sucesso!",
          type: "success",
          floating: false,
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    } catch (error) {
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
      setIsButtonEnabled(true);
    }
  };

  const handleTempDate = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const formattedDatePicker = dayjs(date).format("DD/MM/YYYY");
      setSelectedDatePicker(formattedDatePicker);
      setSelectedDate(formattedDate);
    }
  };

  const handleTempTime = (event: DateTimePickerEvent, time?: Date) => {
    if (time) {
      const formattedTime = time.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSelectedHora(formattedTime);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(true);
  };

  const toggleDatePickerFalse = () => {
    setShowDatePicker(false);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(true);
  };

  const toggleTimePickerFalse = () => {
    setShowTimePicker(false);
  };

  const toggleEscala = (id: number) => {
    setEscalas((prev) =>
      prev.map(
        (escala) =>
          escala.id === id
            ? { ...escala, aberta: !escala.aberta } // Inverte o estado da escala clicada
            : { ...escala, aberta: false } // Fecha todas as outras escalas
      )
    );
  };

  const adicionarEscala = () => {
    if (escalas.length < 5) {
      setEscalas([
        ...escalas,
        {
          id: Date.now(),
          aberta: false,
          dias: [],
          auxiliocirurgicoativo: true,
        },
      ]);
    }
  };

  const deletarEscala = (id: number) => {
    setEscalas((prevEscalas) =>
      prevEscalas.filter((escala) => escala.id !== id)
    );
  };

  const [showSelectedDatesView, setShowSelectedDatesView] = useState(false);

  const handleConfirmRangeCalendario = (id: number) => {
    setShowSelectedDatesView(false);
    atualizarDiasEscala(id);
    setSelectedWeekdays([]);
  };

  const handleConfirmRangeProximo = (id: number) => {
    atualizarDiasEscala(id);
    setModalCalendarioVisible(false);
    setTimeout(() => {
      setShowSelectedDatesView(true);
    }, 500); // Atraso de 300ms
  };

  const handleConfirmRangeReset = (id: number) => {
    atualizarDiasEscala(id);
    setSelectedWeekdays([]);
  };

  const [removedDates, setRemovedDates] = useState<{ [key: number]: Date[] }>(
    {}
  );

  const resetDates = () => {
    setSelectedDates([]);
    setRemovedDates({});
  };

  const removeDate = (dateToRemove: Date, escalaId: number) => {
    setSelectedDates((prevDates) =>
      prevDates.filter((date) => date.getTime() !== dateToRemove.getTime())
    );

    setRemovedDates((prev) => ({
      ...prev,
      [escalaId]: [...(prev[escalaId] || []), dateToRemove],
    }));
  };

  const weekdays = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const toggleWeekday = (dayIndex: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  useEffect(() => {
    if (selectedDates.length > 0) {
      setEscalas((prevEscalas) => {
        const escalasAtualizadas = prevEscalas.map((escala) =>
          escala.id === escalaAbertaId
            ? {
                ...escala,
                dias: selectedDates.map((date) =>
                  dayjs(date).format("YYYY-MM-DD")
                ),
              }
            : escala
        );

        const escalasComData = escalasAtualizadas
          .filter((escala) => escala.dias.length > 0)
          .map((escala) => escala.id);

        setEscalasComDataSelecionada(escalasComData);
        return escalasAtualizadas;
      });
    }
  }, [selectedDates]); // Dependência no selectedDates

  const atualizarDiasEscala = (id: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zerar horas para comparar só a data

    const dates: Date[] = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      date.setHours(0, 0, 0, 0); // Zerar horas para evitar problemas na comparação

      const escalaRemovedDates = removedDates[id] || []; // Datas removidas da escala atual

      if (
        selectedWeekdays.includes(date.getDay()) && // Está no dia da semana selecionado
        date >= today && // ✅ Apenas datas futuras ou o dia atual
        !escalaRemovedDates.some(
          (removed) => removed.getTime() === date.getTime()
        ) // Não foi removida
      ) {
        dates.push(date);
      }
    }

    setSelectedDates(dates);
  };

  const atualizarEscala = (
    id: number,
    campo: "medico" | "local" | "funcao" | "hora" | "auxiliocirurgico",
    valor: string
  ) => {
    setEscalas((prevEscalas) => {
      const escalasAtualizadas = prevEscalas.map((escala) =>
        escala.id === id ? { ...escala, [campo]: valor } : escala
      );

      // Atualiza o estado com os escalas que têm valores nos campos
      if (campo === "medico" && valor !== "") {
        setEscalasComMedico((prev) => [...prev, id]);
      }
      if (campo === "local" && valor !== "") {
        setEscalasComLocal((prev) => [...prev, id]);
      }
      if (campo === "funcao" && valor !== "") {
        setEscalasComFuncao((prev) => [...prev, id]);
      }
      if (campo === "auxiliocirurgico" && valor !== "") {
        setEscalasComAuxilio((prev) => [...prev, id]);
      }
      if (campo === "auxiliocirurgico" && valor == "") {
        setEscalasComAuxilio([]);
      }
      if (campo === "hora" && valor !== "") {
        setEscalasComHora((prev) => [...prev, id]);
      }

      return escalasAtualizadas;
    });
  };

  const atualizarSwitch = (
    id: number,
    campo: "auxiliocirurgicoativo",
    valor: boolean
  ) => {
    setEscalas((prevEscalas) => {
      const escalasAtualizadas = prevEscalas.map((escala) =>
        escala.id === id ? { ...escala, [campo]: valor } : escala
      );
      if (campo === "auxiliocirurgicoativo" && valor == true) {
        setEscalasComAuxilioAtivo((prev) => [...prev, id]);
      }
      if (campo === "auxiliocirurgicoativo" && valor == false) {
        setEscalasComAuxilioAtivo((prev) => [...prev, id]);
      }
      return escalasAtualizadas;
    });
  };

  const handleTempTimeFixa = (event: DateTimePickerEvent, time?: Date) => {
    if (time) {
      const formattedTimeFixa = time.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSelectedHoraFixa(formattedTimeFixa);
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
      setFilteredPlantoes((prev) => prev.filter((p) => p.id !== plantaoId));

      // Buscar plantoes novamente para manter sincronizado
      fetchPlantoes(isConcluido);

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

  const filteredAuxilioCirurgico = itemsMedico.filter(
    (medico) => medico.value !== valueMedico
  );

  const filteredAuxilioCirurgicoFixa = (medicoSelecionado: any) => {
    return itemsMedico.filter((medico) => medico.value !== medicoSelecionado);
  };

  return {
    resetModal,
    fetchPlantoes,
    fetchMedicos,
    fetchHospitals,
    plantoes,
    valueMedico,
    valueLocal,
    valueFuncao,
    setIsButtonEnabled,
    setModalVisible,
    modalVisible,
    itemsMedico,
    setValueMedico,
    setItemsMedico,
    itemsFuncao,
    setValueFuncao,
    setItemsFuncao,
    itemsLocal,
    alertPlantao,
    setValueLocal,
    setItemsLocal,
    isButtonEnabled,
    handleRegisterShift,
    setIsConcluido,
    handleCheckmarkClick,
    isConcluido,
    selectedPlantao,
    isModalObsVisible,
    openModalObs,
    closeModal,
    selectedDate,
    setSelectedDate,
    selectedHora,
    setSelectedHora,
    filteredPlantoes,
    setFilteredPlantoes,
    loading,
    submitting,
    selectedDatePicker,
    showDatePicker,
    showTimePicker,
    toggleDatePicker,
    toggleTimePicker,
    toggleDatePickerFalse,
    handleTempDate,
    toggleTimePickerFalse,
    handleTempTime,
    setModalFixaVisible,
    modalFixaVisible,
    escalas,
    toggleEscala,
    adicionarEscala,
    deletarEscala,
    setModalCalendarioVisible,
    modalCalendarioVisible,
    setSelectedRange,
    selectedRange,
    handleConfirmRangeCalendario,
    atualizarEscala,
    handleTempTimeFixa,
    selectedHoraFixa,
    escalaAbertaId,
    setEscalaAbertaId,
    escalasComDataSelecionada,
    setEscalasComDataSelecionada,
    escalasComMedico,
    escalasComFuncao,
    escalasComAuxilio,
    setEscalasComAuxilio,
    escalasComHora,
    escalasComLocal,
    handleRegisterFixedShift,
    showModalAtencao,
    modalAtencaoTitle,
    modalAtencaoMessage,
    setShowModalAtencao,
    selectedMonth,
    setSelectedMonth,
    setSelectedYear,
    monthNames,
    selectedYear,
    selectedWeekdays,
    toggleWeekday,
    selectedDates,
    weekdays,
    setEscalas,
    setLoading,
    abrirModalAtencao,
    showSelectedDatesView,
    setShowSelectedDatesView,
    removeDate,
    handleConfirmRangeProximo,
    openModalDelete,
    closeModalDelete,
    setIsModalDeleteVisible,
    isModalDeleteVisible,
    handleDeleteShift,
    resetDates,
    handleConfirmRangeReset,
    auxilioCirurgico,
    setAuxilioCirurgico,
    filteredAuxilioCirurgico,
    auxilioCirurgicoAtivo,
    setAuxilioCirurgicoAtivo,
    atualizarSwitch,
    filteredAuxilioCirurgicoFixa,
  };
};

export default plantoesHooks;
