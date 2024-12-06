import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, Image, TouchableOpacity, View, Text, SafeAreaView, Modal, Button, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DrawerLayout() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <GestureHandlerRootView>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={({ navigation }) => ({
            drawerType: 'front',
            drawerLabel: 'Voltar',
            drawerStyle: {
              backgroundColor: '#012E40', // Cor de fundo do drawer
              width: Dimensions.get('window').width * 0.75, // Define a largura do drawer
            },
            drawerActiveBackgroundColor: '#081e27', // Cor de fundo ao selecionar um item
            drawerInactiveTintColor: 'white', // Cor do texto quando o item NÃO está selecionado
            drawerActiveTintColor: 'white', // Cor do texto do item selecionado
            drawerItemStyle: {
              borderColor: '#011826', // Cor do contorno
              borderRadius: 30, // Borda arredondada
              marginVertical: 5, // Espaçamento entre os itens
            },
            title: '',
            headerStyle: {
              backgroundColor: '#012E40',
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: 'white',
              fontSize: 24,
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="return-down-forward" size={24} color={color} />
            ),
            headerLeft: () => (
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => navigation.toggleDrawer()}
                >
                  <Ionicons name="menu" size={24} color="white" style={{ marginLeft: 15 }} />
                  <Image
                    source={require('@/assets/images/iconHeaderAura.png')}
                    style={{
                      width: Dimensions.get('window').width * 0.15,
                      height: (Dimensions.get('window').width * 0.15) * 0.5,
                      marginLeft: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ),
            headerRight: () => (
              <SafeAreaView style={{ marginRight: 15 }}>
                <TouchableOpacity
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => setModalVisible(true)} // Abre o modal
                >
                  <Ionicons name="notifications" size={24} color="white" />
                </TouchableOpacity>
              </SafeAreaView>
            ),
          })}
        />
      </Drawer>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Fecha o modal ao pressionar "voltar"
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Modal de notificações</Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} color="#012E40" />
          </View>
          </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semitransparente
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#012E40',
    textAlign: 'center',
  },
});
