import { View, StyleSheet, Image, ScrollView, Dimensions, Text, Animated, TextInput, TouchableOpacity } from 'react-native';

export default function PlantoesScreen() {
  
  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.scrollView}>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1, // Preenche a tela disponível
    backgroundColor: '#012E40', // Cor de fundo enquanto o scroll é feito
  },
  contentContainer:{
    backgroundColor: '#012E40',
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
});
