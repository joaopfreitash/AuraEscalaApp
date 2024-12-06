import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, Dimensions, View, Text, } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs'; // Biblioteca para manipular datas

const screenWidth = Dimensions.get('window').width; // Obtém a largura da tela

LocaleConfig.locales['br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Maio.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
  today: 'Hoje',
};

LocaleConfig.defaultLocale = 'br';

const plantaoData = [
  { id: '1', data: '22/11/2024', turno: 'Manhã', medico: 'Dr. João Silva' },
  { id: '2', data: '23/11/2024', turno: 'Tarde', medico: 'Dra. Maria Souza' },
  { id: '3', data: '24/11/2024', turno: 'Noite', medico: 'Dr. José Oliveira' },
  // ... mais dados de plantões
];

export default function HomeScreen() {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
  
  // Atualiza a data selecionada imediatamente
  const handleDayPress = useCallback((day: DateData) => {
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        selectedColor: '#FFD700',
      },
    });
  }, []);

  // Gera os meses para exibir no FlatList
  const months = Array.from({ length: 12 }, (_, i) => dayjs().add(i, 'month'));

  // Renderiza cada calendário no FlatList
  const renderItem = ({ item }: { item: dayjs.Dayjs }) => (
    <View style={styles.calendarContainer}>
      <Calendar
        initialDate={item.format('YYYY-MM-DD')} 
        style={styles.calendario}
        theme={{
          backgroundColor: '#012E40',
          calendarBackground: '#012E40',
          textSectionTitleColor: '#ffffff',
          selectedDayBackgroundColor: '#FFD700',
          selectedDayTextColor: '#012E40',
          todayTextColor: '#00FFFF',
          dayTextColor: '#ffffff',
          textDisabledColor: '#666666',
          arrowColor: '#FFD700',
          monthTextColor: '#ffffff',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 15,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 12,
        }}
        onDayPress={handleDayPress}
        disableMonthChange={true}
        markedDates={markedDates}
        enableSwipeMonths={false} // Desabilita swipe interno do calendário
        showSixWeeks
        hideArrows
      />
    </View>
  );

    // Função para renderizar o item da lista de plantões
    const renderPlantaoItem = ({ item }: { item: { data: string; turno: string; medico: string } }) => (
      <View style={styles.plantaoItem}>
        <Text style={styles.plantaoDate}>{item.data}</Text>
        <Text style={styles.plantaoTurno}>Turno: {item.turno}</Text>
        <Text style={styles.plantaoMedico}>Médico: {item.medico}</Text>
      </View>
    );

  return (
    <View style={styles.containerPai}>
    <View style={styles.container}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={months}
        keyExtractor={(index) => index.toString()}
        renderItem={renderItem}
        initialScrollIndex={0} // Sempre começa no mês atual
      />
    </View>
    <View style={styles.plantaoContainer}>
        <Text style={styles.plantaoTitle}>Próximos plantões</Text>
        <FlatList
          data={plantaoData}
          renderItem={renderPlantaoItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPai: {
    flex: 1,
    backgroundColor: '#012E40',
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  calendarContainer: {
    width: screenWidth, // Cada calendário ocupa a largura da tela
    alignItems: 'center',
  },
  calendario: {
    borderRadius: 10,
    overflow: 'hidden',
    width: screenWidth - 20, // Ajusta a largura ao tamanho da tela com margem
    padding: 10,
  },
  plantaoContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  plantaoTitle: {
    fontSize:25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  plantaoItem: {
    backgroundColor: '#1e3c5d',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  plantaoDate: {
    fontSize: 16,
    color: '#FFD700',
  },
  plantaoTurno: {
    fontSize: 14,
    color: '#ffffff',
  },
  plantaoMedico: {
    fontSize: 14,
    color: '#ffffff',
  },
});
