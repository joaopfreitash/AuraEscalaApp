import React from "react";
import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import styles from "../styles/locaisScreenStyle";
import { Hospital } from "../types";

interface LocalItemProps {
  hospital: Hospital;
}

const LocalItem: React.FC<LocalItemProps> = ({ hospital }) => (
  <View style={styles.hospitalItem}>
    <View style={styles.nomeEnderecoContainer}>
      <Text style={styles.hospitalNome}>{hospital.name}</Text>
      <Text style={styles.hospitalEndereco}>{hospital.address}</Text>
    </View>
    <View style={styles.quantosPlantoes}>
      <Entypo name="chevron-right" size={20} color="#012E40" />
      <Text style={styles.permissaoMedico}>
        {Array.isArray(hospital.plantaoIdsH)
          ? hospital.plantaoIdsH.length === 1
            ? "1 Escala"
            : `${hospital.plantaoIdsH.length} Escalas`
          : "Nenhuma escala cadastrada"}
      </Text>
    </View>
  </View>
);

export default LocalItem;
