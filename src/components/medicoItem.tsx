import React from "react";
import { View, Text, Image } from "react-native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/medicosScreenStyle";
import { Medico } from "../types";

interface MedicoItemProps {
  medico: Medico;
}

const MedicoItem: React.FC<MedicoItemProps> = ({ medico }) => (
  <View style={styles.medicoItem}>
    {medico.isAdmin ? (
      <MaterialIcons
        name="admin-panel-settings"
        size={32}
        color="#081e27"
        style={styles.medicoAvatar}
      />
    ) : (
      <FontAwesome
        name="user-md"
        size={32}
        color="#081e27"
        style={styles.medicoAvatar}
      />
    )}
    <View style={styles.nomePermContainer}>
      <Text style={styles.medicoNome}>{medico.nome}</Text>
      <Text style={styles.permissaoMedico}>
        {medico.isAdmin ? "Administrador" : "Médico"}
      </Text>
    </View>
    <View style={styles.quantosPlantoes}>
      <Entypo name="chevron-right" size={20} color="#012E40" />
      <Text style={styles.permissaoMedico}>
        {Array.isArray(medico.plantaoIds)
          ? medico.plantaoIds.length === 1
            ? "1 Escala"
            : `${medico.plantaoIds.length} Escalas`
          : "Nenhuma escala cadastrada"}
      </Text>
    </View>
  </View>
);

export default MedicoItem;
