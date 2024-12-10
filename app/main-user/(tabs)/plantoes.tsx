import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';

import styles from '@/src/styles/plantoesUserScreenStyle';
import PlantaoItem from '@/src/components/plantaoItem';
import plantoesUserHooks from '@/src/hooks/plantoesUserHooks';
import { Entypo, Ionicons } from '@expo/vector-icons';
import FlashMessage from 'react-native-flash-message';

export default function PlantoesUserScreen() {
  const { plantoes, resetModal, handleSelectPlantao,
    selectedPlantao, selectedPlantaoId, setModalVisible, modalVisible,
    text, setText, handleConcluirPlantao, alertPlantao } = plantoesUserHooks();
  

  return (
    <View style={styles.containerPai}>
      <View style={styles.header}>
        <Text style={styles.plantaoTitle}>Meus plantões</Text>
      </View>
      <View style={styles.plantaoContainer}>
        <FlatList
          style={styles.flatListContainer}
          data={plantoes}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectPlantao(item.id)}
              style={[
                selectedPlantaoId === item.id && styles.selectedPlantaoItem,
              ]}
            >
              <PlantaoItem plantao={item} />
              {selectedPlantaoId === item.id && (
                <View style={styles.checkIconContainer}>
                  <Entypo name="check" size={24} color="green" />
                </View>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
        />
      </View>

      <View
        style={[
          styles.finalizarPlantaoContainer,
          { opacity: selectedPlantaoId ? 1 : 0.3 }, 
        ]}
      >
        <TouchableOpacity
          disabled={!selectedPlantaoId}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.plantaoTitle}>Concluir plantão</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() =>Keyboard.dismiss()}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>Concluir plantão</Text>
                    <TouchableOpacity
                      onPress={() => {
                        resetModal();
                      }}>
                        <Ionicons name="close-circle" size={33} color={'#bf3d3d'}/>
                    </TouchableOpacity>
            </View>
            <View style={styles.containerPlantaoSelected}>
                    {/* Verifica se o plantão foi selecionado antes de renderizar */}
                {selectedPlantao ? (
                  <FlatList
                    style={styles.flatListContainer}
                    data={[selectedPlantao]} // Passa um array com o plantão selecionado
                    renderItem={({ item }) => <PlantaoItem plantao={item} />}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                  />
                ) : (
                  <Text>Nenhum plantão selecionado</Text>
                )}
            </View>
              <View style={styles.observacoesContainer}>
                <Text style={styles.obsTitle}>Observações</Text>
              </View>
              <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputText}
                    multiline
                    numberOfLines={4}
                    placeholder="Digite algo..."
                    placeholderTextColor="#a5a8ad"
                    value={text}
                    onChangeText={setText}
                  />
              </View>
              <TouchableOpacity
                    style={styles.confirmarButton}
                    onPress={() =>handleConcluirPlantao()}
                    >
                  <Text style={styles.confirmarButtonText}>Confirmar</Text>
              </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
      </Modal>
      <FlashMessage ref={alertPlantao}/>
    </View>
  );
}
