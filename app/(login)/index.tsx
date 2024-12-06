import { Link, useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Animated, ScrollView, Dimensions, } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const emailLabelAnimated = useRef(new Animated.Value(0)).current;
  const senhaLabelAnimated = useRef(new Animated.Value(0)).current;

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSenhaFocused, setIsSenhaFocused] = useState(false);

  const router = useRouter();

  const auth = getAuth();
  const db = getFirestore();


  const handleLogin = async () => {
          router.replace("../main-admin/(tabs)/home");

  };

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
        
        {/* Campo de Email */}
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

        {/* Campo de Senha */}
        <View style={styles.inputContainer}>
          <Animated.Text style={[styles.inputLabel, {
            top: senhaLabelAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: [18, -20], // Mover o rótulo para cima
            }),
            fontSize: senhaLabelAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 12], // Diminuir o tamanho do rótulo
            }),
            fontWeight: senhaLabelAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: ['400', '600'], // Tornar o rótulo em negrito
            }),
          }]} >
            Senha
          </Animated.Text>
          <TextInput
            style={styles.input}
            placeholder={!isSenhaFocused ? "Senha" : ""}
            placeholderTextColor="#191a1c"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            onFocus={() => handleFocus(senhaLabelAnimated, setIsSenhaFocused)}
            onBlur={() => handleBlur(senhaLabelAnimated, senha, setIsSenhaFocused)}
          />
          <FontAwesome name="lock" size={24} color="#29292e" style={styles.iconPass} />
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Links */}
        <Link href="/esqueci-senha" asChild style={styles.linkEsqueci}>
          <TouchableOpacity>
            <Text style={styles.textEsqueci}>Esqueci a senha</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Sua primeira vez acessando o App?
          </Text>
          <Link href={'/cadastrar'} asChild style={styles.button}>
            <TouchableOpacity>
              <Text style={styles.buttonText}><FontAwesome5 name="first-aid" size={15} color="white" />  Clica aqui</Text>
            </TouchableOpacity>
          </Link>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer:{
    display: 'flex',
    flexGrow: 1,
    marginTop: 70,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxHeight: '100%',
    alignItems: 'center',
  },
  image: {
    display: 'flex',
    marginBottom: 8,
    width: Dimensions.get('window').width * 0.5,
    height: (Dimensions.get('window').width * 0.5) * 0.5,
  },
  separator: {
    width: '50%',
    height: 8,
    marginBottom: 50,
    backgroundColor: '#081e27',
    alignSelf: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems:'center', 
    marginBottom: 25,
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
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  iconPass: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
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
  linkEsqueci: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  textEsqueci: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  footerLink: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  footerContainer: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: 100,
  },
  footerText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#ffffff',
  },
});
