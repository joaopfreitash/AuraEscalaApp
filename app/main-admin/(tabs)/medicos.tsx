import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, TextInput, Keyboard, Modal } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import styles from '@/src/styles/medicosScreenStyle';
import MedicoItem from '@/src/components/medicoItem';
import medicosHooks from '@/src/hooks/medicosHooks';
import searchBar from '@/src/utils/searchBar';

export default function MedicosScreen() {

  const { handleFocusSearchBar, handleBlurSearchbar, searchBarWidth,
    isSearchFocused, searchQuery, setSearchQuery, setIsSearchFocused  } = searchBar();

  const { resetModal, fetchMedicos, medicos,
    filteredMedicos, setFilteredMedicos, filterType, nomeMedico, setIsButtonEnabled,
    emailMedico, value, setModalVisible, modalVisible, toggleFilter, labelRoleAnimation,
    isNomeFocused, setNomeMedico, nomeInputRef, handleRegisterDoctor,
    setIsNomeFocused, emailInputRef, setEmailMedico, open, items, setOpen,
    isEmailFocused, setIsEmailFocused, isButtonEnabled, handleFocusRole, handleFocus,
    setValue, setItems, labelNomeAnimation, labelEmailAnimation} = medicosHooks();

  // Chama a função de buscar médicos assim que o componente é montado
  useEffect(() => {
    fetchMedicos();
  }, []);

  // Filtra a lista com base no tipo selecionado
  useEffect(() => {
    if (filterType === 'todos') {
      setFilteredMedicos(medicos);
    } else if (filterType === 'adm') {
      setFilteredMedicos(medicos.filter((medico) => medico.isAdmin));
    } else if (filterType === 'med') {
      setFilteredMedicos(medicos.filter((medico) => !medico.isAdmin));
    }
  }, [filterType, medicos]);


  //Verificar se campos preenchidos para habilitar botão Confirmar
  const checkFields = () => {
    if (nomeMedico && emailMedico && value) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text); // Atualiza a query de pesquisa

    const filtered = medicos.filter((medico) =>
      medico.nome.toLowerCase().includes(text.toLowerCase())
    );
  
    if (filtered.length === 0) {
      setFilteredMedicos([]); // Define a lista filtrada como vazia
    } else {
      setFilteredMedicos(filtered); // Atualiza os médicos filtrados
    }
  };

  const handleCancel = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setFilteredMedicos(medicos);
    Keyboard.dismiss();
    Animated.timing(searchBarWidth, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    checkFields();
  }, [value, nomeMedico, emailMedico]);
  

  return (
    <View style={styles.containerPai}>
      <View style={styles.medicosContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.medicosTitle}>Médicos</Text>
          </View>
          <View style={styles.containerPaiFiltros}>
              <TouchableOpacity onPress={toggleFilter}>
                  {filterType === 'todos' && <Foundation name="torsos-all" size={24} color="white" />}
                  {filterType === 'adm' && <MaterialIcons name="security" size={24} color="white" />}
                  {filterType === 'med' && <Ionicons name="medkit" size={24} color="white" />}
              </TouchableOpacity>
          </View>
        </View>

        {/* Campo de pesquisa */}
        <View style={styles.searchContainerPai}>
            <Animated.View
              style={[
                styles.searchBarContainer,
                { width: searchBarWidth.interpolate({
                    inputRange: [80, 100],
                    outputRange: ['80%', '100%'],
                  }),
                },
              ]}
            >
            <FontAwesome5 name="search" size={18} color="white" style={styles.iconSearch} />
              <TextInput
                style={styles.searchBar}
                placeholder="Pesquisar por nome"
                placeholderTextColor={'#ccc'}
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={handleFocusSearchBar}
                onBlur={handleBlurSearchbar}
              />
            </Animated.View>
            <View style={styles.cancelarContainer}>
              {isSearchFocused && (
                <TouchableOpacity onPress={handleCancel}><Text style={styles.cancelButton}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {filteredMedicos.length > 0 ? (
            <FlatList
              style={styles.flatListContainer}
              data={filteredMedicos}
              renderItem={({ item }) => <MedicoItem medico={item} />}
              keyExtractor={(item) => item.id}
              numColumns={1}
            />
              ) : searchQuery.trim() ? ( 
                <Text style={styles.errorMessage}>Nenhum médico encontrado com esse nome</Text>
              ) : (
            <FlatList
              style={styles.flatListContainer}
              data={medicos}
              renderItem={({ item }) => <MedicoItem medico={item} />}
              keyExtractor={(item) => item.id}
              numColumns={1}
            />
          )}
        </View>

      {/* Botão para abrir o modal */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>Cadastrar médico no APP</Text>
                <TouchableOpacity
                        onPress={() => {
                          resetModal();
                        }}>
                          <Ionicons name="close-circle" size={33} color={'#bf3d3d'}/>
                  </TouchableOpacity>
            </View>

            {/* Input de Nome*/}
              <View style={styles.containerNome}>
                        <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelNomeAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -20], // Move o rótulo para cima
                              }),
                              fontSize: labelNomeAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelNomeAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        Nome
                         </Animated.Text>
                  <TextInput
                      style={[
                        styles.inputBox,
                        !nomeMedico ? styles.placeholderStyleNome : styles.textStyle
                      ]}
                    placeholder={!isNomeFocused ? "Nome completo do médico" : ""}
                    placeholderTextColor="#191a1c"
                    onChangeText={setNomeMedico}
                    ref={nomeInputRef}
                    autoCapitalize='words'
                    onFocus={() => handleFocus(labelNomeAnimation, setIsNomeFocused)}
                    >
                  </TextInput>
                  <FontAwesome6 name="edit" size={20} color="black" style={styles.iconEdit}/>
              </View>

              <View style={styles.betweenInput}>
                <FontAwesome name="level-down" size={30} color="black" />
              </View>

            {/* Imput de E-mail */}
            <View style={styles.containerEmail}>
                        <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelEmailAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -20], // Move o rótulo para cima
                              }),
                              fontSize: labelEmailAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelEmailAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        E-mail
                         </Animated.Text>
                          <TextInput
                                style={[
                                  styles.inputBox,
                                  !emailMedico ? styles.placeholderStyleEmail : styles.textStyle
                                ]}
                              ref={emailInputRef}
                              placeholder={!isEmailFocused ? "E-mail do médico" : ""}
                              placeholderTextColor="#191a1c"
                              onChangeText={setEmailMedico}
                              keyboardType="email-address"
                              autoCapitalize='none'
                              onFocus={() => handleFocus(labelEmailAnimation, setIsEmailFocused)}
                              >
                            </TextInput>
                          <FontAwesome6 name="edit" size={20} color="black" style={styles.iconEdit}/>
              </View>

              <View style={styles.betweenInput}>
                <FontAwesome name="level-down" size={30} color="black" />
              </View>

              {/* Role */}
              <View style={styles.containerRole}>
                        <Animated.Text
                          style={[
                            styles.inputLabel,
                            {
                              top: labelRoleAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [18, -26], // Move o rótulo para cima
                              }),
                              fontSize: labelRoleAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12], // Diminui o tamanho do rótulo
                              }),
                              fontWeight: labelRoleAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['400', '600'], // Tornar o rótulo em negrito
                              }),
                            },
                          ]}
                        >
                        Permissão
                         </Animated.Text>
                         <DropDownPicker style={styles.inputBoxPicker} 
                         onPress={() => {handleFocusRole(); Keyboard.dismiss();}}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder={'Selecione a permissão do usuário'}
                            placeholderStyle={styles.placeholderStylePermissao}
                            textStyle={styles.textStyle}
                            multiple={false}
                            language="PT"
                            dropDownContainerStyle={styles.dropDownListContainer}
                        />
              </View>
                    <TouchableOpacity
                        style={[styles.confirmarPlantaoButton, !isButtonEnabled && styles.buttonDisabled]}
                        disabled={!isButtonEnabled}
                        onPress={() => handleRegisterDoctor(emailMedico, nomeMedico)}
                        >
                      <Text style={[styles.confirmarPlantaoText, !isButtonEnabled && styles.buttonTextDisabled]}>Confirmar</Text>
                    </TouchableOpacity>
            </View> 
          </Modal>
    </View>
  );
}


