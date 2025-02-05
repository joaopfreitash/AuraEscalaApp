import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/medicosScreenStyle";
import { Medico } from "../types";

interface MedicoItemProps {
  medico: Medico;
  onPress: () => void;
}

const MedicoItem: React.FC<MedicoItemProps> = ({ medico, onPress }) => {
  // Soma o número de plantões antigos e novos
  const totalPlantoes =
    (medico.plantaoIdsAntigos?.length || 0) +
    (medico.plantaoIdsNovos?.length || 0);

  return (
    <TouchableOpacity onPress={onPress}>
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
            {totalPlantoes === 1
              ? "1 Escala"
              : totalPlantoes > 1
              ? `${totalPlantoes} Escalas`
              : "0 Escalas"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MedicoItem;
