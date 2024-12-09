import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import styles from '../styles/plantoesScreenStyle';
import { Plantao } from '../types';

interface PlantaoItemProps {
  plantao: Plantao;
}

const PlantaoItem: React.FC<PlantaoItemProps> = ({ plantao }) => (
  <View style={styles.plantaoItem}>
    <View style={styles.mainContainer}>
        <View style={styles.containerIcons}>
          <FontAwesome6 name="calendar" size={13.5} color="white" />
          <Ionicons name="time" size={15} color="white"/>
          <MaterialIcons name="location-on" size={15.5} color="white"/>
        </View>
          <View style={styles.containerInfos}>
          <Text style={styles.plantaoDate}> {dayjs(plantao.data).format('DD/MM/YYYY')}</Text>
          <Text style={styles.plantaoTurno}> {plantao.horario}</Text>
          <Text style={styles.plantaoLocal}> {plantao.local}</Text>
        </View>
    </View>
    <View style={styles.medicoContainer}>
      <Text style={styles.plantaoFuncao}>{plantao.funcao}</Text>
      <Text style={styles.plantaoMedico}>{plantao.plantonista}</Text>
    </View>
  </View>
);

export default PlantaoItem;
