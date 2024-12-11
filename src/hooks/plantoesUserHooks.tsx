import { useEffect, useRef, useState } from 'react';
import { arrayRemove, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { Plantao } from '../types';

const homeUserHooks = () => {
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [selectedPlantaoId, setSelectedPlantaoId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const db = getFirestore();
  const alertPlantao = useRef<FlashMessage | null>(null);

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
      const plantaoIds = userData.plantaoIds || []; 

      if (plantaoIds.length === 0) {
        setPlantoes([]);
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

      setPlantoes(plantoesList);
    } catch (error) {
      console.error('Erro ao buscar plantões:', error);
    }
  };

  const handleConcluirPlantao = async () => {
    if (!selectedPlantaoId) {
        console.error("Nenhum plantão selecionado.");
        return;
      }
    try {
      const plantaoDocRef = doc(db, "plantoes", selectedPlantaoId);
      const plantaoDoc = await getDoc(plantaoDocRef);
  
      if (!plantaoDoc.exists()) {
        console.error("Plantão não encontrado.");
        return;
      }
  
      const plantaoData = plantaoDoc.data();
  
      const plantaoConcluidoDocRef = doc(collection(db, "plantoesConcluidos"));
      await setDoc(plantaoConcluidoDocRef, {
        ...plantaoData,
        idOriginal: plantaoDoc.id, // Mantenha o id do plantão
        concluidoEm: Timestamp.now(),
        observacoes: text,
      });
  
      await deleteDoc(plantaoDocRef);

    // 4. Atualizar a coleção 'users' para remover o plantão de plantaoIds
    const storedUser = await AsyncStorage.getItem("@user");
    if (!storedUser) {
      console.error("Usuário não encontrado no AsyncStorage");
      return;
    }
    const user = JSON.parse(storedUser);
    const userUid = user.uid;

    const userDocRef = doc(db, "users", userUid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        plantaoIds: arrayRemove(selectedPlantaoId)
      });
    }

    // 5. Atualizar a coleção 'hospitais' para remover o plantão de plantaoIdsH
    const hospitalDocRef = doc(db, "hospitais", plantaoData.localUid);
    const hospitalDoc = await getDoc(hospitalDocRef);

    if (hospitalDoc.exists()) {
      await updateDoc(hospitalDocRef, {
        plantaoIdsH: arrayRemove(selectedPlantaoId)
      });
    }
      resetModal();
      fetchPlantoes();
      setSelectedPlantaoId(null);
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
          message: "Plantão concluído com sucesso!",
          type: "success",
          duration: 4000,
          style: {alignItems: 'center'}
        });
      }
    } catch (error) {
      resetModal();
      if (alertPlantao.current) {
        alertPlantao.current.showMessage({
        message: "Ocorreu um erro, tente novamente.",
        type: "danger",
        duration: 4000,
        style: {alignItems: 'center'}
      });
      }
    }
  };

  const resetModal = () => {
    setModalVisible(false);
    setText('');
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

  const selectedPlantao = plantoes.find((plantao) => plantao.id === selectedPlantaoId);

  return { plantoes, fetchPlantoes, resetModal, handleSelectPlantao,
            selectedPlantao, selectedPlantaoId, setModalVisible, modalVisible,
            text, setText, handleConcluirPlantao, alertPlantao };
};

export default homeUserHooks;