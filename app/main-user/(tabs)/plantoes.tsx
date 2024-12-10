import React, { useCallback, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';

import styles from '@/src/styles/plantoesScreenStyle';
import PlantaoItem from '@/src/components/plantaoItem';
import plantoesHooks from '@/src/hooks/plantoesHooks';

export default function PlantoesScreen() {

  const { resetModal, fetchPlantoes, fetchMedicos, fetchHospitals,
    plantoes, valueMedico, valueLocal, valueFuncao, setIsButtonEnabled,
    setDate, setTime, setModalVisible, modalVisible, date, time,
    openMedico, itemsMedico, setOpenMedico, setValueMedico, setItemsMedico, 
    openFuncao, itemsFuncao, setOpenFuncao, setValueFuncao,
    setItemsFuncao, openLocal, itemsLocal, setOpenLocal, alertPlantao,
    setValueLocal, setItemsLocal, isButtonEnabled, handleRegisterShift,
    labelFuncaoAnimation, labelMedicoAnimation, labelLocalAnimation,
    handleFocusMedico, handleFocusFuncao, handleFocusLocal } = plantoesHooks();
  
// Chama a função de buscar médicos assim que o componente é montado
useEffect(() => {
  fetchPlantoes();
}, []);

  useFocusEffect(
    useCallback(() => {
      fetchMedicos();
      fetchHospitals();
    }, [])
  );


  return (
    <View style={styles.containerPai}>
        <View style={styles.header}>
          <Text style={styles.plantaoTitle}>Plantões</Text>
        </View>
      <View style={styles.plantaoContainer}>
        <FlatList
          style={styles.flatListContainer}
          data={plantoes}
          renderItem={({ item }) => <PlantaoItem plantao={item} />}
          keyExtractor={(item) => item.id}
          numColumns={1}
        />
      </View>

    </View>
  );
}