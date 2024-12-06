import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRef, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, Text, Animated, TextInput, TouchableOpacity } from 'react-native';

export default function CadastrarScreen() {

  const [email, setEmail] = useState('');
  const emailLabelAnimated = useRef(new Animated.Value(0)).current;
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleFocus = (animatedValue: Animated.Value, setIsFocused: React.Dispatch<React.SetStateAction<boolean>>) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsFocused(true);
  };

  const handleBlur = (animatedValue: Animated.Value, text: string, setIsFocused: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!text) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    setIsFocused(false);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>

          <Image source={require('@/assets/images/auraPlantaoLogo.png')} style={styles.image} />

          <View style={styles.separator} />

          <Text style={styles.titleText}>
            Informe o seu e-mail cadastrado pelo administrador. Caso corresponda a um e-mail registrado em nosso sistema, enviaremos um link para redefinição de senha.
          </Text>

          <View style={styles.inputContainer}>
          <Animated.Text style={[styles.inputLabel, {
            top: emailLabelAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: [18, -20], // Mover o rótulo para cima
            }),
            fontSize: emailLabelAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 12], // Diminuir o tamanho do rótulo
            }),
            fontWeight: emailLabelAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: ['400', '600'], // Tornar o rótulo em negrito
            }),
          }]} >
            E-mail
          </Animated.Text>
          <TextInput style={styles.input}
            placeholder={!isEmailFocused ? "E-mail" : ""}
            placeholderTextColor="#191a1c"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => handleFocus(emailLabelAnimated, setIsEmailFocused)}
            onBlur={() => handleBlur(emailLabelAnimated, email, setIsEmailFocused)}
          />
          <MaterialIcons name="alternate-email" size={24} color="black" style={styles.iconEmail} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer:{
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxHeight: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  image: {
    display: 'flex',
    marginBottom: 8,
    width: Dimensions.get('window').width * 0.5,
    height: (Dimensions.get('window').width * 0.5) * 0.5,
  },
  separator: {
    width: '50%',
    height: 5,
    marginBottom: 50,
    backgroundColor: '#081e27',
    alignSelf: 'center',
    borderRadius: 30,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems:'center', 
    marginBottom: 25,
    marginTop: 30,
  },
  inputLabel: {
    position: 'absolute',
    left: 10,
    color: '#ccc',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
  },
  iconEmail: {
    position: 'absolute',
    right: 10,
    top: '25%',
  },
  button: {
    backgroundColor: '#111827',
    display: 'flex',
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
});
