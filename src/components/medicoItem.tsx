import React from 'react';
import { View, Text, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import styles from '../styles/medicosScreenStyle';
import { Medico } from '../types';

interface MedicoItemProps {
  medico: Medico;
}

const MedicoItem: React.FC<MedicoItemProps> = ({ medico }) => (
    <View style={styles.medicoItem}>
    <Image source={medico.avatar} style={styles.medicoAvatar} />
      <View style={styles.nomePermContainer}>
        <Text style={styles.medicoNome}>{medico.nome}</Text>
          <Text style={styles.permissaoMedico}>
              {medico.isAdmin ? "Administrador" : "Médico"}
          </Text>
      </View>
    <View style={styles.quantosPlantoes}>
      <Entypo name="chevron-right" size={20} color="#012E40" />
      <Text style={styles.permissaoMedico}>
      {
        Array.isArray(medico.plantaoIds)
          ? medico.plantaoIds.length === 1
            ? "1 Plantão"
            : `${medico.plantaoIds.length} Plantões`
          : "Nenhum plantão cadastrado"
      }
      </Text>
    </View>
  </View>
);

export default MedicoItem;
