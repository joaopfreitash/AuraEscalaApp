import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, ScrollView, } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "@/firebaseConfig";

import styles from '@/src/styles/loginStyle';
import loginHooks from '@/src/hooks/loginHooks';



export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const { emailLabelAnimated, isEmailFocused, email, setEmail, handleFocus,
          setIsEmailFocused, handleBlur, senhaLabelAnimated, isSenhaFocused,
          senha, setSenha, setIsSenhaFocused, 
        } = loginHooks();

        const handleLogin = async () => {
                router.replace("../main-admin");
        };

  return (
    <ScrollView scrollEnabled={false} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/auraPlantaoLogo.png')} style={styles.image} />
        
        {/* Campo de Email */}
        <View style={styles.inputContainerIndex}>
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

