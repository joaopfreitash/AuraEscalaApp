import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";
import "@/firebaseConfig";

import styles from "@/src/styles/loginStyle";
import loginHooks from "@/src/hooks/loginHooks";

export default function LoginScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();
  const alertLogin = useRef<FlashMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    emailLabelAnimated,
    isEmailFocused,
    email,
    setEmail,
    handleFocus,
    setIsEmailFocused,
    handleBlur,
    senhaLabelAnimated,
    isSenhaFocused,
    senha,
    setSenha,
    setIsSenhaFocused,
  } = loginHooks();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        const combinedUserData = {
          uid: user.uid,
          email: user.email,
          name: userData.name,
        };

        await AsyncStorage.setItem("@user", JSON.stringify(combinedUserData));

        if (userData.isAdmin) {
          router.replace("/main-admin/(tabs)/home");
        } else {
          router.replace("/main-user/(tabs)/home");
        }
      } else {
        alert("Usuário não encontrado no sistema.");
      }
    } catch (error) {
      if (alertLogin.current) {
        alertLogin.current.showMessage({
          message: "Falha no login: Verifique suas credenciais.",
          floating: true,
          type: "danger",
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const combinedUserData = {
            uid: user.uid,
            email: user.email,
            name: userData.name,
          };

          await AsyncStorage.setItem("@user", JSON.stringify(combinedUserData));

          if (userData.isAdmin) {
            router.replace("../main-admin/(tabs)/home");
          } else {
            router.replace("../main-user/(tabs)/home");
          }
        }
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/auraescalas.png")}
          style={styles.image}
        />

        {/* Campo de Email */}
        <View style={styles.inputContainerIndex}>
          <Animated.Text
            style={[
              styles.inputLabel,
              {
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
                  outputRange: ["400", "600"], // Tornar o rótulo em negrito
                }),
              },
            ]}
          >
            E-mail
          </Animated.Text>
          <TextInput
            style={styles.input}
            placeholder={!isEmailFocused ? "E-mail" : ""}
            placeholderTextColor="#191a1c"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => handleFocus(emailLabelAnimated, setIsEmailFocused)}
            onBlur={() =>
              handleBlur(emailLabelAnimated, email, setIsEmailFocused)
            }
          />
          <MaterialIcons
            name="alternate-email"
            size={24}
            color="black"
            style={styles.iconEmail}
          />
        </View>

        {/* Campo de Senha */}
        <View style={styles.inputContainer}>
          <Animated.Text
            style={[
              styles.inputLabel,
              {
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
                  outputRange: ["400", "600"], // Tornar o rótulo em negrito
                }),
              },
            ]}
          >
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
            onBlur={() =>
              handleBlur(senhaLabelAnimated, senha, setIsSenhaFocused)
            }
          />
          <FontAwesome
            name="lock"
            size={24}
            color="#29292e"
            style={styles.iconPass}
          />
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
        <Text style={styles.footerText}>Sua primeira vez acessando o App?</Text>
        <Link href={"/cadastrar"} asChild style={styles.button}>
          <TouchableOpacity>
            <Text style={styles.buttonText}>
              <FontAwesome5 name="first-aid" size={15} color="white" /> Clica
              aqui
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <FlashMessage ref={alertLogin} />
    </ScrollView>
  );
}
